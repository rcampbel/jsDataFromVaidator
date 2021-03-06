
function isEmpty (value) {
	var rtval = false;
	
	switch (typeof value) {
		case "string" : 
			rtval = (value.length === 0);
			break;
		case "undefined" : 
			rtval = true;
			break;
		case "object" :
			if (value instanceof Array) {
				rtval = (value.length === 0);
			} else {
				rtval = true;
				for (key in value) {
					if (value.hasOwnProperty(key)) {
						rtval = false;
						break;
					}
				}
			}
			break;
	};
	
	return rtval;
}

function isArray (value) {
	var rtval = false;
	
	if (value && value != null && typeof value != "undefined" && typeof value === 'object' && value instanceof Array) {
		rtval = true;
	}
	
	return rtval;
}

function toRegex (value) {
	var returnRegex = null,
		selfValue;
	
	if (typeof value === "string" && isNaN(value)) {
		selfValue = value.trim();
		selfValue = selfValue.replace(/^\/(.*)\/$/, "$1");

		returnRegex = new RegExp(selfValue);
	} else if (value instanceof RegExp){
		returnRegex = value;
	}
	
	return returnRegex;
}

function objectLength (value) {
	var returnValue = 0;
	
	if(value === null || typeof value !== "object"){
		returnValue = -1;
	}
	
	if (isArray(value)){
		returnValue = value.length;
	} else {
		for (key in value) {
			if (value.hasOwnProperty(key)) {
				returnValue += 1;
			}
		}
	}
	
	return returnValue;
}

function returnKeyMatch (regex, obj) {
	var myRegex,
		returnArray = [];
	
	myRegex = toRegex(regex);
	for (var key in obj) {
		if (obj.hasOwnProperty(key) && myRegex.test(key)){
			returnArray.push(key);
		}
	}
	
	return returnArray;
}

//Not Order Safe
function uniqueMergeArray () {
	var _values = {},
		returnValue = [];
	
	for (var i = 0; i < arguments.length; i++) {
		if (isArray(arguments[i])) {
			for (var y = 0; y < arguments[i].length; y++) {
				if (!_values[arguments[i][y]]) {
					_values[arguments[i][y]] = true;
					returnValue.push(arguments[i][y]);
				}
			}
		} else {
			if (!_values[arguments[i]]) {
				_values[arguments[i]] = true;
				returnValue.push(arguments[i]);
			}
		}
	}
	
	return returnValue;
}

function extendArrayWithRegex (settings) {
	var profile = settings.profile,
		matchedKeys = [],
		processValues = [],
		returnedMatchedKeys = null;

	if (typeof settings.outputKey === "string" &&
		typeof settings.processKey === "string" &&
		typeof profile[settings.processKey] !== "undefined" &&
		profile[settings.processKey] !== null) {
	
		matchedKeys.push(profile[settings.outputKey] || []);

		if (isArray(profile[settings.processKey])) {
			processValues = profile[settings.processKey];
		} else {
			processValues.push(profile[settings.processKey]);
		}

		for (var keyIndex = 0; keyIndex < processValues.length; keyIndex++) {
			returnedMatchedKeys = returnKeyMatch(processValues[keyIndex], settings.data);
			if (returnedMatchedKeys.length > 0) {
				matchedKeys.push(returnedMatchedKeys);
			}		
		}

		profile[settings.outputKey] = uniqueMergeArray.apply(this ,matchedKeys);
	}
	
	return profile;
}

