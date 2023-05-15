import * as React from 'react';
import {View, Image} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Button,
  Checkbox,
  Text,
  Divider,
  Portal,
  Dialog,
} from 'react-native-paper';
import {
  addHours,
  addMonths,
  addYears,
  eachHourOfInterval,
  eachMonthOfInterval,
  format,
  isAfter,
} from 'date-fns';
import {Calendar, Cash, TagLine} from 'src/assets/images';
import {AvatarHeader, CustomPopUp} from 'src/components';
import colors from 'src/constants/colors';
import {apiInfo, height} from 'src/constants/info';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector} from 'react-redux';
import {addCarRent} from 'src/store/appSlice/appService';
// import App from 'App';
import {removeError} from 'src/store/appSlice/appSlice';

export default ({navigation, route}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.currentUser);
  const app = useSelector(state => state.app);

  const [isMounthlySelected, setIsMounthlySelected] = React.useState(false);
  const [date, setDate] = React.useState({
    pickUpDate: new Date(),
    returnDate: addHours(new Date(), 1),
    mrdDate: addMonths(new Date(), 1),
  });
  const [open, setOpen] = React.useState({
    pickUpDate: false,
    returnDate: false,
    mrdDate: false,
  });

  const [isCustomModalVisible, setIsCustomModalVisible] = React.useState(false);

  return (
    <>
      <CustomPopUp
        visible={isCustomModalVisible}
        backgroundColor={colors.SUCCESS}
        setVisible={() => setIsCustomModalVisible(!isCustomModalVisible)}
        action={() => navigation.goBack()}
        title={'Success'}
        description={'Your Rent order has been recorded.'}
      />

      <Portal>
        <Dialog
          visible={app.error != null ? true : false}
          onDismiss={() => dispatch(removeError())}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={{color: colors.DARK}}>
            Error
          </Dialog.Title>
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

      <DatePicker
        minimumDate={new Date()}
        maximumDate={addYears(new Date(), 1)}
        modal
        mode="datetime"
        open={open.pickUpDate}
        date={new Date()}
        onConfirm={d => {
          if (isAfter(new Date(), d)) {
            setOpen({...open, pickUpDate: false});
            setDate({...date, pickUpDate: new Date()});
          } else {
            if (isAfter(d, addHours(date.returnDate, 1))) {
              setOpen({...open, pickUpDate: false});
              setDate({...date, pickUpDate: d, returnDate: addHours(d, 1)});
            } else {
              setOpen({...open, pickUpDate: false});
              setDate({...date, pickUpDate: d});
            }
          }
        }}
        onCancel={() => {
          setOpen({...open, pickUpDate: false});
        }}
      />
      <DatePicker
        minimumDate={new Date()}
        maximumDate={addYears(new Date(), 1)}
        modal
        mode="datetime"
        open={open.returnDate}
        date={new Date()}
        onConfirm={d => {
          if (!isAfter(addHours(new Date(), 1), d)) {
            if (isAfter(addHours(date.pickUpDate, 1), d)) {
              setOpen({...open, returnDate: false});
              setDate({...date, returnDate: d, pickUpDate: addHours(d, -1)});
        
            } else {
              setOpen({...open, returnDate: false});
              setDate({...date, returnDate: d});
       
            }
          } else {
            setOpen({...open, returnDate: false});
    
          }
        }}
        onCancel={() => {
          setOpen({...open, returnDate: false});
        }}
      />
      <DatePicker
        minimumDate={addMonths(new Date(), 1)}
        maximumDate={addMonths(new Date(), 12)}
        modal
        mode="date"
        open={open.mrdDate}
        date={new Date()}
        onConfirm={d => {
          if (isAfter(addMonths(new Date(), 1), d)) {
            setOpen({...open, mrdDate: false});
            setDate({...date, mrdDate: addMonths(d, 1)});
          } else {
            setOpen({...open, mrdDate: false});
            setDate({...date, mrdDate: d});
          }
        }}
        onCancel={() => {
          setOpen({...open, mrdDate: false});
        }}
      />

      <View style={{backgroundColor: colors.LIGHT}}>
        <AvatarHeader navMode="back" />
      </View>
      <KeyboardAwareScrollView>
        <View
          style={{
            minHeight: height,
            gap: 15,
            paddingHorizontal: 20,
            backgroundColor: colors.LIGHT,
          }}>
          <View>
            <Text variant="title_xl" style={{color: colors.DARK}}>
              Details
            </Text>
          </View>
          <View style={{gap: 15}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <Calendar width={20} height={20} />
                <Text
                  variant="regular"
                  style={{
                    fontSize: 20,
                    color: !isMounthlySelected ? colors.DARK : colors.GRAY,
                  }}>
                  Daily Rental
                </Text>
              </View>
              <Checkbox
                status={!isMounthlySelected ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsMounthlySelected(false);
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 15,
              }}>
              <View style={{flex: 1, gap: 5}}>
                <Text
                  variant="regular"
                  style={{
                    fontSize: 15,
                    color: !isMounthlySelected ? colors.DARK : colors.GRAY,
                  }}>
                  Pick Up Date
                </Text>
                <Text
                  disabled={!isMounthlySelected ? false : true}
                  variant="bold"
                  numberOfLines={2}
                  style={{
                    borderWidth: 1,
                    fontSize: 13,
                    borderRadius: 8,
                    flex: 1,
                    textAlign: 'center',
                    color: !isMounthlySelected ? colors.DARK : colors.GRAY,
                    textAlignVertical: 'center',
                    paddingHorizontal: 35,
                    paddingVertical: 10,
                  }}
                  onPress={() => setOpen({...open, pickUpDate: true})}>
                  {`${format(date.pickUpDate, 'MM/dd/yyyy h:mm a')}`}
                </Text>
              </View>
              <View style={{flex: 1, gap: 5}}>
                <Text
                  variant="regular"
                  style={{
                    fontSize: 15,
                    color: !isMounthlySelected ? colors.DARK : colors.GRAY,
                  }}>
                  Return Date
                </Text>
                <Text
                  disabled={!isMounthlySelected ? false : true}
                  variant="bold"
                  numberOfLines={2}
                  style={{
                    borderWidth: 1,
                    fontSize: 13,
                    borderRadius: 8,
                    flex: 1,
                    textAlign: 'center',
                    color: !isMounthlySelected ? colors.DARK : colors.GRAY,
                    textAlignVertical: 'center',
                    paddingHorizontal: 35,
                    paddingVertical: 10,
                  }}
                  onPress={() => setOpen({...open, returnDate: true})}>
                  {`${format(date.returnDate, 'MM/dd/yyyy h:mm a')}`}
                </Text>
              </View>
            </View>
            <Divider
              bold
              style={{
                marginVertical: 10,
                borderWidth: 0.5,
                borderColor: colors.GRAY,
              }}
            />
          </View>

          <View style={{gap: 15}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <Calendar width={20} height={20} />
                <Text
                  variant="regular"
                  style={{
                    fontSize: 20,
                    color: isMounthlySelected ? colors.DARK : colors.GRAY,
                  }}>
                  Monthly Rental
                </Text>
              </View>
              <Checkbox
                status={isMounthlySelected ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsMounthlySelected(true);
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 15,
              }}>
              <View style={{flex: 1, gap: 5}}>
                <Text
                  variant="regular"
                  style={{
                    fontSize: 15,
                    color: isMounthlySelected ? colors.DARK : colors.GRAY,
                  }}>
                  Return Date
                </Text>
                <Button
                  disabled={!isMounthlySelected ? true : false}
                  theme={{roundness: 1.5}}
                  mode="outlined"
                  contentStyle={{
                    paddingHorizontal: 13,
                    paddingVertical: 3,
                    borderColor: colors.GRAY,
                  }}
                  labelStyle={{
                    fontWeight: 'bold',
                    fontSize: 17,
                    color: isMounthlySelected ? colors.DARK : colors.GRAY,
                    marginTop: 13,
                  }}
                  onPress={() => setOpen({...open, mrdDate: true})}>
                  {`${format(date.mrdDate, 'MM/dd/yyyy')}`}
                </Button>
              </View>
            </View>
            <Divider
              bold
              style={{
                marginVertical: 10,
                borderWidth: 0.5,
                borderColor: colors.GRAY,
              }}
            />
          </View>
          <View style={{gap: 15}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{flexDirection: 'row', gap: 5}}>
                <TagLine width={30} height={30} />
                <View>
                  <Text
                    variant="regular"
                    style={{fontSize: 20, color: colors.DARK}}>
                    Price
                  </Text>
                  <Text
                    variant="regular"
                    style={{fontSize: 15, color: colors.GRAY}}>
                    (Per Day)
                  </Text>
                </View>
              </View>
              <View style={{flex: 0.9, gap: 5}}>
                <Text
                  variant="bold"
                  numberOfLines={3}
                  style={{
                    borderWidth: 1,
                    fontSize: 13,
                    borderRadius: 8,
                    flex: 1,
                    textAlign: 'center',
                    color: colors.DARK,
                    textAlignVertical: 'center',
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                  }}
                  onPress={() => setOpen({...open, pickUpDate: true})}>
                  {'LKR '}
                  {!isMounthlySelected
                    ? (eachHourOfInterval({
                        start: date.pickUpDate,
                        end: date.returnDate,
                      }).length -
                        1) *
                      route.params.package.d_range_begin
                    : (eachMonthOfInterval({
                        start: new Date(),
                        end: date.mrdDate,
                      }).length -
                        1) *
                      30 *
                      route.params.package.m_range_begin}
                </Text>
                <Text
                  variant="bold"
                  numberOfLines={3}
                  style={{
                    borderWidth: 1,
                    fontSize: 13,
                    borderRadius: 8,
                    flex: 1,
                    textAlign: 'center',
                    color: colors.DARK,
                    textAlignVertical: 'center',
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                  }}
                  onPress={() => setOpen({...open, pickUpDate: true})}>
                  {'LKR '}
                  {!isMounthlySelected
                    ? (eachHourOfInterval({
                        start: date.pickUpDate,
                        end: date.returnDate,
                      }).length -
                        1) *
                      route.params.package.d_range_end
                    : (eachMonthOfInterval({
                        start: new Date(),
                        end: date.mrdDate,
                      }).length -
                        1) *
                      30 *
                      route.params.package.m_range_end}
                </Text>
              </View>
            </View>
            <Divider
              bold
              style={{
                marginVertical: 10,
                borderWidth: 0.5,
                borderColor: colors.GRAY,
              }}
            />
          </View>
          <View>
            <View style={{alignItems: 'center'}}>
              <Text variant="medium" style={{fontSize: 20, color: colors.GRAY}}>
                Cash Payment
              </Text>
              <Cash width={35} height={35} />
            </View>
            <Divider
              bold
              style={{
                marginVertical: 10,
                borderWidth: 0.5,
                borderColor: colors.GRAY,
              }}
            />
          </View>
          <View>
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
                source={{uri: route.params.cover}}
              />
              <View style={{width: '52%', alignItems: 'flex-end'}}>
                <Text
                  variant="bold"
                  style={{
                    textAlign: 'right',
                    fontSize: 18,
                    color: colors.DARK,
                  }}>
                  {route.params.model}
                </Text>
                <Text
                  variant="medium"
                  style={{
                    textAlign: 'right',
                    fontSize: 13,
                    color: colors.DARK,
                  }}>
                  LKR {`${route.params.package.d_range_begin.toFixed(2)} - ${route.params.package.d_range_end.toFixed(2)}`}
                </Text>
              </View>
            </View>
          </View>
          <View style={{marginBottom: 20}}>
            <Button
              onPress={() => {
                dispatch(
                  addCarRent({
                    ...apiInfo('rent'),
                    user_id: user.id,
                    email: user.email,
                    pickup_date: !isMounthlySelected
                      ? format(date.pickUpDate, 'MM/dd/yyyy')
                      : format(date.mrdDate, 'MM/dd/yyyy'),
                    return_date: !isMounthlySelected
                      ? format(date.returnDate, 'MM/dd/yyyy')
                      : '',
                    package_id: route.params.package.id,
                    monthly: isMounthlySelected ? 1 : 0,
                    note: route.params.model,
                  }),
                ).then(res =>
                  res.payload != undefined
                    ? res.payload.result
                      ? setIsCustomModalVisible(true)
                      : null
                    : null,
                );
              }}
              contentStyle={{paddingHorizontal: 13, paddingVertical: 3}}
              labelStyle={{
                fontWeight: 'bold',
                fontSize: 20,
                color: colors.LIGHT,
                marginTop: 13,
              }}
              mode="contained">
              RENT NOW
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};
