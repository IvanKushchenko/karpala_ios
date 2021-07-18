<template>
	<Page enableSwipeBackNavigation="false" backgroundColor="#F5F5F5">
		<ActionBar class="action-bar" height="60" backgroundColor="#283593">
			<NavigationButton visibility="hidden" />
			<ActionItem @tap="onCancelButtonTap">
                <Label class="fas" text.decode="&#xf0c9;" fontSize="24" color="#fff" @tap="onDrawerButtonTap"/>
            </ActionItem>
		</ActionBar>
		<FlexboxLayout flexDirection="column" alignItems="center" justifyContent="center">
				
	        <FlexboxLayout class="login-form" flexDirection="column" width="100%" padding="0 20">
	        	<TextField v-model="login"
	        			   class="input login-form__input" 
	        			   hint="Телефон" 
	        			   keyboardType="phone"/>
	        	<TextField v-model="password" class="input login-form__input" hint="Пароль" secure/>
	        	<Button class="button" height="56" @tap="auth" text="ВОЙТИ"/>
	        </FlexboxLayout>
			
        </FlexboxLayout>
	</Page>
</template>

<script>
import * as utils from "~/shared/utils";
import Orders from '@/pages/Orders';
export default {

	name: 'Authorization',

	data() {
		return {
			pages: {
				Orders
			},
			login: '',
			password: '',
		}
	},
	methods: {
		validate() {
			this.$validator.validateAll().then((result) => {
				if (!result)
					return;

				this.auth()
			});
		},
		onDrawerButtonTap() {
			utils.showDrawer();
		},
		async auth() {
			// this.$store.state.notApprovedDispatcher = false
			// this.$store.state.banned = false

			const qs = require('qs/dist/qs')

			let data = qs.stringify({
				phone: this.login,
				password: this.password,
			});

			const result = await this.$axios({
				method: 'post',
				url: '/api/auth/',
				data: data
			});
			if (result.data.success) {
				console.log(!!result.data.user);
				if (result.data.user) this.$store.commit('setUser', result.data.user);
				console.log("navigate to");
				this.$navigateTo(this.pages.Orders);
				// if (this.$route.query.isRedirect) {
				// 	// this.$router.push('/orders/current?id=' + this.$route.query.id);
				// 	return
				// }

				// if (result.data.code == 'notapproved')
				// 	this.$store.state.notApprovedDispatcher = true

				// if (result.data.code == 'banned')
				// 	this.$store.state.banned = true
				// this.$router.push('/');
			} else{
				// this.phoneError = true;
			}
		}
	}
}
</script>

<style lang="scss">
	.login-form {
		width: 100%;
	}

	.login-form__error {
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
		margin-bottom: 12px;
		display: flex;
		justify-content: space-between;
		color: red;
		padding-bottom: 8px;
		align-items: center;
	}

	.login-form__input {
		margin-bottom: 24px;
	}

	.login-form__links {
		display: flex;
		justify-content: space-between;
	}
</style>