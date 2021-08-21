<template>
	<div class="container">
		<div v-if="!this.$store.state.user">
			<h2 style="text-align: center;" class="h2">Необходимо авторизоваться</h2>
		</div>
		<div v-else class="personal">
			<div class="personal__top">
				<div class="personal__info">
					<div class="personal__avatar">
						<img v-if="user.avatar" :src="user.avatar.path" alt="avatar">
						<img v-else src="/unauth.svg" alt="">
					</div>
					<div class="personal__fields">
						<div class="personal__fields-item">
							<span>Имя</span>
							<span>{{user.full_name}}</span>
						</div>
						<div class="personal__fields-item">
							<span>Телефон</span>
							<span>{{user.phone}}</span>
						</div>
					</div>
				</div>
				<div class="personal__telegram-name">
					<div class="personal__telegram-name-placeholder">Имя пользователя в Телеграм</div>
					<div class="personal__telegram-name-value">{{user.name}}</div>
					<div class="personal__telegram-name-refresh" @click="getTelegramLink()">ОБНОВИТЬ</div>
				</div>
			</div>
			<div class="personal__alternative">
				<div class="personal__title personal__alternative-title">АЛЬТЕРНАТИВНЫЙ СПОСОБ СВЯЗИ</div>
				<div class="personal__alternative-item" v-for="(item) in user.methods" :key="item.id">
					<label class="checkbox-label">
						<input class="checkbox" type="checkbox" :checked="item.checked" @change="changeMethods(item);">
						<span></span>
						{{item.name}}
					</label>
					<span>{{user.phone}}</span>
				</div>
			</div>
			<div class="personal__balance">
				<div class="personal__title">БАЛАНС</div>
				<div class="personal__balance-info">
					<div class="personal__balance-value">
						{{moneyFormat(user.balance)}}
					</div>
					<router-link to="/payment" class="blue-text-btn personal__balance-top-up">
						Пополнить
					</router-link>
				</div>
			</div>
			<div class="personal__tariff">
				<div class="personal__title personal__alternative-title">Активируйте смену</div>
				<div class="personal__tariff-items">
					<div class="personal__tariff-item personal__tariff-item_titles">
						<div class="personal__tariff-item-left"></div>
						<div class="personal__tariff-item-right">
							<div class="personal__tariff-week-price">Цена</div>
						</div>
					</div>
					<div class="personal__tariff-item" v-for="tariff in tariffs" :key="tariff.id">
						<div class="personal__tariff-item-left" @click="openChangePopup(tariff.name, tariff.id)">
							<div class="personal__tariff-item-icon" :class="{'personal__tariff-item-icon_active': $store.state.user.tariff && $store.state.user.tariff.period == tariff.period}"></div>
							<div class="personal__tariff-item-text">«{{tariffs.length ? tariff.name : ''}}» <span v-if="$store.state.user.tariff && $store.state.user.tariff.period == tariff.period && $store.state.user.tariff.endDate">{{'До ' + $store.state.user.tariff.endDate}}</span></div>
						</div>
						<div class="personal__tariff-item-right">
							<div class="personal__tariff-week-price">{{moneyFormat(tariffs.length ? tariff.period_price : 0)}}</div>
						</div>
					</div>
				</div>
				<button v-if=isDriver @click="$router.push('/personal/driver-edit')" class="button button_white personal__button">Редактировать профиль</button>
				<button v-else @click="$router.push('/auth/reg/driver')" class="button button_white personal__button">Заполнить профиль</button>
				<button class="button button_white personal__button" @click.stop.prevent="showPass = !showPass">СМЕНИТЬ ПАРОЛЬ</button>
				<div class="personal__change-pass" :class="{'personal__change-pass_active':showPass}">
					<div class="input-wrapper personal__tariff__bot-input" :class="{'input-wrapper_error': errors.has('password') || passError}">
						<input
							type="password"
							placeholder="Пароль"
							data-vv-as="Пароль"
							class="input"
							v-validate="'required|min:6|max:50|numeric'"
							v-model="newPassword"
							name="password"
						>
						<div class="input-msg" v-show="errors.has('password')">
							{{ errors.first('password') }}
						</div>
						<div class="input-msg" v-show="!errors.has('password') && passError">
							{{ passError }}
						</div>
					</div>
				</div>
				<button class="button personal__button" @click.stop.prevent="validate()">СОХРАНИТЬ</button>
			</div>
		</div>

		<overlay
			ref="TopUpBalance"
			title="Внимание"
			:text="'На вашем счёте недостаточно средств чтобы перейти на смену «' + chosenTariffName + '». Пополнить личный счёт?'"
		>
			<div class="popup__buttons">
				<div class="popup__button" @click="$router.push('/payment')">Да</div>
				<div class="popup__button" @click="$refs['TopUpBalance'].close();">Нет</div>
			</div>
		</overlay>

		<overlay
			ref="CongratulationsChange"
			title="Поздравляем!"
			:text="congratulationsChangeText"
		>
			<div class="popup__buttons">
				<div class="popup__button" @click="$refs['CongratulationsChange'].close();">ОК</div>
			</div>
		</overlay>

		<overlay
			ref="changeTariff"
			title="Внимание"
			:text="popupText"
		>
			<div class="popup__buttons">
				<div class="popup__button" @click="changeTariff()">Да</div>
				<div class="popup__button" @click="$refs['changeTariff'].close();">Нет</div>
			</div>
		</overlay>

		<overlay
			ref="changePass"
			title="Поздравляем"
			text="Пароль был успешно изменен"
		>
			<div class="popup__buttons">
				<div class="popup__button" @click="$refs['changePass'].close();">ОК</div>
			</div>
		</overlay>

		<overlay
			ref="somethingWrong"
			title="Внимание"
			:text="somethingWrongText"
		>
			<div class="popup__buttons">
				<div class="popup__button" @click="$refs['somethingWrong'].close();">ОК</div>
			</div>
		</overlay>
	</div>
