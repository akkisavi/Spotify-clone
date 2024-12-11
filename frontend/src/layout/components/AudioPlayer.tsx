import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const { currentSong, isPlaying, playNext, isLooping } = usePlayerStore();

  // Play and Pause the Song
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  // Handles the end of the current song (loop or skip to next)
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      if (audio) {
        if (isLooping) {
          // Looping: Restart the current song from the beginning
          audio.currentTime = 0;
          audio.play();
        } else {
          // Skip to next song
          playNext();
        }
      }
    };

    audio?.addEventListener("ended", handleEnded);

    return () => {
      audio?.removeEventListener("ended", handleEnded);
    };
  }, [playNext, isLooping]);

  useEffect(() => {
    if (!currentSong || !audioRef.current) {
      return;
    }

    const audio = audioRef.current;

    // Checking if the song is new (changed from the previous song)
    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;

    if (isSongChange) {
      audio.src = currentSong?.audioUrl; // Set the new song's URL
      audio.currentTime = 0; // Start from the beginning of the song

      prevSongRef.current = currentSong?.audioUrl;
    }

    if (isPlaying) {
      audio.play();
    }
  }, [currentSong, isPlaying]);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;
