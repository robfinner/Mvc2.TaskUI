namespace Mvc.TaskUI
{
	using System.Web.Mvc;

	public class JsonValidationAttribute : ActionFilterAttribute
	{
		public bool AlwaysInvokeAction { get; set; }

		public override void OnActionExecuting(ActionExecutingContext filterContext)
		{
			base.OnActionExecuting(filterContext);

			var modelState = GetModelState(filterContext.Controller);
			if (ModelHasErrors(modelState) && !this.AlwaysInvokeAction)
				filterContext.Result = new JsonModelErrorResult(modelState);
		}
		public override void OnActionExecuted(ActionExecutedContext filterContext)
		{
			base.OnActionExecuted(filterContext);

			var modelState = GetModelState(filterContext.Controller);
			if (ModelHasErrors(modelState) && ResultIsEmpty(filterContext.Result))
				filterContext.Result = new JsonModelErrorResult(modelState);
		}

		private static ModelStateDictionary GetModelState(ControllerBase controller)
		{
			return controller == null || controller.ViewData == null ? null : controller.ViewData.ModelState;
		}
		private static bool ModelHasErrors(ModelStateDictionary modelState)
		{
			return null != modelState && !modelState.IsValid;
		}
		private static bool ResultIsEmpty(ActionResult result)
		{
			if (result == null)
				return true;

			if (result is EmptyResult)
				return true;

			var json = result as JsonResult;
			if (json != null && json.Data == null)
				return true;

			var content = result as ContentResult;
			if (null != content && string.IsNullOrEmpty(content.Content))
				return true;

			return false;
		}
	}
}