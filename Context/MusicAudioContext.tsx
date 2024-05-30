import { createContext, Dispatch, ReactNode, SetStateAction, useRef,useState } from "react";
import { Audio } from 'expo-av';

export type MusicInfo = {
    songs: {
        artistsname: string;
        name: string;
        picurl: string;
        url: string;
  
    }[];
    isPlaying: boolean;
    playingUrl:string | null
}

export const MusicAudioContext = createContext<[{ music: MusicInfo, audio: Audio.Sound }, Dispatch<SetStateAction<MusicInfo>>]>([{ music: {songs:[],isPlaying:false,playingUrl:null},audio:new Audio.Sound() },useState])
export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => { 
    const audioRef = useRef(new Audio.Sound()).current
    const [musicInfo, setMusicInfo] = useState<MusicInfo>({songs: [], isPlaying: false, playingUrl: null  })
    return < MusicAudioContext.Provider value={[{music:musicInfo,audio:audioRef},setMusicInfo]} >
            {children}
    </MusicAudioContext.Provider>

}