import {Text, TouchableRipple} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {View} from 'react-native';
//const
import colors from 'src/constants/colors';
//Svg
import {Location} from 'src/assets/images';
import decodeString from 'src/utils/helpers/decodeString';

export default ({item}) => {

  return (
    <TouchableRipple
      borderless
      style={{borderRadius: 10}}
      onPress={() => {}}
      rippleColor={colors.PRIMARY}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
          gap: 10,
          paddingHorizontal: 5,
          paddingEnd:10,
          paddingVertical: 6,
        }}>
        <Location width={30} height={30} />
        <View style={{flex: 1}}>
          <Text
            lineBreakMode="clip"
            numberOfLines={4}
            variant="bold"
            style={{color: colors.DARK}}>
           {decodeString(item.pickup_name)}
          </Text>
          <Text lineBreakMode="clip"
            numberOfLines={4}
            style={{fontSize: 12, color: colors.GRAY}}>
           {decodeString(item.pickup_full_address)}
          </Text>
        </View>
        <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name="chevron-right" size={20} color={colors.PRIMARY} />
        </View>
        <View style={{flex: 1}}>
          <Text
            lineBreakMode="clip"
            numberOfLines={4}
            variant="bold"
            style={{color: colors.DARK}}>
           {decodeString(item.departure_name)}
          </Text>
          <Text
            lineBreakMode="clip"
            numberOfLines={4}
            style={{fontSize: 12, color: colors.GRAY}}>
            {decodeString(item.departure_full_address)}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
};
