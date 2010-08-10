namespace Mvc.TaskUI
{
	using System.Web.Mvc;

	public class JsonValidationAttribute : ActionFilterAttribute
	{
		public bool AlwaysInvokeAction { get; set; }

		public override void OnActionExecuting(ActionExecutingContext filterContext)
		{
			base.OnActionExecuting(filterContext);

			var state = GetModelState(filterContext.Controller);
			if (ModelHasErrors(state) && !this.AlwaysInvokeAction)
				filterContext.Result = new JsonModelErrorResult(state);
		}
		public override void OnActionExecuted(ActionExecutedContext filterContext)
		{
			base.OnActionExecuted(filterContext);

			var state = GetModelState(filterContext.Controller);
			if (ModelHasErrors(state) && filterContext.Result is EmptyResult)
				filterContext.Result = new JsonModelErrorResult(state);
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