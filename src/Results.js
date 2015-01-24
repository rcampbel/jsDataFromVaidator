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

/*
{
	required : [
		"field4",
		"field5",
		"field6",
		"field7"
	],
	required_regexp : <regex>||[<regex>,<regex>, ...],
	optional : [
		"field1",
		"field2",
		"field3"
	],
	optional_regexp : <regex>||[<regex>,<regex>, ...],
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
	defaults : {
		field1 : <string>,
		field2 : <string>
	},
	defaults_regexp_map : {
		<regex> : <string>
	},
	filters : [<string>|<function>],
	field_filters : {
		field1 : <string>|<function>
	},
	field_filter_regexp_map : {
		<regex> : <string>|<function>
	},
	constraint_methods : {
		field1 : <function>,
		field2 : <regex>,
		field3 : {
			constraint_method : "<string>",
			params : [<value1>, <value2>],
			name : <string>
		},
		field4 : <string>,
		field5 : [
			<function>,
			<regex>,
			{
				constraint_method : "<string>",
				params : [<value1>, <value2>],
				name : <string>
			},
			<named constraint>
		],
		// Constraint not tied to a field
		name1 : <function>
		name2 : {
			constraint_method : "<string>",
			params : [<value1>, <value2>],
			name : <string>
		},
	}
	constraint_method_regexp_map : {
		<regex> : <function>,
		<regex> : <regex>,
		<regex> : {
			constraint_method : "<string>",
			params : [<value1>, <value2>],
			name : <string>
		},
		<regex> : <string>
	},
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