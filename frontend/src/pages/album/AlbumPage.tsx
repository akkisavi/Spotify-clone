import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { Clock, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { gradients } from "./background/gradients";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { LuMusic4 } from "react-icons/lu";

const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
  const { albumId } = useParams();
  const { isLoading, fetchAlbumById, currentAlbum } = useMusicStore();
  const { currentSong, togglePlay, isPlaying, playAlbum } = usePlayerStore();

  const [randomGradient, setRandomGradient] = useState(gradients[0]); // Set initial gradient

  useEffect(() => {
    // Select a random gradient from the list when the component mounts
    const randomIndex = Math.floor(Math.random() * gradients.length);
    setRandomGradient(gradients[randomIndex]);
  }, []);

  useEffect(() => {
    if (albumId) {
      fetchAlbumById(albumId);
    }
  }, [fetchAlbumById, albumId]);

  if (isLoading) {
    return null;
  }

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;
    const isCurrentAlbumPlaying = currentAlbum?.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentAlbumPlaying) {
      togglePlay();
    } else {
      playAlbum(currentAlbum?.songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (currentAlbum) {
      playAlbum(currentAlbum?.songs, index);
    } else {
      return;
    }
  };

  return (
    <div className="h-full relative">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-full">
          {/* background */}
          <div
            className={`absolute inset-0 ${randomGradient} pointer-events-none`}
            aria-hidden="true"
            style={{ height: "100vh" }}
          />
          {/* content */}
          <div className="relative z-10">
            <div className="flex p-5 pb-8 gap-6">
              <img
                src={currentAlbum?.imageUrl}
                alt={currentAlbum?.title}
                className="w-[240px] h-[240px] shadow-xl rounded"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Album</p>
                <h1 className="text-7xl font-bold my-4">
                  {currentAlbum?.title}
                </h1>
                <div className="flex items-center text-sm gap-2 text-zinc-100">
                  <span className="font-medium text-white">
                    {currentAlbum?.artist}
                  </span>
                  <span>• {currentAlbum?.songs.length} songs</span>
                  <span>• {currentAlbum?.releaseYear}</span>
                </div>
              </div>
            </div>
            {/* Play Button */}
            <div className="flex items-center gap-6 px-6 pb-4 ">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
              >
                {isPlaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
                  <Pause className="scale-125 text-black" /> // Show Pause icon if playing
                ) : (
                  <Play className="scale-125 text-black" /> // Show Play icon if paused
                )}
              </Button>
            </div>

            {/* Table section */}
            <div className="bg-black/20 backdrop:blur-sm">
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  {" "}
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              {/* Songs Title   */}
              <div className="px-6">
                <div className="py-4 space-y-2">
                  {currentAlbum?.songs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)}
                        className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <div className="">
                              <LuMusic4 className="size-4 text-green-500" />
                            </div>
                          ) : (
                            <span className="group-hover:hidden">
                              {index + 1}
                            </span>
                          )}
                          {isCurrentSong && (
                            <Play className="h-4 w-4 hidden group-hover:block" />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="size-10"
                          />
                          <div>
                            <div className={"font-medium text-white"}>
                              {song.title}
                            </div>
                            <div>{song.artist}</div>
                          </div>
                        </div>
                        <div className=" flex items-center">
                          {song.createdAt.split("T")[0]}{" "}
                        </div>
                        <div className=" flex items-center">
                          {formatDuration(song.duration)}{" "}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;
