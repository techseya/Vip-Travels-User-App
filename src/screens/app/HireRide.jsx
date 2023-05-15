import React from 'react';
import {FlatList, View, Alert, Image, BackHandler} from 'react-native';
import {
  Text,
  Button,
  Portal,
  Dialog,
  ProgressBar,
  Avatar,
  Divider,
} from 'react-native-paper';
import colors from 'src/constants/colors';
import {apiInfo, width} from 'src/constants/info';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import {CustomPopUp, HirePackageTypes, Loading} from 'src/components';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  CalendarDARK,
  Call,
  Cash,
  ClockDARK,
  Dummy,
  Location,
} from 'src/assets/images';
import DatePicker from 'react-native-date-picker';
import {addMinutes, format, secondsInQuarter} from 'date-fns';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_MAPS_API_KEY} from '@env';
import MapViewDirections from 'react-native-maps-directions';
import mapStyleJson from 'src/constants/mapStyleJson';

import BackgroundService from 'react-native-background-actions';

import {
  resetHireRideData,
  rideFarePackageReset,
  setActiveHireLoopCode,
  setScreen,
} from 'src/store/appSlice/appSlice';
import {
  addCabHire,
  cancelHire,
  changeDropoffLocation,
  checkCabDriver,
  getRentVehicleType,
  hireLoop,
  matchCabDriver,
} from 'src/store/appSlice/appService';
import {removeError} from 'src/store/appSlice/appSlice';
import {requestHireOption, sleep} from 'src/utils/helpers/backgroundActions';
import decodeString from 'src/utils/helpers/decodeString';
import handleCall from 'src/utils/helpers/handleCall';