</template>

<script>
import Overlay from '@/components/layout/Overlay.vue'
import moneyFormat from '@/mixins/moneyFormat.js'
export default
{
	components:
	{
		Overlay,
	},
	/**
	** return data
	*/
	data: function()
	{
		return {
			showPass: false,
			error: false,
			prevPopupRef: '',
			passError: false,
			newPassword: '',
			chosenTariff: false,
			chosenTariffName: false,
			somethingWrongText: '',
			// dateText: '',
			tariffs: [],

			popupText: '',
			congratulationsChangeText: ''
		}
	},
	mixins: [moneyFormat],
	computed:
	{
		/**
		** return user object from store
		*/
		user: function()
		{
			if(this.$store.state.user)
				return this.$store.state.user
		},
		isDriver()
		{
			return this.user ? this.user.isDriver : false;
		},
	},
	methods:
	{
		/**
		** change messanger methods
		*/
		async changeMethods(item)
		{
			var methods = []

			for(var index in this.$store.state.user.methods)
			{
				if(this.$store.state.user.methods[index].checked)
				{
					methods.push(this.$store.state.user.methods[index].id)
				}
			}

			if(!item.checked)
				methods.push(item.id)

			else
			{
				methods.splice(methods.indexOf(item.id), 1)
			}

			const qs = require('qs');

			let data = qs.stringify({
				methods : methods
			});

			let result = await this.$axios({
				data: data,
				method: 'post',
				url: '/api/users/changeMethods',
			});

			if(result.data.success)
			{
				item.checked = !item.checked
				return
			}

			this.somethingWrongText = result.data.message
			this.openPopup('somethingWrong')

		},
		/**
		** add tg bot
		*/
		async getTelegramLink()
		{
			let result = await this.$axios({
				method: 'post',
				url: '/api/telegram/updateUser/',
			});

			if(result.data.success)
				this.$store.state.user = result.data.user
		},

		/**
		** open change popup
		*/
		openChangePopup: function(tarrifName, chosenTariffId)
		{
			if(this.$store.state.user.tariff && chosenTariffId == this.$store.state.user.tariff.id)
				return false

			this.popupText = 'Вы уверены что хотите сменить смену на «' + tarrifName + '» ?'

			if(this.prevPopupRef)
			{
				this.$refs[this.prevPopupRef].show = false;
				this.prevPopupRef = '';
			}

			this.prevPopupRef = 'changeTariff';


			this.chosenTariff = chosenTariffId
			this.chosenTariffName = tarrifName

			this.$refs['changeTariff'].show = true;

		},

		/**
		** open popup by name
		*/
		openPopup: function(popupName)
		{
			if(this.prevPopupRef)
			{
				this.$refs[this.prevPopupRef].show = false;
				this.prevPopupRef = '';
			}

			this.$refs[popupName].show = true;
			this.prevPopupRef = popupName;
		},

		/**
		** change tariff
		*/
		async changeTariff()
		{
			const qs = require('qs');

			let data = qs.stringify({
				tariffId : this.chosenTariff
			});

			let result = await this.$axios({
				data: data,
				method: 'post',
				url: '/api/users/changeTariff',
			});

			if(result.data.success)
			{
				if(!result.data.transitionNow)
				{
					var selectedTariff = {};

					for(var index in this.tariffs)
					{
						if(this.tariffs[index].id == this.chosenTariff)
							selectedTariff = this.tariffs[index];
					}

					this.congratulationsChangeText = 'Переход на смену «'+ this.chosenTariffName +'» произойдет ' +result.data.dateStart+', когда закончится период текущей смены'
					this.openPopup('CongratulationsChange', this.chosenTariff)

					this.$store.state.user.balance = +this.$store.state.user.balance - +selectedTariff.period_price

					return
				}
				else
				{
					for(var index in this.tariffs)
					{
						if(this.tariffs[index].id == this.chosenTariff)
							this.$store.state.user.tariff = this.tariffs[index]
					}
					if (this.$store.state.user.tariff)
					{
						this.congratulationsChangeText = 'Вы перешли на смену «'+ this.$store.state.user.tariff.name +'». Когда время оплаченного вами периода подойдет к концу, наш бот оповестит вас об этом'
						this.openPopup('CongratulationsChange', this.chosenTariff)

						this.$store.state.user.balance = +this.$store.state.user.balance - +this.$store.state.user.tariff.period_price
					}
					return;
				}

			}

			if(result.data.code == 4)
				this.openPopup('TopUpBalance')

			else
			{
				this.somethingWrongText = result.data.message
				this.openPopup('somethingWrong')
			}
		},

		/**
		** validate
		**/
		validate()
		{
			this.passError = false;
			this.$validator.validateAll().then((result) =>
			{
				if(!result)
					return;

				this.changePassword()
			});
		},

		/**
		** registration
		**/
		async changePassword()
		{
			const qs = require('qs')

			let data = qs.stringify({
				password : this.newPassword,
			});

			const result = await this.$axios({
				method : 'post',
				url    : '/api/auth/changePass/',
				data   : data
			});

			if(result.data.success)
			{
				this.$refs.changePass.show = true;
				return
			}

			this.passError = result.data.errors.password[0]
		},
		/**
		** get tariffs
		*/
		async getTariffs()
		{
			const result = await this.$axios({
				method : 'post',
				url    : '/api/tariffs/get',
			});

			if(result.data.success)
				this.tariffs = result.data.tariffs

		}
	},
	/**
	** mounted
	*/
	mounted:function()
	{
		this.getTariffs()
		this.$store.state.pageTitle = 'Личный кабинет'
		this.$store.state.nestedPage = false;
	},
}
</script>

