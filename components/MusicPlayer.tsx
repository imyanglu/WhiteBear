import ReText from './ReText';
import { AVPlaybackStatusSuccess, Audio } from 'expo-av';
import { Image } from 'expo-image';
import { atom, useAtom } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Dimensions, Pressable, FlatList } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLast } from '@/hooks';
import { Ionicons } from '@expo/vector-icons';
import { Music } from '@/type';
import useMusicAudio from '@/hooks/useAudio';

const { width } = Dimensions.get('window');



type MusicPlayerConfig = {
  songs:Map<string,Music>;
  isPlaying: boolean;
  playingUrl: string;
};

const DefaultSongs: MusicPlayerConfig = {
  songs: new Map(),
  isPlaying: false,
  playingUrl: '',
};

export const MusicAtom = atom<MusicPlayerConfig>(DefaultSongs);

const formatTimeStr = (seconds?: number) => {
  'worklet';
  if (!seconds) return '';
  const secondStr = (seconds % 60).toFixed(0);
  const minutes = Math.floor(seconds / 60);
  if (minutes === 0) return '00:' + secondStr + '';
  const minuteStr = minutes % 60;
  const hour = Math.floor(minutes / 60);
  if (hour === 0) return `${minuteStr}:${secondStr}`;
  return `${hour}:${minuteStr}:${secondStr}`;
};



