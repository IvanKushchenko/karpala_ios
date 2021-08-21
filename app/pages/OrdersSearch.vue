<template>
	<Page backgroundColor="#F5F5F5">
		<ActionBar class="action-bar" height="60" backgroundColor="#283593">
			<NavigationButton visibility="hidden" />
			<ActionItem>
                <Label class="fas" text.decode="&#xf0c9;" fontSize="24" color="#fff" @tap="onDrawerButtonTap"/>
            </ActionItem>
            <ActionItem v-if="auth" ios.position="right">
                <Label class="fas" text.decode="&#xf2f5;" fontSize="24" color="#fff" @tap="logout"/>
            </ActionItem>
		</ActionBar>
		<StackLayout class="container">
			<OrderSearchForm v-show="state == 'main'" orderType="preorder" @searchdone="searchDone"/>
			<StackLayout v-show="state == 'error'">
				<Button @tap="state = 'main'" marginLeft="0" backgroundColor="transparent" textAlignment="left" paddingLeft="0">
					<FormattedString>
						<Span class="fas" fontSize="14" color="#304ffe" text.decode="&#xf053;"/>
						<Span text="  " />
						<Span text="ВЕРНУТЬСЯ К ПАРАМЕТРАМ ПОИСКА" fontSize="14" fontWeight="bold" marginLeft="10" color="#304ffe"/>
					</FormattedString>
				</Button>
				<Label text="Заказов не найдено" fontSize="16"/>
			</StackLayout>
			<ScrollView v-show="state == 'success'" @scroll="onScroll">
				<Button @tap="state = 'main'" marginLeft="0" backgroundColor="transparent" textAlignment="left" paddingLeft="0">
					<FormattedString>
						<Span class="fas" fontSize="14" color="#304ffe" text.decode="&#xf053;"/>
						<Span text="  " />
						<Span text="ВЕРНУТЬСЯ К ПАРАМЕТРАМ ПОИСКА" fontSize="14" fontWeight="bold" marginLeft="10" color="#304ffe"/>
					</FormattedString>
				</Button>
				<StackLayout>
					<OrderItem v-for="(order, key) in orders" :key="order.id" :order="order"/>
				</StackLayout>
	       	</ScrollView>
		</StackLayout>	
	</Page>
</template>

<script>
import OrderItem from '@/components/OrderItem.vue';
import OrderSearchForm from '../components/OrderSearchForm.vue';
import pages from '@/mixins/pages';
export default {

  name: 'OrdersSearch',
  mixins: [pages],
  components: {
  	OrderItem,
  	OrderSearchForm
  },
  data () {
    return {
    	loading: false,
    	lastChildOffsetY: 0,
    	params: false,
    	llResults: false,
    	orders:[],
    	state: 'main',
    	searchParams: {},
    }
  },
  methods: {
  	layoutChanged(event){
  		const layoutObj = event.object;
  		this.lastChildOffsetY = layoutObj.getActualSize().height;

  	},
  	async getOrders(){
		if(this.allResults) return false

		var self = this

		this.params.page = this.counter

		

		const result = await this.$axios({
			method : 'post',
			url    : '/api/orders/search',
			data   : JSON.stringify(this.params)
		});


		if(result.data.success)
		{
			if(this.counter <= result.data.result.total_pages)
			{
				this.counter++;
				return result.data.result.items
			}

			this.allResults = true
			return false

		}
	},
	/**
	** get items
	*/
	async getNextPage()
	{
		this.waiting = true;

		var newOrders = await this.getOrders()

		if(newOrders)
			this.orders = this.orders.concat(newOrders);


		this.waiting = false

	},
	searchDone(orders, data, searchParams) {
		this.params = data
		this.searchParams = searchParams;

		if (orders.result.items.length > 0) {
			this.orders = orders.result.items
			this.state = 'success'
			// this.$store.state.pageTitle = 'Найдено заказов: ' + orders.result.total_items
			// this.getItemsOnScroll();
			return
		}

		// this.$store.state.pageTitle = 'Поиск заказа'
		this.state = 'error'
	},
  	async onScroll(event){
  		if(this.loading) return;
  		const ScrollViewObj = event.object;
  		const verticalOffset = ScrollViewObj.getMeasuredHeight() + ScrollViewObj.verticalOffset;
  		if(verticalOffset >= this.lastChildOffsetY && this.lastChildOffsetY){
  			this.loading = true;
  			await this.getNextPage();
  			this.loading = false;
  		}
  	}
  }
}
</script>

<style lang="scss" scoped>
</style>