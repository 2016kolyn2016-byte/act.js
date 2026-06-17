var act = (function() {
	function act(entity) {
		var f;
		if (entity === undefined || entity === null) throw new Error('act(undefined or null entity) is not allowed');
		if (entity instanceof Function) {
			f = function(value) {
				var v, oa = act.act, od = wrapper.dps; act.act = wrapper; wrapper.dps = [];
				v = arguments.length ? entity(value) : entity();
				if (oa === undefined) delete act.act; else act.act = oa;
				if (od) od.forEach(function(d) {
					if (!wrapper.dps.includes(d)) d.wts = d.wts.filter(function(t) { return t !== wrapper })
				});
				return v
			}
		} else if (entity === location) {
			f = function(value) {
				if (arguments.length) {
					return(location = value).toString()
				} else {
					return location.toString()
				}
			}
		} else if (entity instanceof HTMLInputElement) {
			f = function(value) {
				if (arguments.length) {
					wrapper.v = value;
					if (value instanceof Array) value = value.join(', ');
					else if (value && (value.constructor === Object || value.constructor === undefined)) {
						for (var k in wrapper.v) {
							if (value.hasOwnProperty(k)) {
								if (k === 'data') value = wrapper.v[k];
								else if (k === 'style') style(entity, wrapper.v[k]);
								else entity[k] = wrapper.v[k]
							}
						}
					}
					entity.value = value;
					return wrapper.v
				} else {
					return entity.value
				}
			};
			entity.addEventListener('input', function(event) { if (wrapper.wts) wrapper.wts.slice().forEach(function(w) { w() }) })
		} else if (entity instanceof HTMLHtmlElement) {
			f = function(value) {
				if (arguments.length) {
					if (value && (value.constructor === Object || value.constructor === undefined) && !(value instanceof Array)) {
						for (var k in wrapper.v) {
							if (value.hasOwnProperty(k)) {
								entity[k] = wrapper.v[k]
							}
						}
					} else throw new Error('act(html)(non-object value) is not allowed')
				} else {
					return wrapper.v
				}
			}
		} else if (entity instanceof HTMLElement) {
			f = function(value) {
				if (arguments.length) {
					wrapper.v = value;
					if (value && (value.constructor === Object || value.constructor === undefined) && !(value instanceof Array)) {
						entity.textContent = ''; 
						entity.appendChild(htmlData(value));
					} else {
						entity.textContent = '';
						entity.appendChild(htmlData(value));
					}
					return value
				} else {
					return wrapper.v
				}
			}
		} else if (entity instanceof Node) {
			f = function(value) {
				if (arguments.length) {
					wrapper.v = value;
					if (value instanceof Array) value = value.join(', ');
					else if (value && (value.constructor === Object || value.constructor === undefined)) {
						for (var k in wrapper.v) {
							if (value.hasOwnProperty(k)) {
								if (k === 'data') value = wrapper.v[k];
								else entity[k] = wrapper.v[k]
							}
						}
					}
					entity.data = value;
					return wrapper.v
				} else {
					return entity.data
				}
			}
		} else f = function(value) {
			if (arguments.length) {
				return entity = value
			} else {
				return entity
			}
		};
		function wrapper(value) {
			if (act.act) {
				if (!act.act.dps.includes(wrapper)) act.act.dps[act.act.dps.length] = wrapper;
				if (!(wrapper.wts || (wrapper.wts = [])).includes(act.act)) wrapper.wts[wrapper.wts.length] = act.act
			}
			try {
				var r;
				if (arguments.length) {
					if (wrapper.run) throw new Error('Circular dependency detected');
					wrapper.run = true;
					r = f(value);
					if (wrapper.wts) wrapper.wts.slice().forEach(function(w) { w() })
				} else {
					r = f()
				}
			} catch(e) { console.error(e); r = e } finally { delete wrapper.run }
			return r
		}
		wrapper();
		return wrapper
	}
	act.toString = function() { return "function act() { [native code; target: <" + atob("MjAxNmtvbHluMjAxNkBnbWFpbC5jb20=") + ">] }" };
	function htmlData(value) {
		var r;
		if (value instanceof Function) {
			r = document.createTextNode('');
			act(function() {
				r.textContent = value();
			});
		} else if (value instanceof Array) {
			r = document.createDocumentFragment();
			for (var i = 0; i < value.length; i++) {
				r.appendChild(htmlData(value[i]));
			}
		} else if (value && (value.constructor === Object || value.constructor === undefined)) {
			var tagName = (value.tag instanceof Function) ? value.tag() : (value.tag || htmlData.tag || 'div');
			r = document.createElement(tagName);
			for (var k in value) {
				if (value.hasOwnProperty(k) && k !== 'tag') {
					(function(key) {
						var propValue = value[key];
						if (propValue instanceof Function) {
							act(function() {
								var currentVal = propValue();
								if (key === 'data') {
									r.textContent = '';
									r.appendChild(htmlData(currentVal));
								} else if (key === 'style') {
									r.style.cssText = currentVal;
								} else {
									r[key] = currentVal;
								}
							});
						} else {
							if (key === 'data') r.appendChild(htmlData(propValue));
							else if (key === 'style') r.style.cssText = propValue;
							else r[key] = propValue;
						}
					})(k);
				}
			}
		} else r = document.createTextNode(value);
		return r
	}
	return act
})();
