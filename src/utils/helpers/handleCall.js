import {Linking, Platform} from 'react-native';
const handleCall = number => {
  let phoneNumber;
  if (Platform.OS === 'android') {
    phoneNumber = `tel:${number}`;
  } else {
    phoneNumber = `telprompt:${number}`;
  }
  Linking.openURL(phoneNumber);
};

export default handleCall;
