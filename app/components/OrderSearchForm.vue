<template>
	<ScrollView>
		<StackLayout>
			<FlexboxLayout alignItems="center">
				<Label text="C" flexShrink="0" fontSize="16"/>
				<DateTimePickerFields @dateChange="dateChangeHandler('from', $event)" locale="ru_RU" :date="formFields.dateStart" height="30" hintDate="Выберите дату" hintTime="Выберите время"></DateTimePickerFields>
			</FlexboxLayout>
			
			<FlexboxLayout alignItems="center" fontSize="16" marginBottom="10">
				<Label text="По" flexShrink="0" fontSize="16"/>
				<DateTimePickerFields fontSize="16" @dateChange="dateChangeHandler('to', $event)" locale="ru_RU" :date="formFields.dateEnd" height="30" hintDate="Выберите дату" hintTime="Выберите время"></DateTimePickerFields>
			</FlexboxLayout>

			<FlexboxLayout alignItems="center">
				<Switch marginLeft="0" :checked="formFields.now" @checkedChange="checkedChange('now', $event)"/>
				<Label text="Сейчас" fontSize="16"/>
			</FlexboxLayout>

			<FlexboxLayout alignItems="center">
				<Switch marginLeft="0" :checked="formFields.is_only_karpala_orders" @checkedChange="checkedChange('is_only_karpala_orders', $event)"/>
				<Label text="Только заказы фирмы" fontSize="16"/>
			</FlexboxLayout>

			<FlexboxLayout alignItems="center" marginBottom="10">
				<Switch marginLeft="0" :checked="formFields.is_only_karpala_orders" @checkedChange="checkedChange('is_everyday', $event)"/>
				<Label text="Каждый день" fontSize="16"/>
			</FlexboxLayout>

			<FlexboxLayout flexDirection="column" marginBottom="10" @tap="showRegionSearch('from')">
				<Label text="ОТКУДА" fontSize="16"/>
				<TextField
						   margin="5 0 0 0"
						   :editable="false"
						   fontSize="16"
						   :text="formFields.orderFrom"
				           class="input login-form__input" 
				           hint="Район" />
			</FlexboxLayout>

			<FlexboxLayout flexDirection="column" marginBottom="10" @tap="showRegionSearch('to')">
				<Label text="КУДА" fontSize="16"/>
				<TextField
						   margin="5 0 0 0"
						   width="100%"
						   fontSize="16"
						   :editable="false"
						   :text="formFields.orderTo"
				           class="input login-form__input" 
				           hint="Район" />
			</FlexboxLayout>

			<FlexboxLayout flexDirection="column" marginBottom="10">
				<Label text="КЛАСС АВТО" fontSize="16"/>
				<FlexboxLayout alignItems="center" v-for="(item, key) in autoClasses" :key="`autoclasses-${key}`">
					<Switch marginLeft="0" :checked="formFields.classesAutoId.includes(item.id)" @checkedChange="setClass(item.id)"/>
					<Label :text="item.class_name" fontSize="16"/>
				</FlexboxLayout>
			</FlexboxLayout>

			<FlexboxLayout flexDirection="column" marginBottom="10">
				<Label text="МИНИМАЛЬНАЯ ЦЕНА" fontSize="16"/>
				<TextField
						   margin="5 0 0 0"
						   width="100%"
						   fontSize="16"
						   v-model="formFields.min_price"
				           class="input login-form__input" 
				           hint="0" />
			</FlexboxLayout>
			<Button class="button" height="56" text="НАЙТИ" @tap="addOrder"/>
		</StackLayout>
	</ScrollView>
</template>

