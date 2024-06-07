import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useRef,useState } from "react";
import { Audio } from 'expo-av';


export type AudioStatus = 'playing' | 'paused' |'loading' | null
export type Music = {
    artistsname: string;
    name: string;
    picurl: string;
    url: string;
  
}


export type MusicInfo = {
    songs: Music[];
    randomSongs: Music[];
    randomPlay: boolean;
    status: AudioStatus
    playingUrl:string | null
}

export const MusicAudioContext = createContext<[{ music: MusicInfo, audio: Audio.Sound }, Dispatch<SetStateAction<MusicInfo>>]>([{ music: {songs:[],randomPlay:false,randomSongs:[],status:null,playingUrl:null},audio:new Audio.Sound() },useState])
export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => { 
    const audioRef = useRef(new Audio.Sound()).current
    const [musicInfo, setMusicInfo] = useState<MusicInfo>({ songs: [], status: null, playingUrl: null, randomSongs: [], randomPlay: false })
    useEffect(() => { 
        audioRef._onPlaybackStatusUpdate = (e) => { 
            console.log('pro')
        }
    },[])
    return < MusicAudioContext.Provider value={[{music:musicInfo,audio:audioRef},setMusicInfo]} >
            {children}
    </MusicAudioContext.Provider>

}