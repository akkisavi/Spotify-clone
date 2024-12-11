import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import { create } from "zustand";
import toast from "react-hot-toast";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  featuredSongs: [],
  madeForYouSongs: [],
  trendingSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  deleteSong: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);
  
      // Fetch the updated song list and stats after deleting the song
      await useMusicStore.getState().fetchSongs(); // Refresh song list
      await useMusicStore.getState().fetchStats(); // Refresh stats
  
      toast.success("Song deleted successfully");
    } catch (error: unknown) {
      console.log("Error in deleteSong", error);
      toast.error("Error deleting song");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/albums/${id}`);
  
      // Remove the album from the state immediately
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== id),
      }));
  
      // Refresh albums and stats after deleting
      await useMusicStore.getState().fetchAlbums(); // Refresh albums list
      await useMusicStore.getState().fetchStats(); // Refresh stats
  
      toast.success("Album deleted successfully");
    } catch (error: unknown) {
      console.log("Error in deleteAlbum", error);
      toast.error("Error deleting album");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/albums");
      set({ albums: response.data });
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      set({ currentAlbum: response.data });
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/featured");
      set({ featuredSongs: response.data });
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYouSongs: response.data });
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/trending");
      set({ trendingSongs: response.data });
    } catch (error: unknown) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs");
      set({ songs: response.data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch songs and albums to ensure they are included in the stats
      const [albumsResponse, songsResponse] = await Promise.all([
        axiosInstance.get("/albums"),
        axiosInstance.get("/songs"),
      ]);
  
      // Fetch the current stats
      const statsResponse = await axiosInstance.get("/stats");
  
      // Get all unique artists from albums and songs
      const albumArtists = new Set(albumsResponse.data.map((album: Album) => album.artist));
      const songArtists = new Set(songsResponse.data.map((song: Song) => song.artist));
  
      // Combine both sets to ensure uniqueness
      const allArtists = new Set([...albumArtists, ...songArtists]);
  
      // Calculate total artists, and update other stats
      const updatedStats = {
        totalAlbums: albumsResponse.data.length,
        totalSongs: songsResponse.data.length,
        totalArtists: allArtists.size, // unique artist count
        totalUsers: statsResponse.data.totalUsers, // assume this is part of your stats response
      };
  
      set({ stats: updatedStats });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  
}));
