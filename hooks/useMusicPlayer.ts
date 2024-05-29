import { useAtom } from 'jotai';

import { MusicAtom } from '@/components/MusicPlayer';
import { Music } from '@/type';
import useMusicAudio from './useAudio';

const useMusicPlayer = () => {
  const { audio,musicInfo} = useMusicAudio()
  const [musicsAtom, setMusicsAtom] = useAtom(MusicAtom);
  const add = (music: Music) => {
    setMusicsAtom((a) => {
      const songs = a.songs;
      songs.set(music.url, music); // 设置播放列表
      const isEmpty = songs.keys().next().value === undefined;
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

  const play = (music: Music) => {
    const songs = musicsAtom.songs
    if(songs.has(music.url))
     setMusicsAtom((a) => {
        return { ...a, playingId: music.url, isPlaying: true };
     })
    else {
      setMusicsAtom((a) => {
        const songs = a.songs;
        songs.set(music.url, music);
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
  };
};
export default useMusicPlayer;
