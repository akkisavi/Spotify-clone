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
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }
    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;

    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity:
          willStartPlaying && currentSong
            ? `Playing ${currentSong.title} by ${currentSong.artist}`
            : "Idle",
      });
    }

    set({
      isPlaying: willStartPlaying,
    });
  },

  playNext: () => {
    const { currentIndex, queue, isLooping } = get();
    const nextSongIndex = currentIndex + 1;

    if (nextSongIndex < queue.length) {
      const nextSong = queue[nextSongIndex];
      set({
        currentSong: nextSong,
        isPlaying: true,
        currentIndex: nextSongIndex,
      });
    }
    // If the next index is out of bounds and looping is enabled, loop back to the first song
    else if (isLooping) {
      const firstSong = queue[0];
      set({
        currentSong: firstSong,
        isPlaying: true,
        currentIndex: 0,
      });
    }
    // If the next index is out of bounds and no loop, stop the player
    else {
      set({ isPlaying: false });
    }
  },

  playPrevious: () => {
    const { currentIndex, queue } = get();
    const previousSongIndex = currentIndex - 1;

    if (previousSongIndex >= 0) {
      const previousSong = queue[previousSongIndex];
      set({
        currentSong: previousSong,
        isPlaying: true,
        currentIndex: previousSongIndex,
      });
    } else {
      set({ isPlaying: false });
    }
  },

  toggleLoop: () => {
    set({ isLooping: !get().isLooping });
  },
}));
