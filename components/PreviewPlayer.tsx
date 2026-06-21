"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/lib/player-context";

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PreviewPlayer() {
  const { currentTrack, isPlaying, togglePlay, setIsPlaying } = usePlayer();

  // Tone.js objects live in refs since they're not React state — we drive
  // them imperatively and only mirror what we need (time, duration) into
  // React state for the UI.
  const playerRef = useRef<import("tone").Player | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef(0); // Tone.now() value when playback last (re)started
  const offsetRef = useRef(0); // seconds into the track when playback last (re)started
  const loadTokenRef = useRef(0); // guards against stale async loads racing each other
  const playbackRateRef = useRef(1); // mirrors `rate` state, for use inside the raf tick

  const [ready, setReady] = useState(false);
  const [loadedTrackId, setLoadedTrackId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  // Varispeed control — one knob changes pitch AND tempo together, like
  // FL Studio's MUL or Logic Pro's Varispeed: turning it down makes the
  // track both slower and lower-pitched (true tape/turntable behavior),
  // instead of a formant-preserving pitch shift that keeps tempo constant.
  const [semitones, setSemitones] = useState(0);
  const rate = Math.pow(2, semitones / 12); // semitones -> playback rate multiplier
  const [pitchPopupOpen, setPitchPopupOpen] = useState(false);

  // Set up the Tone.js audio graph once: Player -> speakers. Pitch and
  // tempo are both driven by player.playbackRate (varispeed), so there's
  // no separate pitch-shifting node in the signal path.
  useEffect(() => {
    let cancelled = false;
    import("tone").then((Tone) => {
      if (cancelled) return;
      const player = new Tone.Player({ loop: true, autostart: false }).toDestination();
      playerRef.current = player;
      setReady(true);
    });
    return () => {
      cancelled = true;
      playerRef.current?.dispose();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Load a new track whenever currentTrack changes, then start playback.
  // This is the ONLY place that loads audio and the ONLY place that calls
  // player.start() for a fresh track, to avoid racing with the play/pause
  // effect below.
  useEffect(() => {
    if (!ready || !currentTrack || !playerRef.current) return;
    const token = ++loadTokenRef.current;

    import("tone").then(async (Tone) => {
      if (!playerRef.current) return;
      await Tone.start(); // resume the AudioContext (required after a user gesture)

      const player = playerRef.current;
      if (player.state === "started") player.stop();

      await player.load(currentTrack.audioUrl);
      // Bail out if a newer track was requested while this one was loading
      if (token !== loadTokenRef.current || !playerRef.current) return;

      setDuration(player.buffer.duration);
      offsetRef.current = 0;
      setCurrentTime(0);
      player.playbackRate = playbackRateRef.current;
      player.start(undefined, 0);
      startedAtRef.current = Tone.now();
      setLoadedTrackId(currentTrack.id);
      setIsPlaying(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id, ready]);

  // Play / pause control — only acts once a track has actually finished
  // loading (loadedTrackId matches), so it never races the load effect.
  useEffect(() => {
    if (!ready || !playerRef.current || !currentTrack) return;
    if (loadedTrackId !== currentTrack.id) return;

    import("tone").then((Tone) => {
      const player = playerRef.current;
      if (!player) return;
      if (isPlaying) {
        if (player.state !== "started") {
          player.playbackRate = playbackRateRef.current;
          player.start(undefined, offsetRef.current % (duration || 1));
        }
        startedAtRef.current = Tone.now();
      } else {
        if (player.state === "started") {
          offsetRef.current += (Tone.now() - startedAtRef.current) * playbackRateRef.current;
          player.stop();
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, ready, loadedTrackId]);

  // Varispeed control — one rate drives both pitch and tempo (FL Studio
  // MUL / Logic Pro Varispeed style). Tone.Player.playbackRate can be
  // changed live without restarting playback. We commit the elapsed time
  // at the *old* rate into offsetRef before switching, so the progress
  // bar and looping stay accurate across rate changes mid-playback.
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (player.state === "started") {
      import("tone").then((Tone) => {
        offsetRef.current += (Tone.now() - startedAtRef.current) * playbackRateRef.current;
        startedAtRef.current = Tone.now();
        playbackRateRef.current = rate;
        player.playbackRate = rate;
      });
    } else {
      playbackRateRef.current = rate;
      player.playbackRate = rate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate]);

  // Volume control
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume.value = volume > 0 ? (volume - 1) * 30 : -Infinity;
    }
  }, [volume]);

  // Progress ticker
  useEffect(() => {
    let cancelled = false;
    function tick() {
      if (cancelled) return;
      if (isPlaying && duration > 0) {
        import("tone").then((Tone) => {
          if (cancelled) return;
          const elapsed =
            offsetRef.current + (Tone.now() - startedAtRef.current) * playbackRateRef.current;
          setCurrentTime(elapsed % duration);
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, duration]);

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    offsetRef.current = value;
    setCurrentTime(value);
    const player = playerRef.current;
    if (!player || player.state !== "started") return;
    import("tone").then((Tone) => {
      player.stop();
      player.playbackRate = playbackRateRef.current;
      player.start(undefined, value);
      startedAtRef.current = Tone.now();
    });
  }

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-[#0a0c11]/95 backdrop-blur-md border-t border-[var(--line)]">
      <div className="max-w-[1180px] mx-auto px-4 md:px-7 py-3 flex items-center gap-3 md:gap-6 flex-wrap md:flex-nowrap">
        {/* Track info */}
        <div className="flex items-center gap-3 min-w-0 w-full md:w-[220px] shrink-0">
          <div
            className="w-11 h-11 rounded-md overflow-hidden border border-[var(--line)] shrink-0 flex items-center justify-center"
            style={
              currentTrack.coverImage
                ? {}
                : { background: `linear-gradient(135deg, ${currentTrack.coverColor}, #161f1a)` }
            }
          >
            {currentTrack.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentTrack.coverImage}
                alt={currentTrack.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-mono-brand text-sm font-bold truncate">{currentTrack.name}</p>
            <p className="font-mono-brand text-xs text-[var(--text-faint)] truncate">
              {currentTrack.subtitle}
            </p>
          </div>
        </div>

        {/* Transport + progress */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={togglePlay}
            disabled={!ready}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-9 h-9 rounded-full bg-[var(--accent)] text-[#04140b] flex items-center justify-center shrink-0 hover:shadow-[0_0_16px_var(--accent-glow)] transition-all disabled:opacity-40"
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
            )}
          </button>

          <span className="font-mono-brand text-xs text-[var(--text-faint)] w-9 text-right shrink-0">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 accent-[var(--accent)] h-1 min-w-[80px]"
            aria-label="Seek"
          />
          <span className="font-mono-brand text-xs text-[var(--text-faint)] w-9 shrink-0">
            {formatTime(duration)}
          </span>
        </div>

        {/* Pitch control — uses varispeed under the hood (pitch and tempo move
            together), but only the pitch number is shown, since that's what
            producers expect a "P" control to mean. */}
        <div className="relative shrink-0">
          <button
            onClick={() => setPitchPopupOpen((v) => !v)}
            aria-label="Pitch control"
            title="Pitch"
            className={`w-9 h-9 rounded-full border flex items-center justify-center font-mono-brand text-xs font-bold transition-all ${
              semitones !== 0
                ? "border-[var(--accent)] text-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)]"
                : "border-[var(--line)] text-[var(--text-dim)] hover:border-[var(--accent-dim)] hover:text-[var(--accent)]"
            }`}
          >
            P
          </button>

          {pitchPopupOpen && (
            <div className="absolute bottom-full right-0 mb-3 w-[210px] bg-[#0d0f15] border border-[var(--line)] rounded-xl p-4 shadow-2xl">
              <p className="font-mono-brand text-2xl text-center font-bold mb-2">
                {semitones > 0 ? `+${semitones}` : semitones} st
              </p>
              <input
                type="range"
                min={-12}
                max={12}
                step={1}
                value={semitones}
                onChange={(e) => setSemitones(Number(e.target.value))}
                className="w-full accent-[var(--accent)] h-1"
                aria-label="Varispeed (semitones, also changes tempo)"
              />
              <div className="flex justify-between font-mono-brand text-[10px] text-[var(--text-faint)] mt-1.5">
                <span>-12</span>
                <span>0</span>
                <span>+12</span>
              </div>
              <button
                onClick={() => setSemitones(0)}
                className="w-full mt-3 font-mono-brand text-[11px] uppercase tracking-wide py-2 rounded-md border border-[var(--line)] text-[var(--text-dim)] hover:border-[var(--accent-dim)] hover:text-[var(--accent)] transition-all"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-faint)]">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 accent-[var(--accent)] h-1"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
