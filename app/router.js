import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	scrollBehavior (to, from, savedPosition)
	{
		document.getElementById('cont').scrollTop = 0;
	},
	routes:
	[
		{
			path: '/auth',
			name: 'Authorization',
			component: () => import('./pages/Authorization.vue')
		},
	]
});
