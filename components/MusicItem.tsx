import { Music } from "@/type"
import { View,Text, Pressable, ActivityIndicator } from "react-native"

import { Ionicons } from '@expo/vector-icons';
import { AudioStatus } from "@/Context/MusicAudioContext";




const MusicItem = ({  name, artistsname, onTogglePlay, url ,status}: Music & { status: AudioStatus, onTogglePlay: (data: { url: string, isPlaying: boolean }) => void }) => { 
    const isPlaying = status ==='playing'
    return <View className="flex-row h-[80px] items-center">
        <View>
            <Text>{name}</Text>
            <Text className="text-[#928f8f] text-[12px] mt-[8px]">{artistsname}</Text>
        </View>
        <View className="ml-auto w-[50px] justify-center items-center">
            {status === 'loading' ? <ActivityIndicator size={20} /> : <Pressable onPress={ () => { onTogglePlay({url,isPlaying}) }}>
                { isPlaying ?    <Ionicons name="pause-outline" size={24} color="black" />:  <Ionicons name="play-outline" size={24} color="black" />}
             </Pressable>}
       </View>
    </View>
}
export default MusicItem