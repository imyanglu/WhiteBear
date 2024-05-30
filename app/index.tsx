
import { Pressable, View,Text,StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Utils = [{
    key: 'music',
    label: "音乐",
    des: 'QQ音乐,网易云',
    href:'/music',
    renderItem:function () { 
        return <Pressable className="flex-row items-center px-[12px] w-full bg-[#6EB3A0] h-[40px] py-[8px]  rounded-[8px]" style={{
            elevation:12, shadowColor: '#000',
        }} onPress={() => { 

            router.push(this.href)
        }}>
                  <MaterialIcons name="my-library-music" size={24} color="#A5E3BA" />
            <Text className="ml-[12px] text-[#fff] font-bold">{this.label} <Text className="text-[12px]">{ this.des}</Text></Text>
        </Pressable>
    }
}]

const Index = () => { 
    const { top} = useSafeAreaInsets()
    return <View className='flex-1 bg-[#f2f2f2] px-[16px] flex-row flex-wrap gap-x-[12px]' style={{ paddingTop: top +24}}>
        {Utils.map((item, index) => {
            return <View key={item.key} className='flex-row  basis-[50%]  items-center justify-center'>
                {item.renderItem()}
            </View>
        })}
    </View>
}
export default Index; 
