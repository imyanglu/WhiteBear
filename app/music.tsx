import { SearchInputBar } from "@/components"
import { Stack } from "expo-router"
import { View } from "react-native"

const Page = () => { 
    return <View className="flex-1 ">
        <SearchInputBar onSearch={() => { }}/>
    </View>
}
export default Page