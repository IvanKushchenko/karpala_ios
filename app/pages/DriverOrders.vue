<template>
	<!-- <div class="container container_wide">
		<div v-if="mode === 'orders'" class="orders">
			<div id="accepted">
				<OrderItem
					v-for="(order, key) in accepted"
					:key=order.id
					:order=order
					@completeOrder=completeOrder
					@cancelOrder=cancelOrder
					@update=setOrders
				/>
			</div>
			<template v-if=hasSuggestedOrders>
				<div class="order-hr"><hr><b>Заказы ожидающие ответа</b></div>
				<div id="suggested">
					<OrderItem
						v-for="(order, key) in suggested"
						:key=order.id
						:order=order
						@completeOrder=completeOrder
						@cancelOrder=cancelOrder
						@update=setOrders
					/>
				</div>
			</template>
			<template v-if=hasRejectedOrders>
				<div class="order-hr"><hr><b>Отклоненные заявки</b></div>
				<div id="rejected">
					<OrderItem
						v-for="(order, key) in rejected"
						:key=order.id
						:order=order
						@completeOrder=completeOrder
						@cancelOrder=cancelOrder
						@update=setOrders
					/>
				</div>
			</template>
			<template v-if=hasDisabledOrders>
				<div class="order-hr"><hr><b>Был выбран исполнитель</b></div>
				<div id="disabled">
					<OrderItem
						v-for="(order, key) in disabled"
						:key=order.id
						:order=order
						@completeOrder=completeOrder
						@cancelOrder=cancelOrder
						@update=setOrders
					/>
				</div>
			</template>
		</div>
		<div v-else-if="mode === 'ordersInProgress'" class="orders">
			<OrderItem
				v-for="(order, key) in orders"
				:key=order.id
				:order=order
				@completeOrder=completeOrder
				@cancelOrder=cancelOrder
			/>
		</div>
		<div v-else-if="mode === 'detail'" class="orders">
			<OrderItem
				:order=orders[0]
				:isShowDetail="true"
				@completeOrder=completeOrder
				@cancelOrder=cancelOrder
			/>
		</div>
	</div> -->
</template>

<script>
// import OrderItem from '@/components/block/OrderItem.vue';

// export default {
// 	components: {
// 		OrderItem
// 	},
// 	data() {
// 		return {
// 			timerId: null,
// 			orders: [],
// 			waiting: false,
// 			allResults: false,
// 			counter: 1,
// 			suggested: [],
// 			accepted: [],
// 			rejected: [],
// 			disabled: [],
// 		};
// 	},
// 	computed: {
// 		mode() {
// 			if (this.$route.name === 'DriversOrdersInProgress')
// 				return 'ordersInProgress';
// 			else if (this.$route.name === 'DriverOrderDetail')
// 				return 'detail';
// 			else
// 				return 'orders';
// 		},
// 		hasSuggestedOrders() {
// 			return this.suggested && this.suggested.length;
// 		},
// 		hasRejectedOrders() {
// 			return this.rejected && this.rejected.length;
// 		},
// 		hasDisabledOrders() {
// 			return this.disabled && this.disabled.length;
// 		},
// 	},
// 	watch: {
// 		'$route.name' (value) {
// 			this.setOrders();
// 		},
// 	},
// 	async mounted() {
// 		await this.setOrders();
// 		this.setUpdateTimer();
// 	},
// 	beforeDestroy() {
// 		this.clearTimer();
// 	},
// 	methods: {
// 		setUpdateTimer() {
// 			this.timerId = setInterval(async() => {
// 				await this.setOrders();
// 			}, 1000 * 60);
// 		},
// 		clearTimer() {
// 			clearInterval(this.timerId);
// 			this.timerId = null;
// 		},
// 		async setOrders() {
// 			if (this.mode === 'ordersInProgress')
// 				this.orders = await this.getOrders();
// 			else if (this.mode === 'detail')
// 				await this.getOrderDetail(this.$route.params.id);
// 			else
// 				await this.getSuggestedOrders();
// 		},
// 		async getOrders() {
// 			const result = await this.$store.dispatch('getOrders');

// 			if (result.success)
// 				return result.orders;

// 			return [];
// 		},
// 		async getSuggestedOrders() {
// 			const result = await this.$store.dispatch('getSuggestedOrders');

// 			if (result.success) {
// 				this.suggested = result.data.suggested;
// 				this.accepted = result.data.accepted;
// 				this.rejected = result.data.rejected;
// 				this.disabled = result.data.disabled;
// 			} else {
// 				this.suggested = [];
// 				this.accepted = [];
// 				this.rejected = [];
// 				this.disabled = [];
// 			}
// 		},
// 		async getOrderDetail(orderId) {
// 			const order = await this.getOrderById(orderId);
// 			if (order) {
// 				order.showDetail = true;
// 				this.orders = [order];
// 			}
// 		},
// 		async getOrderById(orderId) {
// 			const qs = require('qs');
// 			const result = await this.$axios({
// 				url: '/api/orders/getDriverOrder/',
// 				method: 'post',
// 				data: qs.stringify({
// 					orderId
// 				}),
// 			});

// 			if (result.data.success)
// 				return result.data.order;
// 			else
// 				this.$router.go(-1);
// 		},
// 		goToRoute(path) {
// 			this.$router.push(path);
// 		},
// 		async goToInProgress() {
// 			if (this.$route.path === '/driver-orders/in-progress')
// 				await this.setOrders();
// 			else
// 				this.goToRoute('/driver-orders/in-progress');
// 		},
// 		completeOrder() {
// 			this.goToInProgress();
// 		},
// 		async cancelOrder() {
// 			await this.setOrders();
// 		},
// 	},
// };
</script>

<style lang="scss">
	.order-hr
	{
		margin: 10px;
		text-align: center;
		hr
		{
			margin-bottom: 10px;
		}
	}
</style>
