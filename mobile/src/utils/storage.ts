import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeStringData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    console.log("error - storeStringData", err);
  };
};

export const storeObjectData = async (key: string, value: string) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (err) {
    console.log("error - storeObjectData", err);
  };
};

export const getStringData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null)
      return value;
  } catch (err) {
    console.log("error - getStringData", err);
  };
};

export const getObjectData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (err) {
    console.log("error - getObjectData", err);
  };
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (err) {
    console.log("error - removeData", err);
    return false;
  };
};