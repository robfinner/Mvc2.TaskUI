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
			if (ModelHasErrors(modelState) && filterContext.Result is EmptyResult)
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
	}
}