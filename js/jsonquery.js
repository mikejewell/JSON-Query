(function($) {

	var _flatten = function(flattened, json) {
		if($.isArray(json)) {
			$.each(json, function(j) { _flatten(flattened, j); });
		}
		else if($.isPlainObject(json)) {
			$.each(json, function(key, value) {
				if(key === "__key") return;
				if($.isPlainObject(value)) {
					var l = flattened.push(value);
					value = flattened[l-1];
					json[key] = value;
					value.__key = key;
				}
				_flatten(flattened, value);
			});
		}
	};

	var arrayify = function(obj) {
		var result = [];
		if($.isPlainObject(obj)) {
			$.each(obj, function(key, value) {
				if(key === "__key") return;
				result.push(value);
			});
		}
		else if($.isArray(obj)) {
			result = result.concat(obj);
		}
		else {
			result = obj;
		}
		return result;
	};


	var matches = function(a, b) {
		if($.isArray(a) && $.isArray(b)) {
			if($(a).not(b).get().length == 0 && 
			   $(b).not(a).get().length == 0)
				return true;
		}
		if($.isPlainObject(b) && b[a]) {
			return true;
		}
		if(b === a) {
			return true;
		}
	
		return false;
	};


	$.fn.jsonquery = function(selector) {
		return this.each(function() {
			var json = this;
			this.__data = [];
			if($.isArray(json)) {
				$.each(json, function(j) {_flatten(this.__data, j)});
			}
			else if($.isPlainObject(json)) {
				this.__data.push(json);
				_flatten(this.__data, json);
			}
		});
	};

	$.fn.result = function() {
		return this[0].__data;
	};

	$.fn.values_with_key = function(key) {
		return this.each(function() {
			var result = [];
			$.each(this.__data, function(index, obj) {
				if(obj[key]) {
					result = result.concat(arrayify(obj[key]));
				}
			});
			this.__data = result;
		});
	};

	$.fn.keys_with_value = function(value) {
		return this.each(function() {
			var result = [];
			$.each(this.__data, function(index, obj) {
				var keys = [];
				$.each(obj, function(key, val) {
					if(matches(val, value))
						keys.push(key);
				});
				result.push(keys);
			});
			this.__data = result;
		});
	};

	$.fn.objects_with_value = function(value) {
		return this.each(function() {
			var result = [];

			$.each(this.__data, function(index, obj) {
				$.each(obj, function(key, val) {
					if(key === "__key") return;
					if(obj[key]) {
						if(matches(obj[key], value)) {
							result.push(obj);
						}
					}
				});
			});
			this.__data = result;
		});
	};

	$.fn.objects_with_key_value = function(key, value) {
		return this.each(function() {
			var result = [];
			$.each(this.__data, function(index, obj) {
				if(obj[key]) {
					if(matches(obj[key], value)) {
						result.push(obj);
					}
				}

			});
			this.__data = result;
		});
	};

	$.fn.objects_with_key = function(key) {
		return this.each(function() {
			var result = [];
			$.each(this.__data, function(index, obj) {
				if(obj[key]) {
					result.push(obj);
				}
			});	
			this.__data = result;
		});
	};




})(jQuery);

