<template>
<!-- 	<div class="container">
		<div class="payment">
			<div class="payment__top">
				<div class="input-wrapper input-wrapper_payment" :class="{'input-wrapper_error': error || amount < 1}">
					<div class="input-wrapper_payment-title">
						Сумма
					</div>
					<input v-model="amount" type="number" placeholder="" class="input">
					<span :class="{'min-payment-error': amount < 50}">Минимальная сумма к пополнению — 50 руб.</span>
					<div v-show="amount < 50 && error" class="input-msg">
						{{error}}
					</div>
				</div>

			</div>
			<div class="payment__bottom">
				<div class="payment__radio" @click="setPayment('monetasdk_paysys_plastic')">
					<div class="personal__tariff-item-icon" :class="{'personal__tariff-item-icon_active': type == 'monetasdk_paysys_plastic'}"></div>
					<div class="personal__tariff-item-text">Банковская карта</div>
				</div>
				<div class="payment__radio" @click="setPayment('monetasdk_paysys_qiwi')">
					<div class="personal__tariff-item-icon" :class="{'personal__tariff-item-icon_active': type == 'monetasdk_paysys_qiwi'}"></div>
					<div class="personal__tariff-item-text">QIWI кошелёк</div>
				</div>
				<div class="payment__radio" @click="setPayment('monetasdk_paysys_yandex')">
					<div class="personal__tariff-item-icon" :class="{'personal__tariff-item-icon_active': type == 'monetasdk_paysys_yandex'}"></div>
					<div class="personal__tariff-item-text">Яндекс.Деньги</div>
				</div>
				<button v-show="amount >= 50" class="button" @click="getPayments">оплатить</button>
				<div class="moneta-form" v-show="false" v-html="htmlText"></div>
			</div>
		</div>
	</div> -->
</template>

<!-- <script>

export default
{
	/**
	** return data
	**/
	data()
	{
		return {
			error: false,
			amount: 300,
			type: 'monetasdk_paysys_plastic',
			htmlText : ''
		}
	},
	methods:
	{
		/**
		** get payment params
		**/
		async getPayments()
		{
			this.error = false

			const qs = require('qs');

			let data = qs.stringify({
				type : this.type,
				amount: this.amount,
			});

			let result = await this.$axios({
				data: data,
				method: 'post',
				url: '/api/moneta/index',
			});

			if(result.data.success)
			{
				this.htmlText = result.data.form;

				setTimeout(function()
				{
					var form = document.getElementById(result.data.formId);
					form.submit();

				},300)
			}

			else
				this.error = result.data.message
		},

		/**
		** get payment params on radio change
		**/
		setPayment(type)
		{
			this.type = type
		}
	},
	/**
	** mounted set title
	*/
	mounted:function()
	{
		this.$store.state.pageTitle = 'Пополнить баланс';
		this.$store.state.nestedPage = true;
	},
}
</script> -->

<!-- <style lang="scss">
	.input-wrapper_payment span.min-payment-error {
		color: $red;
	}

	.payment__top {
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
		padding-bottom: 40px;
		margin-bottom: 17px;
	}

	.input-wrapper_payment-title {
		position: absolute;
		font-size: 12px;
		color: $grey;
		top: 11px;
		left: 16px;
	}

	.input-wrapper_payment {
		height: 56px;
		position: relative;

		&.input-wrapper .input-msg {
			top: 75px;
			padding-left: 5px;
		}

		span {
			font-size: 12px;
			color: $grey;
			padding-left: 5px;
		}

		input {
			padding-top: 22px;
			padding-right: 30px;
		}

		&:before {
			content: '₽';
			position: absolute;
			display: block;
			font-size: 20px;
			font-family: $medium;
			color: $grey;
			padding-top: 6px;
			top: 11px;
			right: 15px;
		}

		&:after {
			display: block;
			font-size: 12px;
			color: $grey;
			padding-top: 8px;
			padding-left: 2px;
			white-space: nowrap;
			position: absolute;
		}

	}

	.payment__radio {
		margin-bottom: 13px;
		cursor: pointer;
		display: flex;
		align-items: center;
	}

	.payment__button {
		margin-top: 22px;
	}

	.personal__tariff-item-icon {
		width: 20px;
		height: 20px;
		border: 2px solid $lightBlue;
		border-radius: 50%;
		margin-right: 5px;
		position: relative;

		&:after {
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

		&_active {
			&:after {
				opacity: 1;
				visibility: visible;
			}

		}

	}

	.moneta-form {
		margin-top: 25px;

		span {
			display: block;
			margin-bottom: 10px;
		}

		input[type="submit"] {
			@include ease($time: .2s)
			background-color:$lightBlue;
			color: #fff;
			width: 100%;
			font-family: $medium;
			font-size: 14px;
			line-height: 18px;
			border-radius: 4px;
			height: 56px;
			cursor: pointer;
			text-transform: uppercase;
			display: flex;
			justify-content: center;
			align-items: center;
			outline: none;
			border: none;

			&:hover {
				background-color: #274bc8;
			}

		}

		input[type="text"] {
			@include ease($time: .135s)
			width:100%;
			border: 2px solid transparent;
			height: 56px;
			border-radius: 4px;
			outline: none;
			box-sizing: border-box;
			background-color: #fff;
			padding: 0 16px;
			margin-bottom: 15px;
		}

	}
</style> -->
