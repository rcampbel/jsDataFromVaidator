'use strict';

var customMatchers = {
	// isArray: function(util, customEqualityTesters) {
		// return {
			// compare: function(actual) {
				// var result = {};

				// result.pass = (actual && typeof actual === 'object' && actual instanceof Array);
				// result.message = "Expected " + actual + " to be an Array";

				// return result;
			// }
		// };
	// }
};

describe("Helper Function", function () {

	describe("isEmpty, ", function () {
		
		var emptyObj = {},
			nonEmptyObj = {
				"one" : 1
			},
			emptyArray = [],
			nonEmptyArray = ["one"],
			emptyString = "",
			nonEmptyString = "one",
			undefValue;
	
		it("checks to see if an empty array is empty", function(){
			expect(isEmpty(emptyArray)).toEqual(true);
		});

		it("checks to see if an not empty array is empty", function () {
			expect(isEmpty(nonEmptyArray)).toEqual(false);
		});

		it("checks to see if an empty object is empty", function () {
			expect(isEmpty(emptyObj)).toEqual(true);
		});

		it("checks to see if an not empty object is empty", function () {
			expect(isEmpty(nonEmptyObj)).toEqual(false);
		});

		it("checks to see if an empty string is empty", function () {
			expect(isEmpty(emptyString)).toEqual(true);
		});

		it("checks to see if an not empty string is empty", function () {
			expect(isEmpty(nonEmptyString)).toEqual(false);
		});
		
		it("checks to see if an undefined value is empty", function () {
			expect(isEmpty(undefValue)).toEqual(true);
		});
	});

	describe("isArray", function () {
	
		it("[] is an array", function () {
			expect(isArray([])).toEqual(true);
		});
		
		it("Array is an array", function () {
			expect(isArray(new Array())).toEqual(true);
		});
		
		it("'array' is not an array", function () {
			expect(isArray("array")).toEqual(false);
		});
		
		it("Object is not an array", function () {
			expect(isArray(new Object())).toEqual(false);
		});
		
		it("{} is not an array", function () {
			expect(isArray({})).toEqual(false);
		});
		
		it("null is not an array", function () {
			expect(isArray(null)).toEqual(false);
		});
		
		it("<blank> is not an array", function () {
			expect(isArray()).toEqual(false);
		});	
	});
	
	describe("toRegex", function() {
		describe("returns null when passed", function() {
			it("object", function() {
				expect(toRegex({})).toEqual(null);
			});
			
			it("array", function() {
				expect(toRegex([])).toEqual(null);
			});
			
			it("null", function() {
				expect(toRegex(null)).toEqual(null);
			});
			
			it("undefined", function() {
				expect(toRegex()).toEqual(null);
			});
				
			it("number", function() {
				expect(toRegex(123)).toEqual(null);
				expect(toRegex("123")).toEqual(null);
			});
		});
		
		describe("when passed", function () {
			it("an RegExp to return the RegExp", function () {
				var regex = new RegExp("test");
				expect(toRegex(regex)).toEqual(regex);
			});
			
			describe("a string", function(){
				
				it("it returns a RegExp", function() {
					var testString = "test";
					expect(toRegex(testString)).toEqual(new RegExp(testString));
				});
				
				it("it trims the string", function() {
					spyOn(String.prototype, "trim").and.callThrough();
					toRegex(" test");
					expect(String.prototype.trim).toHaveBeenCalled();
				});
				
				it("that leads with a / it returns a RegExp that does not have a // in front", function() {
					expect(toRegex("/test/")).toEqual(new RegExp("test"));
				});
			});
		});
	});

	describe("objectLength", function() {
		
		it("returns -1 if prama is not defined", function() {
			expect(objectLength()).toEqual(-1);
		});
		
		it("returns -1 if prama is null", function() {
			expect(objectLength(null)).toEqual(-1);
		});
		
		it("returns -1 if prama is not an object", function() {
			expect(objectLength("")).toEqual(-1);
		});
	
		it("return the size of an array passed to it", function () {
			expect(objectLength([])).toEqual(0);
			expect(objectLength([1,2])).toEqual(2);
		});
		
		it("return the number of ownPropertyKeys in object passed to it", function () {
			expect(objectLength({})).toEqual(0);
			expect(objectLength({a: 1,b: 2})).toEqual(2);
		});
			
	});

	describe("retrunKeyMatch", function() {
		var regex,
			obj,
			objLength,
			numberOfMatches;
		
		beforeEach(function() {
			regex = "/^test$/";
			obj = {
				"test" : 1,
				"aTest" :2
			};
			objLength = 2;
			numberOfMatches = 1;
		});
		
		it("is a function", function() {
			expect(window.returnKeyMatch).toEqual(jasmine.any(Function));
		});
		
		it("calls toRegex", function () {
			spyOn(window, "toRegex");
			returnKeyMatch();
			expect(window.toRegex).toHaveBeenCalled();
		});
		
		it("calls toRegex with the passed in RegExp", function() {
			spyOn(window, "toRegex");
			returnKeyMatch(regex);
			expect(window.toRegex).toHaveBeenCalledWith(regex);
		});
		
		it("calls RegExp.test", function() {
			var regexSpy = jasmine.createSpy("RegExp.test()"),
				_test = RegExp.prototype.test;
				
			RegExp.prototype.test = regexSpy;
						
			returnKeyMatch(regex, obj);
			expect(regexSpy).toHaveBeenCalled();
			
			RegExp.prototype.test = _test;
		});
		
		it("calls RexExp.test once for each key in object passed in", function () {
			var regexSpy = jasmine.createSpy("RegExp.test()"),
				_test = RegExp.prototype.test;
				
			RegExp.prototype.test = regexSpy;
						
			returnKeyMatch(regex, obj);

			expect(regexSpy.calls.count()).toEqual(objLength);
			
			RegExp.prototype.test = _test;
		});
		
		it("it returns an array", function () {
			expect(returnKeyMatch(regex, obj)).toEqual(jasmine.any(Array));
		});
		
		it("it returns the matched keys in an array", function() {
			expect(returnKeyMatch(regex, obj)).toContain("test");
		});
		
		it("it returns an empty array if data is not defined", function () {
			expect(returnKeyMatch(regex)).toEqual(jasmine.any(Array));
		});
		
		it("it returns an empty array if data is null", function () {
			expect(returnKeyMatch(regex, null)).toEqual(jasmine.any(Array));
		});
		
		it("it returns an empty array if data is not a object", function () {
			expect(returnKeyMatch(regex, "why")).toEqual(jasmine.any(Array));
		});
		
	});
	
	describe("uniqueMergeArray", function() {
		it("is a function", function() {
			expect(window.uniqueMergeArray).toEqual(jasmine.any(Function));
		});
		
		it("calls isArray", function() {
			spyOn(window, "isArray");
			uniqueMergeArray("");
			expect(window.isArray).toHaveBeenCalled();
		});
		
		it("calls isArray once for each argument", function() {
			spyOn(window, "isArray");
			uniqueMergeArray("", [1,2,3]);
			expect(window.isArray.calls.count()).toEqual(2);
		});
		
		it("it returns an array", function() {
			expect(uniqueMergeArray("", [1,2,3])).toEqual(jasmine.any(Array));
		});
		
		it("it returns an array with the arrays merged into one", function() {
			var mergedArrays = uniqueMergeArray(["a"], ["b","c"]);
			expect(mergedArrays).toContain("a");
			expect(mergedArrays).toContain("b");
			expect(mergedArrays).toContain("c");
		});
	});
});

