import { getRandMusics } from "@/api"
import { SearchInputBar } from "@/components"
import MusicItem from "@/components/MusicItem"
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
    const [musics, setMusics] = useState<Music[]>()
    const [title,setTitle] = useState<keyof typeof TitleDict>('hot')
    const initMusics = async () => {
        const musicsR = await getRandMusics(5)
        console.log(musicsR)
        setMusics(musicsR.map(i => i.data))
    }
    const onDetail = (id:string) => { }
    const togglePlay = () => { }
    useEffect(() => {
        initMusics()
    }, [])

    return <View className="flex-1 bg-[#fff] px-[16px]" style={{ paddingTop: top + 12 }}>
        <SearchInputBar placeholder="搜索音乐、歌手、专辑..." onSearch={() => { }} />
        <Text>{ TitleDict[title]}</Text>
            <FlashList showsVerticalScrollIndicator={ false} data={musics}
                estimatedItemSize={80}
                renderItem={({ item }) => {
                    return <MusicItem  {...item} isPlaying={ false} />
                }} />
             </View>
}
export default Page