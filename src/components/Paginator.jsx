import {View, Animated} from 'react-native';

//consts
import {width} from 'src/constants/info';
import colors from 'src/constants/colors';


export default ({data, scrollX}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const paginatorWidth = scrollX.interpolate({
          inputRange,
          outputRange: [width / 8, width / 5, width / 8],
          extrapolate: 'clamp',
        });
        const paginatorColor = scrollX.interpolate({
          inputRange,
          outputRange: [
            colors.GRAY,
            colors.PRIMARY,
            colors.GRAY,
          ],
          extrapolate: 'clamp',
        });
        const paginatorOpacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.5, 1, 0.5],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            style={[
              {
                height: 8,
                width: paginatorWidth,
                backgroundColor: paginatorColor,
                opacity: paginatorOpacity,
                borderRadius: 5,
                marginHorizontal: 8,
              },
            ]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
};
