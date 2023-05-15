import React from 'react';
import {View, FlatList, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Button,
  Searchbar,
  Text,
  TouchableRipple,
} from 'react-native-paper';
//consts
import colors from 'src/constants/colors';
//compoenets
import {AvatarHeader, Loading} from 'src/components';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getRentModles,
  getRentPackages,
  getVehicleType,
} from 'src/store/appSlice/appService';
import {apiInfo} from 'src/constants/info';

const RentCar = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const app = useSelector(state => state.app);

  const [isAPIDataLoaded, setIsAPIDataLoaded] = React.useState(false);
  const [currentRentModles, setCurrentRentModles] = React.useState(false);
  const [activeVehicleType, setActiveVehicleType] = React.useState('All');

  const handleFilterRentVehicle = (item, inputType) => {
    if (inputType == 'btn') {
      if (item.id == 'All') {
        setCurrentRentModles(app.rentModle);
      } else {
        setCurrentRentModles(
          app.rentModle.filter(obj => obj.vehicle_type == item.id),
        );
      }
      setActiveVehicleType(item.id);
    } else {
      if (item == '') {
        if (activeVehicleType == 'All') {
          setCurrentRentModles(app.rentModle);
        } else {
          setCurrentRentModles(
            app.rentModle.filter(obj => obj.vehicle_type == activeVehicleType),
          );
        }
      } else {
        setCurrentRentModles(
          currentRentModles.filter(i =>
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
          ...apiInfo('rent'),
          c_state: 0,
          r_state: 1,
          w_state: 0,
        }),
      )
        .then(() => dispatch(getRentModles({...apiInfo('rent')})))
        .then(() => dispatch(getRentPackages({...apiInfo('rent')})))
        .then(() => setIsAPIDataLoaded(true));
    } else {
      setCurrentRentModles(app.rentModle);
    }
  }, [isAPIDataLoaded]);

  if (!isAPIDataLoaded) {
    return <Loading />;
  }

  return (
    <View style={{flex: 1, backgroundColor: colors.LIGHT}}>
      <AvatarHeader navMode="back" />
      <View style={{flexGrow: 1, gap: 5, paddingHorizontal: 10}}>
        <Text variant="bold" style={{fontSize: 20, color: colors.DARK}}>
          Find Your Favourite Vehicle
        </Text>
        <Searchbar
          mode="view"
          onChangeText={val => handleFilterRentVehicle(val, 'input')}
          style={{
            borderRadius: 10,
            backgroundColor: colors.LIGHT,
            borderWidth: 1,
          }}
          placeholderTextColor={colors.GRAY}
          inputStyle={{color:colors.DARK}}
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
                  onPress={() => handleFilterRentVehicle(item, 'btn')}>
                  {item.display}
                </Button>
              );
            }}
            horizontal
          />
        </View>
        <View
          style={{
            paddingVertical: 10,
          }}>
          <Text variant="medium" style={{fontSize: 18, color: colors.DARK}}>
            Available
          </Text>
        </View>
        {app.isLoading ? null : (
          <FlatList
            style={{height: '42%'}}
            contentContainerStyle={{gap: 10,paddingVertical:10}}
            data={currentRentModles}
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
                    navigation.navigate('rentCarConfirm', {
                      ...item,
                      package: app.rentPackages.find(
                        i => i.id == item.r_package,
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
                        {app.rentPackages
                          .find(i => i.id == item.r_package)
                          .d_range_begin.toFixed(2)}
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

export default RentCar;
