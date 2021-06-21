<template>
	<StackLayout class="order-item"
				:class="{
					'order-item_detail-info': isShowDetailInfo,
					'order-item--disabled': order.status_code === 'rejected',
				}">
		
		<FlexboxLayout v-if="!isShowDetailInfo || getAcceptTime()" justifyContent="space-between">
			<Label v-if="!isShowDetailInfo" class="order-item__title" :text="order.title" />
			<FlexboxLayout v-if="getAcceptTime()" flexDirection="column" alignItems="center" marginRight="20">
				<Label class="order-item__attention">
					<FormattedString>
				        <Span class="fas" fontSize="24" color="#ffdd15" text.decode="&#xf071;" textWrap="true"/>
				    </FormattedString>
				</Label>
				<Label class="order-item__attention">
					<FormattedString>
				        <Span :text="getAcceptTime()" color="#000" textWrap="false" />
				    </FormattedString>
				</Label>
			</FlexboxLayout>
		</FlexboxLayout>

		<template v-if="isShowDetailInfo">
			<FlexboxLayout v-if="detailInfoItem.value" v-for="(detailInfoItem, detailInfoIndex) in detailInfoValue" :key="`detail-info-${detailInfoIndex}`">
				<Label :text="detailInfoItem.title" /> : <Label :text="detailInfoItem.value" />
			</FlexboxLayout>
		</template>
		<template v-else>
			<GridLayout columns="*, *" rows="auto, auto">
				<FlexboxLayout col="0" row="0" class="order-item__info-item order-item__info-item_date" flexDirection="column">
					<Label text="Когда" />
					<FlexboxLayout class="order-item__info-item-value" :class="{' order-item__info-item-value_red': order.isNow}">
						<Label v-if="order.isNow" text="Сейчас" />
						<Label v-else :text="`${order.date} ${order.time}`" />
					</FlexboxLayout>
				</FlexboxLayout>

				<FlexboxLayout col="1" row="0" v-if="orderType != 'myPreOrders'" class="order-item__info-item order-item__info-item_money" flexDirection="column">
					<Label :text="isSuggestPrice ? 'Общая' : 'Заработок'" class="order-item__info-item-title"/>
					<FlexboxLayout class="order-item__info-item-value">
						<Label :text="moneyFormat(order.price)" class="order-item__info-item-value order-item__info-item-value_money" />
					</FlexboxLayout>
				</FlexboxLayout>

				<FlexboxLayout row="1" col="0" v-if="orderType == 'myPreOrders'" class="order-item__info-item order-item__info-item_money order-item__info-item_timeRange" flexDirection="column">
					<Label text="Период времени" class="order-item__info-item-title"/>
					<FlexboxLayout class="order-item__info-item-value">
						<Label :text="`${order.time_start} ${order.time_end}`" class="order-item__info-item-value" />
					</FlexboxLayout>
				</FlexboxLayout>
				
				<FlexboxLayout row="1" col="0" class="order-item__info-item order-item__info-item_tarrif" 
								:class="{'order-item__info-item_tarrif-prorder': orderType == 'myPreOrders'}" 
								flexDirection="column" justifyContent="flex-start">
					<Label text="Тариф" class="order-item__info-item-title"/>
					<FlexboxLayout class="order-item__info-item-value">
						<Label v-if="order.tariff && order.tariff.name" :text="order.tariff.name"/>
						<Label v-else-if="order.tariff" :text="order.tariff"/>
						<Label v-else-if="orderType != 'myPreOrders'" :text="order.auto.class_name"/>
						<Label v-else-if="orderType == 'myPreOrders'" :text="order.autosString"/>
					</FlexboxLayout>
				</FlexboxLayout>

				<FlexboxLayout row="1" col="1" v-if="orderType != 'myPreOrders'" class="order-item__info-item order-item__info-item_comment" flexDirection="column">
					<Label text="Комментарий" class="order-item__info-item-title"/>
					<Label class="order-item__info-item-value" :text="order.comment"/>
				</FlexboxLayout>
			</GridLayout>
		</template>
		<Label class="hr m-y-5"/>
		<FlexboxLayout class="order-item__content">
			<FlexboxLayout v-if="isSuggestPrice" class="order-item__controls-wr _suggest-controls">
				<GridLayout v-if="!isInPersonal" columns="*, *" rows="*" class="order-item__contacts">
					<Button @tap="startTakeOrder" col="0" row="0" margin="0" textTransform="uppercase" fontWeight="bold" height="25" textAlignment="left">
						<FormattedString >
					        <Span text="Взять заказ" color="#304FFE" textWrap="false" />
					        <Span text="  "/>
					        <Span class="fas" fontSize="24" color="#304FFE" text.decode="&#xf2b5;"/>
					    </FormattedString>
					</Button>
					<Button @tap="startSuggestPrice" col="1" row="0" margin="0" text="Предложить цену" height="25" textTransform="uppercase" color="#304ffe" textAlignment="left"/>
				</GridLayout>

				<GridLayout v-else-if="order.status_code === 'suggested' || order.status_code === 'rejected' || order.status_code === 'disabled'" class="order-item__controls" columns="*, *" rows="*" >
					<Button @tap="cancelSuggestedPrice" col="0" row="0" margin="0" textTransform="uppercase" fontWeight="bold" height="25" textAlignment="left" class="order-item__cancel">
						<FormattedString >
					        <Span class="far" fontSize="24" color="#F44336" text.decode="&#xf057;"/>
					        <Span text="  "/>
					        <Span text="Отозвать" color="#F44336" textWrap="false" />
					    </FormattedString>
					</Button>
					<Button v-if="order.status_code === 'suggested' || order.status_code === 'rejected'" 
							col="1" row="0" margin="0"
							@tap="startSuggestPrice"
							textTransform="uppercase" 
							fontWeight="bold" 
							height="25" textAlignment="left" class=" order-item__change-price">
						<FormattedString >
					        <Span class="fas" fontSize="24" color="#304FFE" text.decode="&#xf058;"/>
					        <Span text="  "/>
					        <Span text="Изменить цену" color="#304FFE" textWrap="false" />
					    </FormattedString>
					</Button>
				</GridLayout>
				

				<GridLayout v-else class="order-item__controls" columns="*, *, *" rows="*" >
					<Button v-if="order.status_code === 'in_progress' || order.status_code === 'accepted'" 
							col="0" row="0" margin="0" 
							textTransform="uppercase" 
							fontWeight="bold" 
							@tap="askCancelOrder"
							height="25" textAlignment="left" class="order-item__cancel">
						<FormattedString >
					        <Span class="far" fontSize="18" color="#F44336" text.decode="&#xf057;"/>
					        <Span text="  "/>
					        <Span text="Отменить" fontSize="13" color="#F44336" textWrap="false" />
					    </FormattedString>
					</Button>
					<Button v-if="order.status_code === 'in_progress'" 
							col="1" row="0" margin="0" 
							textTransform="uppercase" 
							fontWeight="bold" 
							@tap="completeOrder"
							height="25" textAlignment="left" class="order-item__done">
						<FormattedString >
					        <Span class="fas" fontSize="18" color="#304FFE" text.decode="&#xf058;"/>
					        <Span text="  "/>
					        <Span text="Завершить" fontSize="13" color="#304FFE" textWrap="false" />
					    </FormattedString>
					</Button>
					<Button v-if="!isShowDetailInfo && order.status_code === 'in_progress'"
							col="2" row="0" margin="0" 
							textTransform="uppercase" 
							fontWeight="bold" 
							@tap="toDetail"
							height="25" textAlignment="left" class="order-item__details">
						<FormattedString >
					        <Span class="fas" fontSize="18" color="#00C853" text.decode="&#xf0c9;"/>
					        <Span text="  "/>
					        <Span text="Детали" fontSize="13" color="#00C853" textWrap="false" />
					    </FormattedString>
					</Button>
					<Button v-if="order.status_code === 'accepted'"
							col="1" row="0" margin="0" 
							textTransform="uppercase" 
							fontWeight="bold" 
							@tap="tryTakeSuggestedOrder"
							height="25" textAlignment="left" class="order-item__accept">
						<FormattedString >
					        <Span class="fas" fontSize="18" color="#304FFE" text.decode="&#xf058;"/>
					        <Span text="  "/>
					        <Span text="Принять!" fontSize="13" color="#304FFE" textWrap="false" />
					    </FormattedString>
					</Button>
				</GridLayout>
				
			</FlexboxLayout>
			<FlexboxLayout v-else class="order-item__controls-wr _common-controls">

				<GridLayout class="order-item__controls" columns="*, *" rows="*" >
					<Button col="0" row="0" margin="0" 
							textTransform="uppercase"
							@tap="dispatcherClick"
							fontWeight="bold" 
							height="25" textAlignment="left" class="order-item__edit">
						<FormattedString >
					        <Span class="fas" fontSize="24" color="#304FFE" text.decode="&#xf086;"/>
					        <Span text="  "/>
					        <Span text="К ДИСПЕТЧЕРУ" color="#304FFE" textWrap="false" />
					    </FormattedString>
					</Button>
				</GridLayout>

			</FlexboxLayout>
		</FlexboxLayout>
	</StackLayout>