<script>
import { mapState } from 'vuex';
import { format } from 'date-fns';
import qs from 'qs/dist/qs';
// import preorders from '../mixins/preorders.js'
// import orderForm from '../mixins/orderForm.js'
import RegionSearch from '@/pages/RegionSearch.vue';
export default
{
	components: {
		RegionSearch
	},
	// mixins: [reorders, orderForm],
	// mixins: [orderForm],
	data()
	{
		return {
			pages: {
				RegionSearch
			},
			searchQuery: null,
			formFields:{
				now: 0,
				dateStart: new Date(),
				dateEnd: new Date(),
				timeStart: '00:00',
				timeEnd: '23:59',
				min_price: 0,
				classesAutoId: ['1', '2', '3'],
				is_only_karpala_orders: false,
				is_everyday: false,
				orderFrom: '',
				fromRegion: null,
				fromCity: null,
				orderTo: '',
				toRegion: null,
				toCity: null
			},
			autoClasses: []
		}
	},
	watch: {
		
	},
	computed: {
	},
	methods: {
		setClass(autoClassId) {
			if (this.formFields.classesAutoId.includes(autoClassId))
				this.formFields.classesAutoId.splice(this.formFields.classesAutoId.indexOf(autoClassId), 1)

			else
				this.formFields.classesAutoId.push(autoClassId)


			// if (!this.formFields.classesAutoId.length && !this.searchPage) {
			// 	this.fieldsErrors.classes = 'Выберите хотя бы один класс авто'
			// 	return false
			// } else {
			// 	this.fieldsErrors.classes = false;
			// 	return true
			// }
		},
		async getAutoClasses() {
			const result = await this.$axios({
				method: 'post',
				url: '/api/classauto/get',
			});

			if (result.data.success)
				this.autoClasses = result.data.classes
		},
		async showRegionSearch(type){
			// this.$navigateTo(this.pages.RegionSearch);
			// let data = await this.$showModal(this.pages.RegionSearch, {fullscreen: true});
			let data = await this.$showModal(this.pages.RegionSearch);
			if(data && data.hasOwnProperty('region') && data.hasOwnProperty('city')){
				console.log("modal data", data);
				if(type == 'from'){
					this.formFields.orderFrom = `${data.region.name}, ${data.city.name}`;
					this.formFields.fromRegion = data.region.id;
					this.formFields.fromCity = data.city.id;
					console.log("this.orderFrom", this.formFields.orderFrom);
				} else{
					this.formFields.orderTo = `${data.region.name}, ${data.city.name}`;
					this.formFields.toRegion = data.region.id;
					this.formFields.toCity = data.city.id;
				}
			}
			
			
		},
		checkedChange(type, event){
			this.formFields[type] = event.checked;
		},
		dateChangeHandler(type, date){
			console.log("date change", format(date.value, 'dd.MM.YYYY'), format(date.value, 'HH:mm'));
			switch(type) {
				case 'from':
					this.formFields.dateStart = format(date.value, 'dd.MM.YYYY');
					this.formFields.timeStart = format(date.value, 'HH:mm');
					break;
				case 'to':
					this.formFields.dateEnd = format(date.value, 'dd.MM.YYYY');
					this.formFields.timeEnd = format(date.value, 'HH:mm');
					break;
			}
		},
		timeChangeHandler(type, time){
			this[type].time = time.value;
		},
		async addOrder() {
			// this.waitingResults = true;


			if (!this.formFields.now) {
				var date = this.formFields.date,
					timeStart = this.formFields.timeStart,
					timeEnd = this.formFields.timeEnd
			} else {
				var date = '',
					timeStart = '',
					timeEnd = ''
			}

			let data = qs.stringify({
				classAuto: this.formFields.classesAutoId,
				dateStart: this.formFields.dateStart,
				dateEnd: this.formFields.dateEnd,
				timeStart: this.formFields.timeStart,
				timeEnd: this.formFields.timeEnd,
				now: Number(this.formFields.now),
				is_everyday: Number(this.formFields.is_everyday),
				is_only_karpala_orders: Number(this.formFields.is_only_karpala_orders),
				min_price: Number(this.formFields.min_price),
				fromRegion: this.formFields.fromRegion ? this.formFields.fromRegion : 0,
				fromCity: this.formFields.fromCity ? this.formFields.fromCity : 0,
				toRegion: this.formFields.toRegion ? this.formFields.toRegion : 0,
				toCity: this.formFields.toCity ? this.formFields.toCity : 0
			});

			var propData = {
				classAuto: this.formFields.classesAutoId,
				dateStart: this.formFields.dateStart,
				dateEnd: this.formFields.dateEnd,
				timeStart: this.formFields.timeStart,
				timeEnd: this.formFields.timeEnd,
				now: Number(this.formFields.now),
				is_everyday: Number(this.formFields.is_everyday),
				is_only_karpala_orders: Number(this.formFields.is_only_karpala_orders),
				min_price: Number(this.formFields.min_price),
				fromRegion: this.formFields.fromRegion ? this.formFields.fromRegion : 0,
				fromCity: this.formFields.fromCity ? this.formFields.fromCity : 0,
				toRegion: this.formFields.toRegion ? this.formFields.toRegion : 0,
				toCity: this.formFields.toCity ? this.formFields.toCity : 0
			}

			const result = await this.$axios({
				data: data,
				method: 'post',
				url: '/api/orders/search',
			});

			// this.waitingResults = false;

			// this.$set(this.formFields, 'timeVal', this.timeVal);

			if (result.data.success)
				this.$emit('searchdone', result.data, propData, this.formFields);
		},
	},
	created(){
		this.getAutoClasses();
	}
}
</script>
<style lang="scss">
// .order-search__label
// {
// 	margin-bottom: 20px;
// 	width: 100%;
// 	display: flex;
// 	align-items: center;
// 	.input-wrapper
// 	{
// 		flex: 1;
// 	}
// 	input
// 	{
// 		width: 100%;
// 		background-color: #fff;
// 	}
// }
// .order-search__top
// {
// 	border-bottom: 1px solid rgba(0, 0, 0, 0.06);
// 	padding-bottom: 5px;
// }
// .order-search__label_timerange
// {
// 	margin-bottom: 35px;
// }
// .datepicker__icon
// {
// 	width: 20px;
// 	margin-right: 20px;
// 	flex-shrink: 0;
// }
// .order-search__label_now
// {
// 	padding-left: 44px;
// }
// .time-range-wrapper
// {
// 	flex: 1;
// }
// .order-search__bot
// {
// 	padding: 29px 0;
// }
// .order-search__bot-item-title
// {
// 	font-size: 14px;
// 	text-transform: uppercase;
// 	color: rgba(0, 0, 0, 0.871943);
// 	margin-bottom: 20px;
// }
// .order-search__bot-input
// {
// 	&:not(:last-of-type)
// 	{
// 		margin-bottom: 24px;
// 	}
// 	&_grey input
// 	{
// 		background-color: #ececec;
// 	}
// 	&_chevron
// 	{
// 		position: relative;
// 		&:after
// 		{
// 			content: '';
// 			position: absolute;
// 			display: block;
// 			right: 20px;
// 			top: 27px;
// 			border: 4px solid transparent;
// 			border-top: 5px solid rgba(0,0,0, .5);
// 		}
// 	}
// }
// .order-search__bot-item
// {
// 	margin-bottom: 30px;
// }
// .order-search__bot-checkbox
// {
// 	margin-bottom: 15px;
// }
// .multiselect
// {
// 	height: 56px;
// }
// .multiselect__select
// {
// 	margin-top: 8px;
// }
// .multiselect__tags
// {
// 	height: 56px;
// 	padding: 18px 40px 0 8px;

// 	border: none;
// }
// .multiselect__single
// {
// 	color: $textColor;
// }
// .multiselect__option--selected.multiselect__option--highlight,
// .multiselect__option--highlight
// {
// 	background-color: $lightBlue;
// }
// .order-search__bot-input_preorder
// {
// 	position: relative;
// 	&.input-wrapper_error:after
// 	{
// 		top: 0;
// 	}
// 	&.input-wrapper .input-msg
// 	{
// 		top: 18px;
// 	}
// }
// @media (max-width: 1024px)
// {
// 	.order-search
// 	{
// 		padding: 0 16px;
// 	}
// }
</style>
