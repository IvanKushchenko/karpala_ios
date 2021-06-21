import Inputmask from "inputmask";
export default
{
	methods:
	{
		/**
		* set Phone Mask
		*/
		setTimeMask:function()
		{
			var selector = document.getElementsByClassName("_time");

			var im = new Inputmask({mask:"99:99", showMaskOnHover: false, placeholder: '  :  '});
			im.mask(selector);
		}
	}
}