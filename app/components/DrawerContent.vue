<template>
	<GridLayout rows="auto, *" class="nt-drawer__content">
        <ScrollView row="1" class="nt-drawer__body">
            <StackLayout class="sidebar">
				<FlexboxLayout flexDirection="column" alignItems="center" class="sidebar__top text-center">
					<FlexboxLayout marginBottom="10" height="100" width="100" justifyContent="center">
						<Image v-if="user && user.avatar" :src="user.avatar.path" borderRadius="100%" height="100" width="100" stretch="aspectFill" alt="avatar" />
						<FlexboxLayout v-else height="100" width="100" alignItems="center" justifyContent="center" backgroundColor="#C5CAE9" borderRadius="100%">
							<Label class="fas" text.decode="&#xf030;" color="#283593" fontSize="35"></Label>
						</FlexboxLayout>
					</FlexboxLayout>
				
					<FlexboxLayout v-if="user" flexDirection="column" justifyContent="center">
						<Label v-if="user.full_name" :text="user.full_name" />
						<Label v-if="user.phone" :text="user.phone" />
						<Label :color="+user.balance < 0 ? '#F44336' : '#00C853'" :text="`Баланс: ${moneyFormat(user.balance)}`" />
					</FlexboxLayout>
					
					<FlexboxLayout v-else flexDirection="column" alignItems="center">
						<Button @tap="onNavigationAuthTap()" backgroundColor="transparent" color="#fff" text="Войти или зарегистрироваться"/>
					</FlexboxLayout>
	                
                </FlexboxLayout>
				
				<FlexboxLayout width="100%" padding="10 15" flexDirection="column">
					<Button v-for="item in menuMain" :key="item.name" @tap="onNavigationItemTap(item)" fontSize="16" textAlignment="left" padding="12 0" :color="selectedPage === item.page ? '#00C853' : '#000'">
						<FormattedString>
							<Span :text.decode="String.fromCharCode(item.icon)" class="fas"/>
							<Span text="	"/>
							<Span :text="item.name"/>
						</FormattedString>
					</Button>
				</FlexboxLayout>
			</StackLayout>
        </ScrollView>
    </GridLayout>
</template>

<script>
import moneyFormat from '@/mixins/moneyFormat.js';
import Orders from "@/pages/Orders";
import OrdersSearch from "@/pages/OrdersSearch";
import Authorization from '@/pages/Authorization';
import * as utils from "~/shared/utils";
import { mapState } from 'vuex';
// import {
// 	SelectedPageService
// } from "~/shared/selected-page-service";
export default {

	name: 'DrawerContent',
	mixins: [moneyFormat],
	components: {
		Orders,
		OrdersSearch
	},
	data() {
		return {
			menuMain: [
				{
					name: 'Все заказы',
					icon: '0xf0ca',
					page: 'Orders'
				},
				{
					name: 'Мои предложения',
					icon: '0xf022',
					page: 'DriverOrders',
					middlewares: ['auth']
				},
				{
					name: 'В работе',
					icon: '0xf1ba',
					page: 'DriverOrders',
					middlewares: ['auth']
				},
				{
					name: 'В поиске',
					icon: '0xf002',
					page: 'MyPreorders',
					middlewares: ['auth']
				},
				{
					name: 'Личный кабинет',
					icon: '0xf4fe',
					page: 'Personal',
					middlewares: ['auth']
				}
			],
			mainAdditional: [
				{
					name: 'Настройки',
					icon: '&#xf013;',
					page: 'Settings',
					middlewares: ['auth']
				},
				{
					name: 'Рассказать другу',
					icon: '&#xf1e0;',
					page: Orders
				},
				{
					name: 'Оставить отзыв',
					icon: '&#xf005;',
					page: Orders
				}
			],
			pages: {
				Orders,
				OrdersSearch,
				Authorization
			},
			selectedPage: ""
		}
	},
	computed: {
		...mapState({
			user: state => state.user
		}),
	},
	methods: {
		navigateTo(component){
			this.$navigateTo(this.pages[component]);
			utils.closeDrawer();
		},
		onNavigationAuthTap(){
			this.navigateTo('Authorization')
		},
		onNavigationItemTap(item) {
			// if(item.hasOwnProperty('middlewares') && item.middlewares.includes('auth') && !this.$store.state.user){
			// 	confirm({
			// 		title: "Авторизуйтесь",
			// 		message: "Для того чтобы перейти на эту страницу, вам необходимо войти в свою учётную запись.",
			// 		okButtonText: "Войти",
			// 		cancelButtonText: "Отмена"
			// 	}).then(result => {
			// 		console.log(result);
			// 	});
			// 	return;
			// }

			// this.navigateTo(item.page);
			// this.navigateTo('OrdersSearch');
			this.navigateTo('Orders');
		}
	},
	// mounted() {
	// 	SelectedPageService.getInstance().selectedPage$
	// 		.subscribe((selectedPage) => this.selectedPage = selectedPage);
	// },
}
</script>

<style lang="scss" scoped>
	.sidebar{
		&__top{
			padding: 25px;
			background-color: #283593;
			color: #fff;
			font-size: 14px;
			line-height: 20px;
			min-height: 96px;
		}
	}
</style>