import qs from 'qs/dist/qs';
import axios from '@/axios';

const orders = {
	getters: {},
	state: {
		acceptedOrders: [],
	},
	mutations: {
		updateAcceptedOrders(state, newOrders) {
			state.acceptedOrders = [...state.acceptedOrders, ...newOrders];
		},
	},
	actions: {
		async createSuggestionToOrder(store, { orderId, price })
		{
			const result = await axios.post('/api/suggestions/createSuggestion/', qs.stringify({
				orderId,
				price,
			}));
			return result;
		},
		async takeSuggestedOrder(store, { orderId })
		{
			const result = await axios.post('/api/suggestions/acceptSuggestion/', qs.stringify({
				orderId,
			}));
			return result;
		},
		async updateSuggestion(store, { orderId, price })
		{
			const result = await axios.post('/api/suggestions/updateSuggestion/', qs.stringify({
				orderId,
				price,
			}));
			return result;
		},
		async cancelSuggestion(store, { orderId })
		{
			const result = await axios.post('/api/suggestions/cancelSuggestion/', qs.stringify({
				orderId,
			}));
			return result;
		},
		async getSuggestedOrders(store)
		{
			const result = await axios({
				method: 'get',
				url: '/api/suggestions/getSuggestedDriverOrders/',
			});

			return result.data;
		},
		async completeOrder(store, { orderId })
		{
			const result = await axios.post('/api/orders/completeOrder/', qs.stringify({
				orderId,
			}));
			return result;
		},
		async cancelOrder(store, { orderId, reason })
		{
			const result = await axios.post('/api/orders/cancelOrderByDriver/', qs.stringify({
				orderId,
				reason,
			}));
			return result;
		},
		async takeOrder(store, { orderId })
		{
			const result = await axios.post('/api/orders/takeOrderByDriver/', qs.stringify({
				orderId,
			}));

			if (result.data.success)
				store.commit('updateAcceptedOrders', [ result.data.order ]);

			return result;
		},
		async getOrders(store)
		{
			const result = await axios({
				method: 'get',
				url: '/api/orders/getDriverOrders',
			});

			return result.data;
		},
		async getSuggestionsForOrder(store, { access })
		{
			const result = await axios.post('/api/suggestions/getDriversSuggestionsForOrder/', qs.stringify({
				access,
			}));

			return result;
		},
		async rejectDriverSuggestion(store, { access, userId })
		{
			const result = await axios.post('/api/suggestions/rejectDriverSuggestion/', qs.stringify({
				access,
				userId,
			}));

			return result;
		},
		async acceptDriverSuggestion(store, { access, userId })
		{
			const result = await axios.post('/api/suggestions/acceptDriverSuggestion/', qs.stringify({
				access,
				userId,
			}));

			return result;
		},
		async getAcceptedDriver(store, { access })
		{
			const result = await axios.post('/api/suggestions/getAcceptedDriver/', qs.stringify({
				access,
			}));

			return result;
		},
		async updateSuggestPriceOrder(store, { access, price })
		{
			const result = await axios.post('/api/orders/updateSuggestPriceOrder/', qs.stringify({
				access,
				price,
			}));

			return result;
		},
		async cancelSuggestOrder(store, { access })
		{
			const result = await axios.post('/api/orders/cancelSuggestOrder/', qs.stringify({
				access,
			}));

			return result;
		},
	},
};

export default orders;
