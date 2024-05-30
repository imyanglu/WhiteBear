import { useContext, useEffect, useRef, useState } from "react"
import {  Audio ,AVPlaybackStatusSuccess} from 'expo-av';
import { Music } from "@/type";
import { MusicAudioContext } from "@/Context/MusicAudioContext";

export type MusicInfo = {
    artistsname: string;
    name: string;
    picurl: string;
    url: string;
    isPlaying: boolean;
}

const useMusicAudio = () => {
    const [{music,audio},setMusic] = useContext(MusicAudioContext)
    const changeMusicInfo = setMusic
    const playMusic = async (m: Music) => {
        const songs = music?.songs ?? []
        const currentSong = songs.find(s => s.url === m.url)
        if (!currentSong) songs.push(m)
        try { await audio.unloadAsync(); } catch (err) {
        }
        finally { 
            await audio.loadAsync({ uri: m.url }, { shouldPlay: true }).then(data => { })
            setMusic({ songs:songs,isPlaying:true,playingUrl:m.url })
        }
    }
    const removeMusic = (url: string) => {
        const songs = music.songs.filter(i => i.url !== url)
        setMusic({ ...music, songs: songs })
     }
    const pause = async() => { 
        await audio.stopAsync();
        setMusic(p => ({...p,isPlaying:false}))
    }

    useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
    }); 
    }, [])
 
    
    return {
        audio: audio,
        musicInfo:music,
        playMusic,
        pause,
        changeMusicInfo,
        removeMusic
    }
 }

 export default useMusicAudio