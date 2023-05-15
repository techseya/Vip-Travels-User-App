import {Platform} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const isAccessExternalStorage = async () => {
  if (Platform.OS == 'android') {
    const res = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    if (res == RESULTS.GRANTED || res == RESULTS.LIMITED) {
      return true;
    } else {
      return false;
    }
  } else if (Platform.OS == 'ios') {
    const res = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    if (res == RESULTS.GRANTED || res == RESULTS.LIMITED) {
      return true;
    } else {
      return false;
    }
  }
};

export const isAccessGeoLocation = async()=>{
  if (Platform.OS == 'android') {
    const res = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (res == RESULTS.GRANTED || res == RESULTS.LIMITED) {
      return true;
    } else {
      return false;
    }
  } else if (Platform.OS == 'ios') {
    const res = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (res == RESULTS.GRANTED || res == RESULTS.LIMITED) {
      return true;
    } else {
      return false;
    }
  }
}
