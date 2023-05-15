import {createSlice} from '@reduxjs/toolkit';
import {
  addCabHire,
  addCarRent,
  addWeddingRent,
  cancelHire,
  changeDropoffLocation,
  checkCabDriver,
  editProfile,
  generateFarePackage,
  getRentModles,
  getRentPackages,
  getRentVehicleType,
  getTripHistory,
  getVehicleType,
  getWeddingModles,
  getWeddingPackages,
  hireLoop,
  matchCabDriver,
  reviewHire,
} from './appService';

const initialState = {
  isLoading: false,
  error: null,
  position: {latitude: 7.553600338792646, longitude: 80.74938436718737},
  rentVehicleType: null,
  rentModle: null,
  rentPackages: null,
  weddingModle: null,
  weddingPackages: null,
  rideVehicleTypes: null,
  rideFarePackages: [],
  tripHistory: null,
  screens:null,
  matchedCabDriver:null,
  hireId:0,
  hireLoopCode:false,
  activeHireLoopCode:false,
};

const appSlice = createSlice({
  initialState: initialState,
  name: 'app',
  reducers: {
    resetAppCache: (state) => {
      state = initialState;
    },
    removeError: state => {
      state.error = null;
    },
    resetHireRideData:state=>{
      state.rentVehicleType= null;
      state.rideVehicleTypes=null,
      state.rideFarePackages= [],
      state.hireId=0,
      state.hireLoopCode = null;
      state.activeHireLoopCode=null;
      state.matchedCabDriver=null;
    },
    setActiveHireLoopCode:(state,action)=>{
      state.activeHireLoopCode = action.payload;
    },
    setPosition: (state, action) => {
      state.position = action.payload;
    },
    rideFarePackageReset: state => {
      state.rideFarePackages = [];
    },
    resetTripHistory: state => {
      state.tripHistory = null;
    },
    setScreen:(state,action)=>{
      state.screens = action.payload;
    }

  },
  extraReducers: builder => {
    //EDIT PROFILE
    builder.addCase(editProfile.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(editProfile.fulfilled, state => {
      state.isLoading = false;
    });
    builder.addCase(editProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    //TRIP
    builder.addCase(getTripHistory.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getTripHistory.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.tripHistory == null) {
        state.tripHistory = action.payload.result;
      } else {
        if (action.payload.result != false) {
          state.tripHistory = [...state.tripHistory, ...action.payload.result];
        }
      }
    });
    builder.addCase(getTripHistory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    //RIDE RENT WEDDING
    builder.addCase(getVehicleType.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getVehicleType.fulfilled, (state, action) => {
      state.isLoading = false;
      state.rentVehicleType = [
        {display: 'All', id: 'All'},
        ...action.payload.result,
      ];
    });
    builder.addCase(getVehicleType.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    //RIDE VEHICLE

    builder.addCase(getRentVehicleType.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getRentVehicleType.fulfilled, (state, action) => {
      state.isLoading = false;
      state.rideVehicleTypes = action.payload.result.map((item, index) => {
        return {...item, fetchTime: (index + 1) * 200};
      });
    });
    builder.addCase(getRentVehicleType.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(generateFarePackage.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(generateFarePackage.fulfilled, (state, action) => {
      state.isLoading = false;
      state.rideFarePackages.push(action.payload.result);
    });
    builder.addCase(generateFarePackage.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(addCabHire.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(addCabHire.fulfilled, (state, action)  => {
      state.isLoading = false;
      state.hireId = action.payload.result;
      console.log('hire idddd slice',state.hireId);

    });
    builder.addCase(addCabHire.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(matchCabDriver.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(matchCabDriver.fulfilled, state => {
      state.isLoading = false;
    });
    builder.addCase(matchCabDriver.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(checkCabDriver.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(checkCabDriver.fulfilled, (state,action) => {
      state.isLoading = false;
      // state.matchedCabDriver = action.payload.result;
    });
    builder.addCase(checkCabDriver.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(hireLoop.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(hireLoop.fulfilled, (state,action) => {
      state.isLoading = false;
      state.hireLoopCode = action.payload.result;
      if(state.hireLoopCode != state.activeHireLoopCode ){
        state.activeHireLoopCode = action.payload.result;
      }
    });
    builder.addCase(hireLoop.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(changeDropoffLocation.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(changeDropoffLocation.fulfilled, state => {
      state.isLoading = false;
    });
    builder.addCase(changeDropoffLocation.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

     builder.addCase(cancelHire.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(cancelHire.fulfilled, state => {
      state.isLoading = false;
    });
    builder.addCase(cancelHire.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(reviewHire.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(reviewHire.fulfilled, state => {
      state.isLoading = false;
    });
    builder.addCase(reviewHire.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });



    //RENT VEHICLE

    builder.addCase(getRentModles.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getRentModles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.rentModle = action.payload.result.map(item=>{
        return {...item , myRating:(3.0 + Math.random() * (4.0 - 3.0)).toFixed(1)}
      });
    });
    builder.addCase(getRentModles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(getRentPackages.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getRentPackages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.rentPackages = action.payload.result;
    });
    builder.addCase(getRentPackages.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(addCarRent.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(addCarRent.fulfilled, state => {
      state.isLoading = false;
    });
    builder.addCase(addCarRent.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    //WEDDING VEHICLE

    builder.addCase(getWeddingModles.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getWeddingModles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.weddingModle = action.payload.result.map(item=>{
        return {...item , myRating:(3.0 + Math.random() * (4.0 - 3.0)).toFixed(1)}
      });
    });
    builder.addCase(getWeddingModles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(getWeddingPackages.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getWeddingPackages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.weddingPackages = action.payload.result;
    });
    builder.addCase(getWeddingPackages.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(addWeddingRent.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(addWeddingRent.fulfilled, state => {
      state.isLoading = false;
    });
    builder.addCase(addWeddingRent.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const {
  resetAppCache,
  removeError,
  setPosition,
  setActiveHireLoopCode,
  rideFarePackageReset,
  resetTripHistory,
  setScreen,
  resetHireRideData,
} = appSlice.actions;
export default appSlice.reducer;
