import {View} from 'react-native';
import {Avatar, IconButton} from 'react-native-paper';
import IIcon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import colors from 'src/constants/colors';
import {useNavigation} from '@react-navigation/native';

export default ({navMode, ...props}) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <IconButton
        onPress={() =>
          navMode == 'sideNav'
            ? props.navigation.toggleDrawer()
            : navigation.goBack()
        }
        icon={() =>
          navMode == 'sideNav' ? (
            <FIcon name="navicon" size={30} style={{color: colors.DARK}} />
          ) : navMode == 'back' ? (
            <IIcon name="chevron-back" size={35} style={{color: colors.DARK}} />
          ) : null
        }
      />
      <IconButton
        onPress={() => console.log('edit Profile btn')}
        size={50}
        icon={() => (
          <Avatar.Image
            size={50}
            source={require('../../assets/images/dummy.png')}
          />
        )}
      />
    </View>
  );
};
