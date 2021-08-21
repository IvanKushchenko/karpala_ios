<template>
	<div class="container container_wide">
		<transition-group name="zoom-list">
			<div v-if="!$store.state.user.telegram_id" key="myOrders1">
				<div class="noTelegramgNameBlock">
					<h2 class="h2"></h2>
					<div class="text">
						К сожалению, на вашем аккаунте не активирован бот в Телеграм, чтобы ативировать - нажмите <span style="font-size: 16px;" @click="getTelegramLink()" class="link link_green">СЮДА</span>
						<br>
						<br>
						Если не знаете, как активировать бота в Телеграме, нажмите <span style="font-size: 16px;" class="link link_green" @click="getLinkToManager()">СЮДА</span> и мы вышлем инструкцию.
						<br>
						<br>
						<button class="button button_disabled">ДОБАВИТЬ НОВЫЙ ЗАКАЗ</button>
					</div>
				</div>
			</div>
			<div v-else-if="!this.$store.state.user.tariff" key="myOrders3">
				<div class="container">
					<div class="noTelegramgNameBlock">
						<h2 class="h2">Выберите тариф</h2>
						<div class="text">
							К сожалению у вас не выбран тариф, чтобы выбрать перейдите в <router-link style="font-size: 16px;" to="/personal" class="link link_green">Личный кабинет</router-link>
							<br>
							<br>
							<button class="button button_disabled">ДОБАВИТЬ НОВЫЙ ЗАКАЗ</button>
						</div>
					</div>
				</div>
			</div>
			<div v-else class="orders" key="myOrders3">
				<transition-group name="list-remove">
					<OrderItem class="list-remove-item" @remove="removeOrder" v-for="(order, key) in orders" :key="order.id" :order="order" orderType="myPreOrders"/>
					<div class="button orders__button" key="last" @click="newOrder();">
						ДОБАВИТЬ ПРЕДЗАКАЗ
					</div>
				</transition-group>
			</div>
	</transition-group>
	</div>
</template>

<script>

import OrderItem from '@/components/block/OrderItem.vue'

export default
{
	/**
	** return data
	*/
	data: function()
	{
		return {
			orders:[]
		}
	},
	methods:
	{
		/**
		** get User preOrders
		**/
		async getOrders()
		{
			var result = await this.$axios({
				method: 'post',
				url: '/api/preorders/getUserPreOrders',
			});

			if(result.data.success)
			{
				for(var index in result.data.preorders)
				{
					var autosString = []

					for(var autoIndex in result.data.preorders[index].autos)
					{
						autosString.push(result.data.preorders[index].autos[autoIndex].class_name)
					}

					autosString = autosString.join(', ')
					result.data.preorders[index].autosString = autosString
				}

				this.orders = result.data.preorders
			}
		},

		/**
		** if there is telegram name go to page. else show error
		**/
		newOrder()
		{
			if(this.$store.state.user && this.$store.state.user.telegram_id)
				this.$router.push('preorders/new')
		},

		/**
		** send emit for remove
		**/
		async removeOrder(id)
		{
			const qs = require('qs');

			let data = qs.stringify({
				preOrderId : id
			});

			let result = await this.$axios({
				data: data,
				method: 'post',
				url: '/api/preorders/deletePreOrder',
			});

			if(!result.data.success)
				return false

			for(var index in this.orders)
			{
				if (id == this.orders[index].id)
					this.orders.splice(index, 1);
			}
		},
		/**
		** get Link To Telegram
		**/
		async getTelegramLink()
		{
			let result = await this.$axios({
				method: 'post',
				url: '/api/telegram/generateLinkToBot/',
			});

			if(result.data.success)
				window.location.replace(result.data.link,'_blank');
		},

		/**
		** get Link To Manager
		**/
		async getLinkToManager()
		{
			const link = await this.$axios({
				method : 'post',
				url    : '/api/auth/generateLinkToManager',
			});

			if(link.data.success)
				window.location.replace(link.data.link,'_blank');
		},
	},
	components:
	{
		OrderItem
	},
	/**
	** mounted add arow
	*/
	created:function()
	{
		this.getOrders()
		this.$store.state.pageTitle = 'Куплю';
		this.$store.state.nestedPage = false;
	},
}
</script>
<style lang="scss">
.orders
{
	padding-bottom: 30px;
}
.orders__button
{
	transition: all .5s;
}
.noTelegramgNameBlock
{
	max-width: 552px;
	margin: 0 auto;
}
</style>
