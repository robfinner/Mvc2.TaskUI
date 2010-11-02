$(document).ready(function () {
    $("body").delegate("form.hijax", "submit", function (event) {
        if (event.preventDefault)
            event.preventDefault();
            
        if (event.stopPropagation)
            event.stopPropagation();

		if (this.onSubmit && false === this.onSubmit())
			return false; // this.onSubmit must explictly return false to stop processing

		if (this.requestId)
			return false; // form is busy processing another request; avoid duplicate submit.

		this.requestId = newGuid();

		if (this.onInit)
			this.onInit();

		this.hideInputErrors ? this.hideInputErrors() : hideInputErrors(this);

		var url = (this.action || "").toString().replace(/^(https?\:)?(.*)$/i, "$2");
		url += (url.indexOf("?") < 0 ? "?" : "&") + "RequestId=" + this.requestId;
		ajax(this, url, 0);

		return false;
	});

	function newGuid() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
			.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 0x3 | 0x8;
				return v.toString(16);
			});
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

		var maxAttempts = parseInt($(form).attr("attempts") || 3) - 1; // 3 retries on failure
		if (retry && attempt < maxAttempts) 
			return ajax(form, url, attempt + 1);

		form.requestId = undefined;
		
		if (retry)
			onFailure(form);

		if (form.onComplete)
			form.onComplete();
	}
	function parseResponse(xhr) {
		if (!xhr.responseText)
			return "";

		var contentType = (xhr.getResponseHeader("Content-Type") || "").toLowerCase();
		return (contentType.indexOf("application/json") < 0) ? responseText : $.parseJSON(responseText);
	}
	function onFailure(form) {
		form.onFailure ? form.onFailure() : alert("Whoops!  Something's wrong.  But don't worry, it's not your fault.  It looks like our system isn't responding properly right now.  Give it a minute and try again.");
	}
	function onRedirect(form, url) {
		if (form.onRedirect)
			return form.onRedirect(url);

		if (url)
			location = !window._href && url.match(/^https?\:/i) ? url : window._href + url;
	}
	function onInputErrors(form, errors) {
		if (form.onInputErrors)
			return form.onInputErrors(errors, showInputErrors);

		showInputErrors(form, errors);
	}
	function showInputErrors(form, errors) {
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