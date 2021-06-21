<template lang="html">
	<RadSideDrawer ref="drawer" drawerLocation="Left" gesturesEnabled="true">
        <StackLayout ~drawerContent backgroundColor="#ffffff">
            <DrawerContent/>
        </StackLayout>
        <Frame ~mainContent ref="drawerMainContent">
            <Orders/>
        </Frame>
    </RadSideDrawer>
</template>

<script>
import DrawerContent from './components/DrawerContent';
import Orders from './pages/Orders';
export default {

	name: 'App',
	components: {
		Orders,
		DrawerContent
	},
	data() {
		return {

		}
	}
}
</script>

<style lang="css" scoped>
</style>