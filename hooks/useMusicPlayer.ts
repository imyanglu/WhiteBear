import { useAtom } from 'jotai';

import { MusicAtom } from '@/components/MusicPlayer';
import { Music } from '@/type';

const useMusicPlayer = () => {
  const [musicsAtom, setMusicsAtom] = useAtom(MusicAtom);
  const add = (music: Music) => {
    setMusicsAtom((a) => {
      const songs = a.musics;
      songs.push(music);
      const isEmpty = songs.length === 1;
      return {
        ...a,
        musics: songs,
        playingId: isEmpty ? music.url : a.playingUrl,
        isPlaying: isEmpty ? true : a.isPlaying,
      };
    });
  };
  const pause = () => {
    setMusicsAtom((a) => {
      return { ...a, isPlaying: false };
    });
  };
  const play = (music :Music) => {
    const listIds = musicsAtom.musics.map((a) => a.url);
    if (listIds.includes(music.url)) {
      setMusicsAtom((a) => {
        return { ...a, playingId: music.url, isPlaying: true };
      });
    } else {
      setMusicsAtom((a) => {
        const songs = a.musics;
        songs.unshift(music);
        return { ...a, musics: songs, isPlaying: true, playingUrl:music.url };
      });
    }
  };

  return {
    add,
    playingUrl:musicsAtom.playingUrl,
    play,
    pause,
    isPlaying: musicsAtom.isPlaying,
    list: musicsAtom.musics,
  };
};
export default useMusicPlayer;
