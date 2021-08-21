import Inputmask from "inputmask";
export default
{
	methods:
	{
		/**
		* set Phone Mask
		*/
		setPriceMask:function()
		{
			var selector = document.getElementsByClassName("_price");
			var im = new Inputmask({mask:"9{1,6}", showMaskOnHover: false, placeholder: ''});
			im.mask(selector);
		}
	}
}