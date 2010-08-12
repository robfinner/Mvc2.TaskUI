$(document).ready(function()
{
	var forms = $("form.hijax");
	$.each(forms, function(i, form)
	{
		$(form).submit(function(event)
		{
			event.preventDefault();
			event.stopPropagation();

			if (form.onSubmit && false === form.onSubmit())
				return; // must explictly return false to stop processing

			form.hideInputErrors ? form.hideInputErrors() : hideInputErrors(form);

			var action = (form.action || window.location).toString();
			var url = action + (action.indexOf("?") < 0 ? "?" : "&") + "RequestId=" + "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) { var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 0x3 | 0x8; return v.toString(16); }).toUpperCase();
			ajax(form, url, 0);
		});
	});

	function ajax(form, url, attempt)
	{
		if (++attempt > parseInt(form.attempts || 3)) // max 3 attempts in case of failure
			return onFailure(form);

		$.ajax({
			cache: false,
			data: $(form).serialize(),
			dataType: "text",
			error: function(xhr) { handle(form, xhr, url, attempt); },
			success: function(data, status, xhr) { handle(form, xhr, url, attempt); },
			timeout: parseInt(form.timeout || 3500), // 3.5 seconds
			type: (form.method || "post"),
			url: url
		});
	}
	function handle(form, xhr, url, attempt)
	{
		try
		{
			switch (xhr.status)
			{
				case 200: return form.onSuccess ? form.onSuccess(parseResponse(xhr)) : undefined;
				case 399: return onRedirect(form, xhr.getResponseHeader("Location"));
				case 400: return onInputErrors(form, parseResponse(xhr));
				default: return ajax(form, url, attempt);
			}
		} catch (exception) { ajax(form, url, attempt); }

		if (form.onStatus)
			form.onStatus(attempt);
	}
	function parseResponse(xhr)
	{
		var responseText = xhr.responseText || "";
		if (responseText.length === 0)
			return "";

		var contentType = (xhr.getResponseHeader("Content-Type") || "").toString();
		if (contentType.indexOf("application/json") < 0)
			return responseText;

		return (JSON ? JSON.parse(responseText) : eval(responseText));
	}
	function onFailure(form)
	{
		form.onFailure ? form.onFailure() : window.alert("Whoops!  We messed up!  Don't worry, it's not your fault.  It looks like our system isn't responding correctly right now.  Give it a minute and try again.");
	}
	function onRedirect(form, url)
	{
		form.onRedirect ? form.onRedirect(url) : window.location = url;
	}
	function onInputErrors(form, errors)
	{
		if (form.onInputErrors)
			return form.onInputErrors();

		var summary = "";
		$.each(errors, function(i, error)
		{
			var element = $("#" + error.ElementId, form);
			element.addClass("input-validation-error").attr("_title", element.attr("title")).attr("title", error.Message);
			summary += "<li>" + error.Message + "</li>";
		});

		$(".hijaxSummary", form).html("<ul>" + summary + "</ul>");
	}
	function hideInputErrors(form)
	{
		$(".hijaxSummary", form).html("");
		$(":input", form).each(function(i, element)
		{
			element = $(element);
			element.removeClass("input-validation-error").attr("title", element.attr("_title"));
		});
	}
});