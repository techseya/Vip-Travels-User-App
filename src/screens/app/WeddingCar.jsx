import React, {useState} from 'react';
import {View, ScrollView, FlatList, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Button,
  Searchbar,
  Text,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
//consts
import colors from 'src/constants/colors';
//compoenets
import {AvatarHeader, Loading, WeddingCarDetailsItem} from 'src/components';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getVehicleType,
  getWeddingModles,
  getWeddingPackages,
} from 'src/store/appSlice/appService';
import {apiInfo} from 'src/constants/info';

const WeddingCar = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const app = useSelector(state => state.app);

  const [isAPIDataLoaded, setIsAPIDataLoaded] = React.useState(false);
  const [activeVehicleType, setActiveVehicleType] = React.useState('All');
  const [currentWeddingModles, setCurrentWeddingModles] = React.useState(false);

  const handleFilterWeddingVehicle = (item, inputType) => {
    if (inputType == 'btn') {
      if (item.id == 'All') {
        setCurrentWeddingModles(app.weddingModle);
      } else {
        setCurrentWeddingModles(
          app.weddingModle.filter(obj => obj.vehicle_type == item.id),
        );
      }
      setActiveVehicleType(item.id);
    } else {
      if (item == '') {
        if (activeVehicleType == 'All') {
          setCurrentWeddingModles(app.weddingModle);
        } else {
          setCurrentWeddingModles(
            app.weddingModle.filter(
              obj => obj.vehicle_type == activeVehicleType,
            ),
          );
        }
      } else {
        setCurrentWeddingModles(
          currentWeddingModles.filter(i =>
            i.model.toLowerCase().includes(item.toLowerCase()),
          ),
        );
      }
    }
  };

  React.useEffect(() => {
    if (!isAPIDataLoaded) {
      dispatch(
        getVehicleType({
          ...apiInfo('wedding'),
          c_state: 0,
          r_state: 0,
          w_state: 1,
        }),
      )
        .then(() => dispatch(getWeddingModles({...apiInfo('wedding')})))
        .then(() => dispatch(getWeddingPackages({...apiInfo('wedding')})))
        .then(() => setIsAPIDataLoaded(true));
    } else {
      setCurrentWeddingModles(app.weddingModle);
    }
  }, [isAPIDataLoaded]);

  if (!isAPIDataLoaded) {
    return <Loading />;
  }

  return (
    <View style={{flex: 1, backgroundColor: colors.LIGHT}}>
      <AvatarHeader navMode="back" />
      <View style={{flexGrow: 1, gap: 5, paddingHorizontal: 10}}>
        <Text variant="bold" style={{fontSize: 18, color: colors.DARK}}>
          Find Your Dream Car for Your Special Day
        </Text>
        <Searchbar
          mode="view"
          onChangeText={val => handleFilterWeddingVehicle(val, 'input')}
          style={{
            borderRadius: 10,
            backgroundColor: colors.LIGHT,
            borderWidth: 1,
          }}
          placeholderTextColor={colors.GRAY}
          inputStyle={{color: colors.DARK}}
          placeholder="Search Vehical"
        />
        <View style={{marginTop: 10, gap: 5}}>
          <Text variant="medium" style={{fontSize: 18, color: colors.DARK}}>
            Vehicle Type
          </Text>
          <FlatList
            data={app.rentVehicleType}
            contentContainerStyle={{gap: 10, paddingBottom: 15}}
            renderItem={({item}) => {
              return (
                <Button
                  style={{borderColor: colors.PRIMARY}}
                  mode={activeVehicleType == item.id ? 'contained' : 'outlined'}
                  theme={{roundness: 3}}
                  onPress={() => handleFilterWeddingVehicle(item, 'btn')}>
                  {item.display}
                </Button>
              );
            }}
            horizontal
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text variant="medium" style={{fontSize: 18, color: colors.DARK}}>
            Available
          </Text>
        </View>
        {app.isLoading ? null : (
          <FlatList
            style={{height: '42%'}}
            contentContainerStyle={{gap: 10, paddingVertical: 10}}
            data={currentWeddingModles}
            renderItem={({item}) => {
              return (
                <TouchableRipple
                  style={{
                    borderWidth: 1,
                    borderColor: colors.PRIMARY,
                    borderRadius: 15,
                  }}
                  borderless
                  onPress={() => {
                    navigation.navigate('weddingCarConfirm', {
                      ...item,
                      package: app.weddingPackages.find(
                        i => i.id == item.w_package,
                      ),
                    });
                  }}
                  rippleColor={colors.PRIMARY}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: 15,
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{width: 150, height: 150}}
                      source={{uri: item.cover}}
                    />
                    <View style={{width: '52%', alignItems: 'flex-end'}}>
                      <Text
                        variant="bold"
                        style={{
                          textAlign: 'right',
                          fontSize: 18,
                          color: colors.DARK,
                        }}>
                        {item.model}
                      </Text>
                      <Text
                        variant="medium"
                        style={{
                          textAlign: 'right',
                          fontSize: 15,
                          color: colors.DARK,
                        }}>
                        <Icon name="star" size={15} color={colors.PRIMARY} />
                        {item.myRating} Rating
                      </Text>
                      <Text
                        variant="medium"
                        style={{
                          textAlign: 'right',
                          fontSize: 13,
                          color: colors.DARK,
                        }}>
                        LKR{' '}
                        {app.weddingPackages.find(i => i.id == item.w_package).range_begin}{'-'}{app.weddingPackages.find(i => i.id == item.w_package).range_end}
                      </Text>
                    </View>
                  </View>
                </TouchableRipple>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

export default WeddingCar;
