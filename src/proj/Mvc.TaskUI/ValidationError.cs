namespace Mvc.TaskUI
{
	public class ValidationError
	{
		public ValidationError()
		{
		}

		public ValidationError(string propertyName, string errorMessage)
			: this()
		{
			this.Property = propertyName ?? string.Empty;
			this.Error = errorMessage ?? string.Empty;
		}

		public string Property { get; set; }
		public string Error { get; set; }
	}
}