describe("Profile processing function", function(){
	var profile,
		data,
		singleRegex = "",
		multiRegex = [];
	
	beforeEach(function() {
		jasmine.addMatchers(customMatchers);
	});
	
	describe("processRegexOption", function() {
		
		var settings = {};
		
		beforeEach(function() {
			settings = {
				data: {},
				outputKey: "injectTest",
				processKey: "injectTest",
				profile: {}
			};
			
		});
	
		it("is a function", function() {
			expect(window.processRegexOption).toEqual(jasmine.any(Function));
		});
		
		describe("when passed settings", function() {
			describe("with an outputKey", function() {
				
				it("that is not a string, it returns the profile unchanged", function() {
					settings.profile = {"a":1, "b":2};
					settings.outputKey = [];
					settings.processKey = "a";
					
					var testProfile = JSON.parse(JSON.stringify(settings.profile)),
						newProfile = processRegexOption(settings);
									
					expect(newProfile).toEqual(testProfile);
				});
			
				describe("that is undefined in the profile", function() {
					it("it adds the outputKey to the profile", function() {
						settings.outputKey = "injectTest";
						settings.processKey = "a"
						settings.profile = {"a":1, "b":2};
						
						var newProfile = processRegexOption(settings);
						expect(newProfile[settings.outputKey]).toBeDefined();
					});
			
					it("it adds the outputKey to the profile with a value of []", function() {
						settings.outputKey = "injectTest";
						settings.processKey = "a"
						settings.profile = {"a":1, "b":2};
						
						var newProfile = processRegexOption(settings);
						expect(newProfile[settings.outputKey]).toEqual(jasmine.any(Array));
					});
				});
				
				it("that is null, it sets the outputKey to with a value of []", function() {
					settings.outputKey = "injectTest";
					settings.profile = {"injectTest" : null, "injectRegex": "a"};
					settings.processKey = "injectRegex";
					
					var newProfile = processRegexOption(settings);
					expect(newProfile[settings.outputKey]).toEqual(jasmine.any(Array));
				});
			});
			
			describe("with a processKey", function() {
			
				it("that is not a string, it returns the profile unchanged", function() {
					settings.profile = {"a":1, "b":2};
					settings.outputKey = "injectString";
					settings.processKey = [];
					
					var testProfile = JSON.parse(JSON.stringify(settings.profile)),
						newProfile = processRegexOption(settings);
					
					expect(newProfile).toEqual(testProfile);
				});
				
				it("that does not exist in the profile, it returns the profile unchanged", function () {
					settings.profile = {"a":1, "b":2};
					settings.outputKey = "injectString";
					settings.processKey = "injectRegex";
					
					var testProfile = JSON.parse(JSON.stringify(settings.profile)),
						newProfile = processRegexOption(settings);
					
					expect(newProfile).toEqual(testProfile);
				});
				
				it("that is null in the profile, it returns the profile unchanged", function () {
					settings.profile = {"a":1, "b":2, "injectRegex": null};
					settings.outputKey = "injectString";
					settings.processKey = "injectRegex";
					
					var testProfile = JSON.parse(JSON.stringify(settings.profile)),
						newProfile = processRegexOption(settings);
					
					expect(newProfile).toEqual(testProfile);
				});				
			});
		});

		describe('calls the function', function() {
			
			describe('isArray', function() {
				beforeEach(function() {
					spyOn(window, "isArray");
				});

				it('when settings.processKey is supplied', function () {
					settings.processKey = "testKey";
					settings.outputKey = "injectString";
					settings.profile.testKey = /^test/;
					
					processRegexOption(settings);

					expect(window.isArray).toHaveBeenCalled();
				});

				it("with settings.profile.[settings.processKey]", function() {
					settings.processKey = "testKey";
					settings.outputKey = "injectString";
					settings.profile.testKey = /^test/;
					
					processRegexOption(settings);

					expect(window.isArray).toHaveBeenCalledWith(settings.profile.testKey);
				});
			});

			describe('returnKeyMatch', function() {
				beforeEach(function() {
					spyOn(window, "returnKeyMatch").and.returnValue([]);
				});
				it('once when one settings.processKey is supplied', function() {
					settings.processKey = "testKey";
					settings.outputKey = "injectString";
					settings.profile.testKey = /^test/;

					processRegexOption(settings);

					expect(window.returnKeyMatch).toHaveBeenCalled();
				});	

				it('with settings.profile[settings.processKey] and settings.data', function() {
					settings.processKey = "testKey";
					settings.outputKey = "injectString";
					settings.profile.testKey = /^test/;

					processRegexOption(settings);

					expect(window.returnKeyMatch).toHaveBeenCalledWith(settings.profile.testKey, settings.data);

				});

				it("twice when the settings.profile[settings.processKey] contains more then one value", function() {
					settings.processKey = "testKey";
					settings.outputKey = "injectString";
					settings.profile.testKey = [/^test/, "value\d"];

					processRegexOption(settings);

					expect(window.returnKeyMatch.calls.count()).toBe(2);					
				});
			});

			// Can only test that it is being called since I have found no good way of syping on Function.prototype.apply
			it("uniqueMergeArray", function() {
					
				settings.processKey = "testKey";
				settings.outputKey = "injectString";
				settings.profile.testKey = [/^test/, "value\d"];

				spyOn(window, "uniqueMergeArray");
				
				processRegexOption(settings);
				
				expect(window.uniqueMergeArray).toHaveBeenCalled();
			});	
		});
	});
		
	


});