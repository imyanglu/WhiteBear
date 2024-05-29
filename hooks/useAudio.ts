import { useEffect, useRef, useState } from "react"
import {  Audio } from 'expo-av';
import { Music } from "@/type";

export type MusicInfo = {
    artistsname: string;
    name: string;
    picurl: string;
    url: string;
    isPlaying: boolean;
}

const useMusicAudio = () => {
    const audioRef = useRef(new Audio.Sound()).current
    const [musicInfo, setMusicInfo] = useState<MusicInfo>()
    const changeMusicInfo = setMusicInfo
    const playMusic = async (m: Music) => {
        setMusicInfo({
            ...m,isPlaying:true
        }) 
        try { await audioRef.unloadAsync(); } catch (err) {

        }
        finally { 
        await audioRef.loadAsync({ uri: m.url }, { shouldPlay: true })
        }
       
     
    }
    const pause = async() => { 
          await audioRef.stopAsync();
    }
    useEffect(() => {
        Audio.setAudioModeAsync({
      staysActiveInBackground: true,
    });
    }, [])
    useEffect(() => { 
       
    },[musicInfo])
    
    return {
        audio: audioRef,
        musicInfo,
        playMusic,
        pause,
        changeMusicInfo
    }
 }

 export default useMusicAudio