import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB raw input limit (we compress output to ~20 KB)
const TARGET_SIZE_BYTES = 20 * 1024;     // 20 KB output target
const MAX_DIMENSION = 800;               // max width/height before quality tuning

function mimeFromSharpFormat(format?: string): string {
  const f = (format || '').toLowerCase();
  if (f === 'jpeg' || f === 'jpg') return 'image/jpeg';
  if (f === 'png') return 'image/png';
  if (f === 'webp') return 'image/webp';
  if (f === 'gif') return 'image/gif';
  if (f === 'avif') return 'image/avif';
  return '';
}

/** Compress an image buffer to approximately targetBytes using sharp. */
async function compressToTarget(buffer: Buffer, targetBytes: number): Promise<Buffer> {
  // Resize so longest edge ≤ MAX_DIMENSION first (reduces data before quality pass)
  let img = sharp(buffer).rotate(); // .rotate() auto-corrects EXIF orientation
  const meta = await img.metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
    img = img.resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true });
  }

  // Binary-search JPEG quality between 5 and 80 to land near targetBytes
  let lo = 5, hi = 80, bestBuf = await img.jpeg({ quality: 40 }).toBuffer();
  for (let i = 0; i < 8; i++) {
    const mid = Math.round((lo + hi) / 2);
    const buf = await img.jpeg({ quality: mid }).toBuffer();
    bestBuf = buf;
    if (buf.length > targetBytes) hi = mid - 1;
    else lo = mid + 1;
    if (lo > hi) break;
  }
  return bestBuf;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || typeof file === 'string') {
      console.error('[upload] No file in FormData. Keys received:', [...formData.keys()]);
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Determine MIME type — fall back to extension-based detection when the
    // browser doesn't populate file.type (happens on some OS/browser combos).
    const extMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.avif': 'image/avif',
    };
    const fileName = file.name ?? '';
    const fileExt = fileName ? path.extname(fileName).toLowerCase() : '';
    const mimeType = (file.type || extMap[fileExt] || '').toLowerCase();

    console.log('[upload] name:', fileName, '| type:', file.type, '| ext:', fileExt, '| resolved mime:', mimeType, '| size:', file.size);

    // Validate raw input size (sanity guard; actual output is compressed)
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum raw size is 20 MB.' },
        { status: 400 }
      );
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());

    // Decode with sharp to verify this is a real image and detect its format.
    let detectedType = '';
    try {
      const meta = await sharp(rawBuffer, { animated: true }).metadata();
      detectedType = mimeFromSharpFormat(meta.format);
    } catch {
      return NextResponse.json(
        { error: 'Invalid or unsupported image file. Please upload JPG, PNG, WebP, GIF, or AVIF.' },
        { status: 400 }
      );
    }

    const resolvedType = mimeType || detectedType;
    if (!ALLOWED_TYPES.includes(resolvedType)) {
      return NextResponse.json(
        { error: `Invalid file type "${resolvedType || fileName}". Allowed: JPG, PNG, WebP, GIF, AVIF.` },
        { status: 400 }
      );
    }

    const buffer = await compressToTarget(rawBuffer, TARGET_SIZE_BYTES);

    // Output is always JPEG after compression
    const filename = `${Date.now()}-${crypto.randomUUID()}.jpg`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Ensure the resolved path is still inside uploadDir (guard against traversal)
    const filePath = path.resolve(uploadDir, filename);
    if (!filePath.startsWith(path.resolve(uploadDir))) {
      return NextResponse.json({ error: 'Invalid filename.' }, { status: 400 });
    }

    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/upload]', error);
    return NextResponse.json({ error: error?.message || 'Upload failed.' }, { status: 500 });
  }
}
