import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react";

const PlayButton = ({ song }: { song: Song }) => {
  const {
    setCurrentSong,
    isPlaying,
    currentSong,
    togglePlay,
    playAlbum,
  } = usePlayerStore();

  const isCurrentSong = currentSong?._id === song._id;

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay(); // Toggle play/pause for the current song
    } else {
      setCurrentSong(song);
      playAlbum([song], 0); 
    }
  };

  return (
    <Button
      onClick={handlePlay}
      className={`absolute right-4 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all rounded-full w-10 h-10
        opacity-0 translate-y-0 group-hover:translate-y-0 ${
          isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
    >
      {isCurrentSong && isPlaying ? (
        <Pause className="size-5 text-black" />
      ) : (
        <Play className="size-5 text-black" />
      )}
    </Button>
  );
};

export default PlayButton;
