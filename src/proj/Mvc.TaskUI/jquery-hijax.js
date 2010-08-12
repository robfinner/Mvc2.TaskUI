$.hijax = function(form, options)
{
	options = options || {};
	options.timeout = options.timeout || 3500; // 3.5 seconds
	options.attempts = 3; // 2 attempts
	options.errorContainer = options.errorContainer || undefined; // TODO
	options.errorWrapper = options.errorWrapper || "li";
	options.validationCssClass = options.validationCssClass || "input-validation-error";
	options.onSubmit = options.onSubmit || function() { };
	options.onSuccess = options.onSuccess || function() { };
	options.onValidationErrors = options.onValidationErrors || onValidationErrors;
	options.onRedirect = options.onRedirect || onRedirect;
	options.onFailure = options.onFailure || onFailure;
	options.onStatus = options.onStatus || function() { };

	function onFailure()
	{
		window.alert("Whoops!  We messed up!  Don't worry, it's not your fault.  It looks like our system isn't responding correctly right now.  Give it a minute and try again.");
	}
	function onRedirect(url)
	{
		window.location = url;
	}
	function onValidationErrors(errors)
	{
		var container = options.errorContainer;
		var errors1 = {};

		$.each(errors, function(index, error)
		{
			$('#' + error.Property).addClass(options.validationCssClass);

			errors1[error.Property] = error.Error;

			if (container)
				container.append($(options.errorWrapper) + error.Error + $("/" + errorWrapper));
		});

		if (container)
			container.show();

		if (options.validator)
			options.validator.showErrors(errors1);
	}
	function clearValidationErrors()
	{
		$(":input").each(function(index, input)
		{
			$(input).removeClass(options.validationCssClass)
		});

		if (options.validator)
			options.validator.showErrors();

		if (!options.errorContainer)
			return;

		options.errorContainer.hide();
		options.errorContainer.children.remove();
	}
	form.submit(function(event)
	{
		event.preventDefault();
		event.stopPropagation();

		clearValidationErrors();

		var continueSubmit = options.onSubmit();
		if (false === continueSubmit)
			return; // must explictly return false to stop processing

		var action = (form.attr("action") || window.location).toString();
		var url = action + (action.indexOf("?") < 0 ? "?" : "&") + "RequestId=" + "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) { var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 0x3 | 0x8; return v.toString(16); }).toUpperCase();
		ajax(url, 0);
	});
	function ajax(url, attempt)
	{
		if (++attempt > options.attempts)
			return onFailure();

		$.ajax({
			cache: false,
			data: form.serialize(),
			dataType: "text",
			error: function(xhr) { onReceive(xhr, url, attempt); },
			success: function(data, status, xhr) { onReceive(xhr, url, attempt); },
			timeout: options.timeout,
			type: (form.attr("method") || "post"),
			url: url
		});
	}
	function onReceive(xhr, url, attempt)
	{
		try
		{
			switch (xhr.status)
			{
				case 200: return options.onSuccess(parseResponseText(xhr));
				case 399: return options.onRedirect(xhr.getResponseHeader("Location"));
				case 400: return options.onValidationErrors(parseResponseText(xhr));
				default: return ajax(url, attempt);
			}
		} catch (exception) { ajax(url, attempt); }

		options.onStatus(attempt, options.attempts);
	}
	function parseResponseText(xhr)
	{
		var responseText = xhr.responseText || "";
		if (responseText.length === 0)
			return "";

		var contentType = (xhr.getResponseHeader("Content-Type") || "").toString();
		if (contentType.indexOf("application/json") < 0)
			return responseText;

		return (JSON ? eval(responseText) : JSON.parse(responseText));
	}
}