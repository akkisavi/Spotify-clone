import { useEffect, useRef } from "react";
import { usePlayerStore } from "./usePlayerStore";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentSong, isPlaying, playNext } = usePlayerStore((state: any) => ({
    currentSong: state.currentSong,
    isPlaying: state.isPlaying,
    playNext: state.playNext,
  }));

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  // Handle when the song ends
  const handleSongEnd = () => {
    playNext();
  };

  return (
    <div>
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.audioUrl}
          onEnded={handleSongEnd}
        />
      )}
    </div>
  );
};

export default AudioPlayer;
