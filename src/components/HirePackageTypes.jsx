// working bs
import {format} from 'date-fns';
import React from 'react';
import {Image, View} from 'react-native';
import {ActivityIndicator, Text, TouchableRipple} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {
  PackageIcon1,
  PackageIcon2,
  PackageIcon3,
  PackageIcon4,
  PackageIcon5,
} from 'src/assets/images';
import colors from 'src/constants/colors';
import {apiInfo} from 'src/constants/info';
import {generateFarePackage} from 'src/store/appSlice/appService';

export default ({item, stateData, setPrice}) => {
  const [isAPIDataLoaded, setIsAPIDataLoaded] = React.useState(false);

  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.currentUser);

  React.useEffect(() => {
  
    if (isAPIDataLoaded == false) {
      setTimeout(() => {
        dispatch(
          generateFarePackage({
            ...apiInfo('ride'),
            user_id: user.user_id,
            log_id: user.log_id,
            session_id: user.session_id,
            csi: user.csi,
            pickup_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
            distance: stateData.tripData.tripDuration,
            vehicle_type: item.id,
            tour_type: 1,
          }),
        ).then(res =>
          res.payload == undefined
            ? setIsAPIDataLoaded(null)
            : res.payload.result != false
            ? setIsAPIDataLoaded(res.payload.result)
            : setIsAPIDataLoaded(null),
        );
      }, item.fetchTime);
    }
  }, [isAPIDataLoaded]);

  return (
    <>
      {isAPIDataLoaded == null ? null : isAPIDataLoaded == false ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.LIGHT,
            paddingHorizontal: 40,
            paddingVertical: 60,
            borderWidth: 1.5,
            borderColor: colors.PRIMARY,
            borderRadius: 15,
          }}>
          <ActivityIndicator
            animating={true}
            size={40}
            color={colors.PRIMARY}
          />
        </View>
      ) : (
        <TouchableRipple
          style={{
            borderWidth: 2,
            borderColor: colors.PRIMARY,
            borderRadius: 15,
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
          borderless
          onPress={() =>
            setPrice({
              lastPrice: (
                isAPIDataLoaded.base +
                stateData.tripData.tripDistance * isAPIDataLoaded.rate
              ).toFixed(2),
              vehicleType: item.id,
            })
          }
          rippleColor={colors.PRIMARY}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              resizeMode="contain"
              style={{width: 200, height: 200}}
              source={
                item.id == 1
                  ? PackageIcon1
                  : item.id == 2
                  ? PackageIcon2
                  : item.id == 3
                  ? PackageIcon3
                  : item.id == 4
                  ? PackageIcon4
                  : PackageIcon5
              }
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <View style={{alignItems: 'center'}}>
                <Text variant="bold" style={{color:colors.DARK}}>Trip Distance</Text>
                <Text variant="bold" style={{color:colors.DARK}}>
                  {stateData.tripData.tripDistance.toFixed(1)}
                </Text>
                <Text variant="bold" style={{color:colors.DARK}}>KM</Text>
              </View>

              <View
                style={{
                  height: '75%',
                  borderWidth: 1.5,
                  borderColor: colors.DARK,
                  borderRadius: 10,
                }}
              />
              <View style={{alignItems: 'center'}}>
                <Text variant="bold" style={{color:colors.DARK}}>Base Price</Text>
                <Text variant="bold" style={{color:colors.DARK}}>{isAPIDataLoaded.base}</Text>
                <Text variant="bold" style={{color:colors.DARK}}>LKR</Text>
              </View>

              <View
                style={{
                  height: '75%',
                  borderWidth: 1.5,
                  borderColor: colors.DARK,
                  borderRadius: 10,
                }}
              />

              <View style={{alignItems: 'center'}}>
                <Text variant="bold" style={{color:colors.DARK}}>Last Price</Text>
                <Text variant="bold" style={{color:colors.DARK}}>
                  {(
                    isAPIDataLoaded.base +
                    stateData.tripData.tripDistance * isAPIDataLoaded.rate
                  ).toFixed(2)}
                </Text>
                <Text variant="bold" style={{color:colors.DARK}}>LKR</Text>
              </View>
            </View>
          </View>
        </TouchableRipple>
      )}
    </>
  );
  //   return (
  //
  //   );
};
