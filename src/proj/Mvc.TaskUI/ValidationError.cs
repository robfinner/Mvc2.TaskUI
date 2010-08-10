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
			this.PropertyName = propertyName ?? string.Empty;
			this.ErrorMessage = errorMessage ?? string.Empty;
		}

		public string PropertyName { get; set; }
		public string ErrorMessage { get; set; }
	}
}