const HireRide = ({navigation}) => {
  const dispatch = useDispatch();
  const app = useSelector(state => state.app);
  const user = useSelector(state => state.auth.currentUser);



  const [isCustomModalVisible, setIsCustomModalVisible] = React.useState({
    visibility: false,
    modalType: null,
    modalContent: null,
    action: null,
  });


  // // bg task resume ////
  // const [currentView, setCurrentView] = React.useState(false);

  // React.useEffect(()=>{
  //   if(currentView){
  //     if(currentView=='driverMatching'){
  //       console.log('bg resume driver matching');
  //       toggleModal('driverMatching'); 
  //     }
  //   }
  // },[])
  // //////////

  const [isButtonFinish, setIsButtonFinish] = React.useState(false);
  const [isWaiting, setIsWaiting] = React.useState(false);

  const [isAPIDataLoaded, setIsAPIDataLoaded] = React.useState(null);
  const [hireTime, setHireTime] = React.useState(false);

  const [lastPrice, setLastPrice] = React.useState(null);

  const [pickUpLocation, setPickUpLocation] = React.useState(false);
  const [dropLocation, setDropLocation] = React.useState(false);
  const [tripData, setTripData] = React.useState(false);

  const [hireDetails, setHireDetails] = React.useState({
    hireId: -1,
    beforeCancelSheet: 'driverMatching',
  });

  const [isModalVisible, setModalVisible] = React.useState({
    visibility: false,
    modalType: null,
    modalData: null,
  });

  const toggleModal = modalType => {
    setModalVisible({
      ...isModalVisible,
      visibility: !isModalVisible.visibility,
      modalType: modalType,
    });
  };

  const [dateTime, setDateTime] = React.useState({
    puDate: new Date(),
    puTime: new Date(),
  });

  const [open, setOpen] = React.useState({
    puDate: false,
    puTime: false,
  });

  const initialMapRegion = {
    latitude: 7.853494483169836,
    longitude: 80.64594525814475,
    latitudeDelta: 8,
    longitudeDelta: 8,
  };

  const [mapRegion, setMapRegion] = React.useState({
    latitude: initialMapRegion.latitude,
    longitude: initialMapRegion.longitude,
    latitudeDelta: initialMapRegion.latitudeDelta,
    longitudeDelta: initialMapRegion.longitudeDelta,
  });

  const mapRef = React.createRef(null);

  const onRegionChange = () => {
    mapRef?.current?.animateToRegion({
      latitude: mapRegion.latitude,
      longitude: mapRegion.longitude,
      latitudeDelta: mapRegion.latitudeDelta,
      longitudeDelta: mapRegion.longitudeDelta,
    });
  };

  const [isScheduledRide, setIsScheduledRide] = React.useState(false);

  //progress bar...
  const [progress, setProgress] = React.useState(0);

  const [isGoBackEnabled, setIsGoBackEnabled] = React.useState(true);

  const goBack = () => dispatch(dispatch(setScreen(null)));
  React.useEffect(() => {
    if (isGoBackEnabled) {
      BackHandler.addEventListener('hardwareBackPress', goBack);
      return () => BackHandler.removeEventListener('hardwareBackPress', goBack);
    }
  }, [isGoBackEnabled]);

  const [backGroundActionController, setBackGroundActionController] =
    React.useState({tesk: null, afterTask: null});

  // bg task data states
  const [driverMatchedData, setDriverMatchedData] = React.useState(false);
  //bg task controller effect

  React.useEffect(() => {
    if (backGroundActionController.task == 'driverMatchingTask') {
      BackgroundService.stop().then(() =>
        setTimeout(() => {
          BackgroundService.start(driverMatchingTask, {
            ...requestHireOption(
              'Cab Matching In Progress',
              "Just a moment, we're searching for the perfect match!",
            ),
          }).then(() => {
            setIsWaiting(false);
            if (
              backGroundActionController.afterTask == 'openDriverMatchingModal'
            ) {
              toggleModal('driverMatching');
            }
          });
        }, 5000),
      );
    } else if (backGroundActionController.task == 'trackHireTask') {
      BackgroundService.stop().then(() =>
        setTimeout(() => {
          BackgroundService.start(trackHireTask, {
            ...requestHireOption(
              'Hire In Progress',
              `To ${
                dropLocation ? dropLocation.address.short_address : 'none'
              } with ${
                driverMatchedData ? driverMatchedData.driver_name : 'none'
              }`,
            ),
          }).then(() => {
            setIsWaiting(false);
            if (
              backGroundActionController.afterTask == 'openDriverMatchedModal'
            ) {
              toggleModal('driverMatched');
            }
          });
        }, 5000),
      );
    }
  }, [backGroundActionController]);

  React.useEffect(() => {
    if (app.activeHireLoopCode == 'CODE 01') {
      // cancel
      console.log('Cancel123');
      setModalVisible({...isModalVisible, visibility: false});
      setTimeout(() => {
        setIsWaiting(true)
        BackgroundService.stop().then(() => {
          setTimeout(() => {
            setIsWaiting(false)
            setIsCustomModalVisible({
              ...isCustomModalVisible,
              visibility: true,
              modalType: 'alert',
              modalContent:
                'The current driver has canceled the ride, Find new driver',
              action: 'openDriverMatching',
            });
          }, 5000);
        });
      }, 500);
    } else if (app.activeHireLoopCode == 'CODE 02') {
      //pickup
      console.log('editLocation123');
      setModalVisible({...isModalVisible, visibility: false});
      setTimeout(
        () => setModalVisible({...isModalVisible, modalType: 'editLocation'}),
        500,
      );
    } else if (app.activeHireLoopCode == 'CODE 03') {
      // end tour
      console.log('confirmPayment123');
      setModalVisible({...isModalVisible, visibility: false});
      setTimeout(()=>{
        setIsWaiting(true)
        BackgroundService.stop().then(() => {
          setTimeout(() => {
            setIsWaiting(false)
            setModalVisible({...isModalVisible, modalType: 'confirmPayment'});
          }, 5000);
        });
      },500)
    }
  }, [app.activeHireLoopCode]);

  // ...

  const rideNowConfirmBottomSheetContent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
          // backgroundColor: 'green',
        }}>
        <View
          style={{
            gap: 20,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <View style={{flexDirection: 'row', paddingHorizontal: '5%'}}>
            {isAPIDataLoaded == null || false ? (
              <Loading />
            ) : (
              <FlatList
                horizontal
                contentContainerStyle={{gap: 15}}
                data={[...app.rideVehicleTypes]}
                renderItem={props => (
                  <HirePackageTypes
                    {...props}
                    stateData={{tripData: tripData}}
                    setPrice={setLastPrice}
                  />
                )}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
            }}>
            <View style={{alignItems: 'center'}}>
              <Text variant="bold" style={{color: colors.DARK,fontSize:12}}>
                Trip Distance
              </Text>
              <Text variant="bold" style={{color: colors.DARK,fontSize:12}}>
                {tripData.tripDistance.toFixed(2)}
              </Text>
              <Text variant="bold" style={{color: colors.DARK,fontSize:12}}>
                KM
              </Text>
            </View>

            <View
              style={{
                height: '75%',
                borderWidth: 1.5,
                borderColor: colors.DARK,
                borderRadius: 10,
              }}
            />
            {lastPrice == null ? null : (
              <>
                <View style={{alignItems: 'center'}}>
                  <Text variant="bold" style={{color: colors.DARK,fontSize:12}}>
                    Last Price
                  </Text>
                  <Text variant="bold" style={{color: colors.DARK,fontSize:12}}>
                    {lastPrice.lastPrice}
                  </Text>
                  <Text variant="bold" style={{color: colors.DARK,fontSize:12}}>
                    LKR
                  </Text>
                </View>
                <View
                  style={{
                    height: '75%',
                    borderWidth: 1.5,
                    borderColor: colors.DARK,
                    borderRadius: 10,
                  }}
                />
              </>
            )}

            <View style={{alignItems: 'center'}}>
              <Text variant="bold" style={{color: colors.DARK,fontSize:12}}>
                Pickup Time
              </Text>
              <Text variant="bold" style={{color: colors.DARK,fontSize:12}}>
                {hireTime == 'schedule'
                  ? format(dateTime.puTime, 'HH:mm')
                  : format(new Date(), 'HH:mm')}
              </Text>
              <Text variant="bold" style={{color: colors.DARK,fontSize:12}}>
                {hireTime == 'schedule'
                  ? format(dateTime.puTime, 'a')
                  : format(new Date(), 'a')}
              </Text>
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
              <Text variant="bold" style={{color: colors.DARK,fontSize:12}}>
                Drop Time
              </Text>
              <Text variant="bold" style={{color: colors.DARK,fontSize:12}}>
                {hireTime == 'schedule'
                  ? format(
                      addMinutes(dateTime.puTime, tripData.tripDuration),
                      'HH:mm',
                    )
                  : format(
                      addMinutes(new Date(), tripData.tripDuration),
                      'HH:mm',
                    )}
              </Text>
              <Text variant="bold" style={{color: colors.DARK,fontSize:12}}>
                {hireTime == 'schedule'
                  ? format(
                      addMinutes(dateTime.puTime, tripData.tripDuration),
                      'a',
                    )
                  : format(addMinutes(new Date(), tripData.tripDuration), 'a')}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Button
            contentStyle={{paddingHorizontal: 13, paddingVertical: 3}}
            labelStyle={{
              fontWeight: 'bold',
              fontSize: 20,
              color: colors.LIGHT,
              marginTop: 13,
            }}
            onPress={() => {
              if (lastPrice) {
                const addCabHireData = {
                  ...apiInfo('ride'),
                  user_id: user.id,
                  pickup_location: JSON.stringify({...pickUpLocation.address}),
                  dropoff_location: JSON.stringify({...dropLocation.address}),
                  distance: parseFloat(tripData.tripDistance * 1000),
                  duration: parseFloat(tripData.tripDuration * 60),
                  vehicle_type: lastPrice.vehicleType,
                  pickup_time:
                    hireTime == 'schedule'
                      ? format(
                          addMinutes(dateTime.puTime, tripData.tripDuration),
                          "yyyy-MM-dd'T'HH:mm",
                        )
                      : format(
                          addMinutes(new Date(), tripData.tripDuration),
                          "yyyy-MM-dd'T'HH:mm",
                        ),
                  tour_type: 0,
                  price: lastPrice.lastPrice.toString(),
                };
                dispatch(addCabHire(addCabHireData)).then(res => {
                  if (res.payload != undefined) {
                    if (res.payload.result) {
                      setModalVisible({
                        ...isModalVisible,
                        visibility: false,
                      });
                      if (isScheduledRide) {
                       setTimeout(()=>{
                        setIsCustomModalVisible({
                          ...isCustomModalVisible,
                          visibility: true,
                          modalType: 'success',
                          modalContent: 'Your ride has been scheduled',
                          action: 'goHome',
                        });
                       },500)
                      } else {
                        setIsWaiting(true);
                        setIsGoBackEnabled(false);
                        setProgress(0);
                        // setCurrentView('driverMatching') ////
                        setHireDetails({
                          ...hireDetails,
                          beforeCancelSheet: 'driverMatching',
                        });

                        // start match cab driver bg task
                        setTimeout(()=>{
                          setBackGroundActionController({
                            task: 'driverMatchingTask',
                            afterTask: 'openDriverMatchingModal',
                          });
                        },500)
                      }
                    }
                  }
                });
              } else {
                Alert.alert('Warning', 'Please select a vehicle first.');
              }
            }}
            mode="contained">
            CONFIRM SCHEDULE
          </Button>
        </View>
      </View>
    );
  };

  const rideNowScheduleBottomSheetContent = () => {
    return (
      <>
        <DatePicker
          modal
          mode="date"
          open={open.puDate}
          date={new Date()}
          onConfirm={d => {
            setOpen({...open, puDate: false});
            setDateTime({...dateTime, puDate: d});
          }}
          onCancel={() => {
            setOpen({...open, puDate: false});
          }}
        />

        <DatePicker
          modal
          mode="time"
          open={open.puTime}
          date={new Date()}
          onConfirm={d => {
            setOpen({...open, puTime: false});
            setDateTime({...dateTime, puTime: d});
          }}
          onCancel={() => {
            setOpen({...open, puTime: false});
          }}
        />

        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}>
          <View style={{gap: 20, alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 20,
              }}>
              <View style={{flex: 1, gap: 10}}>
                <Text
                  variant="regular"
                  style={{fontSize: 15, color: colors.DARK}}>
                  Pick Up Date
                </Text>
                <Button
                  icon={() => <CalendarDARK width={20} height={20} />}
                  mode="contained"
                  theme={{
                    roundness: 1,
                    colors: {primary: colors.PRIMARYLIGHT},
                  }}
                  contentStyle={{
                    paddingHorizontal: 13,
                    paddingVertical: 3,
                  }}
                  labelStyle={{
                    fontWeight: 'bold',
                    fontSize: 17,
                    color: colors.DARK,
                    marginTop: 13,
                  }}
                  onPress={() => setOpen({...open, puDate: true})}>
                  {`${format(dateTime.puDate, 'MM/dd/yyyy')}`}
                </Button>
              </View>
              <View style={{flex: 1, gap: 10}}>
                <Text
                  variant="regular"
                  style={{fontSize: 15, color: colors.DARK}}>
                  Time
                </Text>
                <Button
                  icon={() => <ClockDARK width={20} height={20} />}
                  mode="contained"
                  theme={{
                    roundness: 1,
                    colors: {primary: colors.PRIMARYLIGHT},
                  }}
                  contentStyle={{
                    paddingHorizontal: 13,
                    paddingVertical: 3,
                  }}
                  labelStyle={{
                    fontWeight: 'bold',
                    fontSize: 17,
                    color: colors.DARK,
                    marginTop: 13,
                  }}
                  onPress={() => setOpen({...open, puTime: true})}>
                  {`${format(dateTime.puTime, 'h:mm a')}`}
                </Button>
              </View>
            </View>
          </View>
          <View style={{width: '70%'}}>
            <Button
              contentStyle={{paddingHorizontal: 13, paddingVertical: 3}}
              labelStyle={{
                fontWeight: 'bold',
                fontSize: 20,
                color: colors.LIGHT,
              }}
              mode="contained"
              onPress={() => {
                setModalVisible({...isModalVisible, visibility: false});
                setTimeout(
                  () =>
                    setModalVisible({...isModalVisible, modalType: 'hireNow'}),
                  510,
                );
              }}>
              CONFIRM TIME
            </Button>
          </View>
        </View>
      </>
    );
  };

  const driverMatchingTask = async data => {
    await new Promise(async res => {
      const updateProgress = () => {
        setProgress(currentProgress => {
          if (currentProgress < 1) {
            setTimeout(updateProgress, 300);
          } else {
            // progress complete
            setProgress(0);
            updateProgress();
          }
          return currentProgress + 0.01;
        });
      };
      updateProgress();

      for (let i = 1; BackgroundService.isRunning(); i++) {
        let count = i;
        function isInPattern(number) {
          // Check if the number is a power of 2
          while (number > 1) {
            if (number % 2 !== 0) {
              return false;
            }
            number = number / 2;
          }
          return true;
        }
        if (count > (tripData.tripDistance + 1) / 2) {
          count = (tripData.tripDistance + 1) / 2;
        }
        await Promise.all([
          await sleep(5000),
          await new Promise(resData =>
            dispatch(
              checkCabDriver({
                ...apiInfo('ride'),
                hire_id: app.hireId, //mekata maru karanna pahala eka
                // hire_id: 71,
                user_id: user.id,
              }),
            ).then(res => {
              if (res.payload != undefined) {
                if (res.payload.result != false) {
                  if (driverMatchedData == false) {
                    setDriverMatchedData(res.payload.result);

                    setModalVisible({...isModalVisible, visibility: false});
                    setTimeout(() => {
                      setIsWaiting(true);
                      setHireDetails({
                        ...hireDetails,
                        beforeCancelSheet: 'driverMatched',
                      });
                      BackgroundService.stop().then(() => {
                        setTimeout(
                          () =>
                            setBackGroundActionController({
                              task: 'trackHireTask',
                              afterTask: 'openDriverMatchedModal',
                            }),
                          5000,
                        );
                      });
                    }, 500);
                  }
                }
              }
              resData();
            }),
          ),
          isInPattern(i) && count <= (tripData.tripDistance + 1) / 2
            ? await new Promise(resData => {
                console.log(count, 'km');
                dispatch(
                  matchCabDriver({
                    ...apiInfo('ride'),
                    hire_id: app.hireId,
                    user_id: user.id,
                    km_range: count,
                  }),
                ).then(() => resData());
              })
            : await new Promise(resData => {
                resData();
              }),
        ]);
      }
    });
  };

  const trackHireTask = async data => {
    await new Promise(async res => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        console.log(2);
        await Promise.all([
          await sleep(5000),
          await new Promise(resData =>
            dispatch(
              hireLoop({
                ...apiInfo('ride'),
                hire_id: app.hireId,
                // hire_id: 73,
                user_id: user.id,
                cab_id: driverMatchedData.cab_id,
              }),
            ).then(() => {
              resData();
            }),
          ),
        ]);
      }
    });
  };

  const driverMatching = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <Text
          variant="bold"
          numberOfLines={5}
          style={{color: colors.DARK, fontSize: 20}}>
          Searching For Best Driver
        </Text>
        <View
          style={{
            width: '80%',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 15,
          }}>
          <Text variant="medium" style={{color: colors.DARK, fontSize: 16}}>
            Connecting....
          </Text>
          <View style={{flex: 1, backgroundColor: 'red', width: '100%'}}>
            <ProgressBar
              progress={progress}
              color={colors.PRIMARY}
              style={{height: 10, borderRadius: 10, borderWidth: 0.1}}
            />
          </View>
        </View>
        <View style={{width: '70%'}}>
          <Button
            contentStyle={{paddingHorizontal: 13, paddingVertical: 3}}
            labelStyle={{
              fontWeight: 'bold',
              fontSize: 20,
              color: colors.LIGHT,
            }}
            mode="contained"
            onPress={() => {
              setModalVisible({...isModalVisible, visibility: false});
              setTimeout(
                () =>
                  setModalVisible({...isModalVisible, modalType: 'cancelRide'}),
                500,
              );
            }}>
            CANCLE
          </Button>
        </View>
      </View>
    );
  };

  const driverMatched = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <View style={{maxHeight: 50, overflow: 'hidden'}}>
          <Text
            variant="bold"
            numberOfLines={2}
            style={{color: colors.DARK, fontSize: 20, textAlign: 'center'}}>
            {`My Trip To ${
              dropLocation
                ? decodeString(dropLocation.address.short_address)
                : 'none'
            }`}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
          }}>
          <View style={{gap: 10}}>
            <Text variant="bold" style={{color: colors.DARK, fontSize: 16}}>
              Your Vehicle
            </Text>
            <View style={{flexDirection: 'row', gap: 10}}>
              <Image
                resizeMode="contain"
                style={{width: 90, height: 50}}
                source={
                  driverMatchedData.cover != null
                    ? {uri: driverMatchedData.model_cover}
                    : require('../../assets/images/cars/c2.png')
                }
              />
              <View style={{flexDirection: 'column'}}>
                <View style={{maxWidth: 60, maxHeight: 50, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={2}
                    variant="bold"
                    style={{color: colors.DARK, textAlign: 'left'}}>
                    {driverMatchedData.model}
                  </Text>
                </View>
                <Text
                  variant="regular"
                  style={{color: colors.DARK, textAlign: 'center'}}>
                  {driverMatchedData.num_plate}
                </Text>
              </View>
            </View>
          </View>
          <View style={{gap: 10}}>
            <Text variant="bold" style={{color: colors.DARK, fontSize: 16}}>
              Your Driver
            </Text>
            <View style={{flexDirection: 'row', gap: 10}}>
              <Avatar.Image
                size={50}
                source={
                  driverMatchedData.avatar != null
                    ? {uri: driverMatchedData.avatar}
                    : Dummy
                }
              />
              <View style={{flexDirection: 'column'}}>
                <View style={{maxWidth: 60, maxHeight: 50, overflow: 'hidden'}}>
                  <Text
                    numberOfLines={2}
                    variant="bold"
                    style={{color: colors.DARK, textAlign: 'left'}}>
                    {driverMatchedData.driver_name}
                  </Text>
                </View>
                <Text
                  variant="regular"
                  style={{color: colors.DARK, textAlign: 'center'}}>
                  {`${driverMatchedData.rate} Completions`}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
          }}>
          <Avatar.Icon
            size={45}
            onTouchEnd={() => handleCall(driverMatchedData.mobile_number)}
            icon={Call}
          />
          <View style={{flex: 1}}>
            <Button
              contentStyle={{paddingHorizontal: 13, paddingVertical: 3}}
              labelStyle={{
                fontWeight: 'bold',
                fontSize: 20,
                color: colors.LIGHT,
              }}
              mode="contained"
              onPress={() => {
                setModalVisible({...isModalVisible, visibility: false});
                setTimeout(
                  () =>
                    setModalVisible({
                      ...isModalVisible,
                      modalType: 'cancelRide',
                    }),
                  500,
                );
              }}>
              CANCLE
            </Button>
          </View>
        </View>
      </View>
    );
  };

  const cancelRide = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <View style={{gap: 20, paddingHorizontal: 10}}>
          <Text
            variant="bold"
            numberOfLines={5}
            style={{color: colors.DARK, fontSize: 20, textAlign: 'center'}}>
            Are you sure you want to cancel your ride ?
          </Text>
          <Text
            variant="regular"
            numberOfLines={5}
            style={{color: colors.DARK, fontSize: 15, textAlign: 'justify'}}>
            You may be changed a small fee science the driver is already On the
            wat
          </Text>
        </View>
        <View style={{flexDirection: 'column', gap: 10, paddingHorizontal: 10}}>
          <Button
            contentStyle={{paddingHorizontal: 13, paddingVertical: 3}}
            labelStyle={{
              fontWeight: 'bold',
              fontSize: 20,
              color: colors.PRIMARY,
            }}
            mode="outlined"
            onPress={() => {
              if (hireDetails.beforeCancelSheet == 'driverMatching') {
                setModalVisible({...isModalVisible, visibility: false});
                setTimeout(
                  () =>
                    setModalVisible({
                      ...isModalVisible,
                      modalType: 'driverMatching',
                    }),
                  500,
                );
              } else if (hireDetails.beforeCancelSheet == 'driverMatched') {
                setModalVisible({...isModalVisible, visibility: false});
                setTimeout(
                  () =>
                    setModalVisible({
                      ...isModalVisible,
                      modalType: 'driverMatched',
                    }),
                  500,
                );
              }
            }}>
            No, I’ll wait
          </Button>
          <Button
            contentStyle={{paddingHorizontal: 13, paddingVertical: 3}}
            labelStyle={{
              fontWeight: 'bold',
              fontSize: 20,
              color: colors.LIGHT,
            }}
            mode="contained"
            onPress={() => {
              if (!isButtonFinish) {
                setIsButtonFinish(false);
                dispatch(
                  cancelHire({
                    ...apiInfo('ride'),
                    hire_id: app.hireId,
                    user_id: user.id,
                  }),
                ).then(res => {
                  if (res.payload != undefined) {
                    BackgroundService.stop().then(() => {
                      setModalVisible({...isModalVisible, visibility: false});
                      setTimeout(() => {
                        setIsWaiting(true);
                        setTimeout(() => {
                          setIsWaiting(false);
                          dispatch(resetHireRideData());
                          setIsCustomModalVisible({
                            ...isCustomModalVisible,
                            visibility: true,
                            modalType: 'alert',
                            modalContent: 'Your order has been canceled',
                            action: 'goHome',
                          });
                        }, 5000);
                      }, 500);
                    });
                  }
                });
              } else {
                setIsButtonFinish(true);
              }
            }}>
            Yes, Cancel
          </Button>
        </View>
      </View>
    );
  };

  const editLocation = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          // alignItems: 'center',
        }}>
        <View style={{gap: 20, alignItems: 'center', paddingHorizontal: 10}}>
          <Text
            variant="bold"
            numberOfLines={5}
            style={{color: colors.GOLD, fontSize: 20}}>
            Change Location
          </Text>
        </View>
        <View style={{flex: 1, gap: 25, paddingHorizontal: 10}}>
          <View style={{gap: 5}}>
            <Text
              variant="regular"
              numberOfLines={5}
              style={{color: colors.GRAY, fontSize: 15}}>
              Pick Up
            </Text>
            <Text
              variant="bold"
              numberOfLines={5}
              style={{color: colors.DARK, fontSize: 15}}>
              {pickUpLocation.address.short_address}
            </Text>
            <Divider style={{borderWidth: 0.5, marginTop: 5}} />
          </View>
          <View style={{gap: 5}}>
            <Text
              variant="regular"
              numberOfLines={5}
              style={{color: colors.GRAY, fontSize: 15}}>
              Drop Off
            </Text>
            <Text
              variant="bold"
              numberOfLines={5}
              style={{color: colors.DARK, fontSize: 15}}>
              {dropLocation.address.short_address}
            </Text>
            <Divider style={{borderWidth: 0.5, marginTop: 5}} />
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <View style={{width: '70%'}}>
            <Button
              contentStyle={{paddingHorizontal: 13, paddingVertical: 3}}
              labelStyle={{
                fontWeight: 'bold',
                fontSize: 20,
                color: colors.LIGHT,
              }}
              mode="contained"
              onPress={() => {
                setModalVisible({...isModalVisible, visibility: false});
                setTimeout(
                  () =>
                    setModalVisible({
                      ...isModalVisible,
                      modalType: 'editLocationSave',
                    }),
                  500,
                );
              }}>
              EDIT LOCATION
            </Button>
          </View>
        </View>
      </View>
    );
  };
  const editLocationSave = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          gap: 10,
        }}>
        <View style={{gap: 20, paddingHorizontal: 10}}>
          <Text
            variant="bold"
            numberOfLines={5}
            style={{color: colors.GOLD, fontSize: 20}}>
            Change Location
          </Text>
        </View>
        <Divider style={{borderWidth: 0.5, marginTop: 5}} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            gap: 25,
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 15,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
                gap: 10,
              }}>
              <Text
                variant="bold"
                numberOfLines={5}
                style={{color: colors.BLUE, fontSize: 12}}>
                Pick Up
              </Text>
              <View
                style={{
                  height: 23,
                  borderWidth: 2,
                  borderStyle: 'dotted',
                }}></View>
              <Text
                variant="bold"
                numberOfLines={5}
                style={{color: colors.PRIMARY, fontSize: 12}}>
                Drop Off
              </Text>
            </View>
            <View style={{flex: 1, gap: 5, justifyContent: 'space-between'}}>
              <View style={{paddingVertical: 10}}>
                <Text
                  variant="bold"
                  numberOfLines={5}
                  style={{color: colors.DARK, fontSize: 14, paddingStart: 10}}>
                  {pickUpLocation.address.short_address}
                </Text>
              </View>
              <Divider style={{borderWidth: 0.5, marginTop: 5}} />
              <GooglePlacesAutocomplete
                styles={{
                  textInputContainer: {},
                  textInput: {
                    color: colors.DARK,
                    fontSize: 14,
                  },
                  predefinedPlacesDescription: {
                    color: 'red',
                  },
                  listView: {
                    height: '60%',
                  },
                }}
                textInputProps={{
                  placeholderTextColor: colors.PLACEHOLDER,
                  returnKeyType: 'search',
                }}
                isRowScrollable
                renderRow={rowData => {
                  const title = rowData.structured_formatting.main_text;
                  const address = rowData.structured_formatting.secondary_text;
                  return (
                    <View>
                      <Text
                        numberOfLines={2}
                        variant="bold"
                        style={{color: colors.DARK}}>
                        {title}
                      </Text>
                      <Text numberOfLines={2} style={{color: colors.DARK}}>
                        {address}
                      </Text>
                    </View>
                  );
                }}
                fetchDetails
                placeholder="Where are You Going?"
                onPress={(data, details = null) => {
                  setDropLocation({
                    title: 'Drop Location',
                    location: {
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    },
                    address: {
                      latitude: details.geometry.location.lat,
                      longtitude: details.geometry.location.lng,
                      name: details.name,
                      long_address: details.address_components[0].long_name,
                      short_address: details.address_components[0].short_name,
                      city: details.address_components[1].long_name,
                      district: details.address_components[1].long_name,
                      province: details.address_components[2].long_name,
                      country: details.address_components[3].long_name,
                      zip_code: '',
                    },
                  });
                  setMapRegion(
                    !pickUpLocation
                      ? {
                          latitude: details.geometry.location.lat,
                          longitude: details.geometry.location.lng,
                          latitudeDelta: 0.015,
                          longitudeDelta: 0.0121,
                        }
                      : {
                          latitude:
                            (pickUpLocation.location.latitude +
                              details.geometry.location.lat) /
                            2,
                          longitude:
                            (pickUpLocation.location.longitude +
                              details.geometry.location.lng) /
                            2,
                          latitudeDelta: 7,
                          longitudeDelta: 7,
                        },
                  );
                  onRegionChange();
                }}
                query={{
                  key: GOOGLE_MAPS_API_KEY,
                  language: 'en',
                  components: 'country:lk',
                }}
              />
            </View>
          </View>
        </View>
        <Divider style={{borderWidth: 0.5, marginTop: 5}} />
        <View style={{alignItems: 'center'}}>
          <View style={{width: '70%'}}>
            <Button
              contentStyle={{paddingHorizontal: 13, paddingVertical: 3}}
              labelStyle={{
                fontWeight: 'bold',
                fontSize: 20,
                color: colors.LIGHT,
              }}
              mode="contained"
              onPress={() => {
                dispatch(
                  changeDropoffLocation({
                    ...apiInfo('ride'),
                    hire_id: app.hireId,
                    user_id: user.id,
                    dropoff_location: JSON.stringify({...dropLocation.address}),
                    distance: parseFloat(tripData.tripDistance * 1000),
                    duration: parseFloat(tripData.tripDuration * 60),
                  }),
                ).then(res => {
                  if (res.payload != undefined) {
                    setLastPrice({...lastPrice, lastPrice: res.payload.result});
                    setModalVisible({...isModalVisible, visibility: false});
                    setTimeout(
                      () =>
                        setModalVisible({
                          ...isModalVisible,
                          modalType: 'editLocation',
                        }),
                      510,
                    );
                  }
                });
              }}>
              SAVE
            </Button>
          </View>
        </View>
      </View>
    );
  };

  const confirmPayment = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          gap: 20,
        }}>
        <View style={{gap: 10}}>
          <View style={{alignItems: 'center', paddingHorizontal: 10,gap:30}}>
            <Image
              resizeMode="contain"
              style={{width: 120, height: 90}}
              source={
                driverMatchedData.cover != null
                  ? {uri: driverMatchedData.model_cover}
                  : require('../../assets/images/cars/c2.png')
              }
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}>
                <Text
                  variant="bold"
                  numberOfLines={5}
                  style={{color: colors.DARK, fontSize: 20}}>
                  {
                   app.rideVehicleTypes!=null? app.rideVehicleTypes.filter(
                    type => type.id == lastPrice.vehicleType,
                  )[0].type:'-00-'
                  }
                </Text>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 2}}>
                  <Icon name={'user'} size={25} color={colors.DARK} />
                  <Text
                    variant="regular"
                    style={{color: colors.DARK, fontSize: 20}}>
                    {
                      app.rideVehicleTypes!=null?app.rideVehicleTypes.filter(
                        type => type.id == lastPrice.vehicleType,
                      )[0].passenger_count:'-00-'
                    }
                  </Text>
                </View>
              </View>
              <View>
                <Text
                  variant="bold"
                  numberOfLines={5}
                  style={{color: colors.DARK, fontSize: 20}}>
                  {'LKR '}
                  {lastPrice.lastPrice}
                </Text>
              </View>
            </View>
          </View>
          <View style={{paddingHorizontal: 10}}>
            <Text
              variant="medium"
              numberOfLines={5}
              style={{color: colors.DARK, fontSize: 15}}>
              {format(new Date(), 'HH:mm')}
            </Text>
          </View>
        </View>
        <View style={{gap: 10}}>
          <Divider style={{borderWidth: 0.5, marginTop: 5}} />
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            <Cash width={35} height={35} />
            <Text variant="medium" style={{fontSize: 20, color: colors.GRAY}}>
              Cash Payment
            </Text>
          </View>
          <Divider style={{borderWidth: 0.5, marginTop: 5}} />
        </View>
        <View style={{alignItems: 'center'}}>
          <View style={{width: '70%'}}>
            <Button
              contentStyle={{paddingHorizontal: 13, paddingVertical: 3}}
              labelStyle={{
                fontWeight: 'bold',
                fontSize: 20,
                color: colors.LIGHT,
              }}
              mode="contained"
              onPress={() => {
                setModalVisible({...isModalVisible, visibility: false});
                setTimeout(
                  () =>
                    setModalVisible({
                      ...isModalVisible,
                      modalType: 'rideReview',
                    }),
                  510,
                );
              }}>
              CONFIRM
            </Button>
          </View>
        </View>
      </View>
    );
  };

  const rideReview = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{gap: 20, alignItems: 'center', paddingHorizontal: 10}}>
          <Text
            variant="bold"
            numberOfLines={5}
            style={{color: colors.DARK, fontSize: 25}}>
            We’ll review this route
          </Text>
          <Text
            variant="regular"
            numberOfLines={5}
            style={{color: colors.DARK, fontSize: 15, textAlign: 'justify'}}>
           We’ll review this feedback to ensure VIP Travel’s navigation system
            continues to improve. If the issues wasn’t related to the app, we’ll
            follow up with {driverMatchedData.driver_name} with navigation tips.
          </Text>
        </View>
        <View style={{width: '70%'}}>
          <Button
            contentStyle={{paddingHorizontal: 13, paddingVertical: 3}}
            labelStyle={{
              fontWeight: 'bold',
              fontSize: 20,
              color: colors.LIGHT,
            }}
            mode="contained"
            onPress={() => {
              setModalVisible({...isModalVisible, visibility: false});
              setTimeout(()=>{
                navigation.navigate('hireRideReview', {
                  hire_id: app.hireId,
                  driverData: driverMatchedData,
                });
              },500)
            }}>
            CONFIRM
          </Button>
        </View>
      </View>
    );
  };

  return (
    <>
      {isWaiting ? (
        <Loading styles={{backgroundColor: colors.BACKDROP}} />
      ) : null}
      <CustomPopUp
        visible={isCustomModalVisible.visibility}
        backgroundColor={
          isCustomModalVisible.modalType == 'success'
            ? colors.SUCCESS
            : colors.PRIMARYLIGHT
        }
        setVisible={() =>
          setIsCustomModalVisible(!isCustomModalVisible.visibility)
        }
        action={() => {
          if (isCustomModalVisible.action == 'goHome') {
            dispatch(setScreen(null));
          } else if (isCustomModalVisible.action == 'openDriverMatching') {
            setIsWaiting(true)
            setHireDetails({
              ...hireDetails,
              beforeCancelSheet: 'driverMatching',
            });
            setDriverMatchedData(false);
            dispatch(resetHireRideData());
            setBackGroundActionController({
              task: 'driverMatchingTask',
              afterTask: 'openDriverMatchingModal',
            });
          }
        }}
        title={
          isCustomModalVisible.modalType == 'success' ? 'Success' : 'Alert'
        }
        description={
          isCustomModalVisible.modalContent
            ? isCustomModalVisible.modalContent
            : 'your content'
        }
      />

      <Portal>
        <Dialog
          visible={app.error != null ? true : false}
          onDismiss={() => dispatch(removeError())}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={{color: colors.DARK}}>Error !</Dialog.Title>
          <Dialog.Content>
            <Text style={{color: colors.DARK}} variant="bodyMedium">
              {app.error}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => dispatch(removeError())}
              labelStyle={{color: colors.PLACEHOLDER}}>
              Okay
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={{flex: 1}}>
        <View
          style={{
            width: width,
            position: 'absolute',
            zIndex: 5,
            gap: 5,
            paddingHorizontal: 15,
            paddingVertical: 15,
          }}>
          <View>
            <Location
              style={{
                position: 'absolute',
                marginTop: 10,
                paddingStart: 50,
                zIndex: 10,
              }}
              width={30}
              height={30}
            />
            <GooglePlacesAutocomplete
              styles={{
                textInputContainer: {},
                textInput: {
                  paddingStart: 50,
                  height: 50,
                  borderRadius: 30,
                  color: colors.DARK,
                  fontSize: 16,
                },
                predefinedPlacesDescription: {
                  color: 'red',
                },
                listView: {
                  height: 170,
                },
              }}
              isRowScrollable
              renderRow={rowData => {
                const title = rowData.structured_formatting.main_text;
                const address = rowData.structured_formatting.secondary_text;
                return (
                  <View>
                    <Text
                      numberOfLines={2}
                      variant="bold"
                      style={{color: colors.DARK}}>
                      {title}
                    </Text>
                    <Text numberOfLines={2} style={{color: colors.DARK}}>
                      {address}
                    </Text>
                  </View>
                );
              }}
              fetchDetails
              textInputProps={{
                placeholderTextColor: colors.PLACEHOLDER,
                returnKeyType: 'search',
              }}
              placeholder="Pickup Location"
              onPress={(data, details = null) => {
                setPickUpLocation({
                  title: 'Pickup Location',
                  location: {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  },
                  address: {
                    latitude: details.geometry.location.lat,
                    longtitude: details.geometry.location.lng,
                    name: details.name,
                    long_address: details.address_components[0].long_name,
                    short_address: details.address_components[0].short_name,
                    city: details.address_components[1].long_name,
                    district: details.address_components[1].long_name,
                    province: details.address_components[2].long_name,
                    country: details.address_components[3].long_name,
                    zip_code: '',
                  },
                });
                setMapRegion({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  latitudeDelta: dropLocation ? 7 : 0.015,
                  longitudeDelta: dropLocation ? 7 : 0.0121,
                });
                onRegionChange();
              }}
              query={{
                key: GOOGLE_MAPS_API_KEY,
                language: 'en',
                components: 'country:lk',
              }}
            />
          </View>
          <View>
            <Location
              style={{
                position: 'absolute',
                marginTop: 10,
                paddingStart: 50,
                zIndex: 10,
              }}
              width={30}
              height={30}
            />
            <GooglePlacesAutocomplete
              styles={{
                textInputContainer: {},
                textInput: {
                  paddingStart: 50,
                  height: 50,
                  borderRadius: 30,
                  color: colors.DARK,
                  fontSize: 16,
                },
                predefinedPlacesDescription: {
                  color: 'red',
                },
                listView: {
                  height: 170,
                },
              }}
              textInputProps={{
                placeholderTextColor: colors.PLACEHOLDER,
                returnKeyType: 'search',
              }}
              isRowScrollable
              renderRow={rowData => {
                const title = rowData.structured_formatting.main_text;
                const address = rowData.structured_formatting.secondary_text;
                return (
                  <View>
                    <Text
                      numberOfLines={2}
                      variant="bold"
                      style={{color: colors.DARK}}>
                      {title}
                    </Text>
                    <Text numberOfLines={2} style={{color: colors.DARK}}>
                      {address}
                    </Text>
                  </View>
                );
              }}
              fetchDetails
              placeholder="Drop Location"
              onPress={(data, details = null) => {
                setDropLocation({
                  title: 'Drop Location',
                  location: {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  },
                  address: {
                    latitude: details.geometry.location.lat,
                    longtitude: details.geometry.location.lng,
                    name: details.name,
                    long_address: details.address_components[0].long_name,
                    short_address: details.address_components[0].short_name,
                    city: details.address_components[1].long_name,
                    district: details.address_components[1].long_name,
                    province: details.address_components[2].long_name,
                    country: details.address_components[3].long_name,
                    zip_code: '',
                  },
                });
                setMapRegion(
                  !pickUpLocation
                    ? {
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                      }
                    : {
                        latitude:
                          (pickUpLocation.location.latitude +
                            details.geometry.location.lat) /
                          2,
                        longitude:
                          (pickUpLocation.location.longitude +
                            details.geometry.location.lng) /
                          2,
                        latitudeDelta: 2.25,
                        longitudeDelta: 2.25,
                      },
                );
                onRegionChange();
              }}
              query={{
                key: GOOGLE_MAPS_API_KEY,
                language: 'en',
                components: 'country:lk',
              }}
            />
          </View>
        </View>

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{flex: 1}}
          loadingEnabled
          loadingIndicatorColor={colors.PRIMARY}
          customMapStyle={mapStyleJson}
          minZoomLevel={7}
          zoomEnabled
          maxDelta={10}
          showsCompass={false}
          region={{
            latitude: mapRegion.latitude,
            longitude: mapRegion.longitude,
            latitudeDelta: mapRegion.latitudeDelta,
            longitudeDelta: mapRegion.longitudeDelta,
          }}>
          {pickUpLocation ? (
            <Marker
              title={pickUpLocation.title}
              coordinate={pickUpLocation.location}
              pinColor={colors.PRIMARY}
            />
          ) : null}
          {pickUpLocation && dropLocation ? (
            <MapViewDirections
              apikey={GOOGLE_MAPS_API_KEY}
              origin={pickUpLocation.location}
              destination={dropLocation.location}
              strokeColor={colors.DARK}
              strokeWidth={5}
              onReady={result => {
                setTripData({
                  tripDistance: result.distance,
                  tripDuration: result.duration,
                });
              }}
            />
          ) : null}
          {dropLocation ? (
            <Marker
              title={dropLocation.title}
              coordinate={dropLocation.location}
              pinColor={colors.PRIMARY}
            />
          ) : null}
        </MapView>
        <View
          style={{
            width: width,
            position: 'absolute',
            paddingVertical: 30,
            bottom: 0,
            zIndex: 5,
            flexDirection: 'row',
            justifyContent: 'center',
            columnGap: 10,
          }}>
          <Button
            loading={isAPIDataLoaded}
            contentStyle={{paddingHorizontal: 0, paddingVertical: 3}}
            labelStyle={{
              fontWeight: 'bold',
              fontSize: 20,
              color: colors.LIGHT,
              marginTop: 13,
            }}
            onPress={() => {
              setHireTime('hireNow');
              if (pickUpLocation && dropLocation) {
                setIsScheduledRide(false);
                dispatch(rideFarePackageReset());
                setIsAPIDataLoaded(true);
                dispatch(
                  getRentVehicleType({
                    ...apiInfo('ride'),
                    c_state: 1,
                    r_state: 0,
                    w_state: 0,
                  }),
                ).then(() => {
                  setIsAPIDataLoaded(false);
                  toggleModal('hireNow');
                });
              } else {
                Alert.alert(
                  'Warning',
                  'Please Select Pick up and Drop Locations First',
                );
              }
            }}
            mode="contained">
            HIRE NOW
          </Button>
          <Button
            contentStyle={{paddingHorizontal: 0, paddingVertical: 3}}
            labelStyle={{
              fontWeight: 'bold',
              fontSize: 20,
              color: colors.LIGHT,
              marginTop: 13,
            }}
            onPress={() => {
              setHireTime('schedule');
              BackgroundService.stop();
              setIsScheduledRide(true);
              if (pickUpLocation && dropLocation) {
                toggleModal('schedule');
              } else {
                Alert.alert(
                  'Warning',
                  'Please Select Pick up and Drop Locations First',
                );
              }
            }}
            mode="contained">
            SCHEDULE
          </Button>
        </View>

        <Modal
          onBackdropPress={() =>
            ![
              'driverMatching',
              'driverMatched',
              'cancelRide',
              'editLocation',
              'editLocationSave',
              'confirmPayment',
              'rideReview',
            ].includes(isModalVisible.modalType)
              ? setModalVisible({...isModalVisible, visibility: false})
              : null
          }
          onBackButtonPress={() =>
            ![
              'driverMatching',
              'driverMatched',
              'cancelRide',
              'editLocation',
              'editLocationSave',
              'confirmPayment',
              'rideReview',
            ].includes(isModalVisible.modalType)
              ? setModalVisible({...isModalVisible, visibility: false})
              : null
          }
          isVisible={isModalVisible.visibility}
          // isVisible={true}
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
              height:
                isModalVisible.modalType == 'hireNow'
                  ? '80%'
                  : isModalVisible.modalType == 'schedule'
                  ? '40%'
                  : isModalVisible.modalType == 'cancelRide'
                  ? '60%'
                  : isModalVisible.modalType == 'editLocationSave'
                  ? '97%'
                  : isModalVisible.modalType == 'confirmPayment'
                  ? '60%'
                  : '50%',
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

              {![
                'driverMatching',
                'driverMatched',
                'cancelRide',
                'editLocation',
                'editLocationSave',
                'confirmPayment',
                'rideReview',
              ].includes(isModalVisible.modalType) ? (
                <Text
                  variant="bold"
                  numberOfLines={2}
                  style={{color: colors.DARK}}>
                  {isModalVisible.modalType == 'hireNow'
                    ? 'Select Your Vehicle Type'
                    : isModalVisible.modalType == 'schedule'
                    ? 'Select Time to Schedule a Trip'
                    : 'Loading...'}
                </Text>
              ) : null}

              <View
                style={{
                  height: '100%',
                  width: width,
                  paddingTop: '5%',
                  paddingBottom: '10%',
                }}>
                {
                  isModalVisible.modalType == 'hireNow'
                    ? rideNowConfirmBottomSheetContent()
                    : isModalVisible.modalType == 'schedule'
                    ? rideNowScheduleBottomSheetContent()
                    : isModalVisible.modalType == 'driverMatching'
                    ? driverMatching()
                    : isModalVisible.modalType == 'cancelRide'
                    ? cancelRide()
                    : isModalVisible.modalType == 'driverMatched'
                    ? driverMatched()
                    : isModalVisible.modalType == 'editLocation'
                    ? editLocation()
                    : isModalVisible.modalType == 'editLocationSave'
                    ? editLocationSave()
                    : isModalVisible.modalType == 'confirmPayment'
                    ? confirmPayment()
                    : isModalVisible.modalType == 'rideReview'
                    ? rideReview()
                    : null
                  // driverMatching()
                  // driverMatched()
                  // cancelRide()
                  // editLocation()
                  // editLocationSave()
                  // confirmPayment()
                  // rideReview()
                }
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};
export default HireRide;
