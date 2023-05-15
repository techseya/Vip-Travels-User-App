import AsyncStorage from "@react-native-async-storage/async-storage"

export const setData = (name,data)=>{
    AsyncStorage.setItem(name,JSON.stringify(data));
}

export const removeItem = (name)=>{
    AsyncStorage.removeItem(name);
}

export const getData = async(name)=>{
    // AsyncStorage.clear()
    const res = await AsyncStorage.getItem(name);
    return JSON.parse(res);
}
