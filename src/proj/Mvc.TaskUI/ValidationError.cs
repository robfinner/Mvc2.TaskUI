namespace Mvc.TaskUI
{
	public class ValidationError
	{
		public ValidationError()
		{
		}

		public ValidationError(string property, string message)
			: this()
		{
			this.Property = property ?? string.Empty;
			this.Message = message ?? string.Empty;
		}

		public string Property { get; set; }
		public string Message { get; set; }
	}
}