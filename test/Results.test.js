'use strict';

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
});

describe("Profile processing", function(){
	var profile,
		data,
		singleRegex = "",
		multiRegex = [];
		
	

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
		});		


		profile = {};
			
			spyOn(String.prototype, 'test').and.callThrough();
		});
		
		if("profile is returned with required after process", function () {
			var _profile;
			
			profile.require_regex = singleRegex;
			_profile = processRequiredRegex(profile, data);
			
			expect(_profile.required).toBeDefined();
		});
		
		it("profile is returned with required as an array", function () {
			var _profile;
			
			profile.require_regex = singleRegex;
			_profile = processRequiredRegex(profile, data);
			
			expect(_profile.required).toBe(jasmine.any(Array));
		});
		
		it("uses the String.test function to test", function () {
			var _profile;
			
			profile.require_regex = singleRegex;
			_profile = processRequiredRegex(profile, data);
			
			expect(String.prototype.test).toHaveBeenCalled();
			
		});
		
		describe("is supplied a single regex string", function () {
			it("it calls String.match once for each key in the data", function () {
				var _profile;
			
				profile.require_regex = singleRegex;
				_profile = processRequiredRegex(profile, data);
			
				expect(String.prototype.test.calls.count()).toBe(data.length);
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
			
				expect(String.prototype.test.calls.count()).toBe(profile.require_regex.length * data.length);
			});
		
			it("it adds the matched fields to the profile.required array", function () {	
				var _profile;
				
				profile.require_regex = multiRegex;
				_profile = processRequiredRegex(profile, data);
				
				expect(_profile.required.length).toBe(3);
			});
		});
		
	});
	
	describe("of optional_regexp", function() {
		pending();
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