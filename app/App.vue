<template lang="html">
	<RadSideDrawer ref="drawer" drawerLocation="Left" gesturesEnabled="true">
        <StackLayout ~drawerContent backgroundColor="#ffffff">
            <DrawerContent/>
        </StackLayout>
        <Frame ~mainContent ref="drawerMainContent">
        	<!-- <Authorization /> -->
            <Orders/>
        </Frame>
    </RadSideDrawer>
</template>

<script>
import DrawerContent from './components/DrawerContent';
import Orders from './pages/Orders';
import Authorization from './pages/Authorization';
export default {

	name: 'App',
	components: {
		Orders,
		Authorization,
		DrawerContent
	},
	data() {
		return {

		}
	},
	methods: {

	},
	created(){
		this.$store.dispatch('getUser');
	}
}
</script>

<style lang="css" scoped>
</style>