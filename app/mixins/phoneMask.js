import Inputmask from "inputmask";
export default
{
	methods:
	{
		/**
		* set Phone Mask
		*/
		setMask:function()
		{
			var selector = document.getElementsByClassName("_phone");

			var im = new Inputmask({mask:"+9 (999) 999-99-99", showMaskOnHover: false});
			im.mask(selector);
		}
	}
}