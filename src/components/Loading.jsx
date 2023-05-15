import {View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import colors from 'src/constants/colors';
import {height, width} from 'src/constants/info';

const Loading = ({styles}) => {
  return (
    <View
      style={{
        height: '100%',
        position: 'absolute',
        zIndex: 1001,
        backgroundColor: colors.LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        ...styles,
      }}>
      <ActivityIndicator animating={true} size={40} color={colors.PRIMARY} />
    </View>
  );
};

export default Loading;
