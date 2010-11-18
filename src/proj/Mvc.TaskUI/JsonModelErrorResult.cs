namespace Mvc.TaskUI
{
	using System.Collections.Generic;
	using System.Linq;
	using System.Web.Mvc;

	public class JsonModelErrorResult : JsonResult
	{
		// We originally had specified 400, but IIS7's CustomErrorModule kept intercepting
		// anything >= 400 and trying to filter and help out.
		// it's way easier to just pick a new, unused code below 400 rather than fight IIS
		private const int StatusCode = 299;
		private const string StatusText = "299 Input Rejected";
		private readonly ModelStateDictionary state;

		public JsonModelErrorResult(ModelStateDictionary state)
		{
			this.state = state;
		}

		public override void ExecuteResult(ControllerContext context)
		{
			if (!this.state.IsValid)
				this.AppendModelErrrors(context);

			base.ExecuteResult(context);
		}
		private void AppendModelErrrors(ControllerContext context)
		{
			this.ContentType = string.Empty; // let the base class append the content type
			context.HttpContext.Response.Status = StatusText;
			context.HttpContext.Response.StatusCode = StatusCode;

			this.Data = this.GetModelErrors();
		}
		private ICollection<ValidationError> GetModelErrors()
		{
			return (from item in this.state
			        from error in item.Value.Errors
			        select new ValidationError(item.Key, error.ErrorMessage)).ToList();
		}
	}
}