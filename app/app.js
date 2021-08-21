import Vue from 'nativescript-vue';
// Vue.config.silent = false;
// import Vuetify from 'vuetify';
// import router from './router';
// import * as http from "http";
import store from './store/index';
// import VeeValidate from 'vee-validate/dist/vee-validate';
import RadSideDrawer from 'nativescript-ui-sidedrawer/vue';
Vue.use(RadSideDrawer);
import axios from './axios';
Vue.prototype.$axios = axios;

Vue.prototype.$qs = require('qs/dist/qs');

import DateTimePicker from "@nativescript/datetimepicker/vue";
Vue.use(DateTimePicker);

// import RadListView from 'nativescript-ui-listview/vue';
// Vue.use(RadListView);
// const dict = {
// 	ru: {
// 		messages: {
// 			required() {
// 				return "Поле не заполненно";
// 			},
// 			min(fieldName) {
// 				return `Неверный формат, поле ${fieldName} должно быть длиннее`;
// 			},
// 			max(fieldName) {
// 				return `Неверный формат, поле ${fieldName} должно быть короче`;
// 			},
// 			email() {
// 				return "Неверный формат электронной почты";
// 			},
// 			numeric() {
// 				return "Неверный формат, должны быть только цифры";
// 			},
// 			length() {
// 				return "Неверный формат";
// 			},
// 			regex(fieldName) {
// 				return `Неверный формат поля "${fieldName}"`;
// 			}
// 		}
// 	}
// };

// const config = {
// 	aria: false,
// 	classNames: {},
// 	classes: false,
// 	delay: 0,
// 	dictionary: dict,
// 	errorBagName: 'errors', // change if property conflicts
// 	events: '',
// 	fieldsBagName: 'fields',
// 	i18n: null, // the vue-i18n plugin instance
// 	i18nRootKey: 'validations', // the nested key under which the validation messages will be located
// 	inject: true,
// 	locale: 'ru',
// 	validity: false
// };
// Vue.use(VeeValidate, config);

// import CanvasSVG from '@nativescript-community/ui-svg/vue';
// Vue.use(CanvasSVG);

// Vue.registerElement('SVGImage', () => require('nativescript-svg').SVGImage)
// Vue.use(Vuetify);
// Vue.use(Vuetify, {
// 	iconfont: 'mdi' // 'md' || 'mdi' || 'fa' || 'fa4'
// });

// Плагин для масок
// import VueTheMask from 'vue-the-mask';
// Vue.use(VueTheMask);


// router.beforeEach(async function(to, from, next)
// {
// 	const freePages =
// 	[
// 		'Authorization',
// 		'OrderSearch',
// 		'Orders',
// 		'Registration',
// 		'NewPassword',
// 		'Security',
// 		'Offer',
// 		'SecurityPolicy',
// 		'SecurityPolicy',
// 		'Agreement',
// 		'Forbidden',
// 		'Reklama',
// 		'Trebovaniya',
// 		'Usloviya',
// 		'Otkaz',
// 		'Cookies',
// 		'platniy-dostup',
// 		'Contacts',
// 		'Docs',
// 		'NotFound',
// 	];
// 	const adminPages =
// 	[
// 		'Drivers',
// 		'Settings',
// 		'Tariffs',
// 		'Dispatchers',
// 		'OrdersTable',
// 		'StatisticsOrders',
// 		'StatisticsDrivers',
// 		'StatisticsTransitions',
// 		'Mailing',
// 	];
// 	const clientPages =
// 	[
// 		'TradingCabinet',
// 		'TradingCabinetDriver',
// 		'TradingCabinetDriverComments',
// 	];
// 	const user = await axios({url: 'https://karpala.ru/api/auth/isLogged/' });
// 	let access;
// 	let client;
// 	if (window.location.search.match(/access/) || window.localStorage.getItem('access'))
// 	{
// 		access = window.location.search.match(/access/) ? window.location.search : `?access=${window.localStorage.getItem('access')}`;
// 		await store.dispatch('getClient', { access });
// 		client = store.state.client;
// 	}
// 	if(user.data.success)
// 	{
// 		store.commit('setAuth', user);
// 		setTimeout(function()
// 		{
// 			if(store.state.user.role !== 'manager' && adminPages.indexOf(to.name) != -1)
// 				return next('/404');
// 			if(to.name == 'Authorization' || to.name == 'Registration')
// 				return next('/404');
// 			if(~clientPages.indexOf(to.name) && !client)
// 				return next('/404');
// 		}, 50);
// 		return next();
// 	}
// 	else if (client)
// 	{
// 		setTimeout(() =>
// 		{
// 			if(!~clientPages.indexOf(to.name) && !~freePages.indexOf(to.name))
// 				return next('/trading-cabinet');
// 		});
// 		return next();
// 	}
// 	else if(!~freePages.indexOf(to.name))
// 	{
// 		if(~clientPages.indexOf(to.name))
// 			return next('/404');

// 		return next('/auth');
// 	}
// 	next();
// });

import App from './App';
new Vue({
	store,
	render: (h) => h(App),
	async mounted() {
		const user = await axios({url: '/api/auth/isLogged/' });
		if (user.data.success) {
			this.$store.commit('setAuth', user.data);
		}
	}
}).$start()
