var testVar = new $.countCoinsClass($('body'), $.fn.countCoins.configs);

// Test the currency validation
QUnit.test("Test Currency Validation", function() {
  equal(testVar.validateMoney('££'), false, 'Enter pound alone');
  equal(testVar.validateMoney('p'), false, 'Enter pence alone');
  equal(testVar.validateMoney('£p'), false, 'Enter pound and pence, no numbers');
  equal(testVar.validateMoney('ABC123'), false, 'Enter invalid characters');
  equal(testVar.validateMoney('12345'), true, 'Pence only');
  equal(testVar.validateMoney('£123'), true, 'Pounds');
  equal(testVar.validateMoney('£123p'), true, 'Pounds and pence');
  equal(testVar.validateMoney('£123.01p'), true, 'Pounds and pence');
});

// Test pence conversion method
QUnit.test("Test Pence Conversion", function() {
	equal(testVar.convertToSmUnits('432'), 432, '432');
	equal(testVar.convertToSmUnits('213p'), 213, '213p');
	equal(testVar.convertToSmUnits('£16.23'), 1623, '£16.23');
	equal(testVar.convertToSmUnits('£14'), 1400, '£14');
	equal(testVar.convertToSmUnits('£54.04'), 5404, '£54.04');
	equal(testVar.convertToSmUnits('£23.33333'), 2333, '£23.33333');
	equal(testVar.convertToSmUnits('001.41p'), 141, '001.41p');
});

// Test the cal coins method
QUnit.test("Test Calculate Coins", function() {
	deepEqual(testVar.calcCoins('1'), ["1x 1p"], '1 pence');
	deepEqual(testVar.calcCoins('100'), ["1x \u00A31"], '100 pence');
	deepEqual(testVar.calcCoins('1000'), ["5x \u00A32"], '1000 pence');
	deepEqual(testVar.calcCoins('1001'), ["5x \u00A32", "1x 1p"], '1001 pence');
});