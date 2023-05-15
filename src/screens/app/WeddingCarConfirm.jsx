import * as React from 'react';
import {View, Image} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Button,
  Text,
  Divider,
  Portal,
  Dialog,
} from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import {Calendar, Clock, TagLine} from 'src/assets/images';
import {AvatarHeader, CustomPopUp} from 'src/components';
import colors from 'src/constants/colors';
import {apiInfo} from 'src/constants/info';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {addYears, format} from 'date-fns';
import {useDispatch, useSelector} from 'react-redux';
import {addWeddingRent} from 'src/store/appSlice/appService';
import { removeError } from 'src/store/appSlice/appSlice';

export default ({navigation, route}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.currentUser);
  const app = useSelector(state => state.app);

  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);

  const hourRange = [
    {title: '2 hours', hours: 2},
    {title: '4 hours', hours: 4},
    {title: '6 hours', hours: 6},
    {title: '8 hours', hours: 8},
    {title: '10 hours', hours: 10},
  ];

  const [selectHourRange, setSelectHourRange] = React.useState(
    hourRange[0].hours,
  );

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
        mode="date"
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      <View style={{backgroundColor: colors.LIGHT}}>
        <AvatarHeader navMode="back" />
      </View>
      <KeyboardAwareScrollView
        style={{
          flex: 1,
          gap: 15,
          paddingHorizontal: 20,
          backgroundColor: colors.LIGHT,
          backgroundColor: colors.LIGHT,
        }}>
        <View style={{gap: 15}}>
          <Text variant="title_xl" style={{color: colors.DARK}}>
            Details
          </Text>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}>
                <Calendar width={20} height={20} />
                <Text variant="bold" style={{fontSize: 20, color: colors.GRAY}}>
                  Date
                </Text>
              </View>
              <View style={{flex: 1.1}}>
                <Text
                  variant="bold"
                  numberOfLines={2}
                  style={{
                    borderWidth: 1,
                    fontSize: 15,
                    borderRadius: 8,
                    flex: 1,
                    textAlign: 'center',
                    color: colors.GRAY,
                    textAlignVertical: 'center',
                    paddingHorizontal: 35,
                    paddingVertical: 17,
                  }}
                  onPress={() => setOpen(true)}>
                  {`${format(date, 'MM/dd/yyyy')}`}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}>
                <Clock width={20} height={20} />
                <Text variant="bold" style={{fontSize: 20, color: colors.GRAY}}>
                  Hour Range
                </Text>
              </View>
              <SelectDropdown
                data={hourRange}
                onSelect={(selectedItem, index) => {
                  setSelectHourRange(selectedItem.hours);
                }}
                defaultValueByIndex={0}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={{
                  flex: 1,
                  height: 50,
                  backgroundColor: colors.LIGHT,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.DARK,
                }}
                buttonTextStyle={{
                  color: colors.GRAY,
                  fontSize: 15,
                  fontWeight: 'bold',
                  textAlign: 'left',
                }}
                renderDropdownIcon={isOpened => {
                  return (
                    <FontAwesome
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={colors.DARK}
                      size={18}
                    />
                  );
                }}
                renderCustomizedButtonChild={(selectedItem, index) => {
                  return (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        paddingHorizontal: 10,
                      }}>
                      <Text
                        variant="bold"
                        style={{fontSize: 15, color: colors.GRAY}}>
                        {selectedItem ? selectedItem.title : 'Select Range'}
                      </Text>
                    </View>
                  );
                }}
                renderCustomizedRowChild={(item, index) => {
                  return (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        paddingHorizontal: 20,
                      }}>
                      <Text
                        variant="bold"
                        style={{
                          fontSize: 15,
                          color: colors.DARK,
                        }}>
                        {item.title}
                      </Text>
                    </View>
                  );
                }}
                selectedRowStyle={{backgroundColor: colors.PRIMARY}}
                dropdownStyle={{
                  marginTop: 10,
                  borderRadius: 10,
                  backgroundColor: colors.LIGHT,
                }}
                rowStyle={{
                  backgroundColor: colors.LIGHT,
                  borderBottomColor: colors.GRAY,
                }}
              />
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}>
                <TagLine width={25} height={25} />
                <Text variant="bold" style={{fontSize: 20, color: colors.GRAY}}>
                  Price
                </Text>
              </View>
              <View style={{flex: 1.1}}>
                <Text
                  variant="bold"
                  numberOfLines={3}
                  style={{
                    borderWidth: 1,
                    fontSize: 15,
                    borderRadius: 8,
                    flex: 1,
                    textAlign: 'center',
                    color: colors.GRAY,
                    textAlignVertical: 'center',
                    paddingHorizontal: 5,
                    paddingVertical: 15,
                  }}>
                  {'LKR '}
                  {route.params.package.range_begin}
                </Text>
              </View>
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
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}>
                <TagLine width={25} height={25} />
                <Text variant="bold" style={{fontSize: 20, color: colors.GRAY}}>
                  Subtotal
                </Text>
              </View>
              <View style={{flex: 1.1}}>
                <Text
                  variant="bold"
                  numberOfLines={3}
                  style={{
                    borderWidth: 1,
                    fontSize: 15,
                    borderRadius: 8,
                    flex: 1,
                    textAlign: 'center',
                    color: colors.GRAY,
                    textAlignVertical: 'center',
                    paddingHorizontal: 5,
                    paddingVertical: 15,
                  }}>
                  {'LKR '}{' '}
                  {(selectHourRange * route.params.package.range_begin).toFixed(
                    2,
                  )}
                </Text>
              </View>
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
        <View style={{flex: 1}}>
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
                {'LKR '}
                {app.weddingPackages.find(i => i.id == route.params.w_package).range_begin}{'-'}{app.weddingPackages.find(i => i.id == route.params.w_package).range_end}
              </Text>
              <Text
                variant="regular"
                style={{
                  textAlign: 'right',
                  fontSize: 13,
                  color: colors.GRAY,
                }}>
                {app.weddingPackages.find(i => i.id == route.params.w_package).rate}{' (Per Hour)'}
              </Text>
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
              mode="contained"
              onPress={() => {
                const addWeddingCarData = {
                  ...apiInfo('wedding'),
                  user_id: user.id,
                  email: user.email,
                  package_id: route.params.package.id,
                  rent_hours: selectHourRange,
                  note: route.params.model,
                  pickup_date: date,
                };
                dispatch(addWeddingRent(addWeddingCarData)).then(res =>
                  res.payload != undefined
                    ? res.payload.result
                      ? setIsCustomModalVisible(true)
                      : null
                    : null,
                );
              }}>
              CONFIRM BOOK
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};