function extendObjectWithRegex (settings) {
	var profile = settings.profile
		processKey = settings.processKey,
		targetKey = settings.targetKey,
		objToProcess = {},
		objToProcessKey = null,
		objToProcessValue = null,
		matchedFelidNames = [],
		singluarTarget = settings.singluarTarget || false,
		replaceTarget = settings.replaceTarget || false,
		valueMap = {},
		index = 0;

	if (typeof processKey === "string" && 
		typeof profile[processKey] === "object" && 
		profile[processKey] !== null &&
		typeof targetKey === "string" &&
		targetKey.trim().length > 0
	) {
		objToProcess = profile[processKey];
		for (objToProcessKey in objToProcess) {
			if (objToProcess.hasOwnProperty(objToProcessKey)){
				objToProcessValue = objToProcess[objToProcessKey];
				matchedFelidNames = returnKeyMatch(objToProcessKey, settings.data);
				for (index = 0; index < matchedFelidNames.length; index++) {
					var fieldName = matchedFelidNames[index],
						valArray = valueMap[fieldName] || [];
					
					valArray = uniqueMergeArray(valArray, objToProcessValue);
					valueMap[fieldName] = valArray;
				}
			}
		}

		if (objectLength(valueMap) > 0){
			var targetProfileObject = profile[settings.targetKey] || {};

			for (objToProcessKey in valueMap) {
				if (valueMap.hasOwnProperty(objToProcessKey)) {
					if (typeof targetProfileObject[objToProcessKey] === "undefined" || targetProfileObject[objToProcessKey] === null ) {
						if (singluarTarget) {
							targetProfileObject[objToProcessKey] = valueMap[objToProcessKey].pop();
						} else {
							targetProfileObject[objToProcessKey] = valueMap[objToProcessKey];
						}
					} else {
						if (!singluarTarget) {
							targetProfileObject[objToProcessKey] = uniqueMergeArray(targetProfileObject[objToProcessKey], valueMap[objToProcessKey]);
						}
					}
				}		
			}
			profile[settings.targetKey] = targetProfileObject;
		}

	}

	return profile;
}

/*
{

//	required : [
//		"field4",
//		"field5",
//		"field6",
//		"field7"
//	],
//	required_regexp : <regex>||[<regex>,<regex>, ...],
//	optional : [
//		"field1",
//		"field2",
//		"field3"
//	],
//	optional_regexp : <regex>||[<regex>,<regex>, ...],

	dependencies : {
		field1 : [<field_name>, ...],
		field2 : {
			<value> : [<field_name>, ...]
		},
		field3 : <function>
	},
	dependency_groups : {
		group_name : [<field_name>, ...]
	},

//	defaults : {
//		field1 : <string>,
//		field2 : <string>
//	},
//	defaults_regexp_map : {
//		<regex> : <string>
//	},

	filters : [<string>|<function>],
	
//	field_filters : {
//		field1 : [<string>|<function>]
//	},
//	field_filter_regexp_map : {
//		<regex> : <string>|<function>
//	},
	
//	constraint_methods : {
//		field1 : <function>,
//		field2 : <regex>,
//		field3 : {
//			constraint_method : "<string>",
//			params : [<value1>, <value2>],
//			name : <string>
//		},
//		field4 : <string>,
//		field5 : [
//			<function>,
//			<regex>,
//			{
//				constraint_method : "<string>",
//				params : [<value1>, <value2>],
//				name : <string>
//			},
//			<named constraint>
//		],
//		// Constraint not tied to a field
//		name1 : <function>
//		name2 : {
//			constraint_method : "<string>",
//			params : [<value1>, <value2>],
//			name : <string>
//		},
//	}
//	constraint_method_regexp_map : {
//		<regex> : <function>,
//		<regex> : <regex>,
//		<regex> : {
//			constraint_method : "<string>",
//			params : [<value1>, <value2>],
//			name : <string>
//		},
//		<regex> : <string>
//	},
	untaint_all_constraints : <true|false>,
	untaint_constraint_fields : {
		field1 : <true|false>
	},
	untaint_regexp_map : {
		<regex> : <true|false>
	},
	missing_optional_valid : <true|false>
}
*/

/*
function Results (profile, data) {

	var missing = [],
		unknown = [],
		untaintedData,
		filteredData,
		_process = function () {
			
			//TODO : Apply Uncoditonal Filters
			//TODO : Apply Specific Filters
			//TODO : Apply Specific Filters from Regex Map
			//TODO : Store Filtered Data
			
			//TODO : Update required based off Regex
			//TODO : Update Optional based off Regex
			
			//TODO : handle "require_some"
		
			//TODO : Handle Dependencies
			//TODO : Handle Dependencies Groups
			
			//TODO : Fill out unknown fields
			
			//TODO : fill in defalut values from regex
			//TODO : fill in defalut values
			
			//TODO : Check for required fields
			//TODO : Check for require_some fields
			
			
		};
		
}
*/