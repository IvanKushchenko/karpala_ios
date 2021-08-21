<template>
	<Page :enableSwipeBackNavigation="false" class="suggest-price-drivers">
		<ActionBar title="Предлагаем Вашу цену" color="#fff" height="60" backgroundColor="#283593">
			<NavigationButton visibility="hidden"/>
		</ActionBar>
		<FlexboxLayout flexDirection="column" justifyContent="center">
			<Label class="mb-4 font-weight-bold text-center pt-5" fontSize="21" textWrap="true">
				<FormattedString>
					<Span :text="`Предлагаем Вашу цену ${ suggestedStatistic.price } рублей.`"/>
					<Span text.decode="\n"/>
					<Span text="Ожидайте ответа от пассажира"/>
				</FormattedString>
			</Label>
			<v-template v-if="suggestedStatistic.count">
				<FlexboxLayout v-if="getSuggestPriceDriversImages && getSuggestPriceDriversImages.length" flexDirection="row-reverse" justifyContent="center" class="avatars mb-1">
					<FlexboxLayout v-for="image in getSuggestPriceDriversImages" class="avatars__item">
						<Image :src="image" stretch="none" />
					</FlexboxLayout>
				</FlexboxLayout>
				<Label class="font-weight-bold text-center px-2 mb-1" :text="getSuggestPriceDriversPhrase" />
			</v-template>
			<FlexboxLayout justifyContent="center">
				<Button class="suggest-price-drivers__action"
					@tap="goToAcceptedOrders"
					width="300"
					text="ОК"
				/>
			</FlexboxLayout>
		</FlexboxLayout>
	</Page>
</template>

<script>
import DriverOrders from '@/pages/DriverOrders';

export default {

	name: 'SuggestPriceDrivers',
	props: {
		suggestedStatisticProp: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			pages: {
				DriverOrders
			},
			suggestedStatistic: this.suggestedStatisticProp,
		}
	},
	computed: {
		getSuggestPriceDriversPhrase() {
			if (!this.suggestedStatistic || !this.suggestedStatistic.count)
				return '';
			const count = +this.suggestedStatistic.count;

			let phrase = `Еще ${count} `;

			if (count >= 10 && count <= 19)
				phrase += 'водителей ';
			else if (count % 10 === 1)
				phrase += 'водитель ';
			else if (count % 10 >= 2 && count % 10 <= 4)
				phrase += 'водителя ';
			else
				phrase += 'водителей ';

			if (count === 1)
				phrase += 'предложил свою цену';
			else
				phrase += 'предложили свои цены';

			return phrase;
		},
		getSuggestPriceDriversImages() {
			if (this.suggestedStatistic.images && this.suggestedStatistic.images.length)
				return this.suggestedStatistic.images.splice(0, 5);
			return [];
		},
	},
	methods: {
		goToAcceptedOrders() {
			console.log("go to DriverOrders");
			// this.$navigateTo(this.pages.DriverOrders);
		},
	}
}
</script>
<style lang="scss" scoped>
	.suggest-price-drivers{
		&__action{
			text-transform: initial;
			background: #31CB87;
			border-radius: 45px;
			color: #fff;
			font-size: 16px;
		}
	}

	.avatars{
		display: flex;
		flex-direction: row-reverse;
		justify-content: center;

		&__item{
			width: 54px;
			height: 54px;
			overflow: hidden;
			border-radius: 50%;

			&:not(:last-child){
				margin-left: -90px;
			}
		}
	}
</style>
