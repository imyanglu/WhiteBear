import { getRandMusics } from "@/api"
import { MusicFooter, SearchInputBar } from "@/components"
import MusicItem from "@/components/MusicItem"
import useMusicAudio from "@/hooks/useAudio"
import useMusicPlayer from "@/hooks/useMusicPlayer"
import { Music } from "@/type"
import { FlashList } from "@shopify/flash-list"
import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import { View,Text } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"


const TitleDict = {
    hot: '热歌推荐',
    res:'搜索结果'
}
const Page = () => {
    const { top } = useSafeAreaInsets()
    const { audio,changeMusicInfo,musicInfo,playMusic} = useMusicAudio()

    const [musics, setMusics] = useState<Music[]>()
    const [title, setTitle] = useState<keyof typeof TitleDict>('hot')
    const initMusics = async () => {
        const musicsR = await getRandMusics(5)
        console.log(musicsR)
        setMusics(musicsR.map(i => i.data))
    }
    const onDetail = () => { }
    const togglePlay = (data: { url: string, isPlaying: boolean }) => { 
        const { url, isPlaying } = data
        const cMusic = musics?.find(i => i.url === url) 
        if(cMusic)playMusic(cMusic)
    }
    useEffect(() => {
        initMusics()
    }, [])

    return <View className="flex-1 bg-[#fff]" style={{ paddingTop: top + 12 }}>
        <View className="px-[16px]"><SearchInputBar placeholder="搜索音乐、歌手、专辑..." onSearch={() => { }} /></View>
        <Text className="ml-[16px]">{ TitleDict[title]}</Text>
        <FlashList
            contentContainerStyle={{paddingHorizontal:16}}
            showsVerticalScrollIndicator={false}
            data={musics}
            extraData={[musicInfo]}
            estimatedItemSize={80}
            renderItem={({ item }) => {
                    return <MusicItem  {...item} isPlaying={musicInfo?.url===item.url} onTogglePlay={togglePlay} />
            }} />
        <View className="h-[80px]">
            {musicInfo && <MusicFooter {...musicInfo} onTogglePlay={() => { }} onDetail={onDetail}/> }
        </View>
        </View>
}
export default Page