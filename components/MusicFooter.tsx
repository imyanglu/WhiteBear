import useMusicAudio, { MusicInfo } from "@/hooks/useAudio";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { SimpleLineIcons } from '@expo/vector-icons';
import { Image } from "expo-image";
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Music } from "@/type";
import { useEffect, useMemo } from "react";
import { AVPlaybackStatusSuccess }from 'expo-av'
import { useLast } from "@/hooks";
import { useRouter } from "expo-router";

const MusicFooter = () => {
    const router = useRouter()

    const { musicInfo, audio,playMusic, removeMusic } = useMusicAudio();
    const isPlaying = musicInfo.status === 'playing'
    const { songs, playingUrl, status } = musicInfo
    const currentMusic = useMemo(() => { 
       return songs.find((item) => item.url === playingUrl)
    }, [playingUrl, songs])
    const onMusicEnd = useLast(() => { 
        const cSongs = songs.filter(i => i.url !== playingUrl)
        if (cSongs.length === 0) { 
            console.log('歌曲播放完了')
        // return changeMusicInfo({songs:[],playingUrl:null,isPlaying:false})
        }
        console.log('下一首')
        removeMusic(cSongs[0].url)
        playMusic(cSongs[0])
        
        
    })
    useEffect(() => { 
        audio._onPlaybackStatusUpdate = (s) => {
            const status = s  as  AVPlaybackStatusSuccess
            if (status.didJustFinish) { 
                onMusicEnd.current()
            }
         }
    },[])
    return <View className="flex-row relative h-[60px] items-center px-[16px]">
        <View className="absolute h-[1px] top-0 left-0 right-0 bg-[#ccc]" />
        {currentMusic?.picurl ? <Pressable onPress={() => { 
            router.push('/lyrics')
        }}>
            <Image key={ currentMusic.picurl} className="w-[40px] h-[40px] rounded-[20px] bg-[#F4F4F4]" source={{ uri: currentMusic?.picurl }} onLoad={() => { }}/>
        </Pressable> : <View className="h-[40px] w-[40px] rounded-[20px]  justify-center items-center border-[1px]"><SimpleLineIcons name="music-tone-alt" size={16} color="black" /></View>}
        <View className="flex-1 ml-[12px] flex-row items-center "><Text className="text-[#716c6c]">{currentMusic?.name ?? '歌曲名'}</Text>
            <Text className="text-[#716c6c] ml-[8px] font-bold text-[12px]">{currentMusic?.artistsname ?? '歌手'}</Text>
        </View>
        {status === 'loading' ? <ActivityIndicator size={20} /> : <Pressable onPress={() => { }}>
                { isPlaying ?    <Ionicons name="pause-outline" size={24} color="black" />:  <Ionicons name="play-outline" size={24} color="black" />}
             </Pressable>}
      
    </View>

}
export default MusicFooter;