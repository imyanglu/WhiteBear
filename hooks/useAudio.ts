import { useContext, useEffect, useRef, useState } from "react"
import { Audio, AVPlaybackStatusSuccess } from 'expo-av';
import { Music } from "@/type";
import { MusicAudioContext } from "@/Context/MusicAudioContext";

export type AudioStatus = 'loading' | 'playing' | 'paused'
export type MusicInfo = {
    artistsname: string;
    name: string;
    picurl: string;
    url: string;
    status: AudioStatus
}

const useMusicAudio = () => {
    const [{ music, audio }, setMusic] = useContext(MusicAudioContext)
    const changeMusicInfo = setMusic

    const continuePlay = async () => {
        const s = await audio.getStatusAsync();
        if(!s.isLoaded) return
        await audio.setPositionAsync(s.positionMillis)
        console.log(s.positionMillis,'ooo',s)
        await audio.playAsync()
    }
    const playMusic = async (m: Music) => {
        const songs = music?.songs ?? []
        const currentSong = songs.find(s => s.url === m.url)
        if (!currentSong) { songs.push(m) }

        setMusic(p => ({ ...p, songs: songs, status: 'loading', playingUrl: m.url }))
        if (m.url !== music.playingUrl) {
            await audio.loadAsync({ uri: m.url }, { shouldPlay: true })
        }
        else { 
          await  continuePlay()
        }
        setMusic(p => ({ ...p, status: 'playing' }))


    }
    const addSongs = (m: Music[]) => {
        setMusic(p => ({ ...p, songs: p.songs.concat(m) }))
    }
    const changeSongsList = (m: Music[]) => {
        setMusic(p => ({ ...p, songs: m }))
    }
    const removeMusic = (url: string) => {
        const songs = music.songs.filter(i => i.url !== url)
        setMusic({ ...music, songs: songs })
    }
    const pause = async () => {
        await audio.pauseAsync()
        setMusic(p => ({ ...p, status: 'paused' }))
    }





    return {
        audio: audio,
        musicInfo: music,
        addSongs,
        playMusic,
        pause,
        changeMusicInfo,
        removeMusic,
        changeSongsList
    }
}

export default useMusicAudio