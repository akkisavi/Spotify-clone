import { axiosInstance } from "@/lib/axios";
import { useState, useEffect } from "react";
import { Song } from "@/types";
import { Loader2, Search } from "lucide-react";
import Topbar from "@/components/Topbar.tsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlayButton from "./PlayButton.tsx";

const ShowAll = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]); // Holds filtered songs based on search
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch all songs when the component mounts
  useEffect(() => {
    const fetchAllSongs = async () => {
      try {
        const response = await axiosInstance.get("/songs/showall");
        setSongs(response.data);
        setFilteredSongs(response.data); // Initially, show all songs
      } catch (error) {
        console.error("Error fetching all songs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSongs();
  }, []);

  // Update filtered songs whenever search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSongs(songs); // Show all songs if no search query
    } else {
      setFilteredSongs(
        songs.filter(
          (song) =>
            song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, songs]);

  if (loading) {
    return (
      <div className="text-center p-4">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar />

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            className="w-full p-3 pl-10 rounded-md bg-zinc-800 text-white border-2 
        border-zinc-600 hover:border-emerald-600 focus:border-emerald-500 focus:outline-none 
        transition-all"
            placeholder="Search by title or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        {/* Container for scrollable content */}
        <div className="flex-1 py-4 px-6 max-h-screen">
          {/* Grid displaying songs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSongs.map((song) => (
              <div 
                key={song._id}
                className=" p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
              >
                <div className="relative mb-4">
                  <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                    <img
                      src={song.imageUrl}
                      alt={song.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute pt-6 center -right-4 scale-110">
                    <PlayButton song={song} />
                  </div>
                </div>
                <h3 className="font-medium mb-2 truncate">{song.title}</h3>
                <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ShowAll;