<style lang="scss">
	.personal__change-pass
	{
		max-height: 0;
		overflow-y: hidden;
		opacity: 0;
		@include ease(.2s);
		&_active
		{
			opacity: 1;
			visibility: visible;
			max-height: 150px;
		}
	}
	.personal__info
	{
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}
	.personal__top,
	.personal__alternative,
	.personal__balance
	{
		padding-bottom: 12px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
		margin-bottom: 17px
	}
	.personal__alternative,
	.personal__balance
	{
		padding-bottom: 22px;
	}
	.personal__balance-info
	{
		display: flex;
	}
	.personal__balance
	{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.personal__avatar
	{
		margin-right: 16px;
		flex-shrink: 0;
		width: 64px;
		height: 64px;
		border-radius: 50%;
		overflow: hidden;
		img
		{
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
	.personal__fields-item
	{
		display: flex;
		&:not(:last-child)
		{
			margin-bottom: 4px;
		}
		span:first-child
		{
			flex-shrink: 0;
			width: 70px;
			margin-right: 10px;
			color: $grey;
		}
	}
	.personal__telegram-name
	{
		background-color: #fff;
		padding: 12px 16px;
		position: relative;
		height: 57px;
	}
	.personal__telegram-name-refresh
	{
		background-color: $lightBlue;
		color: #fff;
		height: 57px;
		position: absolute;
		right: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 20px;
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
		font-size: 14px;
		font-family: $medium;
		cursor: pointer;
		@include ease(.125s);
		&:hover
		{
			background-color: #274bc8;
		}
	}
	.personal__telegram-name-placeholder
	{
		margin-bottom: 2px;
		font-size: 12px;
		color: rgba(0,0,0,.38);
	}
	.personal__title
	{
		font-size: 14px;
		letter-spacing: 0.5px;
		text-transform: uppercase;
		font-family: $medium;
	}
	.personal__alternative-title
	{
		margin-bottom: 16px;
	}
	.personal__alternative-item
	{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 2px;
		&:not(:last-child)
		{
			margin-bottom: 15px;
		}
	}
	.personal__balance-top-up
	{
		margin-left: 26px;
	}
	.personal__tariff-item-left
	{
		display: flex;
		align-items: center;
		cursor: pointer;
	}
	.personal__tariff-items
	{
		margin-bottom: 15px;
		margin-top: -34px;
	}
	.personal__tariff-item
	{
		display: flex;
		justify-content: space-between;
		&:not(:last-child)
		{
			margin-bottom: 14px;
		}
		&_titles
		{
			.personal__tariff-week-price,
			.personal__tariff-transition-price
			{
				font-size: 12px;
				color: $grey;
			}
		}
	}
	.personal__tariff-item-right
	{
		display: flex;
	}
	.personal__tariff-week-price,
	.personal__tariff-transition-price
	{
		min-width: 82px;
		font-size: 16px;
	}
	.personal__tariff-text
	{
		color: $grey;
		font-size: 14px;
		margin-bottom: 13px;
		line-height: 20px;
	}
	.personal__tariff-item-icon
	{
		width: 20px;
		height: 20px;
		border: 2px solid $lightBlue;
		border-radius: 50%;
		margin-right: 5px;
		position: relative;
		&:after
		{
			@include ease(.125s);
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			width: 10px;
			height: 10px;
			background-color: $lightBlue;
			border-radius: 50%;
			opacity: 0;
			visibility: hidden;
		}
		&_active
		{
			&:after
			{
				opacity: 1;
				visibility: visible;
			}
		}
	}
	.personal__button
	{
		margin-bottom: 20px;
	}
	.personal__tariff__bot-input
	{
		margin-bottom: 20px;
	}
	@media (max-width: 1024px)
	{
		.personal
		{
			padding: 0 16px;
		}
	}
</style>
