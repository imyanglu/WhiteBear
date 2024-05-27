
import { forwardRef, ReactNode, useImperativeHandle, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';

type SearchInputProps = {
  placeholder?: string;
  onSearch: (str: string) => void;
  searchIcon?: ReactNode;
};
export type SearchInputHandle = {
  changeIsSearching(b: boolean): void;
};

const SearchInput = forwardRef<SearchInputHandle, SearchInputProps>(
  ({ searchIcon,  placeholder, onSearch }, ref) => {
    const scaleProgress = useSharedValue(0);
    const inputRef = useRef<TextInput>(null);
    const [str, setStr] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useImperativeHandle(ref, () => {
      return {
        changeIsSearching: setIsSearching,
      };
    });

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
      width: 38 * scaleProgress.value,
      transform: [{ scale: scaleProgress.value }],
    }));
    return (
      <View className="w-full bg-[#fff] flex-row items-center   h-[80px]">
        <TextInput
          ref={inputRef}
          value={str}
          selectTextOnFocus={false}
          selectionColor="#26AB47"
          placeholder={  placeholder}
          className="h-[44px] w-[100px] flex-1 rounded-[12px] bg-[#F2F2F2] px-[10px]"
          onChangeText={(text) => {
            if (text.trim()) {
              scaleProgress.value = withTiming(1, { duration: 500 });
            } else {
              scaleProgress.value = withTiming(0, { duration: 500 });
            }
            setStr(text);
          }}
        />
        {isSearching ? (
          <View className="w-[38px] pl-[8px]">
            <ActivityIndicator color="#4bb3e9" size={30} />
          </View>
        ) : (
          <Animated.View style={buttonAnimatedStyle}>
            <Pressable
              className="h-[30px] w-[30px] ml-[8px]"
              onPress={() => {
                inputRef.current?.blur();
                if (str && str.trim().length > 0) onSearch(str);
              }}>
           <FontAwesome6 name="searchengin" size={24} color="#6EB3A0" />
            </Pressable>
          </Animated.View>
        )}
      </View>
    );
  }
);
export default SearchInput;
