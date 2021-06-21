<template>
	<Page class="page">
      <ActionBar class="action-bar">
        <NavigationButton visibility="hidden"/>
        <GridLayout columns="50, *">
          <Label class="action-bar-title" text="Home" colSpan="2"/>

          <Label class="fas" text.decode="&#xf0c9;" @tap="onDrawerButtonTap"/>
        </GridLayout>
      </ActionBar>

        <GridLayout class="page__content">
            <Label text="page content Home"/>
        </GridLayout>
    </Page>
</template>

<script>
import * as utils from "~/shared/utils";
export default {

  name: 'Home',

  data () {
    return {

    }
  },
  methods: {
		onDrawerButtonTap() {
			utils.showDrawer();
		}
	}
}
</script>

<style lang="css" scoped>
</style>