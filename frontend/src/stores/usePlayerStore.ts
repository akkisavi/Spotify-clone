import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  isLooping: boolean;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleLoop: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  isLooping: false,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: songs[0] || null,
      currentIndex: songs.length > 0 ? 0 : -1,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];
    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  togglePlay: () => {
    set((state) => ({
      isPlaying: !state.isPlaying,
    }));
  },

  playNext: () => {
    const { currentIndex, queue, isLooping } = get();
    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      set({
        currentSong: queue[nextIndex],
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else if (isLooping) {
      set({
        currentSong: queue[0],
        currentIndex: 0,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });
    }
  },

  playPrevious: () => {
    const { currentIndex, queue } = get();
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      set({
        currentSong: queue[previousIndex],
        currentIndex: previousIndex,
        isPlaying: true,
      });
    }
  },

  toggleLoop: () => {
    set((state) => ({
      isLooping: !state.isLooping,
    }));
  },
}));
