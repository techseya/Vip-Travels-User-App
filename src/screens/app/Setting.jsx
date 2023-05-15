import {View, Text, Button} from 'react-native';
import Modal from 'react-native-modal';
import React from 'react';
import colors from 'src/constants/colors';

const Setting = () => {
  const [modalVisibility, setModalVisibility] = React.useState(false);

  const toggleModal = () => {
    setModalVisibility(!modalVisibility);
  };

  return (
    <View>
      <Text>Setting</Text>
      <Button title="Show modal" onPress={toggleModal} />

      <Modal
        onBackdropPress={() => setModalVisibility(false)}
        onBackButtonPress={() => setModalVisibility(false)}
        isVisible={modalVisibility}
        swipeDirection="down"
        onSwipeComplete={toggleModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={200}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={250}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View
          style={{
            backgroundColor: colors.LIGHT,
            paddingTop: 12,
            paddingHorizontal: 12,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            minHeight: "50%",
            paddingBottom: 20,
          }}>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 60,
                height: 5,
                backgroundColor: '#bbb',
                borderRadius: 3,
              }}
            />
            <Text>Welcome To My Bottom Sheet</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Setting;
