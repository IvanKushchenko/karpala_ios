<template>
	<Page backgroundColor="#F5F5F5">
		<ActionBar class="action-bar" height="60" backgroundColor="#283593">
			<ActionItem @tap="onCancelButtonTap" ios.position="left">
                <Label class="fas" text.decode="&#xf0c9;" color="#fff" @tap="onDrawerButtonTap"/>
            </ActionItem>
		</ActionBar>
		<StackLayout class="container">
			<ScrollView>
				<FlexboxLayout class="page__content" flexDirection="column">
					
			            <OrderItem v-for="order in orders" :key="order.id" :order="order"/>
					
		        </FlexboxLayout>
	       	</ScrollView>
		</StackLayout>	
	</Page>
</template>

<script>
import * as utils from "~/shared/utils";
import OrderItem from '../components/OrderItem.vue';
export default {

	name: 'Orders',
	components: {
		OrderItem
	},
	data() {
		return {
			orders: [],
			counter: 1,
			allResults: false,
		}
	},
	methods: {
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