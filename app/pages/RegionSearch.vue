<template>
	<Page backgroundColor="#F5F5F5" @loaded="onPageLoaded">
		<StackLayout>
			<FlexboxLayout v-if="regionsComputed" height="100%" flexDirection="column">
				<SearchBar v-model="searchValue" fontSize="16" :hint="!currentRegion ? 'Регион' : 'Город'" flexShrink="0"></SearchBar>
				<ListView v-if="!currentRegion" key="regions" flexGrow="1" backgroundColor="#fff" for="region in regionsComputed" @itemTap="selectRegion" >
					<v-template>
						<Label :text="region.name" height="53" paddingLeft="20" fontSize="16"/>
					</v-template>
				</ListView>
				<ListView v-else key="cities" backgroundColor="#fff" flexGrow="1" for="city in citiesComputed" @itemTap="selectCity" >
					<v-template>
						<Label height="53" paddingLeft="20" textWrap>
							<FormattedString>
								<Span :text="city.name" fontSize="16"/>
								<Span text.decode="\n" />
								<Span :text="currentRegion.name" color="#757575" fontSize="14"/>
							</FormattedString>
						</Label>
					</v-template>
				</ListView>
			</FlexboxLayout>
			<Label v-else text="Ничего не найдено"/>
		</StackLayout>
	</Page>
</template>

<script>
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { mapState } from 'vuex';
export default {

  name: 'RegionSearch',
  props: {
  	type: {
  		type: String,
  		default: null
  	}
  },
  data () {
    return {
    	currentRegion: false,
		currentRegionId: false,
		currentCityId: false,
		currentCity: false,
    	searchValue: null,
    	currentArea: '',
    	regions: []
    }
  },
  computed: {
  	// ...mapState({
  	// 	currentRegionId: state => this.type === 'from' ? state.search.fromRegion : state.se
  	// }),
  	regionsComputed(){
  		return this.regions.filter(region => region.name.includes(this.searchValue || ''));
  	},
  	citiesComputed(){
  		if(!this.currentRegion) return [];
  		let region = this.regions.find(region => region.id == this.currentRegion.id);
		return region.cities.filter(city => city.name.includes(this.searchValue || ''));
  	},
	filterByInput() {
		// if(!this.currentRegion){
		// 	return this.regions.filter(region => region.name.includes(this.searchValue));
		// } else {
		// 	let cities = this.regions.reduce((arr, region) => {
	 //  			region.cities.forEach(city => arr.push(city));
	 //  			return arr;
	 //  		}, []);
		// 	return this.cities.filter(city => city.name.includes(this.searchValue));
		// }
			// var result = [];

			// if (this.currentRegion && this.searchValue.length == 0) {
			// 	for (var index in this.regions) {
			// 		if (this.regions[index].name != this.currentRegion)
			// 			continue;

			// 		result = this.cloneObj(this.regions[index]);
			// 		// result.show = false;
			// 		break;
			// 	}

			// 	if (this.searchValue == '')
			// 		return [result];

			// }

			// // if (this.searchValue.length == 0 && this.currentArea != '')
			// // 	return this.cloneObj(this.regions);


			// result = [];

			// for (var index in this.regions) {
			// 	if (this.equalStr(this.regions[index].name, this.searchValue)) {
			// 		var item = this.cloneObj(this.regions[index]);

			// 		// item.show = true;
			// 		var includedCities = []

			// 		for (var cityIndex in item.cities) {
			// 			if (this.equalStr(item.cities[cityIndex].name, this.searchValue))
			// 				includedCities.push(item.cities[cityIndex])
			// 		}
			// 		item.cities = includedCities

			// 		result.push(item);
			// 		continue;
			// 	}

			// 	var withoutRegionIncluded = [];

			// 	for (var cityIndex in this.regions[index].cities) {
			// 		if (!this.equalStr(this.regions[index].cities[cityIndex].name, this.searchValue))
			// 			continue;

			// 		var item = this.cloneObj(this.regions[index].cities[cityIndex]);

			// 		withoutRegionIncluded.push(item);
			// 	}

			// 	if (withoutRegionIncluded.length == 0)
			// 		continue;

			// 	var item = this.cloneObj(this.regions[index]);

			// 	// item.show = false;
			// 	item.cities = withoutRegionIncluded;
			// 	result.push(item);
			// }

			// // console.log("result", result);

			// if (result.length == 0)
			// 	return false

			// return result;
	}
  },
  methods: {
  	onPageLoaded(val){
  		try{
  			console.log("onPageLoaded");
	  		this.getRegions();
	  	} catch(error){
	  		console.error(error);
	  	}
  	},
  	setDataToStore(){
  		this.$store.commit('setRegionCity', {
  			type: this.type,
  			address: `${this.currentRegion?.name} ${this.currentCity?.name}`,
  			regionId: this.currentRegion?.id,
  			cityId: this.currentCity?.id
  		})
  	},
  	selectRegion({index}){
  		this.currentRegion = this.regionsComputed[index];
  		// this.setDataToStore();
  		this.searchValue = null;
  	},
  	selectCity({index}){
  		this.currentCity = this.citiesComputed[index];
  		this.$modal.close({
  			region: {
  				id: this.currentRegion.id,
  				name: this.currentRegion.name
  			}, 
  			city: {
  				id: this.currentCity.id,
  				name: this.currentCity.name
  			}
  		});
  		// this.setDataToStore();
  	},
	cloneObj(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	equalStr(name, searchText) {
		return name.toLowerCase().includes(searchText.toLowerCase());
	},
	setCurrentRegion(region, regionId) {
		this.currentRegionId = regionId;
		// document.getElementById('region-list').scrollTop = 0
		this.currentRegion = region;
		this.searchValue='';
		// this.noMatter = false;
	},
	setValue(address, city, cityId, currentRegionId) {
		// document.getElementById('region-list').scrollTop = 0;
		// this.noMatter = false;
		this.currentCityId = cityId;
		// this.$emit('selectregion', address, (currentRegionId ? currentRegionId : this.currentRegionId), this.currentCityId);
		// this.currentCity = city;
		// this.close();
		this.searchValue = '';
	},
	async getRegions() {
		try{
			const result = await this.$axios({
				method: 'post',
				url: '/api/regions/getRegions',
			});
			
			this.regions = result.data.regions;
			console.log("this.regions");
		} catch(error){
			console.error(error);
			return Promise.reject(error);
		}
	

			// for (var index in this.regions) {
			// 	this.regions[index].show = true;
			// 	// if (this.orderType == 'preorder')
			// 		// this.regions[index].cities.unshift({
			// 		// 	id: 0,
			// 		// 	name: 'Не важно'
			// 		// });
			// }
		// }
	},
  },
 //  async beforeRouteEnter(from, to, next){
 //  	console.log("beforeRouteEnter");
 //  	let {data} = await this.$axios({
	// 	method: 'post',
	// 	url: '/api/regions/getRegions',
	// });

	// next(vm => {
	// 	vm.regions = data.regions;
	// 	console.log("vm.regions", vm.regions);
	// })
 //  },
  // created(){
  // 	try{
  // 		this.getRegions();
  // 	} catch(error){
  // 		console.error(error);
  // 	}
  	
  	
  // }
}
</script>

<style lang="css" scoped>
</style>