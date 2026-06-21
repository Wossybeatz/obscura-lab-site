"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export type PlayerTrack = {
  id: string;
  name: string;
  subtitle: string; // e.g. "Dm / 132 BPM"
  coverImage: string | null;
  coverColor: string;
  audioUrl: string;
};

type PlayerContextType = {
  currentTrack: PlayerTrack | null;
  isPlaying: boolean;
  playTrack: (track: PlayerTrack) => void;
  togglePlay: () => void;
  setIsPlaying: (playing: boolean) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<PlayerTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function playTrack(track: PlayerTrack) {
    if (currentTrack?.id === track.id) {
      // same track clicked again — just toggle
      setIsPlaying((prev) => !prev);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  }

  function togglePlay() {
    setIsPlaying((prev) => !prev);
  }

  return (
    <PlayerContext.Provider
      value={{ currentTrack, isPlaying, playTrack, togglePlay, setIsPlaying }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
