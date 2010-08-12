namespace Mvc.TaskUI
{
	using System;
	using System.Web.Mvc;

	public static class ModelStateExtensions
	{
		public static void WhenValid(this ModelStateDictionary state, Action action)
		{
			if (state.IsValid)
				action();
		}

		public static void WhenInvalid(this ModelStateDictionary state, Action action)
		{
			if (!state.IsValid)
				action();
		}
	}
}