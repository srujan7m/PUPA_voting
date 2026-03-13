import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = { path: string[] };

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { path: parts } = await context.params;

    if (!Array.isArray(parts) || parts.length === 0) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 });
    }

    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
    const requestedFile = path.resolve(uploadsDir, ...parts);

    // Prevent path traversal outside the uploads directory.
    if (!requestedFile.startsWith(uploadsDir + path.sep) && requestedFile !== uploadsDir) {
      return NextResponse.json({ error: 'Invalid path.' }, { status: 400 });
    }

    const ext = path.extname(requestedFile).toLowerCase();
    const contentType = MIME_BY_EXT[ext] ?? 'application/octet-stream';
    const file = await readFile(requestedFile);

    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found.' }, { status: 404 });
  }
}
