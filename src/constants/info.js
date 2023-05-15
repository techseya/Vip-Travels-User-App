import {Dimensions, Platform} from 'react-native';

export const {width, height} = Dimensions.get('window');

const host = 'user.viptravels.lk';
const api_key =
  'CASuPsXy7DyJzDrnF9fwGPQKBgBdvq8ylZ2nnA64H5ZF6Febc++PHdLdL9dyvw4V1KIw0lpZYyMVmNkgCO77A3Rajm0ZbDr';
const device =
  Platform.OS === 'android'
    ? 'android'
    : Platform.OS === 'ios'
    ? 'ios'
    : 'other';
const device_type =
  Platform.OS === 'android' ? 1 : Platform.OS === 'ios' ? 0 : 2;
const browser = 'Mobile Application';
const ip_address = 'null';
const user_agent = 'Mobile Application';

export const apiInfo = path => {
  let info;
  switch (path) {
    //AUTH-----
    case 'signUp':
      info = {
        host: host,
        api_key: api_key,
        session_id: Date.now(),
        device: device,
        device_type: device_type,
        browser: browser,
        ip_address: ip_address,
        user_agent: user_agent,
      };
      break;
    case 'login':
      info = {
        host: host,
        api_key: api_key,
        session_id: Date.now(),
        device: device,
        device_type: device_type,
        browser: browser,
        ip_address: ip_address,
        user_agent: user_agent,
      };
      break;
    case 'autoLogin':
      info = {
        host: host,
        api_key: api_key,
      };
      break;
    case 'logOut':
      info = {
        host: host,
        api_key: api_key,
      };
      break;
    //APP---
    //Ride
    case 'ride':
      info = {
        host: host,
        api_key: api_key,
      };
      break;
    //RENTCAR
    case 'rent':
      info = {
        host: host,
        api_key: api_key,
      };
      break;
    //WEDDINGCAR
    case 'wedding':
      info = {
        host: host,
        api_key: api_key,
      };
      break;
    //EDIT PROFILE
    case 'profile':
      info = {
        host: host,
        api_key: api_key,
      };
      break;
    case 'trip':
      info = {
        host: host,
        api_key: api_key,
      };
      break;
  }
  return info;
};

export const url = {
  //AUTH
  signUp: '/signup',
  login: '/login',
  autoLogin: '/autologin',
  logout: '/logout',

  //APP
  //HOME

  //ALLVEHICALTYPES
  getVehicleType: '/get%20vehicle%20types',
  //RENTCAR
  getRentModles: '/get%20rent%20models',
  getRentPackages: 'get%20rent%20packages',
  addCarRent: '/add%20car%20rent',
  //WEDDINGCAR
  getWeddingModles: '/get%20wedding%20models',
  getWeddingPackages: '/get%20wedding%20packages',
  addWeddingRent: '/add%20wedding%20rent',

  //Cab
  generateFarePackage: 'generate%20fare%20package',
  addCabHire:'add%20cab%20hire',
  
  matchCabDriver:'match%20cab%20driver',
  checkCabDriver:'check%20cab%20driver',
  hireLoop:'hire%20loop',
  cancelHire:'cancel%20hire',
  changeDropoffLocation:'change%20dropoff%20location',
  reviewHire:'review%20hire',
  
  //TRIP
  getTripHistory:'get%20trip%20history',

  //EDIT PROFILE
  editProfile: '/edit%20profile',
};
