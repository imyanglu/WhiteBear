import { useEffect } from "react"
import { View } from "react-native"
import {  Audio ,AVPlaybackStatusSuccess} from 'expo-av';
import useMusicAudio from "@/hooks/useAudio";
import { useLast } from "@/hooks";

const SongPlayer = () => { 

    const { musicInfo,audio, playMusic, changeSongsList } = useMusicAudio()
    
    const nextSongs = useLast(() => { 
        console.log(musicInfo.songs)
    })
    useEffect(() => {
        Audio.setAudioModeAsync({
            staysActiveInBackground: true,
        });
       
        audio._onPlaybackStatusUpdate = (status) => {
          
        }
    
    },[])
    
    return <View></View>
}
export default SongPlayer