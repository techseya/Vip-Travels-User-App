import {View} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Avatar,
  Text,
  TouchableRipple,
} from 'react-native-paper';
//consts
import colors from 'src/constants/colors';
//compoenets
import {DashHr} from '../../components';

export default props => {
  return (
    <View style={{flex: 1, backgroundColor: colors.LIGHT}}>
      <View
        style={{
          flex: 0.2,
          backgroundColor: colors.PRIMARY,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 5,
        }}>
        <Avatar.Image
          size={50}
          source={require('../../assets/images/dummy.png')}
        />
        <View>
          <Text
            variant="bold"
            style={{
              width: 180,
              maxHeight: '50%',
              overflow: 'hidden',
              color: colors.LIGHT,
              marginStart: 10,
              fontSize: 20,
            }}>
            John Fernando
          </Text>
          <TouchableRipple
            style={{width: '64%', borderRadius: 30}}
            borderless
            onPress={() => props.navigation.navigate('editProfile')}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingHorizontal: 10,
                paddingVertical: 2,
              }}>
              <Text variant="bold" style={{fontSize: 12}}>
                EDIT PROFILE
              </Text>
              <Icon name="edit" size={12} style={{color: colors.DARK}} />
            </View>
          </TouchableRipple>
        </View>
      </View>
      <View style={{flex: 0.5}}>
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      </View>
      <View style={{flex: 0.3}}>
        <View style={{alignItems: 'center'}}>
          <DashHr
            dashStyle={{
              width: '80%',
              height: 2,
              borderRadius: 10,
              backgroundColor: colors.GRAY,
            }}
          />
        </View>
      </View>
    </View>
  );
};
