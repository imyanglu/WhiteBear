import { useRef, useState } from "react"
import {  Audio } from 'expo-av';

export type MusicInfo = {
    artistsname: string;
    name: string;
    picurl: string;
    url: string;
}

const useMusicAudio = () => {
    const audioRef = useRef(new Audio.Sound()).current
    const [musicInfo, setMusicInfo] = useState<MusicInfo>()
    const changeMusicInfo =setMusicInfo
    return {
        audio: audioRef,
        musicInfo,
        changeMusicInfo
    }
 }

 export default useMusicAudio