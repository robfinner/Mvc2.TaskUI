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
			this.Property = property ?? string.Empty;
			this.Error = error ?? string.Empty;
		}

		public string Property { get; set; }
		public string Error { get; set; }
	}
}