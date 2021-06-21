import TimeRange from '@/components/form/TimeRange.vue';
import orderForm from '@/mixins/orderForm.js'

export default
{
	/**
	** return data
	*/
	data: function()
	{
		return {
			formFields:
			{
				classAuto   : 'Стандарт',
				price       : '',
				comment     : '',
				classAutoId : 2,
				date        : '',
				time        : '',
				now         : false,
				fromRegion  : false,
				fromCity    : false,
				toRegion    : false,
				toCity      : false,
				orderFrom   : '',
				orderTo     : '',
			},
			serverDateError: false,
			fieldsErrors:
			{
				date: false,
				time: false,
			}
		};
	},
	methods:
	{
		/**
		** set auto class
		*/
		setClass(autoClass)
		{
			this.formFields.classAuto = autoClass.class_name
			this.formFields.classAutoId = autoClass.id
		},
		/**
		** validate date
		*/
		validateDate()
		{
			var testDate = /^\d{2}\.\d{2}\.\d{4}$/;

			if(this.formFields.date == '')
			{
				this.fieldsErrors.date = 'Поле не заполнено';
				return false
			}

			else if(!testDate.test(this.formFields.date))
			{
				this.fieldsErrors.date = 'Поле заполнено некорректно'
				return false
			}

			else
			{
				this.fieldsErrors.date = false
				return true
			}
		},
		/**
		** validate time
		*/
		validateTime()
		{
			if(this.formFields.time == '' || this.formFields.time == '--:--')
			{
				this.fieldsErrors.time = 'Поле заполнено некорректно'
				return false
			}

			else
			{
				this.fieldsErrors.time = false
				return true
			}
		},
		/**
		** validare order
		*/
		validateOrder()
		{
			if(!this.now)
			{
				this.validateDate()
				this.validateTime()
			}

			this.$validator.validateAll().then((result) =>
			{
				if(result && (this.formFields.now || (this.validateDate() && this.validateTime())))
					this.addOrder()
			});
		},
	}
}