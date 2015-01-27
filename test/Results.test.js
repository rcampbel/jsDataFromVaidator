'use strict';

var customMatchers = {
	isArray: function(util, customEqualityTesters) {
		return {
			compare: function(actual) {
				var result = {};

				result.pass = (actual && typeof actual === 'object' && actual instanceof Array);
				result.message = "Expected " + actual + " to be an Array";

				return result;
			}
		};
	}
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
	
		beforeEach(function() {
			jasmine.addMatchers(customMatchers);
		});

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
			
			singleRegex = "/^field\d+*/";
			multiRegex = ["/^field\d+*/", "/^vaule\d+$/"];
			
			spyOn(String.prototype, 'match').and.callThrough();
		});
		
		it("profile is returned", function () {
			var _profile;
			
			profile.require_regex = singleRegex;
			_profile = processRequiredRegex(profile, data);
			
			expect(_profile).toBeDefined();
		});
		
		describe("returns required in profile after process", function () {
			it("when proifile does not have requried defined", function () {
				var _profile;
				
				profile.require_regex = singleRegex;
				_profile = processRequiredRegex(profile, data);
				
				expect(_profile.required).toBeDefined();
			});
			
			it("when proifile has requried defined", function () {
				var _profile;
				
				profile.require_regex = singleRegex;
				profile.require = ["max3"];
				_profile = processRequiredRegex(profile, data);
				
				expect(_profile.required).toBeDefined();
			});
		});
			
		it("profile is returned with required as an array", function () {
			var _profile;
			
			profile.require_regex = singleRegex;
			_profile = processRequiredRegex(profile, data);
			
			expect(_profile.required).isArray();
		});
		
		it("uses the String.match function to match", function () {
			var _profile;
			
			profile.require_regex = singleRegex;
			_profile = processRequiredRegex(profile, data);
			
			expect(String.prototype.match).toHaveBeenCalled();
			
		});
		
		describe("is supplied a single regex string", function () {
			it("it calls String.match once for each key in the data", function () {
				var _profile;
			
				profile.require_regex = singleRegex;
				_profile = processRequiredRegex(profile, data);
			
				expect(String.prototype.match.calls.count()).toBe(data.length);
			});
		
			it("it adds the matched fields to the profile.required array", function () {	
				var _profile;
				
				profile.require_regex = singleRegex;
				_profile = processRequiredRegex(profile, data);
				
				expect(_profile.required.length).toBe(2);
			});
		});
		
		describe("is supplied a mutiple regexs", function () {
			it("it calls String.match for each require_regex and data key combonation", function () {
				var _profile;
			
				profile.require_regex = multiRegex;
				_profile = processRequiredRegex(profile, data);
			
				expect(String.prototype.match.calls.count()).toBe(profile.require_regex.length * data.length);
			});
		
			it("it adds the matched fields to the profile.required array", function () {	
				var _profile;
				
				profile.require_regex = multiRegex;
				_profile = processRequiredRegex(profile, data);
				
				expect(_profile.required.length).toBe(3);
			});
		});
		
		it("moves optional fields to requried when the field matches a regex", function () {
			var _profile;
			profile.optional = [ "field1" ];
			profile.require_regex = singleRegex;
			_profile = processRequiredRegex(profile, data);
			
			expect(_profile.required.length).toBe(0);
		})
		
	});
	
	describe("of optional_regexp", function() {
		beforeEach(function () {

			profile = {};
			data = {
				"field1" : "a",
				"field2" : ["c","d"],
				"radio1" : "e",
				"radio2" : "f",
				"value1" : ""
			};
			
			singleRegex = "/^field\d+*/";
			multiRegex = ["/^field\d+*/", "/^vaule\d+$/"];
			
			spyOn(String.prototype, 'match').and.callThrough();
		});
		
		it("profile is returned", function () {
			var _profile;
			
			profile.require_regex = singleRegex;
			_profile = processOptionalRegexp(profile, data);
			
			expect(_profile).toBeDefined();
		});
		
		it("profile is returned with optional after process", function () {
			var _profile;
			
			profile.optional_regexp = singleRegex;
			_profile = processOptionalRegexp(profile, data);
			
			expect(_profile.optional).toBeDefined();
		});
		
		it("profile is returned with optional as an array", function () {
			var _profile;
			
			profile.optional_regexp = singleRegex;
			_profile = processOptionalRegexp(profile, data);
			
			expect(_profile.optional).toBe(jasmine.any(Array));
		});
		
		it("uses the String.match function to match", function () {
			var _profile;
			
			profile.optional_regexp = singleRegex;
			_profile = processOptionalRegexp(profile, data);
			
			expect(String.prototype.match).toHaveBeenCalled();
			
		});
		
		describe("is supplied a single regex string", function () {
			it("it calls String.match once for each key in the data", function () {
				var _profile;
			
				profile.optional_regexp = singleRegex;
				_profile = processOptionalRegexp(profile, data);
			
				expect(String.prototype.match.calls.count()).toBe(data.length);
			});
		
			it("it adds the matched fields to the profile.optional array", function () {	
				var _profile;
				
				profile.optional_regexp = singleRegex;
				_profile = processOptionalRegexp(profile, data);
				
				expect(_profile.optional.length).toBe(2);
			});
		});
		
		describe("is supplied a mutiple regexs", function () {
			it("it calls String.match for each optional_regexp and data key combonation", function () {
				var _profile;
			
				profile.optional_regexp = multiRegex;
				_profile = processOptionalRegexp(profile, data);
			
				expect(String.prototype.match.calls.count()).toBe(profile.optional_regexp.length * data.length);
			});
		
			it("it adds the matched fields to the profile.optional array", function () {	
				var _profile;
				
				profile.optional_regexp = multiRegex;
				_profile = processOptionalRegexp(profile, data);
				
				expect(_profile.optional.length).toBe(3);
			});
		});		
	});
	
	describe("of dependency_groups", function() {
		pending();
	});
	describe("of defaults", function() {
		pending();
	});
	describe("of defaults_regexp_map", function() {
		pending();
	});
	describe("of filters", function() {
		pending();
	});
	describe("of field_filters", function() {
		pending();
	});
	describe("of field_filter_regexp_map", function() {
		pending();
	});
	describe("of constraint_methods", function() {
		pending();
	});
	describe("of constraint_method_regexp_map", function() {
		pending();
	});
	describe("of untaint_all_constraints", function() {
		pending();
	});
	describe("of untaint_constraint_fields", function() {
		pending();
	});
	describe("of untaint_regexp_map", function() {
		pending();
	});
	describe("of missing_optional_valid", function() {
		pending();
	});
});