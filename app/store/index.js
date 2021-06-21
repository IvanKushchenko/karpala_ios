import * as applicationSettings from "tns-core-modules/application-settings";

import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import axios from '../axios';
import orders from './orders.js';
import registrationDriver from './registrationDriver';

Vue.use(Vuex);
export default new Vuex.Store({
	modules:
	{
		orders,
		registrationDriver
	},
	state: {
		apiToken: applicationSettings.getString('apiToken'),
		banned: false,
		notApprovedDispatcher: false,
		user: false,
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
		},
		setClient(state, client) {
			state.client = client;
			window.localStorage.setItem('access', client.access_code);
		},
	},
	actions: {
		async getUser(store) {
			const result = await $axios({
				method: 'post',
				url: '/api/auth/isLogged/',
			});

			if (result.data.success)
				store.commit('setUser', result.data.user);
		},
		async getClient(store, {
			access
		}) {
			const result = await $axios({
				method: 'post',
				url: `/api/auth/isClient/${access}`,
			});

			if (result.data.success)
				store.commit('setClient', result.data.client);
		},
	},
});