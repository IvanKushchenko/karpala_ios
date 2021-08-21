<template>
	<Page enableSwipeBackNavigation="false" backgroundColor="#F5F5F5">
		<ActionBar class="action-bar" color="#fff" title="Авторизация" height="60" backgroundColor="#283593">
			<NavigationButton visibility="hidden" />
			<ActionItem>
                <Label class="fas" text.decode="&#xf0c9;" fontSize="24" color="#fff" @tap="onDrawerButtonTap"/>
            </ActionItem>
		</ActionBar>
		<FlexboxLayout flexDirection="column" alignItems="center" justifyContent="center">
				<ScrollView>
			        <FlexboxLayout class="login-form" flexDirection="column" width="100%" padding="0 20">
			        	<Image v-if="image" :src="image" />
			        	<Button v-else @tap="loadImage()" />
			        	<TextField v-model="login"
			        			   class="input login-form__input" 
			        			   hint="Телефон" 
			        			   keyboardType="phone"/>
			        	<TextField v-model="password" class="input login-form__input" hint="Пароль" secure/>
			        	<FlexboxLayout alignItems="center" justifyContent="space-between">
			        		<Button fontSize="14" height="20" backgroundColor="transparent" color="#00c853" @tap="navigateTo('Registration')" text="Регистрация"/>
			        		<Button fontSize="14" height="20" backgroundColor="transparent" color="#00c853" @tap="navigateTo('RecoveryPassword')" text="Забыли пароль?"/>
			        	</FlexboxLayout>
			        	<Button class="button" height="56" @tap="auth" text="ВОЙТИ"/>
			        </FlexboxLayout>
				</ScrollView>
        </FlexboxLayout>
	</Page>
</template>

<script>
var imagepicker = require("nativescript-imagepicker");
const fs = require('tns-core-modules/file-system');
const imageSourceModule = require("tns-core-modules/image-source");
import * as utils from "~/shared/utils";
import Orders from '@/pages/Orders';
import Registration from '@/pages/Registration';
import RecoveryPassword from '@/pages/RecoveryPassword';

export default {

	name: 'Authorization',

	data() {
		return {
			image: null,
			pages: {
				Orders,
				Registration,
				RecoveryPassword
			},
			login: '',
			password: '',
		}
	},
	methods: {
		loadImage(){
			var milliseconds = (new Date()).getTime();
			const context = imagepicker.create({
			  mode: 'single' // use "multiple" for multiple selection
			});
			context
			    .authorize()
			    .then(function() {
			        return context.present();
			    })
			    .then((selection) => {
			    	console.log("selection[0]", selection[0]);
			    	imageSourceModule.fromAsset(selection[0]).then((imageSource) => {
			    		console.log("selection", imageSource);
			    		let folder = fs.knownFolders.documents();
			    		console.log("folder", folder);
			    		let path = fs.path.join(folder.path, milliseconds + '.png');
			    		console.log("path", path);
			    		let saved = imageSource.saveToFile(path, 'png');
			    		console.log("saved", saved);
			    		let binarySource = fs.File.fromPath(path).readSync(err => { 
			    			console.log("err", err);
			    		});
			    		console.log("binarySource", binarySource);
			    		this.image = path;
			    	})
			    	// selection[0].getImageAsync((imageSource) => {
			    	// 	console.log("selection", imageSource);
			    	// 	let folder = fs.knownFolders.documents();
			    	// 	console.log("folder", folder);
			    	// 	let path = fs.path.join(folder.path, milliseconds + '.png');
			    	// 	console.log("path", path);
			    	// 	let saved = imageSource.saveToFile(path, 'png');
			    	// 	console.log("saved", saved);
			    	// 	this.image = saved;
			    	// })
			    	
			        // selection.forEach(function(selected) {
			        // 	console.log("selected", selected.getImage());
			        // 	// selected.getImage().then((imageSource) => {
			        // 	// 	console.log("imageSource", imageSource);
			        // 	// 	let folder = fs.knownFolders.documents();
			        // 	// 	console.log("folder", folder);
			        // 	// 	let path = fs.path.join(folder.path, milliseconds + '.png');
			        // 	// 	let saved = imageSource.saveToFile(path, 'png');
			        // 	// 	this.image = saved;
			        // 	// })
			        //     // process the selected image
			        // });
			        
			    }).catch(function (e) {
			        // process error
			    });
			// console.log(context);
			// context
			//   .authorize()
			//   .then(() => {
			//     return context.present()
			//   })
			//   .then(selection => {
			//     selection.forEach(selected => {
			//       // process the selected image
			//     });
			//     console.log("selection", selection);
			//     // list.items = selection
			//   })
			//   .catch(e => {
			//     // process error
			//   })
		},
		navigateTo(component){
			this.$navigateTo(this.pages[component]);
			utils.closeDrawer();
		},
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
				console.log(result.data.user);
				if (result.data.user) this.$store.commit('setUser', result.data.user);
				this.navigateTo('Orders');
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