export default
{
	methods:
	{
		/**
		* set popup params and show it
		*/
		showPopup: function(type, title, text)
		{
			this.$store.state.popup.type = type;
			this.$store.state.popup.title = title;
			this.$store.state.popup.text = text;
			this.$store.state.popup.state = true;
		},
	}
}