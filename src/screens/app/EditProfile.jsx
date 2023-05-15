import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {
  Avatar,
  Button,
  Dialog,
  IconButton,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import {isAccessExternalStorage} from 'src/utils/helpers/permission';
import {editProfile} from 'src/store/appSlice/appService';
import {removeError} from 'src/store/appSlice/appSlice';
import {apiInfo} from 'src/constants/info';
import {BackButton, Loading} from 'src/components';
import colors from 'src/constants/colors';
import {Dummy} from 'src/assets/images';
import {setEditProfile} from 'src/store/authSlice/authSlice';

const EditProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.currentUser);
  const app = useSelector(state => state.app);
  const [editUser, setEditUser] = React.useState({
    first_name: user.first_name == 'None' ? '' : user.first_name,
    last_name: user.last_name == 'None' ? '' : user.last_name,
    mobile: user.mobile,
    email: user.email,
    profile: user.profile == null ? '' : user.profile,
  });
  const selectImage = () => {
    isAccessExternalStorage().then(access => {
      if (access) {
        launchImageLibrary({mediaType: 'photo', includeBase64: true}).then(
          res => {
            if (res.assets) {
              setEditUser({
                ...editUser,
                profile: `data:image/png;base64,${res.assets[0].base64}`,
              });
            }
          },
        );
      }
    });
  };
  return (
    <>
      {app.isLoading ? (
        <Loading styles={{backgroundColor: colors.BACKDROP}} />
      ) : null}
      <ScrollView style={{backgroundColor: colors.LIGHT}}>
        <Portal>
          <Dialog
            visible={app.error != null ? true : false}
            onDismiss={() => dispatch(removeError())}>
            <Dialog.Icon icon="alert" />
            <Dialog.Title style={{color: colors.DARK}}>
              Edit Profile Error
            </Dialog.Title>
            <Dialog.Content>
              <Text style={{color: colors.DARK}} variant="bodyMedium">
                {app.error}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => dispatch(removeError())}
                labelStyle={{color: colors.PLACEHOLDER}}>
                Okay
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <View style={{flex: 1, width: '100%', height: 50}}>
          <BackButton _goBack={() => navigation.goBack()} />
        </View>
        <View style={{padding: 10, alignItems: 'center'}}>
          {editUser.profile == null || editUser.profile == '' ? (
            <Avatar.Image
              style={{backgroundColor: colors.LIGHT, elevation: 5}}
              source={Dummy}
              size={150}
            />
          ) : (
            <Avatar.Image
              style={{backgroundColor: colors.LIGHT, elevation: 5}}
              source={{uri: editUser.profile}}
              size={150}
            />
          )}
          <IconButton
            style={{position: 'absolute', right: 95, bottom: 10}}
            size={30}
            icon="pencil-outline"
            iconColor={colors.LIGHT}
            containerColor={colors.PRIMARY}
            onPress={() => selectImage()}
          />
        </View>
        <Text
          variant="title_lg"
          style={{color: colors.DARK, textAlign: 'center', marginTop: 20}}>
          Edit Profile
        </Text>
        <View style={{paddingHorizontal: 20, rowGap: 10, marginTop: 20}}>
          <TextInput
            value={editUser.first_name}
            onChangeText={val => setEditUser({...editUser, first_name: val})}
            mode="flat"
            label={<Text style={{color: colors.PLACEHOLDER}}>First Name</Text>}
            textColor={colors.PLACEHOLDER}
            placeholderTextColor={colors.PLACEHOLDER}
            underlineColor={colors.DARK}
            activeUnderlineColor={colors.DARK}
          />
          <TextInput
            value={editUser.last_name}
            onChangeText={val => setEditUser({...editUser, last_name: val})}
            mode="flat"
            label={<Text style={{color: colors.PLACEHOLDER}}>Last Name</Text>}
            textColor={colors.PLACEHOLDER}
            placeholderTextColor={colors.PLACEHOLDER}
            underlineColor={colors.DARK}
            activeUnderlineColor={colors.DARK}
          />
          <TextInput
            value={editUser.mobile}
            onChangeText={val => setEditUser({...editUser, mobile: val})}
            mode="flat"
            label={
              <Text style={{color: colors.PLACEHOLDER}}>Phone Number</Text>
            }
            textColor={colors.PLACEHOLDER}
            placeholderTextColor={colors.PLACEHOLDER}
            underlineColor={colors.DARK}
            activeUnderlineColor={colors.DARK}
          />
          <TextInput
            value={editUser.email}
            onChangeText={val => setEditUser({...editUser, email: val})}
            mode="flat"
            label={
              <Text style={{color: colors.PLACEHOLDER}}>Email Address</Text>
            }
            textColor={colors.PLACEHOLDER}
            placeholderTextColor={colors.PLACEHOLDER}
            underlineColor={colors.DARK}
            activeUnderlineColor={colors.DARK}
          />
          <Button
            style={{marginTop: 30}}
            contentStyle={{paddingHorizontal: 13, paddingVertical: 3}}
            labelStyle={{
              fontWeight: 'bold',
              fontSize: 20,
              color: colors.LIGHT,
              marginTop: 13,
            }}
            onPress={() => {
              dispatch(
                editProfile({
                  user_id: user.id,
                  ...editUser,
                  ...apiInfo('profile'),
                }),
              ).then(res =>
                res.payload == undefined
                  ? null
                  : dispatch(setEditProfile(res.payload)),
              );
            }}
            mode="contained">
            SAVE
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

export default EditProfile;
