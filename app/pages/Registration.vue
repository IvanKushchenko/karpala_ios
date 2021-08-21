<template>
	<Page enableSwipeBackNavigation="false" backgroundColor="#F5F5F5">
		<ActionBar class="action-bar" color="#fff" title="Регистрация" height="60" backgroundColor="#283593">
			<NavigationButton visibility="hidden" />
			<ActionItem>
                <Label class="fas" text.decode="&#xf0c9;" fontSize="24" color="#fff" @tap="onDrawerButtonTap"/>
            </ActionItem>
		</ActionBar>
		<FlexboxLayout flexDirection="column" alignItems="center" justifyContent="center">
			<ScrollView>
		        <FlexboxLayout v-if="!registered" flexDirection="column" width="100%" padding="0 20">
		        	<TextField v-model="phone"
		        			   hint="Телефон"
		        			   class="input"
		        			   keyboardType="phone"/>
		        	<FlexboxLayout>
		        		<TextField v-model="code" class="input" width="auto" hint="Код по телефону"/>
		        		<Button backgroundColor="transparent" color="#304ffe" @tap="getCode" text="ПОЛУЧИТЬ КОД"/>
		        	</FlexboxLayout>
		        	<TextField v-model="password" class="input" hint="Пароль"/>
		        	<Button class="button" height="56" @tap="registration" text="ЗАРЕГИСТРИРОВАТЬСЯ"/>
		        </FlexboxLayout>
		        <FlexboxLayout v-else flexDirection="column" width="100%" padding="0 20">
		        	<Label text="Спасибо за регистрацию!" fontSize="20" />
					<Label fontSize="14" textWrap="true" text="Теперь вам необходимо активировать нашего бота для того, чтобы вы могли пользоваться всеми функциями нашего сервиса." color="#747474" marginBottom="10" />
					<FlexboxLayout alignItems="center">
						<Button text="АКТИВИРОВАТЬ БОТА" backgroundColor="transparent" @tap="activateBot"/>
						<Button text="К ПОИСКУ" backgroundColor="transparent" @tap="navigateTo('OrdersSearch')"/>
					</FlexboxLayout>
		        </FlexboxLayout>
			</ScrollView>
        </FlexboxLayout>
	</Page>
</template>

<script>
import * as utils from "~/shared/utils";
import OrdersSearch from '@/pages/OrdersSearch.vue';
export default {

	name: 'Registration',

	data() {
		return {
			pages: {
				OrdersSearch
			},
			registered: true,
			photo: null,
			code: null,
			password: null
		}
	},
	methods: {
		navigateTo(component){
			this.$navigateTo(this.pages[component]);
			utils.closeDrawer();
		},
		activateBot(){

		},
		onDrawerButtonTap() {
			utils.showDrawer();
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
		async getCode(){
			// this.codeError = '';

			// this.$validator.validate('username').then((result) => {
			// 	if (!result)
			// 		return;
			// });

			// this.phoneError = false;

			let data = this.$qs.stringify({
				phone: this.phone,
			});

			let code = await this.$axios({
				data: data,
				method: 'post',
				url: '/api/auth/approvePhone/',
			});

			console.dir(code);

			// if (!code.data.success) {
			// 	if (code.data.message == 'Пользователь с таким телефоном уже существует') {
			// 		this.notAprovedPhone = false
			// 		this.isForgotPassword = true
			// 		this.notAprovedPhone = code.data.message + '.'
			// 	} else {
			// 		this.codeError = code.data.message
			// 	}
			// }

			// this.tryMessage = code.data.successMessage
		},
		async registration() {
			try{
				let data = this.$qs.stringify({
					role     : 'driver',
					phone    : this.phone,
					password : this.password,
					code     : this.code
				});

				const result = await this.$axios({
					method : 'post',
					url    : '/api/auth/signup/',
					data   : data
				});
				console.dir(result);

				if (result.data.success) {
					this.nextStep(2);
					if (result.data.user) this.$store.state.user = result.data.user
					return;
				}
			} catch(error){
				console.dir(error);
			}
			

			// if (result.data.success) {
			// 	this.codeError = false;
			// 	this.notAprovedPhone = false;
			// 	this.nextStep(2);
			// 	if (result.data.user)
			// 		this.$store.state.user = result.data.user
			// 	return;
			// }

			// if (result.data.message == 'Телефон не подтвержден') {
			// 	this.codeError = false
			// 	this.notAprovedPhone = result.data.message
			// }

			// if (result.data.message == 'Неверный код') {
			// 	this.notAprovedPhone = false
			// 	this.codeError = result.data.message
			// }

			// if (result.data.errors && result.data.errors.phone[0] == 'Пользователь с таким телефоном уже существует') {
			// 	this.notAprovedPhone = false
			// 	this.isForgotPassword = true
			// 	this.notAprovedPhone = result.data.errors.phone[0] + '.'
			// }
		}
	},
	mounted(){
		this.getTelegramLink();
	}
}
</script>

<style lang="css" scoped>
</style>