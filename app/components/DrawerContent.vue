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
				
					<FlexboxLayout v-if="user" flexDirection="column" >
						<Label v-if="user.full_name" :text="user.full_name" />
						<Label v-if="user.phone" :text="user.phone" />
						<Label :color="+user.balance < 0 ? '#F44336' : '#00C853'" :text="`Баланс: ${moneyFormat(user.balance)}`" />
					</FlexboxLayout>
					
					<FlexboxLayout v-else flexDirection="column">
						<Button backgroundColor="transparent" color="#fff" text="Войти или зарегистрироваться"/>
					</FlexboxLayout>
	                
                </FlexboxLayout>
				
				<FlexboxLayout width="100%" padding="10 15">
					<Button fontSize="18" padding="12 0" :color="selectedPage === 'Orders' ? '#00C853' : '#000'">
						<FormattedString>
							<Span text.decode="&#xf0ca;" class="fas"/>
							<Span text="	"/>
							<Span text="Все заказы"/>
						</FormattedString>
					</Button>
				</FlexboxLayout>
               <!--  <GridLayout padding="12 0" columns="auto, *"
                			:color="selectedPage === 'Orders' ? '#00C853' : '#000'"
                            @tap="onNavigationItemTap(Orders)">
                    <Label col="0" text.decode="&#xf015;" class="nt-icon fas"/>
                    <Label col="1" text="Все заказы" class="p-r-10"/>
                </GridLayout> -->
				<!--  <GridLayout columns="auto, *"
                			:class="'nt-drawer__list-item' + (selectedPage === 'Orders' ? ' -selected': '')"
                            @tap="onNavigationItemTap(Orders)">
                    <Label col="0" text.decode="&#xf015;" class="nt-icon fas"/>
                    <Label col="1" text="Orders" class="p-r-10"/>
                </GridLayout> -->
			</StackLayout>
        </ScrollView>
    </GridLayout>
</template>

<script>
import moneyFormat from '@/mixins/moneyFormat.js';
import Orders from "../pages/Orders";
import * as utils from "~/shared/utils";
// import {
// 	SelectedPageService
// } from "~/shared/selected-page-service";
export default {

	name: 'DrawerContent',
	mixins: [moneyFormat],
	components: {
		Orders
	},
	data() {
		return {
			menuMain: [
				{
					name: 'Все заказы',
					icon: '&#xf0ca;',
					page: Orders
				},
				{
					name: 'Мои предложения',
					icon: '&#xf022;',
					page: Orders
				},
				{
					name: 'В работе',
					icon: '&#xf1ba;',
					page: Orders
				},
				{
					name: 'В поиске',
					icon: '&#xf3eb;',
					page: Orders
				},
				{
					name: 'Личный кабинет',
					icon: '&#xf4fe;',
					page: Orders
				}
			],
			mainAdditional: [
				{
					name: 'Настройки',
					icon: '&#xf013;',
					page: Orders
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
			Orders: Orders,
			selectedPage: ""
		}
	},
	computed: {
		user() {
			return this.$store.state.user
		},
	},
	methods: {
		onNavigationItemTap(component) {
			this.$navigateTo(component);
			utils.closeDrawer();
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