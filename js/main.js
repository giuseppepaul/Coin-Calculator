(function ($){

	$.countCoinsClass = function (elem, configs){

		var countCoinsPlugin = this;
		var moneyValidationRegex = new RegExp("^" + configs.lgCurrencyUnit + "?[0-9]+(?:" + configs.delimiter + "[0-9]+)?" + configs.smCurrencyUnit + "?$", "");

		// Checks that the value is a valid monetary value - public method
		countCoinsPlugin.validateMoney = function (val){
			return moneyValidationRegex.test(val);
		}

		// Main function - public method
		countCoinsPlugin.calcCoins = function (val){
			var inputVal = parseFloat(countCoinsPlugin.convertToSmUnits(val));
			var calcTotal = inputVal;
			var coinOutput = new Array();

			for ($x=0; $x < configs.coinValues.length; $x++)
			{
				var currentCoin = configs.coinValues[$x];
				var currentRemainder = calcTotal % currentCoin;
				var totalMinusRemainder = calcTotal - currentRemainder;
				var numberOfCurrentCoins = totalMinusRemainder / currentCoin;

				if (numberOfCurrentCoins > 0)
				{
					calcTotal = calcTotal - totalMinusRemainder;
					coinOutput.push(numberOfCurrentCoins + "x " + configs.coinLabels[$x]);
				}

				if (calcTotal == 0) break;
			}

			return coinOutput;
		}

		// Clean up and convert input value into clean, simple value - public method
		countCoinsPlugin.convertToSmUnits = function (val){
			// Strip out any currency characters
			var cleanVal = val.replace(new RegExp("[" + configs.lgCurrencyUnit + configs.smCurrencyUnit + "]", 'g'),'');
			
			// Split pounds and pence
			var currencyArray = cleanVal.split(configs.delimiter);
	    	var totalSmUnit = 0;

	    	console.log(currencyArray);

	    	// Flags
	    	var hasPound = false;
	    	if (new RegExp("[" + configs.lgCurrencyUnit + "]", 'g').test(val)) hasPound = true;

	    	// Check if the input had any pennies
	    	if (currencyArray.length < 2)
	    	{
	    		// If the input had no decimal then check for a pound sign
	    		if (hasPound){
	    			totalSmUnit = parseInt(currencyArray[0]) * configs.lgUnit;	
	    		}
	    		else {
	    			// Else the user input pennies
	    			totalSmUnit = parseInt(currencyArray[0]);
	    		}
	    	} else {
	    		totalSmUnit = parseInt(currencyArray[0]) * configs.lgUnit;
	    		totalSmUnit = totalSmUnit + parseInt(currencyArray[1].substring(0,2));	
	    	}

	    	return totalSmUnit;
		}

		// Generate validation errors
		var createErrors = function (val){
			// No input
			if (val.length == 0) return configs.errorEmptyInput;

			// Check for invalid characters
			return configs.errorInvalidInput;
		}

		// Create return HTML string
		var buildHTML = function(dataArray){
			var html = "<ul class='list-inline bg-success'>";
			for ($x=0; $x < dataArray.length; $x++)
			{
				html = html + "<li>" + dataArray[$x] + "</li>";
			}
			html = html.substring(0, html.length - 2);
			html = html + "</ul>";
			return html;
		}

		// Add the Enter Key event listener
		elem.keypress(function(e) {
		    if(e.which == configs.submitKey) {
		        
		        $this = $(this);
		        elem.parent().find("ul,p").remove();

		    	// Validate the value
		    	var inputVal = elem.val();

		    	if (countCoinsPlugin.validateMoney(inputVal))
		    	{
		    		var coins = countCoinsPlugin.calcCoins(inputVal);
		    		elem.parent().append(buildHTML(coins));		    		
		    	}
		    	else
		    	{
		    		// Return errors
		    		elem.after("<p class='help-block bg-danger error'>" + createErrors(inputVal) + "</p>");
		    	}
		    }
		});

	}

	$.fn.countCoins = function (options) {
		var opts = $.extend({}, $.fn.countCoins.configs, options);
        return this.each(function () {
            new $.countCoinsClass($(this), opts);
        });
    }

	// Default configs
	$.fn.countCoins.configs = {
		lgUnit			: 100,
		lgCurrencyUnit	: "\u00A3",
		smCurrencyUnit	: "p",
		delimiter		: "\.",
		submitKey		: 13,
		errorEmptyInput : "Oops, looks like you didn't enter a value!",
		errorInvalidInput: "It looks like the value you entered was invalid.",
		coinValues		: [200, 100, 50, 20, 10, 5, 2, 1],
		coinLabels		: ["\u00A32", "\u00A31", "50p", "20p", "10p", "5p", "2p", "1p"]
	};


})(jQuery)