const MusicPlayer = () => {
  const { top } = useSafeAreaInsets();
  const { audio,musicInfo,changeMusicInfo} = useMusicAudio()
  const isExpandedProgress = useSharedValue(0);
  const isLongPress = useSharedValue(false);
  const saveTranslateY = useSharedValue(top);
  const translateY = useSharedValue(0);
  const songsListHeight = useSharedValue(0);
  const currentDuration = useSharedValue(0);
  const duration = useSharedValue(0);

  const [musicsAtom, setMusicsAtom] = useAtom(MusicAtom);
  const prePlayingIdRef = useRef('');
  const [showCloseModal, setShowCloseModal] = useState(false);

    const currentMusic = useMemo(() => {
      return musicsAtom.songs.get(musicsAtom.playingUrl);
  }, [musicsAtom]);

  const stopMusic = async () => {
    const data = (await audio.getStatusAsync()) as AVPlaybackStatusSuccess;
    const currentMillions = data.positionMillis;
    currentDuration.value = currentMillions / 1000;
    if (currentMillions !== data.durationMillis) {
      await audio.pauseAsync();
    } else {
      await audio.stopAsync();
    }
  };

  const continuePlay = async () => {
    const data = (await audio.getStatusAsync()) as AVPlaybackStatusSuccess;
    const duration = data.durationMillis;
    const currentMillions = data.positionMillis;
    audio.setPositionAsync(currentMillions);
    audio.playAsync();
    currentDuration.value = withTiming(duration ?? 1 / 1000, {
      duration: (duration ?? 9999) - currentMillions,
    });
  };

  const clearSongs = async () => {
    await audio.unloadAsync();
    setMusicsAtom({ songs: new Map(), isPlaying: false, playingUrl: '' });
  };

    const playEnded = useLast(async () => {
      const songs = musicsAtom.songs
  songs.delete(musicsAtom.playingUrl)
    if (!songs.keys().next().value) {
      try {
        await audio.unloadAsync();
      } catch (err) {}
      clearSongs();
      return;
    }
    setMusicsAtom({ playingUrl: songs.values().next().value as string, isPlaying: true,songs: new Map(songs) });
  });

  const playMusic = async (uri: string) => {
    currentDuration.value = 0;
    duration.value = 0;
    try {
      await audio.unloadAsync();
    } catch (err) {}
    await audio.loadAsync({ uri }, { shouldPlay: true }).then((data) => {
      prePlayingIdRef.current = musicsAtom.playingUrl;
      const successData = data as AVPlaybackStatusSuccess;
      if (successData.durationMillis) {
        duration.value = successData.durationMillis / 1000;
        currentDuration.value = withTiming(successData.durationMillis / 1000, {
          duration: successData.durationMillis / 1000,
        });
      }
    });

    audio._onPlaybackStatusUpdate = (e) => {
      const result = e as AVPlaybackStatusSuccess;
      currentDuration.value = result.positionMillis / 1000;

      if (!e.isLoaded) return;
      if (e.didJustFinish) {
        prePlayingIdRef.current = '';
        audio.stopAsync();
       playEnded.current()
      }
    };
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: 80 + (width - 32 - 80) * isExpandedProgress.value,
      borderRadius: 40 - 24 * isExpandedProgress.value,
      transform: [{ translateY: saveTranslateY.value + translateY.value }],
      height: 80 + songsListHeight.value,
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginLeft: 5,
    };
  });

  const text = useDerivedValue(() => {
    return formatTimeStr(currentDuration.value);
  });

  const extraAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: (width - 32 - 80) * isExpandedProgress.value,
    };
  });

  const songsListAnimatedStyle = useAnimatedStyle(() => {
    return {
      zIndex: -1,
      height: songsListHeight.value,

      width: '100%',
    };
  });

  const toggleSongsList = () => {
    songsListHeight.value = withTiming(songsListHeight.value === 0 ? 300 : 0);
  };
  const toggleMusic = () => {
    setMusicsAtom((a) => {
      return {
        ...a,
        isPlaying: !a.isPlaying,
      };
    });
  };

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .onUpdate((e) => {
        if (!isLongPress.value) return;
        const { translationY } = e;
        translateY.value = translationY;
      })
      .onEnd((e) => {
        if (isLongPress.value) {
          const { translationY } = e;
          translateY.value = 0;
          saveTranslateY.value += translationY;
        }
        isLongPress.value = false;
      });
  }, []);

  const tabGesture = useMemo(() => {
    return Gesture.Tap().onStart(() => {
      if (isExpandedProgress.value === 0) isExpandedProgress.value = withTiming(1);
      else
        songsListHeight.value = withTiming(0, {}, () => {
          isExpandedProgress.value = withTiming(0);
        });
    });
  }, []);

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: '100%',
      width: `${(currentDuration.value * 100) / (duration.value || 1)}%`,
      backgroundColor: '#53c053',
    };
  });

  const longPressGesture = useMemo(() => {
    return Gesture.LongPress()
      .minDuration(200)
      .onStart(() => {
        isLongPress.value = true;
      })
      .simultaneousWithExternalGesture(panGesture, tabGesture);
  }, []);

  const close = () => {
    setShowCloseModal(true);
  };

  useEffect(() => {
    if (!currentMusic) return;
    if (musicsAtom.isPlaying) {
      if (prePlayingIdRef.current === currentMusic.url) {
        continuePlay();
      } else playMusic(currentMusic.url);
      return;
    }
    stopMusic();
  }, [musicsAtom.isPlaying, currentMusic]);

  if (!musicsAtom.songs.values().next().value) return <></>;
  return (
    <>
      <Animated.View
        className="bg-slate-300 absolute  right-[16px] overflow-hidden top-0 "
        style={animatedStyle}>
        <View className="flex-row h-[70px] mt-[5px]">
          <GestureDetector gesture={longPressGesture}>
            <GestureDetector gesture={panGesture}>
              <GestureDetector gesture={tabGesture}>
                <Animated.View style={imageAnimatedStyle}>
                  {currentMusic && (
                    <Image
                      key={currentMusic.picurl}
                                          source={{uri:currentMusic.picurl}}
                    className="w-[70px] h-[70px] rounded-[30px]"
       
                    />
                  )}
                </Animated.View>
              </GestureDetector>
            </GestureDetector>
          </GestureDetector>

          <Animated.View className=" h-[70px]  flex-row" style={extraAnimatedStyle}>
            <View className="ml-[10px] flex-1 py-[4px] ">
              <Text className="text-[18px] font-bold" numberOfLines={1}>
                {currentMusic?.name}
              </Text>
              <View className="flex-row items-center h-[20px]">
                <ReText text={text} style={{ fontSize: 12 }} />
              </View>
              <View className="w-full mt-[4px] h-[6px] rounded-[3px] bg-[#fff] overflow-hidden">
                <Animated.View style={progressAnimatedStyle} />
              </View>
            </View>
            <View className="w-[30px] ml-[20px] h-full items-center justify-center">
              <Pressable className="" onPress={toggleMusic}>
               { musicsAtom.isPlaying ?    <Ionicons name="pause-outline" size={24} color="black" />:  <Ionicons name="play-outline" size={24} color="black" />}
              </Pressable>
            </View>
            <View className="w-[40px] h-full items-center justify-center ">
              <Pressable className="gap-y-[4px]" onPress={toggleSongsList}>
                <View className="w-[22px] h-[4px] rounded-[2px] bg-black" />
                <View className="w-[22px] h-[4px] rounded-[2px] bg-black" />
                <View className="w-[22px] h-[4px] rounded-[2px] bg-black" />
              </Pressable>
            </View>
            <View className="w-[20px] items-end">
              <Pressable onPress={close}>
                {/* <Image
                  source={require('assets/images/icons/close-red.svg')}
                  className="w-[18px] h-[18px] mt-[4px] mr-[4px]"
                /> */}
              </Pressable>
            </View>
          </Animated.View>
        </View>
        <Animated.View style={songsListAnimatedStyle}>
          <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View className="h-[30px] justify-center items-center">
                <Text>列表</Text>
              </View>
            }
            data={Array.from(musicsAtom.songs.values())}
            ItemSeparatorComponent={() => <View className='h-[10px]'/>}
            renderItem={({ item }) => (
              <View className="h-[40px]  items-center flex-row px-[8px] ">
                <Text
                  numberOfLines={1}
                  onPress={() => {
                    setMusicsAtom((a) => ({ ...a,playingUrl:item.url }));
                  }}>
                  {item.name}
                </Text>
                <Pressable
                  className="ml-auto pr-[4px]"
                  onPress={() => {
                    // removeMusic(item);
                  }}>
                  {/* <Image
                    className="w-[18px] h-[18px]"
                    source={require('assets/images/icons/close-gray.svg')}
                  /> */}
                </Pressable>
              </View>
            )}
          />
        </Animated.View>
      </Animated.View>
      {/* <CloseMusicPlayerModal
        show={showCloseModal}
        onClose={() => {
          setShowCloseModal(false);
        }}
        onConfirm={() => {
          setShowCloseModal(false);
          clearSongs();
        }}
      /> */}
    </>
  );
};
export default MusicPlayer;
