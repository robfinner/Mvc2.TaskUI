namespace Mvc.TaskUI
{
	public class ValidationError
	{
		public ValidationError()
		{
		}

		public ValidationError(string property, string error)
			: this()
		{
			this.ElementId = property ?? string.Empty;
			this.Message = error ?? string.Empty;
		}

		public string ElementId { get; set; }
		public string Message { get; set; }
	}
}