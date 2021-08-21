export default {
	namespaced: true,
	state: {
		orderFrom: null,
		fromRegion: null,
		fromCity: null,
		orderTo: null,
		toRegion: null,
		toCity: null
	},
	mutations: {
		setRegionCity(state, {type, address, regionId, cityId}){
			if(type === 'from'){
				state.orderFrom = address;
				state.fromRegion = regionId;
				state.fromCity = cityId;
			} else{
				state.orderTo = address;
				state.toRegion = regionId;
				state.toCity = cityId;
			}
			
		}
	}
}