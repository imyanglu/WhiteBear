import { getRandMusics, getSearchMusic } from "@/api"
import { MusicFooter, SearchInputBar } from "@/components"
import MusicItem from "@/components/MusicItem"
import useMusicAudio from "@/hooks/useAudio"
import useMusicPlayer from "@/hooks/useMusicPlayer"
import { Music } from "@/type"
import { FlashList } from "@shopify/flash-list"
import { Stack } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { View, Text, Pressable, FlatList } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Image } from "expo-image"
import { SearchInputHandle } from "@/components/SearchInputBar"
import { get, save } from "@/storage"


const dateKey = new Date().toLocaleDateString() + 'music'
const DefaultLoadMusicCount = 8
const colors = [
    '#1C6759',
    '#071E1D',
    '#D8634F',
    '#AD292A',
    '#200B0D',
    '#BE7353',
    '#6889A9',
    '#FE803E',
];


const Page = () => {
    const { top } = useSafeAreaInsets()
    const { musicInfo, playMusic, changeSongsList,pause } = useMusicAudio()

    const [musics, setMusics] = useState<(Music)[]>()
    const requestRandomMusicList = async () => {
        const musicsR = await getRandMusics(DefaultLoadMusicCount)
        return musicsR.map(i => i.data)

    }
    const initMusics = async () => {

        const localMusicList = await get(dateKey)
        let songsList: Music[] = []
        if (!localMusicList) {
            songsList = await requestRandomMusicList()
            save(dateKey, musics)
        }
        else songsList = JSON.parse(localMusicList) as Music[]
        changeSongsList(songsList)
        setMusics(songsList)
    }





    const togglePlay = (data: { url: string, isPlaying: boolean }) => {
        const { url, isPlaying } = data
        const cMusic = musics?.find(i => i.url === url)
        console.log(isPlaying)
        if (isPlaying) { 
            pause()
            return
        }
        if (cMusic && !isPlaying) playMusic(cMusic)
        
    }

    const refreshMusicList = async () => {
        const musics = await requestRandomMusicList()
        setMusics(musics)
        save(dateKey, musics)
    }
    useEffect(() => {
        initMusics()
    }, [])

    return <View className="flex-1 bg-[#fff]" style={{ paddingTop: top + 12 }}>

        <View className="flex-row">
            <Pressable className="ml-[16px] py-[12px]  bg-[#1C6759] w-[100px] rounded-[8px] items-center" onPress={refreshMusicList}><Text className="text-[#fff]" onPress={refreshMusicList}>刷新</Text></Pressable>

        </View>
        <FlatList
            contentContainerStyle={{ paddingHorizontal: 16 }}
            data={musics}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
                return <MusicItem  {...item} status={musicInfo.playingUrl === item.url ? musicInfo.status : null} onTogglePlay={togglePlay} />
            }} />

        <View className="h-[80px]">
            {musicInfo.playingUrl && <MusicFooter  />}
        </View>
    </View>
}
export default Page