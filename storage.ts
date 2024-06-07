import AsyncStorage from "@react-native-async-storage/async-storage";


export const save = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  } catch (e) {
    throw e;
  }
};

export const get = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    throw e;
  }
};

export const del = async (key: string) => {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (e) {
    throw e;
  }
};