</template>

<script>
import showPopup from '../mixins/showPopup.js';
import moneyFormat from '../mixins/moneyFormat.js';
import PagePayment from '@/pages/Payment';
import SuggestPrice from '@/pages/SuggestPrice';

export default {
	props: {
		order: Object
	},
	mixins: [moneyFormat, showPopup],
	data() {
		return {
			pages: {
				PagePayment,
				SuggestPrice,
			},
			isShowDetailInfo: false,
			detailInfo: {
				id: {
					title: 'Номер заказа',
					value: '',
				},
				from_city_str: {
					title: 'Откуда',
					value: '',
				},
				from_address: {
					title: 'Адрес откуда',
					value: '',
				},
				to_city_str: {
					title: 'Куда',
					value: '',
				},
				to_address: {
					title: 'Адрес куда',
					value: '',
				},
				date: {
					title: 'Дата и время',
					value: '',
				},
				adults: {
					title: 'Взрослые',
					value: '',
				},
				kids: {
					title: 'Дети',
					value: '',
				},
				client_name: {
					title: 'Имя',
					value: '',
				},
				client_phone: {
					title: 'Телефон',
					value: '',
					link: '',
				},
				tariff_name: {
					title: 'Тариф',
					value: '',
				},
				price: {
					title: 'Цена',
					value: '',
				},
				transition_price: {
					title: 'Комиссия',
					value: '',
				},
				meet_with_sign: {
					title: 'Встречать с табличкой',
					value: '',
				},
				payment_type: {
					title: 'Форма оплаты',
					value: '',
				},
			},
			paymentTypes: {
				cash: 'Наличные',
				card: 'Карта',
			},
			refusalReasons: [
				{
					label: 'Клиент отказался',
					value: 'client_refused',
				},
				{
					label: 'Изменилось время',
					value: 'time_changed',
				},
				{
					label: 'У меня не получается',
					value: 'driver_refused',
				},
			],
			refusalReason: 'client_refused',
		};
	},
	computed: {
		isInPersonal() {
			return !+this.order.is_active;
		},
		transitionPriceInSuggest() {
			return Math.floor(this.order.price * 0.2);
		},
		detailInfoValue() {
			this.detailInfo['payment_type'].value = this.paymentTypes[this.detailInfo['payment_type'].value] ? this.paymentTypes[this.detailInfo['payment_type'].value] : '';
			this.detailInfo['meet_with_sign'].value = +this.detailInfo['meet_with_sign'].value ? 'Да' : 'Нет';
			this.detailInfo['transition_price'].value = this.moneyFormat(this.transitionPriceInSuggest);
			this.detailInfo['client_phone'].link = `tel:${this.detailInfo['client_phone'].value}`;
			return this.detailInfo;
		},
	},
	methods: {
		tryTakeSuggestedOrder() {
			this.debitePrice();
		},
		goToPayment(){
			console.log("goToPayment");
			// this.$navigateTo(PagePayment);
		},
		dispatcherClick() {
			if (!this.$store.state.user) {
				confirm({
					title: "Авторизуйтесь",
					message: "Для того чтобы перейти в чат к продавцу, вам необходимо войти в свою учётную запись.",
					okButtonText: "Войти",
					cancelButtonText: "Отмена"
				}).then(result => {
					console.log(result);
				});
			}
			// if (!this.$store.state.user) {
			// 	// $refs['needAuth'].show = true
			// } else {
			// 	if (!this.$store.state.user.tariff) {
			// 		this.openPopup('noTarrif');
			// 		return
			// 	}
			// 	if (this.links)
			// 		this.collapsed = !this.collapsed
			// 	else {
			// 		if (!fromPopup && !this.order.seen && this.transitionPrice > 0) {
			// 			this.openPopup('chatTransition');
			// 			return
			// 		}
			// 		var result = await this.getLinks();
			// 		if (result.data.success) {
			// 			if (!this.order.seen)
			// 				this.$store.state.user.balance = +this.$store.state.user.balance - this.transitionPrice;
			// 			this.order.seen = true;
			// 			this.collapsed = !this.collapsed;
			// 			this.links = result.data.links;
			// 			return
			// 		} else {
			// 			if (result.data.code == '1') {
			// 				this.balanceText = result.data.message;
			// 				this.openPopup('balanceError');
			// 				return
			// 			}
			// 			this.somethingWrongText = result.data.message;
			// 			this.openPopup('somethingWrong');
			// 		}
			// 	}
			// }
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
		async takeSuggestedOrder() {
			const result = await this.$store.dispatch('takeSuggestedOrder', {
				orderId: this.order.id
			});

			await this.$store.dispatch('getUser');
			if (result.data.success) this.toDetail();
		},
		getAcceptTime() {
			return this.timeLast;
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
		async completeOrder() {
			const result = await this.$store.dispatch('completeOrder', {
				orderId: this.order.id
			});
			this.$emit('completeOrder', result.data.success);
		},
		goToInProgressOrders(){
			console.log("goToInProgressOrders");
			// this.$navigateTo();
			// this.$router.push('/driver-orders/in-progress');
		},
		async cancelOrder()
		{
			let result = await this.$store.dispatch('cancelOrder', {
				reason: this.refusalReason,
				orderId: this.order.id,
			});
			this.$emit('cancelOrder', result.data.success);
			if (result.data.success && (result.data.reason === 'client_refused' || result.data.reason === 'time_changed'))
				alert({
					title: 'Заказ отменен',
					message: 'Заказ отменен, после проверки деньги будут возвращены Вам на счет. Обычно это занимает 10-15 минут, в крайних случаях время возврата средств может занимать до 24 часов',
					okButtonText: "Хорошо" 
				}).then(result => {
					this.goToInProgressOrders()
				})
		},
		askCancelOrder() {
			if (this.order.status_code === 'accepted'){

				confirm({
					title: "",
					message: "Вы уверены, что хотите отменить предложение?",
					okButtonText: "Да",
					cancelButtonText: "Отмена"
				}).then(result => {
					if(result) {
						this.cancelSuggestedPrice();
					}
				});

			} else{
				action("Причина отмены заказа?", "Отмена", this.refusalReasons.map(item => item.label))
					.then(result => {
						this.refusalReason = this.refusalReasons.find(item => item.label == result);
						this.refusalReason = this.refusalReason.value;
						this.cancelOrder();
					});

			}
		},
		async cancelSuggestedPrice() {
			const result = await this.$store.dispatch('cancelSuggestion', {
				orderId: this.order.id
			});

			if (!result.data.success)
				this.showError(result.data.msg || 'Что-то пошло не так');
			else
				this.$emit('update');
		},
		startTakeOrder() {
			// if (!this.$store.state.user) {
			// 	alert({title: "Ошибка", message: 'Войдите или зарегистрируйтесь', okButtonText: "Хорошо"})
			// 	return;
			// }
			this.debitePrice();
		},
		startSuggestPrice() {
			// if (!this.$store.state.user) {
			// 	alert({title: "Ошибка", message: 'Войдите или зарегистрируйтесь'})
			// 	return;
			// }
			this.$navigateTo(this.pages.SuggestPrice, {
				props: {
				    actionsTitle: "Цена для клиента",
					suggestPriceBtnText: "Предложить цену",
					travelTime: "1 час 30 минут  (без учета пробок)",
					distance: "97 км",
					order: this.order,
					isDefaultMinimum: true,
					isDefaultMaximum: this.isDefaultMaximum
				}
			})
			// this.openPopup('suggestPrice');
		},
		setDetailInfo() {
			if (!this.detailInfo || !this.order)
				return;

			for (let key in this.detailInfo)
				if (this.order[key] !== undefined) this.detailInfo[key].value = this.order[key];
		},
	},
	mounted(){
		this.setDetailInfo();
	}
};
</script>

<style lang="scss">
	
	@import "@/assets/resources.scss";
	
	.order-item
	{
		position: relative;
		width: 100%;
		max-width: 816px;
		background-color: #fff;
		padding: 22px 31px 29px 24px;
		box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12);
		border-radius: 2px;
		margin-bottom: 20px;
		&--disabled { background-color: #d3d3d3; }
	}
	.order-item__cancel{
		color: $red;
		font-size: 13px;
		margin-bottom: 10px;
	}
	.order-item__accept,
	.order-item__details{
		color: $green;
		fill: $green;
		font-size: 13px;
	}
	.order-item__change-price,
	.order-item__done{
		color: $lightBlue;
		fill: $lightBlue;
		font-size: 13px;
	}
	.order-item__done{
		margin-bottom: 10px;
	}
	// .order-item__attention{
	// 	position: absolute;
	// 	right: 20px;
	// 	top: 22px;
	// 	font-size: 12px;
	// 	flex-direction: column;
	// }
	.order-item__title
	{
		width: 100%;
		font-size: 24px;
		color: #000;
		margin-bottom: 10px;
	}
	.order-item__content
	{
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.order-item_detail-info &{
			flex-direction: column;
		}
	}
	.order-item__info
	{
		display: flex;
		flex: 1;
		.order-item_detail-info &{
			flex-direction: column;
		}
	}
	.order-item__contacts-title
	{
		text-transform: uppercase;
		display: flex;
		align-items: center;
		margin-bottom: 5px;
		letter-spacing: 0.4px;
		svg
		{
			fill: $lightBlue;
			margin-right: 10px;
		}
	}
	.order-item__contacts
	{
		// width: 140px;
		// min-height: 58px;
		// margin-left: 30px;
		flex-shrink: 0;
		color: $lightBlue;
		font-family: $medium;
		font-size: 13px;
		cursor: pointer;
		// display: flex;
		// flex-direction: column;
		// justify-content: center;
		// align-items: baseline;
		&_collapsed
		{
			.order-item__contacts-title
			{
				color: #747474;
			}
			svg
			{
				fill: #747474;
			}
		}
		&_seen
		{
			.order-item__contacts-title
			{
				color: #747474;
			}
			svg
			{
				fill: #747474;
			}
		}
		.order-item_detail-info &{
			margin-left: 0;
			min-height: initial;
			margin-top: 25px;
		}
		button span { white-space: nowrap; }
	}
	.order-item__info-item-title
	{
		font-size: 16px;
		line-height: 24px;
	}
	.order-item__info-item-value
	{
		white-space: normal;
		font-size: 14;
		line-height: 1.3;
		color: $grey;
		&_red
		{
			color: $red;
		}
		&_money
		{
			color: $green;
			font-family: $roboto;
			font-weight: bold;
		}
	}
	.order-item__info-item
	{
		width: 50%;
	}
	// .order-item__info-item_date
	// {
	// 	width: 128px;
	// 	margin-right: 30px;
	// }
	// .order-item__info-item_money
	// {
	// 	width: 90px;
	// 	margin-right: 60px;
	// }
	// .order-item__info-item_tarrif
	// {
	// 	width: 80px;
	// 	margin-right: 45px;
	// }
	// .order-item__info-item_comment
	// {
	// 	width: 150px;
	// }
	// .order-item__info-item_timeRange
	// {
	// 	width: 130px;
	// }
	// .order-item__info-item_tarrif-prorder
	// {
	// 	width: 200px;
	// }
	.order-item__contacts-items
	{
		display: flex;
		align-items: center;
	}
	.order-item__contacts-item
	{
		display: block;
		@include ease(.2s);
		&:not(:last-child)
		{
			margin-right: 25px;
		}
		svg
		{
			fill: $lightBlue;
			@include ease(.2s);
		}
		&:hover
		{
			svg
			{
				fill: $green;
			}
		}
	}
	.order-item__contacts-title__mobile-close
	{
		display: none;
	}
	.order-item__edit
	{
		color: $lightBlue;
		font-size: 13px;
		text-transform: uppercase;
		font-family: $medium;
		display: flex;
		align-items: center;
		margin-bottom: 5px;
		cursor: pointer;
		svg
		{
			margin-right: 13px;
			fill: $lightBlue;
		}
	}
	.order-item__remove
	{
		color: $red;
		font-size: 13px;
		text-transform: uppercase;
		font-family: $medium;
		display: flex;
		align-items: center;
		cursor: pointer;
		svg
		{
			margin-right: 13px;
			fill: $red;
		}
	}
	.order-item__controls
	{
		flex-shrink: 0;
		justify-content: space-between;
	}
	// .order-item__controls-wr { flex-shrink: 0; width: 100%; }
	
</style>