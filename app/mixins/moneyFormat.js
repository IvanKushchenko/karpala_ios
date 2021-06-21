export default
{
	methods:
	{
		/**
		* return param in money format
		*/
		moneyFormat: function(money)
		{
			if(!money)
				return '0 ₽'

			money = money.toString().split('');

			var priceFormatValue = '',
				counter          = 0;

			for(var i = money.length-1; i >= 0;  i--)
			{
				priceFormatValue = money[i] + priceFormatValue

				if((priceFormatValue.length + counter) % 3 != 0 || i == 0)
					continue;

				priceFormatValue = ' ' + priceFormatValue
				counter--
			}

			return priceFormatValue + ' ₽'
		},
	}
}