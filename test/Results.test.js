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

	describe("returnKeyMatch", function() {
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

		it("it returns an array with the arrays and non-arrays merged into one", function() {
			var mergedArrays = uniqueMergeArray(["a"], ["b","c"], "d");
			expect(mergedArrays).toContain("a");
			expect(mergedArrays).toContain("b");
			expect(mergedArrays).toContain("c");
			expect(mergedArrays).toContain("d");
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
	
	describe("extendArrayWithRegex", function() {
		
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
			expect(window.extendArrayWithRegex).toEqual(jasmine.any(Function));
		});
		
		describe("when passed settings", function() {
			describe("with an outputKey", function() {
				
				it("that is not a string, it returns the profile unchanged", function() {
					settings.profile = {"a":1, "b":2};
					settings.outputKey = [];
					settings.processKey = "a";
					
					var testProfile = JSON.parse(JSON.stringify(settings.profile)),
						newProfile = extendArrayWithRegex(settings);
									
					expect(newProfile).toEqual(testProfile);
				});
			
				describe("that is undefined in the profile", function() {
					it("it adds the outputKey to the profile", function() {
						settings.outputKey = "injectTest";
						settings.processKey = "a"
						settings.profile = {"a":1, "b":2};
						
						var newProfile = extendArrayWithRegex(settings);
						expect(newProfile[settings.outputKey]).toBeDefined();
					});
			
					it("it adds the outputKey to the profile with a value of []", function() {
						settings.outputKey = "injectTest";
						settings.processKey = "a"
						settings.profile = {"a":1, "b":2};
						
						var newProfile = extendArrayWithRegex(settings);
						expect(newProfile[settings.outputKey]).toEqual(jasmine.any(Array));
					});
				});
				
				it("that is null, it sets the outputKey to with a value of []", function() {
					settings.outputKey = "injectTest";
					settings.profile = {"injectTest" : null, "injectRegex": "a"};
					settings.processKey = "injectRegex";
					
					var newProfile = extendArrayWithRegex(settings);
					expect(newProfile[settings.outputKey]).toEqual(jasmine.any(Array));
				});
			});
			
			describe("with a processKey", function() {
			
				it("that is not a string, it returns the profile unchanged", function() {
					settings.profile = {"a":1, "b":2};
					settings.outputKey = "injectString";
					settings.processKey = [];
					
					var testProfile = JSON.parse(JSON.stringify(settings.profile)),
						newProfile = extendArrayWithRegex(settings);
					
					expect(newProfile).toEqual(testProfile);
				});
				
				it("that does not exist in the profile, it returns the profile unchanged", function () {
					settings.profile = {"a":1, "b":2};
					settings.outputKey = "injectString";
					settings.processKey = "injectRegex";
					
					var testProfile = JSON.parse(JSON.stringify(settings.profile)),
						newProfile = extendArrayWithRegex(settings);
					
					expect(newProfile).toEqual(testProfile);
				});
				
				it("that is null in the profile, it returns the profile unchanged", function () {
					settings.profile = {"a":1, "b":2, "injectRegex": null};
					settings.outputKey = "injectString";
					settings.processKey = "injectRegex";
					
					var testProfile = JSON.parse(JSON.stringify(settings.profile)),
						newProfile = extendArrayWithRegex(settings);
					
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
					
					extendArrayWithRegex(settings);

					expect(window.isArray).toHaveBeenCalled();
				});

				it("with settings.profile.[settings.processKey]", function() {
					settings.processKey = "testKey";
					settings.outputKey = "injectString";
					settings.profile.testKey = /^test/;
					
					extendArrayWithRegex(settings);

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

					extendArrayWithRegex(settings);

					expect(window.returnKeyMatch).toHaveBeenCalled();
				});	

				it('with settings.profile[settings.processKey] and settings.data', function() {
					settings.processKey = "testKey";
					settings.outputKey = "injectString";
					settings.profile.testKey = /^test/;

					extendArrayWithRegex(settings);

					expect(window.returnKeyMatch).toHaveBeenCalledWith(settings.profile.testKey, settings.data);

				});

				it("twice when the settings.profile[settings.processKey] contains more then one value", function() {
					settings.processKey = "testKey";
					settings.outputKey = "injectString";
					settings.profile.testKey = [/^test/, "value\d"];

					extendArrayWithRegex(settings);

					expect(window.returnKeyMatch.calls.count()).toBe(2);					
				});
			});

			// Can only test that it is being called since I have found no good way of syping on Function.prototype.apply
			it("uniqueMergeArray", function() {
					
				settings.processKey = "testKey";
				settings.outputKey = "injectString";
				settings.profile.testKey = [/^test/, "value\d"];

				spyOn(window, "uniqueMergeArray");
				
				extendArrayWithRegex(settings);
				
				expect(window.uniqueMergeArray).toHaveBeenCalled();
			});	
		});
	});
		
	describe("extendObjectWithRegex", function() {
		var settings = null;

		beforeEach(function() {
			settings = {
				data : {},
				profile : {},
				processKey: "testProcess",
				targetKey: "testTarget",
				singluarTarget: false
			};
		});

		it('is a function', function() {
			expect(extendObjectWithRegex).toEqual(jasmine.any(Function));
		});

		describe("returns", function() {

			it('an object', function() {
				expect(extendObjectWithRegex(settings)).toEqual(jasmine.any(Object));
			});

			describe('the profile unchanged', function() {
				var controlProfile = null,
					_profile = null;

				beforeEach(function() {
					settings.profile[settings.processKey] = {
						"k1" : 1
					};
					controlProfile = JSON.parse(JSON.stringify(settings.profile));
					_profile = null
				});

				it('if the processKey is undefined', function() {
					settings.processKey = undefined;

					_profile = extendObjectWithRegex(settings);

					expect(_profile).toEqual(controlProfile);
				});

				it('if the processKey is null', function() {
					settings.processKey = null;

					_profile = extendObjectWithRegex(settings);

					expect(_profile).toEqual(controlProfile);
				});

				it('if the processKey is not an string', function() {
					settings.processKey = {};

					_profile = extendObjectWithRegex(settings);

					expect(_profile).toEqual(controlProfile);
				});

				it('if the processKey is not an in the profile as a key', function() {
					settings.processKey = "testKey";
					
					_profile = extendObjectWithRegex(settings);

					expect(_profile).toEqual(controlProfile);
				});

				it('if the processKey is in the profile but has a value that is not a object', function() {
					settings.profile.testKey = "test";
					controlProfile = JSON.parse(JSON.stringify(settings.profile));
					settings.processKey = "testKey";
					
					_profile = extendObjectWithRegex(settings);

					expect(_profile).toEqual(controlProfile);
				});

				it('if the processKey is in the profile but has a value of null', function() {
					settings.profile.testKey = null;
					controlProfile = JSON.parse(JSON.stringify(settings.profile));
					settings.processKey = "testKey";

					_profile = extendObjectWithRegex(settings);

					expect(_profile).toEqual(controlProfile);
				});

				it('if the targetKey is undefined', function() {
					settings.targetKey = undefined;
					controlProfile = JSON.parse(JSON.stringify(settings.profile));
					
					_profile = extendObjectWithRegex(settings);

					expect(_profile).toEqual(controlProfile);
				});

				it('if the targetKey is null', function() {
					settings.targetKey = null;
					
					controlProfile = JSON.parse(JSON.stringify(settings.profile));
					
					_profile = extendObjectWithRegex(settings);

					expect(_profile).toEqual(controlProfile);
				});

				it('if the targetKey is not a string', function() {
					settings.targetKey = {};
					
					controlProfile = JSON.parse(JSON.stringify(settings.profile));
					
					_profile = extendObjectWithRegex(settings);

					expect(_profile).toEqual(controlProfile);
				});

				it('if the targetKey is an empty string', function() {
					settings.targetKey = "";
					
					controlProfile = JSON.parse(JSON.stringify(settings.profile));
					
					_profile = extendObjectWithRegex(settings);

					expect(_profile).toEqual(controlProfile);
				});

				it('if the targetKey is a string containg only white space', function() {
					settings.targetKey = "   ";
					
					controlProfile = JSON.parse(JSON.stringify(settings.profile));
					
					_profile = extendObjectWithRegex(settings);

					expect(_profile).toEqual(controlProfile);
				});

				it("if there are no values found to add to the profilekey", function() {
					settings.processKey = "testValue";
					settings.profile[settings.processKey] = {
						"k1" : 1,
						"k2" : 2,
						"k3" : 3
					};

					spyOn(window,'objectLength').and.returnValue(0);
					spyOn(window,'returnKeyMatch').and.returnValue([]);

					controlProfile = JSON.parse(JSON.stringify(settings.profile));
					
					_profile = extendObjectWithRegex(settings);

					expect(_profile).toEqual(controlProfile);
				});


				it('when settings.singluarTarget is true and the matched key has a value that is not null', function () {
					settings.singluarTarget = true;
					settings.profile[settings.targetKey] = {
						"k1": 4
					};

					controlProfile = JSON.parse(JSON.stringify(settings.profile));
				
					_profile = extendObjectWithRegex(settings);

					expect(_profile).toEqual(controlProfile);
				});
			});

			describe('a modified profile', function() {
				var _profile = {},
					controlProfile = null;

				beforeEach(function(){
					_profile = {};

					settings.processKey = "testValue";
					settings.profile[settings.processKey] = {
						"k1" : 1,
						"k2" : 2,
						"k3" : 3
					};
					settings.targetKey = "injectedTest";
					settings.profile[settings.targetKey] = {};

					spyOn(window,'objectLength').and.returnValue(1);
					spyOn(window,'returnKeyMatch').and.returnValue(["k1"]);

					controlProfile = null;
				});

				describe('by adding the target as an object', function () {
					it('when the settings.profile[settings.targetKey] is undefined it adds an object to the profile', function() {
						settings.profile[settings.targetKey] = undefined;

						_profile = extendObjectWithRegex(settings);

						expect(_profile[settings.targetKey]).toEqual(jasmine.any(Object));
					});

					it('when the settings.profile[settings.targetKey] is null it adds an object to the profile', function() {
						settings.profile[settings.targetKey] = null;

						_profile = extendObjectWithRegex(settings);

						expect(_profile[settings.targetKey]).toEqual(jasmine.any(Object));
						expect(_profile[settings.targetKey]).not.toBe(null);
					});
				});

				describe('by modifying the target object', function() {
					
					describe('with the new value', function() {
						it('when settings.singluarTarget is true and the matched key has a value of null', function () {
							settings.singluarTarget = true;
							settings.profile[settings.targetKey].k1 = null;
							settings.profile[settings.processKey] = {
								"k1" : 1
							};
							
							_profile = extendObjectWithRegex(settings);

							expect(_profile[settings.targetKey]).toEqual(jasmine.objectContaining({
	      						"k1" : 1
							}));
						});
						
						it('when settings.singluarTarget is true and the matched key has an undefined value', function () {
							settings.singluarTarget = true;
							settings.profile[settings.targetKey].k1 = undefined;
							settings.profile[settings.processKey] = {
								"k1" : 1
							};
							
							_profile = extendObjectWithRegex(settings);

							expect(_profile[settings.targetKey]).toEqual(jasmine.objectContaining({
								"k1" : 1
							}));
						});


						it('when settings.singluarTarget is false and the matched key has an undefined value', function () {
							settings.singluarTarget = false;
							settings.profile[settings.targetKey].k1 = undefined;
							settings.profile[settings.processKey] = {
								"k1" : 1
							};
							
							_profile = extendObjectWithRegex(settings);

							expect(_profile[settings.targetKey]).toEqual(jasmine.objectContaining({"k1" : [1]}));
						});

						it('when settings.singluarTarget is false and the matched key has a value of null', function () {
							settings.singluarTarget = false;
							settings.profile[settings.targetKey].k1 = null;
							settings.profile[settings.processKey] = {
								"k1" : 1
							};
							
							_profile = extendObjectWithRegex(settings);

							expect(_profile[settings.targetKey]).toEqual(jasmine.objectContaining({
								"k1" : [1]
							}));
						});

						it('when settings.singluarTarget is false and the matched key has a value that is not null', function () {
							settings.singluarTarget = false;
							settings.profile[settings.targetKey] = {
								"k1" : 2
							};
							settings.profile[settings.processKey] = {
								"k1" : 1
							};
							
							_profile = extendObjectWithRegex(settings);

							expect(_profile[settings.targetKey]["k1"]).toEqual(jasmine.any(Array));
							expect(_profile[settings.targetKey]["k1"]).toContain(1);
							expect(_profile[settings.targetKey]["k1"]).toContain(2);
						});

						it('when settings.singluarTarget is false and the matched key has a value that is an array mixed types', function () {
							
							var testFunction = function () {
								return 1;
							};
							settings.singluarTarget = false;
							settings.profile[settings.targetKey] = {
								"k1" : [2, 'test', testFunction]
							};
							settings.profile[settings.processKey] = {
								"k1" : [4, {}]
							};
							
							_profile = extendObjectWithRegex(settings);

							expect(_profile[settings.targetKey]["k1"]).toEqual(jasmine.any(Array));
							expect(_profile[settings.targetKey]["k1"]).toContain(2);
							expect(_profile[settings.targetKey]["k1"]).toContain(4);
							expect(_profile[settings.targetKey]["k1"]).toContain({});
							expect(_profile[settings.targetKey]["k1"]).toContain('test');
							expect(_profile[settings.targetKey]["k1"]).toContain(testFunction);
						});

					});
				});
			});
		});

		describe('calls', function() {
			describe('returnKeyMatch', function() {
				beforeEach(function(){
					spyOn(window, 'returnKeyMatch').and.returnValue(["k1", "k2", "k3"]);
					settings.processKey = "testValue";
					settings.profile[settings.processKey] = {
						"k1" : 1,
						"k2" : 2,
						"k3" : 3
					};
				});

				it('when the settings.processKey is a string and the string exists in the profile', function() {
					extendObjectWithRegex(settings);
					expect(window.returnKeyMatch).toHaveBeenCalled();
				});

				it("once when settings.profile[settings.processKey] has one key", function() {
					settings.processKey = "testValue";
					settings.profile[settings.processKey] = {
						"k1" : 1
					};

					extendObjectWithRegex(settings);
					expect(window.returnKeyMatch.calls.count()).toBe(1);
				});

				it("twice when settings.profile[settings.processKey] has two key", function() {
					settings.processKey = "testValue";
					settings.profile[settings.processKey] = {
						"k1" : 1,
						"k2" : 2
					};

					extendObjectWithRegex(settings);
					expect(window.returnKeyMatch.calls.count()).toBe(2);
				});

				it("once for each key in settings.profile[settings.processKey]", function() {
					settings.processKey = "testValue";
					settings.profile[settings.processKey] = {
						"k1" : 1,
						"k2" : 2,
						"k3" : 3
					};

					extendObjectWithRegex(settings);
					expect(window.returnKeyMatch.calls.count()).toBe(3);
				});

				it("with the paramaters settings.profile[settings.processKey][i] and settings.data", function() {
					settings.processKey = "testValue";
					settings.profile[settings.processKey] = {
						"k1" : 1
					};

					extendObjectWithRegex(settings);
					expect(window.returnKeyMatch).toHaveBeenCalledWith("k1", settings.data);
				});
			});

			describe('objectLength', function() {
				beforeEach(function(){
					settings.processKey = "testValue";
					settings.profile[settings.processKey] = {
						"k1" : 1,
						"k2" : 2,
						"k3" : 3
					};
				});

				it('when the settings.processKey is a string and the string exists in the profile', function() {
					spyOn(window,'objectLength');

					extendObjectWithRegex(settings);
					expect(window.objectLength).toHaveBeenCalled();
				});
			});

			describe('uniqueMergeArray', function() {
				it('when the settings.processKey is a string and the string exists in the profile', function() {
					spyOn(window,'uniqueMergeArray');

					settings.singluarTarget = false;
					settings.profile[settings.targetKey] = {
						"k1" : 2
					};
					settings.profile[settings.processKey] = {
						"k1" : 1
					};

					extendObjectWithRegex(settings);
					expect(window.uniqueMergeArray).toHaveBeenCalled();
				});
			});
		});

		describe('dose not call', function() {
			describe('returnKeyMatch', function() {
				beforeEach(function(){
					spyOn(window, 'returnKeyMatch');
				});

				it('when the processKey is undefined', function() {
					settings.processKey = undefined;

					extendObjectWithRegex(settings);

					expect(window.returnKeyMatch).not.toHaveBeenCalled()					
				});

				it('when the processKey is null', function() {
					settings.processKey = null;

					extendObjectWithRegex(settings);
					expect(window.returnKeyMatch).not.toHaveBeenCalled();
				});

				it('when the processKey is not an string', function() {
					settings.processKey = {};

					extendObjectWithRegex(settings);
					expect(window.returnKeyMatch).not.toHaveBeenCalled();
				});

				it('when the processKey is not an in the profile as a key', function() {
					settings.processKey = "testKey";
					
					extendObjectWithRegex(settings);
					expect(window.returnKeyMatch).not.toHaveBeenCalled();
				});

				it('when the processKey is in the profile but has a value that is not a object', function() {
					settings.profile.textKey = "test";
					settings.processKey = "testKey";
					
					extendObjectWithRegex(settings);
					expect(window.returnKeyMatch).not.toHaveBeenCalled();
				});

				it('when the processKey is in the profile but has a value of null', function() {
					settings.profile.textKey = null;
					settings.processKey = "testKey";

					extendObjectWithRegex(settings);
					expect(window.returnKeyMatch).not.toHaveBeenCalled();
				});

				it('when settings.profile[settings.processKey] has no keys', function() {
					extendObjectWithRegex(settings);
					expect(window.returnKeyMatch).not.toHaveBeenCalled();
				});
			});

			describe('objectLength', function() {
				beforeEach(function(){
					spyOn(window, 'objectLength');
				});

				it('when the processKey is undefined', function() {
					settings.processKey = undefined;

					extendObjectWithRegex(settings);

					expect(window.objectLength).not.toHaveBeenCalled()					
				});

				it('when the processKey is null', function() {
					settings.processKey = null;

					extendObjectWithRegex(settings);
					expect(window.objectLength).not.toHaveBeenCalled();
				});

				it('when the processKey is not an string', function() {
					settings.processKey = {};

					extendObjectWithRegex(settings);
					expect(window.objectLength).not.toHaveBeenCalled();
				});

				it('when the processKey is not an in the profile as a key', function() {
					settings.processKey = "testKey";
					
					extendObjectWithRegex(settings);
					expect(window.objectLength).not.toHaveBeenCalled();
				});

				it('when the processKey is in the profile but has a value that is not a object', function() {
					settings.profile.textKey = "test";
					settings.processKey = "testKey";
					
					extendObjectWithRegex(settings);
					expect(window.objectLength).not.toHaveBeenCalled();
				});

				it('when the processKey is in the profile but has a value of null', function() {
					settings.profile.textKey = null;
					settings.processKey = "testKey";

					extendObjectWithRegex(settings);
					expect(window.objectLength).not.toHaveBeenCalled();
				});
			});

			describe('uniqueMergeArray', function() {
				beforeEach(function(){
					spyOn(window, 'uniqueMergeArray');
				});

				it('when the processKey is undefined', function() {
					settings.processKey = undefined;

					extendObjectWithRegex(settings);

					expect(window.uniqueMergeArray).not.toHaveBeenCalled()					
				});

				it('when the processKey is null', function() {
					settings.processKey = null;

					extendObjectWithRegex(settings);
					expect(window.uniqueMergeArray).not.toHaveBeenCalled();
				});

				it('when the processKey is not an string', function() {
					settings.processKey = {};

					extendObjectWithRegex(settings);
					expect(window.uniqueMergeArray).not.toHaveBeenCalled();
				});

				it('when the processKey is not an in the profile as a key', function() {
					settings.processKey = "testKey";
					
					extendObjectWithRegex(settings);
					expect(window.uniqueMergeArray).not.toHaveBeenCalled();
				});

				it('when the processKey is in the profile but has a value that is not a object', function() {
					settings.profile.textKey = "test";
					settings.processKey = "testKey";
					
					extendObjectWithRegex(settings);
					expect(window.uniqueMergeArray).not.toHaveBeenCalled();
				});

				it('when the processKey is in the profile but has a value of null', function() {
					settings.profile.textKey = null;
					settings.processKey = "testKey";

					extendObjectWithRegex(settings);
					expect(window.uniqueMergeArray).not.toHaveBeenCalled();
				});
			

				it('when settings.singluarTarget is true', function () {
					settings.singluarTarget = true;
					settings.profile[settings.targetKey] = {
						"k1" : 2
					};
					settings.profile[settings.processKey] = {
						"k1" : 1
					};
					
					extendObjectWithRegex(settings);

					expect(window.uniqueMergeArray).not.toHaveBeenCalled();
				});
			});
		});
	});
});