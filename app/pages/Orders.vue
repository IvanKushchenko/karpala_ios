<template>
	<Page backgroundColor="#F5F5F5">
		<ActionBar class="action-bar" height="60" backgroundColor="#283593">
			<NavigationButton visibility="hidden" />
			<ActionItem>
                <Label class="fas" text.decode="&#xf0c9;" fontSize="24" color="#fff" @tap="onDrawerButtonTap"/>
            </ActionItem>
            <!-- <ActionItem ios.position="right">
                <Label class="fas" text.decode="&#xf2f5;" fontSize="24" color="#fff" @tap="logout"/>
            </ActionItem> -->
            <ActionItem v-if="auth" ios.position="right">
                <Label class="fas" text.decode="&#xf2f5;" fontSize="24" color="#fff" @tap="logout"/>
            </ActionItem>
		</ActionBar>
		<StackLayout class="container">
			<Button text="gettelegramlink" @tap="getTelegram" />
			<!-- <WebView src="tg://resolve?domain=karpalaBot&start=73565ea319ab5294240cff5695d1ae14" /> -->
			<!-- <WebView height="300" src="tg://resolve?domain=karpalaBot&start=73565ea319ab5294240cff5695d1ae14" /> -->
			<ActivityIndicator v-if="loading" busy="true"/>
			<ScrollView v-else>
				<StackLayout>
					<OrderItem v-for="order in orders" :key="order.id" :order="order"/>
				</StackLayout>
			    
	       	</ScrollView>
		</StackLayout>	
	</Page>
</template>

<script>
import { Utils } from '@nativescript/core';
import { mapState } from 'vuex';
import * as helpers from "~/shared/utils";
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
		async getTelegram(){
			try{
				let data = await Utils.openUrl('tg://resolve?domain=karpalaBot&start=73565ea319ab5294240cff5695d1ae14');
				console.log("data", data);
			} catch(error){
				console.error(error)
			}
			
			// tg://resolve?domain=karpalaBot&start=73565ea319ab5294240cff5695d1ae14
			
		},
		async getTelegramLink() {
			let result = await this.$axios({
				method: 'post',
				url: '/api/telegram/generateLinkToBot/',
			});
			console.dir(result.data);
			// if (result.data.success)
				// window.location.replace(result.data.link);
		},
		logout(){
			this.$store.dispatch('logout');
		},
		onDrawerButtonTap() {
			helpers.showDrawer();
		},
		async getOrders() {
			if (this.allResults) return false
			this.loading = true;

			try{
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
			} catch(error){
				console.error(error);
			} finally{
				this.loading = false;
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
	created(){
			// this.getTelegramLink();
		this.getOrders();
	}
}
</script>

<style lang="scss" scoped>
	.container{
		padding: 0 8;
	}
</style>