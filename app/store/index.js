import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import axios from '../axios';
import orders from './orders.js';
import registrationDriver from './registrationDriver';
import * as applicationSettings from "tns-core-modules/application-settings";

Vue.use(Vuex);
export default new Vuex.Store({
	modules:
	{
		orders,
		registrationDriver
	},
	state: {
		banned: false,
		notApprovedDispatcher: false,
		user: null,
		sidebarState: true,
		nestedPage: false,
		pageTitle: '',
		pageTitleCenter: false,
		popup: {
			state: false,
			type: '',
			title: '',
			text: '',
		},
		client: null,
	},
	mutations: {
		/**
		 ** set user on router change
		 **/
		setAuth(state, user) {
			if (state.user) return;

			state.user = user;
		},
		setUser(state, user) {
			state.user = user;
			applicationSettings.setString('user', JSON.stringify(user));
		},
		setClient(state, client) {
			state.client = client;
			window.localStorage.setItem('access', client.access_code);
		},
	},
	actions: {
		async logout({state}){
			let result = await axios('/api/auth/logOut/');
			if(result.data.success){
				state.user = null;
				applicationSettings.clear();
			}
		},
		getUser({state, commit}) {
			if(state.user) return state.user;
			let user = applicationSettings.getString('user');
			if(!user) return false;
			user = JSON.parse(user);
			commit('setUser', user);
			return user;
		},
		async getClient(store, {
			access
		}) {
			const result = await axios({
				method: 'post',
				url: `/api/auth/isClient/${access}`,
			});

			if (result.data.success)
				store.commit('setClient', result.data.client);
		},
	},
});