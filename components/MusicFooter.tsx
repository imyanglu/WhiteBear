import useMusicAudio, { MusicInfo } from "@/hooks/useAudio";
import { View, Text, Pressable } from "react-native";
import { SimpleLineIcons } from '@expo/vector-icons';
import { Image } from "expo-image";
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

const MusicFooter = ({ picurl, artistsname, name, isPlaying, onTogglePlay ,onDetail}: MusicInfo & { onTogglePlay: () => void, onDetail():void}) => {


    return <View className="flex-row relative h-[60px] items-center px-[16px]">
        <View className="absolute h-[1px] top-0 left-0 right-0 bg-[#ccc]" />
        {picurl ? <View>
            <Image className="w-[40px] h-[40px] rounded-[20px]" source={{ uri: picurl }} />
        </View> : <View className="h-[40px] w-[40px] rounded-[20px]  justify-center items-center border-[1px]"><SimpleLineIcons name="music-tone-alt" size={16} color="black" /></View>}
        <View className="flex-1 ml-[12px] flex-row items-center "><Text className="text-[#716c6c]">{name ?? '歌曲名'}</Text>
            <Text className="text-[#716c6c] ml-[8px] font-bold text-[12px]">{artistsname ?? '歌手'}</Text>
        </View>
        <Pressable onPress={onTogglePlay} className="mx-[12px]">{isPlaying ? <Ionicons name="pause-outline" size={24} color="black" /> : <Ionicons name="play-outline" size={24} color="black" />}</Pressable>
        <Pressable onPress={onDetail} className="mr-[12px]"><AntDesign name="menufold" size={24} color="black" /></Pressable>
    </View>

}
export default MusicFooter;