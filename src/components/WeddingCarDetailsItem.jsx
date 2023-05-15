import {View, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
//consts
import colors from 'src/constants/colors';
import {Text, TouchableRipple} from 'react-native-paper';

export default ({item}) => {
  return (
    <TouchableRipple
      style={{
        borderWidth: 1,
        borderColor: colors.PRIMARY,
        borderRadius: 15,
      }}
      borderless
      onPress={() => console.log('Pressed')}
      rippleColor={colors.PRIMARY}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
        }}>
        <Image
          resizeMode="contain"
          style={{width: 150, height: 150}}
          source={require('../assets/images/cars/c2.png')}
        />
        <View style={{width: '52%', alignItems: 'flex-end'}}>
          <Text
            variant="bold"
            style={{
              textAlign: 'right',
              fontSize: 18,
              color: colors.DARK,
            }}>
            Prius
          </Text>
          <Text
            variant="medium"
            style={{
              textAlign: 'right',
              fontSize: 15,
              color: colors.DARK,
            }}>
            <Icon name="star" size={15} color={colors.PRIMARY} />
            3.0 Rating
          </Text>
          <Text
            variant="medium"
            style={{
              textAlign: 'right',
              fontSize: 13,
              color: colors.DARK,
            }}>
            LKR 10000.00 two hours
          </Text>
          <Text
            variant="regular"
            style={{
              textAlign: 'right',
              fontSize: 13,
              color: colors.GRAY,
            }}>
            (LKR 2000.00 will be added for every additional 2 hours)
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
};
