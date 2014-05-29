window.FormValidator = function(jqSelector, defaultReturnValue, onPassFn)
{
		var form = this;
		form._selector = jqSelector;
		form._watches = new Array();

		form._onAllIsGood = function()
		{

		};
		if(typeof(onPassFn) == "function")
		{
			form._onAllIsGood = onPassFn;
		}
		form._defaultReturnValue = true;
		if(typeof(defaultReturnValue) == "boolean")
		{
			form._defaultReturnValue = defaultReturnValue;
		}
}
window.FormValidator.prototype.ensure = function(jqChildElement, fn, errorMsg, onError)
{
		var form = this;
		if(!jqChildElement)
		{
			throw "argument one is expecting a jquery Element to be passed";
		}
		if(!fn)
		{
			throw "argument two should be a function that returns true or false";
		}
		//if(!errorMsg && !onError)
		//{
		//	throw "argument three needs to be an error message, or...argument three may be an empty string if a fourth argument is passed as a callback function when argument two returns false";
		//}
		form._watches.push(
		{
			selector: jqChildElement,
			validationFn: fn,
			errorMsg: errorMsg,
			errorFn: onError,
			async: false
		});
}
window.FormValidator.prototype.ensureAsync = function(jqChildElement, dataFn, responseValidationFn, url, method, errorMsg, onError)
{
		var form = this;
		var els = $(form._selector).find(jqChildElement);
		var resultss = [];
		els.each(function(idx, Elm)
		{
			resultss.push("pending");
		});
		form._watches.push(
		{
			selector: jqChildElement,
			dataFn: dataFn,
			responseFn: responseValidationFn,
			url: url,
			method: method,
			errorMsg: errorMsg,
			errorFn: onError,
			async: true,
			results: resultss
		});
}
window.FormValidator.prototype._checkResults = function()
{
	var form = this;
	$(".formvalidation_error").each(function(idx, Elm)
	{
		$(Elm).removeClass("form_validation_error");
		$(Elm).blur(function(idx2, Elm2)
		{
			$(Elm2).removeClass("form_validation_error");
		});
	});
	$(".formvalidation_message").each(function(i, e){$(e).detach();});
	for(var i = 0; i < form._watches.length; i++)
	{
		var results = new Array();
		for(var k = 0; k < $(form._selector).find(form._watches[i]["selector"]).size(); k++)
		{
			if(!form._watches[i]["async"])
			{
				results.push(form._watches[i].validationFn($(form._selector).find(form._watches[i]["selector"]).eq(k)));
			}
		    else
		    {
		    	//console.log(form._watches[i]);
		    	if(form._watches[i].results[k] == "pending")
		    	{
					var url = form._watches[i]["url"];
		    		var key_vals = form._watches[i].dataFn($(form._selector).find(form._watches[i]["selector"]).eq(k));
		    		if(form._watches[i]["method"] == "GET")
		    		{
						var do_qmark = true;
		    			for(var key in key_vals)
		    			{
		    				if(do_qmark)
		    				{
		    					url += "?";
		    				}
		    				else
		    				{
		    					url += "&";
		    				}
		    				do_qmark = false;
		    				url += key + "=" + encodeURIComponent(key_vals[key]);
		    			}
		    			$.get(url).done(function(d)
		    			{
		    				form._watches[i]["results"][k] = form._watches[i].responseFn(d, $(form._selector).find(form._watches[i]["selector"]).eq(k));
		    				$(form._selector).eq(0).submit();
							setTimeout(function()
							{
								form._watches[i]["results"][k] = "pending";
							}, 100);
		    			});
					return false;
		    		}
		    		else if(form._watches[i]["method"] == "POST")
		    		{
		    			$.post(url, key_vals).done(function(d)
		    			{
		    				form._watches[i]["results"][k] = form._watches[i].responseFn(d, $(form._selector).find(form._watches[i]["selector"]).eq(k));
		    				$(form._selector).eq(0).submit();
							setTimeout(function()
							{
								form._watches[i]["results"][k] = "pending";
							}, 100);

		    			});
					return false;
		    		}

		    	}
		    	else
		    	{
		    		results.push(form._watches[i]["results"][k]);
		    	}
		    }
		}
		var do_custom_callback = (((form._watches[i].errorMsg === "") || (!form._watches[i].errorMsg)) && (typeof(form._watches[i].errorFn) != "undefined"))
		for(var k = 0; k < results.length; k++)
		{
			if(!results[k])
			{
				$(form._selector).find(form._watches[i]["selector"]).eq(k).addClass("formvalidation_error");
				if(do_custom_callback)
				{
					form._watches[i].errorFn();
					return false;
				}
				else
				{
					var off = $(".formvalidation_error").eq(0).offset();
					var ll = off.left;
					var tt = off.top;

					var width = $(".formvalidation_error").eq(0).width();
					var h = $(".formvalidation_error").eq(0).height();

					ll += '';
					tt += '';
					width += '';
					h += '';

					ll = ll.replace("px", "");
					tt = tt.replace("px", "");
					width = width.replace("px", "");
					h = h.replace("px", "");

					ll *= 1.0;
					tt *= 1.0;
					width *= 1.0;
					h *= 1.0;

					ll = parseInt(ll);
					tt = parseInt(tt);
					width = parseInt(width);
					h = parseInt(h);

					var msg = $("<p></p>");
					msg.text(form._watches[i]["errorMsg"]);
					msg.addClass("formvalidation_message");
					msg.css("position", "absolute")
						.css("display", "block")
						.css("left", ((ll + '') + 'px'))
						.css("top", ((tt + '') + 'px'))
						.css("min-height", ((h + '') + 'px'))
						.css("width", ((width + '') + 'px')).appendTo("body");
					msg.click(function()
					{
						msg.detach();
					});
				}

				try
				{
					$(form._selector).find(form._watches[i]["selector"]).eq(k)[0].focus();
				}
				catch(e2)
				{
					var h = $(window).height();
					h = h + '';
					h = h.replace("px", "");
					h = h + 0;
					h = parseInt(h);

					var ot = $(form._selector).find(form._watches[i]["selector"]).eq(k).offset().top;
					ot = ot + '';
					ot = ot.replace("px", "");
					ot = ot + 0;
					ot = parseInt(ot);
					if(ot > h)
					{
						$(window).scrollTop(ot - h);

					}
				}
				return false;
			}
		}
	}
	form._onAllIsGood();
	return form._defaultReturnValue;
}
window.FormValidator.prototype.watch = function()
{
		var form = this;
		$(form._selector).submit(function()
		{
			return form._checkResults();
		});
}
