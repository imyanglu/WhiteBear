import { SearchInputBar } from "@/components"
import { Stack } from "expo-router"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const Page = () => { 
    const { top} = useSafeAreaInsets()
    return <View className="flex-1 bg-[#fff] px-[16px]" style={{paddingTop:top+12}}>
        <SearchInputBar placeholder="搜索音乐、歌手、专辑..." onSearch={() => { }}/>
    </View>
}
export default Page