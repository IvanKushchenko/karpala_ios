// import DatePicker from '@/components/form/DatePicker.vue';
// import RegionPicker from '@/components/form/RegionPicker.vue'
// import timeMask from '@/mixins/timeMask.js'
// import priceMask from '@/mixins/priceMask.js'
// var moment = require('moment');

export default
{
	components: { 
		// DatePicker, 
		// RegionPicker, 
		// moment 
	},
	props: ['orderType'],
	name: 'NewOrderForm',
	// mixins: [timeMask, priceMask],
	/**
	** return data
	**/
	data: function()
	{
		return {
			autoClasses   : [],
			regions       : [],
			orderDone     : false,
			show          : false,
			disabledStart : ''
		}
	},
	methods:
	{
		/**
		** validate current address field on change
		*/
		validateAddresOnChange(fildName)
		{
			this.$validator.validate(fildName).then((result) =>
			{
				if(!result)
					return;
			});
		},
		/**
		** get classe of auto
		*/
		async getAutoClasses()
		{
			const result = await this.$axios({
				method : 'post',
				url    : '/api/classauto/get',
			});

			if(result.data.success)
				this.autoClasses = result.data.classes
		},
		/**
		** get regions
		*/
		async getRegions()
		{

			const result = await this.$axios({
				method : 'post',
				url    : '/api/regions/getRegions',
			});

			if(result.data.success)
			{
				this.regions = result.data.regions

				for(var index in this.regions)
				{
					this.regions[index].show = true;

					if(this.orderType == 'preorder')
						this.regions[index].cities.unshift({id : 0, name : 'Не важно'});
				}
			}
		},
		/**
		** open popup by name, hide prev popup, dont shows popup if ckicked tarrif == current tarrif
		*/
		openPopup: function(popupName)
		{
			this.$refs[popupName].show = true;
		},
		/**
		** format date
		*/
		formatDate (date)
		{
			return moment(date).format('DD.MM.YYYY')
		},
		/**
		** set order from address
		*/
		setOrderFromAddress(address, regionId, cityId)
		{
			this.setField('orderFrom', address);
			this.setField('fromRegion', regionId);
			this.setField('fromCity', cityId);

			this.validateAddresOnChange('from');
		},
		/**
		** set order to address
		*/
		setOrderToAddress(address, regionId, cityId)
		{
			this.setField('orderTo', address);
			this.setField('toRegion', regionId);
			this.setField('toCity', cityId);

			this.validateAddresOnChange('to');
		},
		/**
		** set form field value
		*/
		setField: function(name, value)
		{
			if(typeof this.formFields == 'undefined')
				return false;

			// if(typeof this.formFields[name] == 'undefined')
			// 	return false;

			this.formFields[name] = value;
		},
	},
	/**
	** mounted
	**/
	mounted()
	{
		this.setTimeMask();
		this.setPriceMask();
		this.getRegions();
		this.getAutoClasses();
		this.disabledStart = new Date();
		this.disabledStart =  moment(this.disabledStart).format('YYYY-MM-DD h:mm:s');
	},
}
