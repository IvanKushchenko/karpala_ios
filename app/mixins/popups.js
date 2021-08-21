export default
{
	methods:
	{
		/**
		** close popup
		*/
		closeEsc (e)
		{
			if(typeof e.type != 'undefined' && e.type == 'keyup' && e.keyCode != '27')
				return false;

			this.show = false;
		},

		/**
		** close popup
		**/
		close()
		{
			this.show = false;
			this.currentRegion = false;
		},
	},
	watch:
	{
		/**
		** esc close popup
		**/
		show (newValue, oldValue)
		{
			if(newValue)
				document.addEventListener('keyup', this.closeEsc);
			else
				document.removeEventListener('keyup', this.closeEsc);
		}
	},
}