namespace Mvc.TaskUI
{
	using System.Web.Mvc;

	public class AjaxOnlyAttribute : ActionFilterAttribute
	{
		public override void OnActionExecuting(ActionExecutingContext filterContext)
		{
			base.OnActionExecuting(filterContext);

			if (!filterContext.HttpContext.Request.IsAjaxRequest())
				filterContext.Result = new EmptyResult();
		}
	}
}