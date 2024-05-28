import { Music } from "@/type"
import { View,Text, Pressable } from "react-native"
import { Image } from "expo-image"
import { Ionicons } from '@expo/vector-icons';



const MusicItem = ({ picurl, name, artistsname, isPlaying,onTogglePlay,url }: Music & { isPlaying: boolean, onTogglePlay: (data: {url:string,isPlaying:boolean}) => void }) => { 
    return <View className="flex-row h-[80px] items-center">
        <View>
            <Text>{name}</Text>
            <Text className="text-[#928f8f] text-[12px] mt-[8px]">{artistsname}</Text>
        </View>
        <View className="ml-auto w-[50px]">
            <Pressable onPress={() => { onTogglePlay({url,isPlaying}) }}>
                { isPlaying ?    <Ionicons name="pause-outline" size={24} color="black" />:  <Ionicons name="play-outline" size={24} color="black" />}
             </Pressable>
       </View>
    </View>
}
export default MusicItem