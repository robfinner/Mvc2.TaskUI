namespace Mvc.TaskUI
{
	using System.Collections.Generic;
	using System.Linq;
	using System.Web.Mvc;

	public class JsonModelErrorResult : JsonResult
	{
		private const int BadRequestHttpStatusCode = 400;
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
			context.HttpContext.Response.StatusCode = BadRequestHttpStatusCode;

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