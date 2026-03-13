'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { fetchTeams, fetchTeam, updateTeamProfile, uploadImage } from '@/lib/api';
import { type Team } from '@/components/TeamCard';
import {
  CheckCircle,
  Upload,
  X,
  Loader2,
  ChevronDown,
  ImagePlus,
} from 'lucide-react';

const MAX_IMAGES = 1;

export default function SetupPage() {
  // Step 1: pick team. Step 2: enter PIN (if set). Step 3: fill/edit form.
  const [step, setStep] = useState<'pick' | 'pin' | 'form'>('pick');

  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fields
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [stallImages, setStallImages] = useState<string[]>([]);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeams()
      .then((res) => {
        const sorted = [...(res.data as Team[])].sort(
          (a, b) => (a.team_number || a.id) - (b.team_number || b.id)
        );
        setTeams(sorted);
      })
      .catch(console.error)
      .finally(() => setLoadingTeams(false));
  }, []);

  const handleSelectTeam = async (team: Team) => {
    setSelectedTeam(team);
    setDropdownOpen(false);

    // Load fresh data for the chosen team
    try {
      const res = await fetchTeam(team.id);
      const data = res.data;
      setTeamName(data.team_name || '');
      setDescription(data.description || '');
      setTeamMembers(data.team_members || '');
      setStallImages(Array.isArray(data.stall_images) ? data.stall_images : []);
    } catch {
      toast({ title: 'Error', description: 'Could not load team data.', variant: 'destructive' });
    }

    setStep('pin');
  };

  const handlePinContinue = () => {
    if (!currentPin.trim()) {
      toast({ title: 'PIN required', description: 'Enter your team\'s security PIN to continue.', variant: 'destructive' });
      return;
    }
    setStep('form');
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (stallImages.length >= MAX_IMAGES) {
      toast({ title: 'Limit reached', description: `You can upload at most ${MAX_IMAGES} images.`, variant: 'destructive' });
      return;
    }

    const toUpload = Array.from(files).slice(0, MAX_IMAGES - stallImages.length);
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of toUpload) {
        const res = await uploadImage(file);
        urls.push(res.data.url);
      }
      setStallImages((prev) => [...prev, ...urls]);
    } catch (err: any) {
      toast({
        title: 'Upload failed',
        description: err?.response?.data?.error || 'Could not upload image.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setStallImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!selectedTeam) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateTeamProfile(selectedTeam.id, {
        teamName: teamName.trim() || undefined,
        description: description.trim() || undefined,
        teamMembers: teamMembers.trim() || undefined,
        stallImages,
        currentPin: currentPin.trim(),
      });
      setSaved(true);
      toast({ title: '✅ Profile saved!', description: 'Your team details have been updated.' });
    } catch (err: any) {
      toast({
        title: 'Save failed',
        description: err?.response?.data?.error || 'Could not save team details.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12" style={{ background: 'var(--cream)' }}>
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {/* Page header */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-11 h-11 rounded-[10px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--amber-400), var(--amber-600))', boxShadow: 'var(--shadow-amber)' }}
            >
              <ImagePlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1
                style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem', color: 'var(--stone-900)', lineHeight: 1.1 }}
              >
                Team Setup
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--stone-500)' }}>
                Fill in your team details so voters can learn about your project
              </p>
            </div>
          </div>

          {/* Step: pick team */}
          <section className="rounded-2xl p-6 mb-4" style={{ background: 'var(--cream-card)', border: '1.5px solid var(--stone-200)' }}>
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--stone-700)' }}>
              1. Select Your Team
            </label>
            {loadingTeams ? (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--stone-500)' }}>
                <Loader2 className="w-4 h-4 animate-spin" /> Loading teams…
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors"
                  style={{
                    background: 'var(--cream)',
                    border: '1.5px solid var(--stone-300)',
                    color: selectedTeam ? 'var(--stone-800)' : 'var(--stone-400)',
                  }}
                >
                  {selectedTeam
                    ? `Stall #${selectedTeam.team_number || selectedTeam.id}`
                    : 'Choose your stall…'}
                  <ChevronDown className="w-4 h-4 shrink-0 ml-2" style={{ color: 'var(--stone-400)' }} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 w-full mt-1 rounded-xl overflow-auto shadow-lg"
                      style={{
                        background: 'var(--cream-card)',
                        border: '1.5px solid var(--stone-200)',
                        maxHeight: 280,
                        boxShadow: 'var(--shadow-lg)',
                      }}
                    >
                      {teams.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleSelectTeam(t)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-amber-50 transition-colors"
                          style={{ color: 'var(--stone-700)' }}
                        >
                          <span className="font-bold" style={{ color: 'var(--amber-600)' }}>
                            Stall #{t.team_number || t.id}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </section>

          {/* Step: PIN entry */}
          <AnimatePresence>
            {step !== 'pick' && (
              <motion.section
                key="pin"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl p-6 mb-4 overflow-hidden"
                style={{ background: 'var(--cream-card)', border: '1.5px solid var(--stone-200)' }}
              >
                <label className="block text-sm font-bold mb-1" style={{ color: 'var(--stone-700)' }}>
                  2. Security PIN
                </label>
                <p className="text-xs mb-3" style={{ color: 'var(--stone-500)' }}>
                  Enter the PIN provided to your team by the organiser.
                </p>
                <input
                  type="password"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePinContinue()}
                  placeholder="Team PIN"
                  maxLength={64}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: 'var(--cream)',
                    border: '1.5px solid var(--stone-300)',
                    color: 'var(--stone-800)',
                  }}
                />
                {step === 'pin' && (
                  <Button
                    onClick={handlePinContinue}
                    className="mt-3 font-semibold text-sm text-white"
                    style={{ background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))', border: 'none' }}
                  >
                    Continue →
                  </Button>
                )}
              </motion.section>
            )}
          </AnimatePresence>

          {/* Step: Edit form */}
          <AnimatePresence>
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <section className="rounded-2xl p-6 mb-4" style={{ background: 'var(--cream-card)', border: '1.5px solid var(--stone-200)' }}>
                  <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--stone-700)' }}>
                    3. Team Details
                  </h2>

                  {/* Team name */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--stone-600)' }}>
                      Team / Project Name
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. EcoScan — Smart Waste Sorter"
                      maxLength={255}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'var(--cream)', border: '1.5px solid var(--stone-300)', color: 'var(--stone-800)' }}
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--stone-600)' }}>
                      Product / Project Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your project, what problem it solves, and how it works…"
                      maxLength={2000}
                      rows={5}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                      style={{ background: 'var(--cream)', border: '1.5px solid var(--stone-300)', color: 'var(--stone-800)' }}
                    />
                    <p className="text-right text-xs mt-0.5" style={{ color: 'var(--stone-400)' }}>
                      {description.length}/2000
                    </p>
                  </div>

                  {/* Team members */}
                  <div className="mb-2">
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--stone-600)' }}>
                      Team Members <span className="font-normal" style={{ color: 'var(--stone-400)' }}>(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={teamMembers}
                      onChange={(e) => setTeamMembers(e.target.value)}
                      placeholder="Alice, Bob, Carol, …"
                      maxLength={1000}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'var(--cream)', border: '1.5px solid var(--stone-300)', color: 'var(--stone-800)' }}
                    />
                  </div>
                </section>

                {/* Stall images */}
                <section className="rounded-2xl p-6 mb-4" style={{ background: 'var(--cream-card)', border: '1.5px solid var(--stone-200)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-sm font-bold" style={{ color: 'var(--stone-700)' }}>
                        4. Stall / Product Images
                      </h2>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--stone-500)' }}>
                        Upload up to {MAX_IMAGES} photos — voters will see these before casting their vote
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--amber-50)', color: 'var(--amber-700)', border: '1px solid var(--amber-200)' }}>
                      {stallImages.length}/{MAX_IMAGES}
                    </span>
                  </div>

                  {/* Image grid */}
                  {stallImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {stallImages.map((src, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`Stall image ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(0,0,0,0.55)' }}
                          >
                            <X className="w-3.5 h-3.5 text-white" />
                          </button>
                          {i === 0 && (
                            <span className="absolute bottom-1 left-1 text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--amber-500)', color: '#fff' }}>
                              MAIN
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  {stallImages.length < MAX_IMAGES && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files)}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold border-2 border-dashed transition-colors"
                        style={{
                          borderColor: 'var(--amber-300)',
                          color: uploading ? 'var(--stone-400)' : 'var(--amber-600)',
                          background: 'var(--amber-50)',
                          cursor: uploading ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {uploading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                        ) : (
                          <><Upload className="w-4 h-4" /> Click to upload photos</>
                        )}
                      </button>
                      <p className="text-xs mt-1.5 text-center" style={{ color: 'var(--stone-400)' }}>
                        JPG, PNG, WebP, GIF, AVIF · max 20 MB each
                      </p>
                    </>
                  )}
                </section>

                {/* Save */}
                <Button
                  onClick={handleSave}
                  disabled={saving || uploading}
                  className="w-full h-12 font-bold text-sm text-white gap-2"
                  style={{
                    background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))',
                    border: 'none',
                    boxShadow: 'var(--shadow-amber)',
                  }}
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                  ) : saved ? (
                    <><CheckCircle className="w-4 h-4" /> Saved!</>
                  ) : (
                    'Save Team Profile'
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
}
