namespace Mvc.TaskUI
{
	using System;
	using System.Linq.Expressions;
	using System.Web.Mvc;

	public static class ModelStateExtensions
	{
		public static void AddModelError<T>(
			this ModelStateDictionary modelState, Expression<Func<T>> property, string errorMessage)
		{
			modelState.AddModelError(property.GetName(), errorMessage);
		}
		private static string GetName<T>(this Expression<Func<T>> expression)
		{
			MemberExpression memberExpression = null;

			if (expression.Body.NodeType == ExpressionType.MemberAccess)
				memberExpression = expression.Body as MemberExpression;
			else if (expression.Body.NodeType == ExpressionType.Convert)
				memberExpression = ((UnaryExpression)expression.Body).Operand as MemberExpression;

			return null == memberExpression ? string.Empty : memberExpression.Member.Name;
		}
	}
}