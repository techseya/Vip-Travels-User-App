import {View} from 'react-native';
import {Text} from 'react-native-paper';

//consts
import {width} from 'src/constants/info';
import colors from 'src/constants/colors';

export default ({item}) => {
  return (
    <View
      style={{
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
      }}>
      <View
        style={{
          width: width / 1.5,
          aspectRatio: 1,
          borderRadius: width / 0.25,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.PRIMARY,
        }}>
        <item.img width={width / 3} height={width / 3} />
      </View>
      <View style={{width: width / 2}}>
        <Text variant="bold" style={{fontSize: 20,color:colors.GRAY, textAlign: 'center'}}>
          {item.title}
        </Text>
      </View>
    </View>
  );
};
