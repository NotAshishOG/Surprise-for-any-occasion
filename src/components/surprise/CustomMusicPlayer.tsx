"use client";

import { useEffect, useRef } from "react";

interface CustomMusicPlayerProps {
  audioFileUrl?: string;
  audioLinkUrl?: string;
  playing: boolean;
}

export function CustomMusicPlayer({ audioFileUrl, audioLinkUrl, playing }: CustomMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Helper to extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    if (audioFileUrl && audioRef.current) {
      if (playing) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    } else if (audioLinkUrl) {
      const ytId = getYouTubeId(audioLinkUrl);
      if (ytId && iframeRef.current?.contentWindow) {
        const action = playing ? 'playVideo' : 'pauseVideo';
        iframeRef.current.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: action
        }), '*');
      } else if (!ytId && audioRef.current) {
        // Fallback if it's a direct mp3 link
        if (playing) {
          audioRef.current.play().catch(console.error);
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [playing, audioFileUrl, audioLinkUrl]);

  if (audioFileUrl || (audioLinkUrl && !getYouTubeId(audioLinkUrl))) {
    return (
      <audio
        ref={audioRef}
        src={audioFileUrl || audioLinkUrl}
        loop
        className="hidden"
      />
    );
  }

  if (audioLinkUrl) {
    const ytId = getYouTubeId(audioLinkUrl);
    if (ytId) {
      return (
        <iframe
          ref={iframeRef}
          width="0"
          height="0"
          src={`https://www.youtube.com/embed/${ytId}?enablejsapi=1&autoplay=0&loop=1&playlist=${ytId}`}
          allow="autoplay"
          className="hidden"
          title="Custom Music"
        />
      );
    }
  }

  return null;
}
