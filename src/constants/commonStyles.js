import {StyleSheet} from 'react-native';

export const styles = {
  bottomSheetModal: StyleSheet.create({
    modal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    modalContent: {
      backgroundColor: '#161616',
      paddingTop: 12,
      paddingHorizontal: 12,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      minHeight: 400,
      paddingBottom: 20,
    },
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
};
