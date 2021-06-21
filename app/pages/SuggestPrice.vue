<template>
	<Page class="suggest-price">
		<ActionBar class="action-bar" title="Предложение цены" color="#fff" height="60" backgroundColor="#283593">
			<NavigationButton color="#fff" @tap="onDrawerButtonTap" />
	    </ActionBar>
		<FlexboxLayout flexDirection="column" alignItems="center" justifyContent="center" height="100%" width="100%">
			<FlexboxLayout flexDirection="column" alignItems="flex-start">
				
				<FlexboxLayout flexDirection="column" alignItems="flex-start" padding="0 30" marginBottom="30">
					<Label class="suggest-price__date" fontWeight="bold">{{travelDate}}</Label>
					<FlexboxLayout class="suggest-price__from" alignItems="center">
						<Label class="fas" color="#00C853" text.decode="&#xf3c5;" marginRight="5"/>
						<Label :text="order.from_city_str" />
					</FlexboxLayout>
					<FlexboxLayout class="suggest-price__to" alignItems="center">
						<Label class="fas" color="#304FFE" text.decode="&#xf3c5;" marginRight="5"/>
						<Label :text="order.to_city_str" />
					</FlexboxLayout>
					<FlexboxLayout v-if="order.destination_info" class="suggest-price__meta mt-2 caption" flexDirection="column">
						<Label v-if="travelTime" :text="`Время в пути: ${order.destination_info.time}`"  />
						<Label v-if="distance" :text="`Расстояние: ${order.destination_info.distance}`" />
						<Label v-if="averageTariff" :text="`Средний тариф: ${averageTariff}`" /> 
					</FlexboxLayout>
					<FlexboxLayout v-if="order.suggestion_statistic" class="mt-4 caption" flexDirection="column">
						<Label v-if="order.suggestion_statistic.count" class="mb-2 suggest-price__info" fontWeight="bold" :text="`Сделано предложений: ${order.suggestion_statistic.count}`" />
						<Label v-if="order.suggestion_statistic.min" class="suggest-price__info suggest-price__money" :text="`Минимальная цена: ${order.suggestion_statistic.min}`" />
					</FlexboxLayout>
				</FlexboxLayout>
				
				<FlexboxLayout class="suggest-price__footer" flexDirection="column" justifyContent="center" alignItems="center" width="100%" padding="0 30">
					<!-- <Label v-if="actionsTitle" class="headline text-xs-center font-weight-bold mb-2" :title="actionsTitle" /> -->
					<Label fontSize="24" class="font-weight-bold mb-2 text-center" text="Цена для клиента" />
					<FlexboxLayout width="100%" maxWidth="300" class="suggest-price__actions mb-2" justifyContent="center" alignItems="center">
						<Button borderWidth="1" borderColor="#31CB87" class="suggest-price__action suggest-price__action_down font-weight-bold" text="-50" @tap="priceDown" />
						<Label class="suggest-price__price-result" :text="`${price} ₽`" />
						<Button borderWidth="1" borderColor="#283593" class="suggest-price__action suggest-price__action_up font-weight-bold" text="+50" @tap="priceUp" />
					</FlexboxLayout>
					<FlexboxLayout width="100%" justifyContent="center">
						<Button
							v-if="!isOwner && price === defaultPrice"
							class="suggest-price__action suggest-price__action_suggest-price font-weight-bold"
							@tap="startTakeOrder"
							width="300"
							text="Взять заказ"
						/>
						<Button
							v-else
							:disabled="!canAccept"
							round
							dark
							flat
							width="300"
							@tap="showSuggestPriceDrivers"
							class="suggest-price__action suggest-price__action_suggest-price font-weight-bold"
							:text="suggestPriceBtnText"
						/>
					</FlexboxLayout>
				</FlexboxLayout>

			</FlexboxLayout>
		</FlexboxLayout>
	</Page>
</template>

<script>
import Orders from '@/pages/Orders';
import SuggestPriceDrivers from '@/pages/SuggestPriceDrivers';

