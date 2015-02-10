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

describe("Profile processing", function(){
	var profile,
		data,
		singleRegex = "",
		multiRegex = [];
	
	beforeEach(function() {
		jasmine.addMatchers(customMatchers);
	});
	
	describe("of required_regex", function() {
		beforeEach(function () {

			profile = {};
			data = {
				"field1" : "a",
				"field2" : ["c","d"],
				"radio1" : "e",
				"radio2" : "f",
				"value1" : ""
			};
			
			singleRegex = /^field\d+/;
			multiRegex = [/^field\d+/, "/^value\\d+$/"];
			
			spyOn(String.prototype, 'match').and.callThrough();
		});
		
		describe("is passed a profile", function () {
			describe("that is null", function () {
				it("it throws an execption", function() {
					expect(function() {
						processRequiredRegex(null);
					}).toThrowError();
				});

				it("it throws a TypeError exception with eht message of invalidProfile", function() {
					expect(function() {
						processRequiredRegex(null);
					}).toThrow(new TypeError("invalidProfile"));
				});
			});
			
			describe("that is a string", function () {
				it("it throws an execption", function() {
					expect(function() {
						processRequiredRegex("test");
					}).toThrowError();
				});

				it("it throws a TypeError exception with the message of invalidProfile", function() {
					expect(function() {
						processRequiredRegex("test");
					}).toThrow(new TypeError("invalidProfile"));
				});
			});
			
			describe("that is an array", function () {
				it("it throws an execption", function() {
					expect(function() {
						processRequiredRegex(["test"]);
					}).toThrowError();
				});

				it("it throws a TypeError exception with the message of invalidProfile", function() {
					expect(function() {
						processRequiredRegex(["test"]);
					}).toThrow(new TypeError("invalidProfile"));
				});
			});
			
			describe("that is an object", function() {
				it("it returns a value", function () {
					var _profile;
					
					profile.require_regex = singleRegex;
					_profile = processRequiredRegex(profile, data);
					
					expect(_profile).toBeDefined();
				});
														
				describe("without predifined required attribute", function() {
				
					beforeEach(function() {
						profile.required_regex = "someVal";
					});
				
					it("it adds the key requried to the returned profile", function() {
						var _profile;
						_profile = processRequiredRegex(profile, data);
					
						expect(_profile.hasOwnProperty("required")).toEqual(true);
					});
					
					it("it adds the key requried and sets it to be an array to the returned profile", function() {
						var _profile;
						_profile = processRequiredRegex(profile, data);
					
						expect(_profile.required).toEqual(jasmine.any(Array));
					});					
				});
				
				describe("throws a TypeErrror with the message of invalidProfile when requried is defined and is", function(){
					it("an empty string", function() {
						profile.required = "";
						profile.required_regex = singleRegex;
						expect(function() {
							processRequiredRegex(profile, data);
						}).toThrow(new TypeError("invalidProfile"))
					});
					
					it("an empty object", function() {
						profile.required = {};
						profile.required_regex = singleRegex;
						expect(function() {
							processRequiredRegex(profile, data);
						}).toThrow(new TypeError("invalidProfile"))
					});
				});
				
				describe("with requried_regex", function() {
					
					describe("is not in the profile", function() {
						it("it returns the profile unchanged", function(){
							var _profile,
								selfProfile;
							
							selfProfile =  JSON.parse(JSON.stringify(profile));
							_profile = processRequiredRegex(profile, data);
					
							expect(_profile).toEqual(selfProfile);
						});
					});
										
					describe("as null", function() {
						it("it returns the profile unchanged", function(){
							var _profile,
								selfProfile;
							
							profile.required_regex = null;
							selfProfile =  JSON.parse(JSON.stringify(profile));
							_profile = processRequiredRegex(profile, data);
					
							expect(_profile).toEqual(selfProfile);
						});
					});
					
					describe("as a string", function() {
						it("that is empty, it returns the profile unchanged", function () {
							var _profile,
								selfProfile;
							profile.required_regex = "";
							selfProfile =  JSON.parse(JSON.stringify(profile));
							_profile = processRequiredRegex(profile, data);
					
							expect(_profile).toEqual(selfProfile);
						});						
					});
										
					describe("as an Array", function() {
						
						it("it returns the profile unchanged when empty", function(){
							var _profile,
								selfProfile;
							
							profile.required_regex = [];
							selfProfile =  JSON.parse(JSON.stringify(profile));
							_profile = processRequiredRegex(profile, data);
					
							expect(_profile).toEqual(selfProfile);
						});
					});
					
					
				});
				
			});
		});

		describe("is passed data", function() {
			it("that is undeifned, it returns the profile unchanged", function () {
				var _profile,
					selfProfile;
					
				profile.required_regex = "test";
				selfProfile = JSON.parse(JSON.stringify(profile));
				_profile = processRequiredRegex(profile);
				
				expect(_profile).toEqual(selfProfile);
			});
			
			it("that is null, it returns the profile unchanged", function () {
				var _profile,
					selfProfile;
					
				profile.required_regex = "test";
				selfProfile = JSON.parse(JSON.stringify(profile));
				_profile = processRequiredRegex(profile, null);
				
				expect(_profile).toEqual(selfProfile);
			});
			
			it("that is a non-object, it returns the profile unchanged", function () {
				var _profile,
					selfProfile;
					
				profile.required_regex = "test";
				selfProfile = JSON.parse(JSON.stringify(profile));
				_profile = processRequiredRegex(profile, "test");
				
				expect(_profile).toEqual(selfProfile);
			});
			
			it("that is an Array, it returns the profile unchanged", function () {
				var _profile,
					selfProfile;
					
				profile.required_regex = "test";
				selfProfile = JSON.parse(JSON.stringify(profile));
				_profile = processRequiredRegex(profile, ["test"]);
				
				expect(_profile).toEqual(selfProfile);
			});
			
			describe("that is an object", function() {
				
				it("it calls objectLength", function() {
					var _profile,
						selfProfile;
					
					spyOn(window, "objectLength");
					profile.required_regex = "test";
					selfProfile = JSON.parse(JSON.stringify(profile));
					_profile = processRequiredRegex(profile, {});
					
					expect(window.objectLength).toHaveBeenCalled();
				});
								
				it("it calls objectLength with the supplied data", function() {
					var _profile,
						selfProfile;
					
					spyOn(window, "objectLength");
					profile.required_regex = "test";
					selfProfile = JSON.parse(JSON.stringify(profile));
					_profile = processRequiredRegex(profile, data);
					
					expect(window.objectLength).toHaveBeenCalledWith(data);
				});
				
				it("which is empty returns the profile unchanged", function () {
					var _profile,
						selfProfile;
					
					profile.required_regex = "test";
					selfProfile = JSON.parse(JSON.stringify(profile));
					_profile = processRequiredRegex(profile, {});
					
					expect(_profile).toEqual(selfProfile);
				});
			});
		});
	
		describe("is applied", function() {
			
			describe("when required_regex is a single value", function() {
				beforeEach(function() {
					profile = {
						"required": ["radio1"],
						"required_regex": singleRegex
					};
				});
				it("it calls returnKeyMatch", function() {
					spyOn(window, "returnKeyMatch");
					
					processRequiredRegex(profile, data);
					
					expect(window.returnKeyMatch).toHaveBeenCalled();
				});
				
				it("it calls returnKeyMatch with the required_regex and data", function() {
					spyOn(window, "returnKeyMatch");
					
					processRequiredRegex(profile, data);
					
					expect(window.returnKeyMatch).toHaveBeenCalledWith(profile.required_regex, data);
				});
				
				it("it calls uniqueMergeArray", function() {
					spyOn(window, "uniqueMergeArray");
					
					processRequiredRegex(profile, data);
					
					expect(window.uniqueMergeArray).toHaveBeenCalled();
				});
				
				it("it adds the match fields to the profile.required", function() {
					var _profile;
					
					_profile = processRequiredRegex(profile, data);
					
					expect(_profile.required).toContain("radio1");
					expect(_profile.required).toContain("field1");
					expect(_profile.required).toContain("field2");
				});
			});
			
			describe("when required_regex is an array", function() {
				beforeEach(function() {
					profile = {
						"required": ["radio1"],
						"required_regex": multiRegex
					};
				});
				
				it("it calls returnKeyMatch", function() {
					spyOn(window, "returnKeyMatch");
					
					processRequiredRegex(profile, data);
					
					expect(window.returnKeyMatch).toHaveBeenCalled();
				});
				
				it("it calls returnKeyMatch for each required_regex", function() {
					spyOn(window, "returnKeyMatch");
					
					processRequiredRegex(profile, data);
					
					expect(window.returnKeyMatch.calls.count()).toEqual(profile.required_regex.length);
				});
				
				it("it calls returnKeyMatch with the required_regex and data", function() {
					spyOn(window, "returnKeyMatch");
					
					processRequiredRegex(profile, data);
						
					for (var _value = 0; _value < profile.required_regex.length; _value++) {
						expect(window.returnKeyMatch).toHaveBeenCalledWith(profile.required_regex[_value], data);
					}
				});
				
				it("it calls uniqueMergeArray", function() {
					spyOn(window, "uniqueMergeArray");
					
					processRequiredRegex(profile, data);
					
					expect(window.uniqueMergeArray).toHaveBeenCalled();
				});
				
				it("it adds the match fields to the profile.required", function() {
					var _profile;
					
					_profile = processRequiredRegex(profile, data);
					
					expect(_profile.required).toContain("radio1");
					expect(_profile.required).toContain("field1");
					expect(_profile.required).toContain("field2");
					expect(_profile.required).toContain("value1");
				});
			});
		});
	});
});