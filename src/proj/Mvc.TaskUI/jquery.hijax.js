$(document).ready(function () {
	var xdBrowser = (window.XDomainRequest || (window.XMLHttpRequest && "withCredentials" in new window.XMLHttpRequest()));

	var forms = $("form.hijax");
	$.each(forms, function () {

		$(this).submit(function (event) {
			event.preventDefault();
			event.stopPropagation();

			if (this.requestId)
				return false;

			if (this.onSubmit && false === this.onSubmit())
				return false; // this.onSubmit must explictly return false to stop processing

			this.requestId = newGuid(); // form is busy processing another request; avoid duplicate submit.

			if (this.onInit)
				this.onInit();

			this.hideInputErrors ? this.hideInputErrors() : hideInputErrors(this);

			var url = getAction(this);
			url += (url.indexOf("?") < 0 ? "?" : "&") + "RequestId=" + this.requestId;
			ajax(this, url, 0);
		});
	});
	function newGuid() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
			.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 0x3 | 0x8;
				return v.toString(16);
			}).toUpperCase();
	}
	function getAction(form) {
		var action = (form.action || "").toString();
		var currentLocation = window.location;
		if (action.length === 0)
			return currentLocation;

		var parsedAction = $("<a />").attr("href", action);
		if (parsedAction.attr("protocol") === currentLocation.protocol
			&& parsedAction.attr("hostname") === currentLocation.hostname
			&& parsedAction.attr("port") === currentLocation.port)
			return action;

		return xdBrowser ? action : $(form).attr("proxy") || "/proxy/" + "?action=" + escape(action);
	}
	function ajax(form, url, attempt) {
		if (form.onStatus)
			form.onStatus(attempt + 1); // make it a 1-based number

		var $form = $(form);
		$.ajax({
			cache: false,
			data: $form.serialize(),
			dataType: "text",
			error: function (xhr) { handle(form, xhr, url, attempt); },
			success: function (data, status, xhr) { handle(form, xhr, url, attempt); },
			timeout: parseInt($form.attr("timeout") || 3500), // 3.5 seconds
			type: (form.method || "post"),
			url: url
		});
	}
	function handle(form, xhr, url, attempt) {
		var retry = false;

		try {
			switch (xhr.status) {
				case 200: form.onSuccess ? form.onSuccess(parseResponse(xhr)) : undefined; break;
				case 399: onRedirect(form, xhr.getResponseHeader("Location")); break;
				case 400: onInputErrors(form, parseResponse(xhr)); break;
				default: retry = true;
			}
		} catch (exception) { retry = true; }

		if (retry && attempt <= parseInt($(form).attr("attempts") || 3)) // 3 retries on failure
			return ajax(form, url, attempt + 1);

		if (retry)
			onFailure(form);

		form.requestId = undefined;

		if (form.onComplete)
			form.onComplete();
	}
	function parseResponse(xhr) {
		var responseText = xhr.responseText || "";
		if (responseText.length === 0)
			return "";

		var contentType = (xhr.getResponseHeader("Content-Type") || "").toString();
		if (contentType.indexOf("application/json") < 0)
			return responseText;

		return (window.JSON ? window.JSON.parse(responseText) : eval(responseText));
	}
	function onFailure(form) {
		form.onFailure ? form.onFailure() : window.alert("Whoops!  We messed up!  Don't worry, it's not your fault.  It looks like our system isn't responding correctly right now.  Give it a minute and try again.");
	}
	function onRedirect(form, url) {
		form.onRedirect ? form.onRedirect(url) : window.location = url;
	}
	function onInputErrors(form, errors) {
		if (form.onInputErrors)
			return form.onInputErrors();

		var summary = "";
		$.each(errors, function () {
			var element = $(":input[name$=" + this.Property + "]", form);
			element.addClass("input-validation-error").attr("_title", element.attr("title")).attr("title", this.Message);
			summary += "<li><label for=\"" + this.Property + "\">" + this.Message + "</label></li>";
		});

		$(".hijaxSummary", form).html("<ul>" + summary + "</ul>").show();
	}
	function hideInputErrors(form) {
		$(".hijaxSummary", form).hide().html("");
		$(":input", form).each(function () {
			$this = $(this);
			$this.removeClass("input-validation-error").attr("title", $this.attr("_title"));
		});
	}
});