export default {

	name: 'SuggestPrice',
	props: {
		showActionCancelOrder: {
			type: Boolean,
			default: false
		},
		actionsTitle: {
			type: String,
			default: null
		},
		travelTime: {
			type: String,
			default: null
		},
		distance: {
			type: String,
			default: null
		},
		averageTariff: {
			type: String,
			default: null
		},
		suggestPriceBtnText: {
			type: String,
			default: 'Предложить цену'
		},
		order: {
			type: Object,
			default: () => ({}),
		},
		isDefaultMinimum: {
			type: Boolean,
			default: false,
		},
		isDefaultMaximum: {
			type: Boolean,
			default: false,
		},
		isOwner: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			pages: {
				Orders,
				SuggestPriceDrivers
			},
			price: 1000,
			defaultPrice: 1000,
		}
	},
	computed: {
		travelDate() {
			const monthes = month => ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][month - 1];

			if (!this.order.date) return '';

			const month = +this.order.date.match(/\.(\d*)\./)[1];
			const day = +this.order.date.match(/^\d*/);
			return `${day} ${monthes(month)} ${this.order.time}`;
		},
		canAccept() {
			return this.price !== +this.order.old_price && this.price !== +this.order.price;
		},
	},
	methods: {
		showSuggestPriceDrivers(statistic) {
			this.$navigateTo(this.pages.SuggestPriceDrivers, {
				props: {
					suggestedStatisticProp: statistic
				}
			});
		},
		async suggestPrice(price) {
			if (price === +this.order.price)
				return;

			const result = await this.$store.dispatch('createSuggestionToOrder', {
				orderId: this.order.id,
				price
			});

			if (result.data.success) {
				this.$navigateTo(this.pages.Orders);
				this.showSuggestPriceDrivers(result.data.suggested);
			} else {
				this.$navigateTo(this.pages.Orders);
				if (result.data.code === 'no_money')
					confirm({
						title: "Недостаточно средств!",
						message: "На вашем счете недостаточно средств! Пополните счет, чтобы взять заказ",
						okButtonText: "Пополнить",
						cancelButtonText: "Отмена"
					}).then(result => {
						this.goToPayment();
					});
				else if (result.data.code === 'no_user')
					alert({title: "Ошибка", message: 'Пользователя не существует', okButtonText: "Хорошо"})
				else if (result.data.code === 'no_driver_profile')
					alert({title: "Ошибка", message: 'Войдите или зарегистрируйтесь', okButtonText: "Хорошо"})
				else
					alert({title: "Ошибка", message: 'Что-то пошло не так', okButtonText: "Хорошо"})
			}
		},
		debitePrice(){
			confirm({
				title: "",
				message: `C Вашего счета будет списано ${ this.transitionPriceInSuggest } рублей.`,
				okButtonText: "Хорошо",
				cancelButtonText: "Отмена"
			}).then(result => {
				if(result){
					this.takeOrder();
				}
			});
		},
		async takeSuggestedOrder() {
			const result = await this.$store.dispatch('takeSuggestedOrder', {
				orderId: this.order.id
			});

			await this.$store.dispatch('getUser');
			if (result.data.success) this.toDetail();
		},
		toDetail() {
			console.log("go to toDetail");
			// this.$router.push({
			// 	name: 'DriverOrderDetail',
			// 	params: {
			// 		id: this.order.id,
			// 	},
			// });
		},
		goToPayment(){
			console.log("goToPayment");
			// this.$navigateTo(PagePayment);
		},
		async takeOrder() {
			if (this.order.is_suggestion) {
				await this.takeSuggestedOrder();
				return;
			}

			const result = await this.$store.dispatch('takeOrder', {
				orderId: this.order.id
			});

			if (!result.data.success) {
				if (result.data.code === 'no_money')
					
					confirm({
						title: "Недостаточно средств!",
						message: "На вашем счете недостаточно средств! Пополните счет, чтобы взять заказ",
						okButtonText: "Пополнить",
						cancelButtonText: "Отмена"
					}).then(result => {
						this.goToPayment();
					});

				else if (result.data.code === 'no_user')
					alert({title: "Ошибка", message: 'Пользователя не существует', okButtonText: "Хорошо"})
				else if (result.data.code === 'no_driver_profile')
					alert({title: "Ошибка", message: 'Войдите или зарегистрируйтесь', okButtonText: "Хорошо"})
				else
					alert({title: "Ошибка", message: 'Что-то пошло не так', okButtonText: "Хорошо"})

				return false;
			}

			await this.$store.dispatch('getUser');
			this.toDetail();
		},
		startTakeOrder() {
			// if (!this.$store.state.user) {
			// 	alert({title: "Ошибка", message: 'Войдите или зарегистрируйтесь', okButtonText: "Хорошо"})
			// 	return;
			// }
			this.debitePrice();
		},
		onCancelButtonTap() {
	        this.$navigateBack();
	    },
		priceUp() {
			const resultPrice = this.price + 50;
			if (this.isDefaultMaximum && resultPrice > this.initialPrice) return;

			this.price = resultPrice;
		},
		priceDown() {
			const resultPrice = this.price - 50;
			if (this.isDefaultMinimum && resultPrice < this.defaultPrice) return;

			if (resultPrice > 0)
				this.price = resultPrice;
			else
				this.price = 50;
		},
	}
}
</script>

<style lang="scss" scoped>
	.suggest-price {
		position: relative;

		&__price-result{
			font-size: 27px;
		}

		&__date {
			font-size: 18px;
		}

		&__from, &__to {
			font-size: 18px;
			display: flex;
			align-items: center;
		}

		&__money{
			color: #00C853;
			font-weight: bold;
		}

		&__action{
			font-size: 16px;

			&_suggest-price{
				text-transform: initial;
				background: #31CB87;
				border-radius: 45px;
				color: #fff;
				height: 40px;
				font-size: 16px;
			}

			&_cancel-order{
				color: red;
				position: absolute;
				right: -20px;
				top: -10px;
				line-height: 18px;
				margin: 0;
				height: auto;
				text-transform: initial;
			}

			&_down,
			&_up{
				width: 60px;
				height: 30px;
				font-size: 24px;
				line-height: 28px;
				border-radius: 35px;
			}

		}
	}
</style>