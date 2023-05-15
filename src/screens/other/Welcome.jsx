import React from 'react';
import {View, FlatList, Animated} from 'react-native';
import {Button, Text} from 'react-native-paper';
//svg
import {Taxi, Rent, Wedding} from 'src/assets/images';

// compoent
import {width} from 'src/constants/info';
import {WalkThroughItem, Paginator} from 'src/components';
import colors from 'src/constants/colors';

//redux
import {useDispatch} from 'react-redux';
import {continueApp} from 'src/store/walkthroughSlice/walkthroughSlice';

const Welcome = props => {
  const dispatch = useDispatch();

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const slidesRef = React.useRef(null);

  const viewableItemChanged = React.useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = React.useRef({viewAreaCoveragePercentThreshold: 50}).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({index: currentIndex + 1});
    } else {
      dispatch(continueApp());
    }
  };

  const slides = [
    {
      id: 1,
      title: 'We offer combatable & safe Taxi Service',
      img: Taxi,
    },
    {
      id: 2,
      title: 'Beautify your Wedding day with us',
      img: Wedding,
    },
    {
      id: 3,
      title: 'We offers Luxury Cars for Rent',
      img: Rent,
    },
  ];

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View style={{flex: 3}}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          scrollEnabled={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          onViewableItemsChanged={viewableItemChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
          data={slides}
          renderItem={({item}) => <WalkThroughItem item={item} />}
          keyExtractor={item => item.id}
        />
      </View>
      <Paginator data={slides} scrollX={scrollX} />
      <View style={{width: width / 2, paddingVertical: '10%'}}>
        <Button
          mode="contained"
          contentStyle={{paddingHorizontal: 13, paddingVertical: 3}}
          labelStyle={{
            fontWeight: 'bold',
            fontSize: 20,
            color: colors.LIGHT,
            marginTop: 13,
          }}
          onPress={scrollTo}>
          <Text variant="bold" style={{fontSize: 18, color: colors.LIGHT}}>
            Next
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default Welcome;
