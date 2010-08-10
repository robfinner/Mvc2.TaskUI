namespace Mvc.TaskUI
{
	using System.Web.Mvc;

	public class JavascriptRedirectResult : ActionResult
	{
		private const int HttpRedirectStatusCode = 399;
		private const string HttpRedirectStatus = "399 Javascript Redirect";
		private const string LocationHeader = "Location";
		private readonly string url;

		public JavascriptRedirectResult(string url)
		{
			this.url = url;
		}

		public override void ExecuteResult(ControllerContext context)
		{
			var response = context.HttpContext.Response;

			response.Status = HttpRedirectStatus;
			response.StatusCode = HttpRedirectStatusCode;
			response.AddHeader(LocationHeader, this.url);
		}
	}
}