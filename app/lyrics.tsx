import { MusicAudioContext } from '@/Context/MusicAudioContext'
import { useContext, useEffect, useMemo } from 'react'
import { View} from 'react-native'

const Page = () => {
    const [{ music, audio }] = useContext(MusicAudioContext)
    const currentMusic = useMemo(() => {
        return  music.songs.find(i=>i.url===music.playingUrl)
     },[music])
    useEffect(() => { 
        audio._onPlaybackStatusUpdate = () => { 
            
         
        }
    },[])
    return <View className='flex-1 bg-[#fff]'>
        
    </View>
 }
export default Page