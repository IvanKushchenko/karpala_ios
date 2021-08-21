// import TimeRange from '@/components/form/TimeRange.vue';
import orderForm from '@/mixins/orderForm.js'

export default
{
	// components: { TimeRange },
	methods:
	{
		/**
		** get time range
		*/
		setTimeRange(timeStart, timeEnd)
		{
			this.formFields.timeStart = timeStart
			this.formFields.timeEnd = timeEnd
		},
		/**
		** set auto class
		*/
		setClass(autoClass)
		{
			if(this.formFields.classesAutoId.indexOf(autoClass) !== -1)
				this.formFields.classesAutoId.splice(this.formFields.classesAutoId.indexOf(autoClass), 1)

			else
				this.formFields.classesAutoId.push(autoClass)


			if(this.formFields.classesAutoId.length == 0 && !this.searchPage)
			{
				this.fieldsErrors.classes = 'Выберите хотя бы один класс авто'
				return false
			}

			else
			{
				this.fieldsErrors.classes = false;
				return true
			}
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
				if(typeof this.fieldsErrors.date !== 'undefined')
					delete this.fieldsErrors.date;

				return true
			}
		},
		/**
		** validate time
		*/
		validateTime()
		{
			if(this.formFields.timeStart == '' || this.formFields.timeEnd == '')
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
				if(result && !this.fieldsErrors.classes && (this.formFields.now || (this.validateDate() && this.validateTime())))
				{
					this.addOrder()
				}
			});
		},
	}
}