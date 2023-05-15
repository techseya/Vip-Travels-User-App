import React from 'react';
import {
  Surface,
  Text,
  Button,
  TouchableRipple,
  ActivityIndicator,
} from 'react-native-paper';
import {View, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import colors from 'src/constants/colors';
import {LocationListItem} from 'src/components';
import {
  resetTripHistory,
  setPosition,
  setScreen,
} from 'src/store/appSlice/appSlice';

import {Taxi, Wedding, Rent} from 'src/assets/images';

import {apiInfo, height, width} from 'src/constants/info';
import {isAccessGeoLocation} from 'src/utils/helpers/permission';
import Modal from 'react-native-modal';
import mapStyleJson from 'src/constants/mapStyleJson';
import {getTripHistory} from 'src/store/appSlice/appService';

const Home = () => {
  const app = useSelector(state => state.app);
  const user = useSelector(state => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [modalData, setModalData] = React.useState({
    visibility: false,
    modal: {
      modalIcon: Taxi,
      modalText: 'error',
      modalBtnText: 'loading',
      navScreenName: 'hireRide',
    },
  });

  const [up, setUp] = React.useState(0);
  const [offUp, setOffUp] = React.useState(false);

  const toggleModal = data => {
    setModalData({
      visibility: !modalData.visibility,
      modal: data ? data : modalData.modal,
    });
  };

  const getLocation = async () => {
    const access = await isAccessGeoLocation();
    if (access) {
      Geolocation.getCurrentPosition(
        position => {
          dispatch(
            setPosition({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          );
        },
        err => {
          console.log(err.code, err.message);
        },
        {timeout: 15000, maximumAge: 10000},
      );
    }
  };

  React.useEffect(() => {
    getLocation();
    const mapRenderInterval = setInterval(() => getLocation(), 10000);
    return () => clearInterval(mapRenderInterval);
  }, []);

  React.useEffect(() => {
    if (!offUp) {
      if (up == 0) {
        dispatch(resetTripHistory());
      }
      dispatch(
        getTripHistory({
          ...apiInfo('trip'),
          user_id: user.id,
          row_count: 20,
          up: up,
        }),
      ).then(res =>
        res.payload != undefined
          ? res.payload.result == false
            ? setOffUp(true)
            : null
          : null,
      );
    }
  }, [up]);

  return (
    <View
      style={{
        flex: 1,
        gap: 10,
        backgroundColor: colors.LIGHT,
        paddingHorizontal: 20,
        paddingTop: 10,
      }}>
      <View style={{flex: 0.25}}>
        <Surface
          elevation={4}
          style={{
            flexGrow: 1,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: colors.LIGHT,
          }}>
          <Text variant="bold" style={{color: colors.GRAY}}>
            Recent Trips
          </Text>

          {app.tripHistory == null ? (
            <>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator
                  animating={true}
                  size={40}
                  color={colors.PRIMARY}
                />
              </View>
            </>
          ) : app.tripHistory == false ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text variant="bold" style={{color: colors.DARK}}>
                No Trip History
              </Text>
            </View>
          ) : (
            <FlatList
              style={{flex: 1}}
              contentContainerStyle={{
                gap: 10,
                paddingVertical: 15,
              }}
              onEndReached={() => (offUp ? {} : setUp(up + 20))}
              onEndReachedThreshold={0}
              ListFooterComponent={() => (
                <View>
                  {app.isLoading ? (
                    <ActivityIndicator
                      animating={true}
                      size={40}
                      color={colors.PRIMARY}
                    />
                  ) : null}
                </View>
              )}
              data={[...app.tripHistory]}
              renderItem={props => <LocationListItem {...props} />}
            />
          )}
        </Surface>
      </View>
      <View style={{flex: 0.5}}>
        <Surface
          elevation={4}
          style={{
            flexGrow: 1,
            borderRadius: 10,
            overflow: 'hidden',
            backgroundColor: colors.LIGHT,
          }}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            customMapStyle={mapStyleJson}
            style={{width: '100%', height: '100%'}}
            region={{
              latitude: app.position.latitude,
              longitude: app.position.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}>
            <Marker
              title={'Your Location'}
              coordinate={{...app.position}}
              pinColor={colors.PRIMARY}
            />
          </MapView>
        </Surface>
      </View>
      <View style={{flex: 0.25, justifyContent: 'center'}}>
        <FlatList
          horizontal
          contentContainerStyle={{
            gap: 10,
            alignItems: 'center',
            paddingHorizontal: 10,
          }}
          data={[
            {
              name: 'Ride',
              icon: Taxi,
              modal: {
                modalIcon: Taxi,
                modalText:
                  'Thank you for using our Service. Please wait for one of our drivers to contact you Or Contact Our Hotline. ',
                modalBtnText: 'Start A Ride',
                navScreenName: 'hireRide',
              },
            },
            {
              name: 'Rent',
              icon: Rent,
              modal: {
                modalIcon: Rent,
                modalText:
                  'Thank you for using our Service. Please wait for one of our drivers to contact you Or Contact Our Hotline. ',
                modalBtnText: 'Book Now',
                navScreenName: 'rentCar',
              },
            },
            {
              name: 'Wedding',
              icon: Wedding,
              modal: {
                modalIcon: Wedding,
                modalText:
                  'Thank you for using our Service. Please wait for one of our drivers to contact you Or Contact Our Hotline. ',
                modalBtnText: 'Book Now',
                navScreenName: 'weddingCar',
              },
            },
          ]}
          renderItem={({item}) => {
            return (
              <Surface
                elevation={4}
                style={{
                  borderRadius: 10,
                  backgroundColor: colors.LIGHT,
                }}>
                <TouchableRipple
                  borderless
                  backgroundColor={colors.LIGHT}
                  onPress={() => toggleModal(item.modal)}
                  rippleColor={colors.PRIMARY}
                  style={{
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 50,
                    paddingVertical: 10,
                  }}>
                  <View style={{alignItems: 'center', gap: 10}}>
                    <item.icon height={40} width={40} />
                    <Text
                      variant="bold"
                      style={{
                        color: colors.DARK,
                        textTransform: 'uppercase',
                      }}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableRipple>
              </Surface>
            );
          }}
        />
      </View>

      <Modal
        onBackButtonPress={() => toggleModal()}
        onSwipeComplete={() => toggleModal()}
        isVisible={modalData.visibility}
        swipeDirection="down"
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={500}
        animationOutTiming={600}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={500}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View
          style={{
            backgroundColor: colors.LIGHT,
            paddingTop: 12,
            paddingHorizontal: 12,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            height: height / 1.5,
            paddingBottom: 20,
          }}>
          <View
            style={{
              flex: 1,
              gap: 10,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 60,
                height: 5,
                backgroundColor: colors.GRAY,
                borderRadius: 3,
              }}
            />
            <View
              style={{
                height: '100%',
                width: width,
                paddingTop: '5%',
                paddingBottom: '10%',
              }}>
              <View
                style={{
                  flex: 1,
                  gap: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                }}>
                <View
                  style={{
                    width: width / 2,
                    aspectRatio: 1,
                    borderRadius: width / 0.25,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.PRIMARY,
                  }}>
                  <modalData.modal.modalIcon
                    width={width / 4}
                    height={width / 4}
                  />
                </View>
                <Text
                  variant="regular"
                  style={{color: colors.DARK, textAlign: 'center'}}>
                  {modalData.modal.modalText}
                </Text>
                <View style={{width: '60%'}}>
                  <Button
                    contentStyle={{paddingHorizontal: 13, paddingVertical: 3}}
                    labelStyle={{
                      fontWeight: 'bold',
                      fontSize: 20,
                      color: colors.LIGHT,
                      marginTop: 13,
                    }}
                    onPress={() => {
                      toggleModal();
                      setTimeout(() => {
                        modalData.modal.navScreenName == 'hireRide'
                          ? dispatch(setScreen('hireRide'))
                          : navigation.navigate(modalData.modal.navScreenName);
                      }, 510);
                    }}
                    mode="contained">
                    {modalData.modal.modalBtnText}
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;
