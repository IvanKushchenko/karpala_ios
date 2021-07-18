<template>
	<Page backgroundColor="#F5F5F5">
		
		<ActionBar class="action-bar" height="60" backgroundColor="#283593">
			<NavigationButton visibility="hidden" />
			<ActionItem>
                <Label class="fas" text.decode="&#xf0c9;" fontSize="24" color="#fff" @tap="onDrawerButtonTap"/>
            </ActionItem>
            <ActionItem v-if="auth" ios.position="right">
                <Label class="fas" text.decode="&#xf2f5;" fontSize="24" color="#fff" @tap="logout"/>
            </ActionItem>
		</ActionBar>
		<StackLayout class="container">
			<ActivityIndicator v-if="loading" busy="true"/>
			<ScrollView v-else>
				<FlexboxLayout v-if="!auth">
					<Label text="Авторизуйтесь" />
				</FlexboxLayout>
				<FlexboxLayout v-else class="page__content" flexDirection="column">
					
			            <OrderItem v-for="order in orders" :key="order.id" :order="order"/>
					
		        </FlexboxLayout>
	       	</ScrollView>
		</StackLayout>	
	</Page>
</template>

<script>
import { mapState } from 'vuex';
import * as utils from "~/shared/utils";
import OrderItem from '../components/OrderItem.vue';
export default {

	name: 'Orders',
	components: {
		OrderItem
	},
	data() {
		return {
			loading: false,
			orders: [],
			counter: 1,
			allResults: false,
		}
	},
	methods: {
		logout(){
			this.$store.dispatch('logout');
		},
		onDrawerButtonTap() {
			utils.showDrawer();
		},
		async getOrders() {
			if (this.allResults)
				return false

			const result = await this.$axios({
				method: 'get',
				params: {
					page: this.counter
				},
				url: '/api/orders/getOrders',
			});

			if (result.data.success) {
				if (this.counter <= result.data.orders.total_pages) {
					this.counter++;
					this.orders = this.orders.concat(result.data.orders.items);
				}

				this.allResults = true;
			}
		},
	},
	computed: {
		...mapState({
			user: state => state.user
		}),
		auth(){
			return !!this.user;
		}
	},
	mounted(){
		this.getOrders();
	}
}
</script>

<style lang="scss" scoped>
	.container{
		padding: 0 8;
	}
</style>