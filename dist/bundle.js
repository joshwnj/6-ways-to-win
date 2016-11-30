(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function() {
  return function(deck) {
    var backdrops;

    function createBackdropForSlide(slide) {
      var backdropAttribute = slide.getAttribute('data-bespoke-backdrop');

      if (backdropAttribute) {
        var backdrop = document.createElement('div');
        backdrop.className = backdropAttribute;
        backdrop.classList.add('bespoke-backdrop');
        deck.parent.appendChild(backdrop);
        return backdrop;
      }
    }

    function updateClasses(el) {
      if (el) {
        var index = backdrops.indexOf(el),
          currentIndex = deck.slide();

        removeClass(el, 'active');
        removeClass(el, 'inactive');
        removeClass(el, 'before');
        removeClass(el, 'after');

        if (index !== currentIndex) {
          addClass(el, 'inactive');
          addClass(el, index < currentIndex ? 'before' : 'after');
        } else {
          addClass(el, 'active');
        }
      }
    }

    function removeClass(el, className) {
      el.classList.remove('bespoke-backdrop-' + className);
    }

    function addClass(el, className) {
      el.classList.add('bespoke-backdrop-' + className);
    }

    backdrops = deck.slides
      .map(createBackdropForSlide);

    deck.on('activate', function() {
      backdrops.forEach(updateClasses);
    });
  };
};

},{}],2:[function(require,module,exports){
module.exports = function() {
  return function(deck) {
    var addClass = function(el, cls) {
        el.classList.add('bespoke-' + cls);
      },

      removeClass = function(el, cls) {
        el.className = el.className
          .replace(new RegExp('bespoke-' + cls +'(\\s|$)', 'g'), ' ')
          .trim();
      },

      deactivate = function(el, index) {
        var activeSlide = deck.slides[deck.slide()],
          offset = index - deck.slide(),
          offsetClass = offset > 0 ? 'after' : 'before';

        ['before(-\\d+)?', 'after(-\\d+)?', 'active', 'inactive'].map(removeClass.bind(null, el));

        if (el !== activeSlide) {
          ['inactive', offsetClass, offsetClass + '-' + Math.abs(offset)].map(addClass.bind(null, el));
        }
      };

    addClass(deck.parent, 'parent');
    deck.slides.map(function(el) { addClass(el, 'slide'); });

    deck.on('activate', function(e) {
      deck.slides.map(deactivate);
      addClass(e.slide, 'active');
      removeClass(e.slide, 'inactive');
    });
  };
};

},{}],3:[function(require,module,exports){
module.exports = function() {
  return function(deck) {
    var parseHash = function() {
      var hash = window.location.hash.slice(1),
        slideNumberOrName = parseInt(hash, 10);

      if (hash) {
        if (slideNumberOrName) {
          activateSlide(slideNumberOrName - 1);
        } else {
          deck.slides.forEach(function(slide, i) {
            if (slide.getAttribute('data-bespoke-hash') === hash) {
              activateSlide(i);
            }
          });
        }
      }
    };

    var activateSlide = function(index) {
      var indexToActivate = -1 < index && index < deck.slides.length ? index : 0;
      if (indexToActivate !== deck.slide()) {
        deck.slide(indexToActivate);
      }
    };

    setTimeout(function() {
      parseHash();

      deck.on('activate', function(e) {
        var slideName = e.slide.getAttribute('data-bespoke-hash');
        window.location.hash = slideName || e.index + 1;
      });

      window.addEventListener('hashchange', parseHash);
    }, 0);
  };
};

},{}],4:[function(require,module,exports){
module.exports = function(options) {
  return function(deck) {
    var isHorizontal = options !== 'vertical';

    document.addEventListener('keydown', function(e) {
      if (e.which == 34 || // PAGE DOWN
        (e.which == 32 && !e.shiftKey) || // SPACE WITHOUT SHIFT
        (isHorizontal && e.which == 39) || // RIGHT
        (!isHorizontal && e.which == 40) // DOWN
      ) { deck.next(); }

      if (e.which == 33 || // PAGE UP
        (e.which == 32 && e.shiftKey) || // SPACE + SHIFT
        (isHorizontal && e.which == 37) || // LEFT
        (!isHorizontal && e.which == 38) // UP
      ) { deck.prev(); }
    });
  };
};

},{}],5:[function(require,module,exports){
'use strict';

var toPositiveInteger = require('es5-ext/number/to-pos-integer')
  , primitiveSet      = require('es5-ext/object/primitive-set')
  , memoize           = require('memoizee/plain')
  , getNormalizer     = require('memoizee/normalizers/get-1')

  , forEach = Array.prototype.forEach, keys = Object.keys, round = Math.round
  , byNum = function (a, b) { return a - b; }
  , actions = primitiveSet('activate', 'deactivate', 'insert', 'remove', 'mark', 'class')
  , getSubsteps;

getSubsteps = memoize(function (element) {
	var map = {}, defaultOrder = 0;
	forEach.call(element.querySelectorAll('.substep'), function (el) {
		var order, action, data, names, classOrder;
		if (!el.dataset) {
			console.error(el + " cannot serve as substep wrapper due to no `dataset` support");
			return;
		}
		order = Number(el.dataset.order);
		if (isNaN(order)) order = (defaultOrder += 0.01);
		else defaultOrder = order;
		if (!map[order]) map[order] = {};
		action = el.dataset.action;
		if (!actions[action]) action = null;
		if (action == null) {
			if (el.nodeName.toLowerCase() === 'mark') action = 'mark';
			else action = 'activate';
		}
		if (action === 'class') {
			if (!el.dataset.names) throw new TypeError('Missing names for class configuration');
			names = el.dataset.names.split(' ');
			classOrder = order;
			names.forEach(function (name) {
				data = { el: el, name: name };
				if (!map[classOrder]) map[classOrder] = {};
				if (!map[classOrder].class) map[classOrder].class = [data];
				else map[order][action].push(data);
				classOrder += 0.001;
				classOrder = round(classOrder * 1000) / 1000;
			});
			return;
		}
		if (!map[order][action]) map[order][action] = [el];
		else map[order][action].push(el);
	});
	return keys(map).sort(byNum).map(function (order) { return map[order]; });
}, { normalizer: getNormalizer() });

module.exports = function (/*options*/) {
	return function (deck) {
		var activeSubstep = 0;

		deck.on('activate', function (e) {
			var substep = toPositiveInteger(e.substep);
			getSubsteps(e.slide).forEach(function (els, index) {
				var current = substep === index + 1
				  , isAfter = substep > index;
				if (els.activate) {
					els.activate.forEach(function (el) {
						el.classList[isAfter ? 'add' : 'remove']('active');
						el.classList[isAfter ? 'remove' : 'add']('inactive');
					});
				}
				if (els.deactivate) {
					els.deactivate.forEach(function (el) {
						el.classList[isAfter ? 'remove' : 'add']('active');
						el.classList[isAfter ? 'add' : 'remove']('inactive');
					});
				}
				if (els.insert) {
					els.insert.forEach(function (el) {
						el.classList[isAfter ? 'add' : 'remove']('inserted');
						el.classList[isAfter ? 'remove' : 'add']('removed');
					});
				}
				if (els.remove) {
					els.remove.forEach(function (el) {
						el.classList[isAfter ? 'remove' : 'add']('inserted');
						el.classList[isAfter ? 'add' : 'remove']('removed');
					});
				}
				if (els.mark) {
					els.mark.forEach(function (el) {
						el.classList[current ? 'add' : 'remove']('marked');
						el.classList[current ? 'remove' : 'add']('unmarked');
					});
				}
				if (els.class) {
					els.class.forEach(function (data) {
						data.el.classList[current ? 'add' : 'remove'](data.name);
					});
				}
			});
			activeSubstep = substep;
		});

		deck.on('next', function () {
			var activeSlide = deck.slide();
			if (!getSubsteps(deck.slides[activeSlide])[activeSubstep]) return;
			deck.slide(activeSlide, { substep: activeSubstep + 1 });
			return false;
		});

		deck.on('prev', function () {
			var activeSlide = deck.slide();
			if (!activeSlide) return;
			if (!activeSubstep) {
				--activeSlide;
				deck.slide(activeSlide, {
					substep: getSubsteps(deck.slides[activeSlide]).length
				});
			} else {
				deck.slide(activeSlide, { substep: activeSubstep - 1 });
			}
			return false;
		});
	};
};

},{"es5-ext/number/to-pos-integer":23,"es5-ext/object/primitive-set":35,"memoizee/normalizers/get-1":55,"memoizee/plain":56}],6:[function(require,module,exports){
var from = function(selectorOrElement, plugins) {
  var parent = selectorOrElement.nodeType === 1 ? selectorOrElement : document.querySelector(selectorOrElement),
    slides = [].filter.call(parent.children, function(el) { return el.nodeName !== 'SCRIPT'; }),
    activeSlide = slides[0],
    listeners = {},

    activate = function(index, customData) {
      if (!slides[index]) {
        return;
      }

      fire('deactivate', createEventData(activeSlide, customData));
      activeSlide = slides[index];
      fire('activate', createEventData(activeSlide, customData));
    },

    slide = function(index, customData) {
      if (arguments.length) {
        fire('slide', createEventData(slides[index], customData)) && activate(index, customData);
      } else {
        return slides.indexOf(activeSlide);
      }
    },

    step = function(offset, customData) {
      var slideIndex = slides.indexOf(activeSlide) + offset;

      fire(offset > 0 ? 'next' : 'prev', createEventData(activeSlide, customData)) && activate(slideIndex, customData);
    },

    on = function(eventName, callback) {
      (listeners[eventName] || (listeners[eventName] = [])).push(callback);

      return function() {
        listeners[eventName] = listeners[eventName].filter(function(listener) {
          return listener !== callback;
        });
      };
    },

    fire = function(eventName, eventData) {
      return (listeners[eventName] || [])
        .reduce(function(notCancelled, callback) {
          return notCancelled && callback(eventData) !== false;
        }, true);
    },

    createEventData = function(el, eventData) {
      eventData = eventData || {};
      eventData.index = slides.indexOf(el);
      eventData.slide = el;
      return eventData;
    },

    deck = {
      on: on,
      fire: fire,
      slide: slide,
      next: step.bind(null, 1),
      prev: step.bind(null, -1),
      parent: parent,
      slides: slides
    };

  (plugins || []).forEach(function(plugin) {
    plugin(deck);
  });

  activate(0);

  return deck;
};

module.exports = {
  from: from
};

},{}],7:[function(require,module,exports){
function createClassname (baseToken, comps, name) {
  let compsForName = comps[name] || []
  if (typeof compsForName === 'string') {
    compsForName = [compsForName]
  }

  const token = baseToken + (name ? `__${name}` : '')
  return [token].concat(compsForName).join(' ')
}

function upsertCss (id, css) {
  const head = document.querySelector('head')
  var el = head.querySelector('style[data-cmz="' + id + '"]')

  if (!el) {
    el = document.createElement('style')
    el.setAttribute('type', 'text/css')
    el.setAttribute('data-cmz', id)
    head.appendChild(el)
  }

  if (el.styleSheet) {
    el.styleSheet.cssText = css
  } else {
    el.textContent = css
  }

  return el
}

module.exports.createClassname = createClassname
module.exports.upsertCss = upsertCss

},{}],8:[function(require,module,exports){
'use strict';

var assign        = require('es5-ext/object/assign')
  , normalizeOpts = require('es5-ext/object/normalize-options')
  , isCallable    = require('es5-ext/object/is-callable')
  , contains      = require('es5-ext/string/#/contains')

  , d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

},{"es5-ext/object/assign":25,"es5-ext/object/is-callable":29,"es5-ext/object/normalize-options":34,"es5-ext/string/#/contains":38}],9:[function(require,module,exports){
'use strict';

var toPosInt = require('../../number/to-pos-integer')
  , value    = require('../../object/valid-value')

  , indexOf = Array.prototype.indexOf
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , abs = Math.abs, floor = Math.floor;

module.exports = function (searchElement/*, fromIndex*/) {
	var i, l, fromIndex, val;
	if (searchElement === searchElement) { //jslint: ignore
		return indexOf.apply(this, arguments);
	}

	l = toPosInt(value(this).length);
	fromIndex = arguments[1];
	if (isNaN(fromIndex)) fromIndex = 0;
	else if (fromIndex >= 0) fromIndex = floor(fromIndex);
	else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));

	for (i = fromIndex; i < l; ++i) {
		if (hasOwnProperty.call(this, i)) {
			val = this[i];
			if (val !== val) return i; //jslint: ignore
		}
	}
	return -1;
};

},{"../../number/to-pos-integer":23,"../../object/valid-value":37}],10:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Array.from
	: require('./shim');

},{"./is-implemented":11,"./shim":12}],11:[function(require,module,exports){
'use strict';

module.exports = function () {
	var from = Array.from, arr, result;
	if (typeof from !== 'function') return false;
	arr = ['raz', 'dwa'];
	result = from(arr);
	return Boolean(result && (result !== arr) && (result[1] === 'dwa'));
};

},{}],12:[function(require,module,exports){
'use strict';

var iteratorSymbol = require('es6-symbol').iterator
  , isArguments    = require('../../function/is-arguments')
  , isFunction     = require('../../function/is-function')
  , toPosInt       = require('../../number/to-pos-integer')
  , callable       = require('../../object/valid-callable')
  , validValue     = require('../../object/valid-value')
  , isString       = require('../../string/is-string')

  , isArray = Array.isArray, call = Function.prototype.call
  , desc = { configurable: true, enumerable: true, writable: true, value: null }
  , defineProperty = Object.defineProperty;

module.exports = function (arrayLike/*, mapFn, thisArg*/) {
	var mapFn = arguments[1], thisArg = arguments[2], Constructor, i, j, arr, l, code, iterator
	  , result, getIterator, value;

	arrayLike = Object(validValue(arrayLike));

	if (mapFn != null) callable(mapFn);
	if (!this || (this === Array) || !isFunction(this)) {
		// Result: Plain array
		if (!mapFn) {
			if (isArguments(arrayLike)) {
				// Source: Arguments
				l = arrayLike.length;
				if (l !== 1) return Array.apply(null, arrayLike);
				arr = new Array(1);
				arr[0] = arrayLike[0];
				return arr;
			}
			if (isArray(arrayLike)) {
				// Source: Array
				arr = new Array(l = arrayLike.length);
				for (i = 0; i < l; ++i) arr[i] = arrayLike[i];
				return arr;
			}
		}
		arr = [];
	} else {
		// Result: Non plain array
		Constructor = this;
	}

	if (!isArray(arrayLike)) {
		if ((getIterator = arrayLike[iteratorSymbol]) !== undefined) {
			// Source: Iterator
			iterator = callable(getIterator).call(arrayLike);
			if (Constructor) arr = new Constructor();
			result = iterator.next();
			i = 0;
			while (!result.done) {
				value = mapFn ? call.call(mapFn, thisArg, result.value, i) : result.value;
				if (!Constructor) {
					arr[i] = value;
				} else {
					desc.value = value;
					defineProperty(arr, i, desc);
				}
				result = iterator.next();
				++i;
			}
			l = i;
		} else if (isString(arrayLike)) {
			// Source: String
			l = arrayLike.length;
			if (Constructor) arr = new Constructor();
			for (i = 0, j = 0; i < l; ++i) {
				value = arrayLike[i];
				if ((i + 1) < l) {
					code = value.charCodeAt(0);
					if ((code >= 0xD800) && (code <= 0xDBFF)) value += arrayLike[++i];
				}
				value = mapFn ? call.call(mapFn, thisArg, value, j) : value;
				if (!Constructor) {
					arr[j] = value;
				} else {
					desc.value = value;
					defineProperty(arr, j, desc);
				}
				++j;
			}
			l = j;
		}
	}
	if (l === undefined) {
		// Source: array or array-like
		l = toPosInt(arrayLike.length);
		if (Constructor) arr = new Constructor(l);
		for (i = 0; i < l; ++i) {
			value = mapFn ? call.call(mapFn, thisArg, arrayLike[i], i) : arrayLike[i];
			if (!Constructor) {
				arr[i] = value;
			} else {
				desc.value = value;
				defineProperty(arr, i, desc);
			}
		}
	}
	if (Constructor) {
		desc.value = null;
		arr.length = l;
	}
	return arr;
};

},{"../../function/is-arguments":16,"../../function/is-function":17,"../../number/to-pos-integer":23,"../../object/valid-callable":36,"../../object/valid-value":37,"../../string/is-string":41,"es6-symbol":42}],13:[function(require,module,exports){
'use strict';

var from = require('./from')

  , isArray = Array.isArray;

module.exports = function (arrayLike) {
	return isArray(arrayLike) ? arrayLike : from(arrayLike);
};

},{"./from":10}],14:[function(require,module,exports){
'use strict';

var assign = require('../object/assign')

  , captureStackTrace = Error.captureStackTrace;

exports = module.exports = function (message/*, code, ext*/) {
	var err = new Error(), code = arguments[1], ext = arguments[2];
	if (ext == null) {
		if (code && (typeof code === 'object')) {
			ext = code;
			code = null;
		}
	}
	if (ext != null) assign(err, ext);
	err.message = String(message);
	if (code != null) err.code = String(code);
	if (captureStackTrace) captureStackTrace(err, exports);
	return err;
};

},{"../object/assign":25}],15:[function(require,module,exports){
'use strict';

var toPosInt = require('../number/to-pos-integer')

  , test = function (a, b) {}, desc, defineProperty
  , generate, mixin;

try {
	Object.defineProperty(test, 'length', { configurable: true, writable: false,
		enumerable: false, value: 1 });
} catch (ignore) {}

if (test.length === 1) {
	// ES6
	desc = { configurable: true, writable: false, enumerable: false };
	defineProperty = Object.defineProperty;
	module.exports = function (fn, length) {
		length = toPosInt(length);
		if (fn.length === length) return fn;
		desc.value = length;
		return defineProperty(fn, 'length', desc);
	};
} else {
	mixin = require('../object/mixin');
	generate = (function () {
		var cache = [];
		return function (l) {
			var args, i = 0;
			if (cache[l]) return cache[l];
			args = [];
			while (l--) args.push('a' + (++i).toString(36));
			return new Function('fn', 'return function (' + args.join(', ') +
				') { return fn.apply(this, arguments); };');
		};
	}());
	module.exports = function (src, length) {
		var target;
		length = toPosInt(length);
		if (src.length === length) return src;
		target = generate(length)(src);
		try { mixin(target, src); } catch (ignore) {}
		return target;
	};
}

},{"../number/to-pos-integer":23,"../object/mixin":33}],16:[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString

  , id = toString.call((function () { return arguments; }()));

module.exports = function (x) { return (toString.call(x) === id); };

},{}],17:[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString

  , id = toString.call(require('./noop'));

module.exports = function (f) {
	return (typeof f === "function") && (toString.call(f) === id);
};

},{"./noop":18}],18:[function(require,module,exports){
'use strict';

module.exports = function () {};

},{}],19:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Math.sign
	: require('./shim');

},{"./is-implemented":20,"./shim":21}],20:[function(require,module,exports){
'use strict';

module.exports = function () {
	var sign = Math.sign;
	if (typeof sign !== 'function') return false;
	return ((sign(10) === 1) && (sign(-20) === -1));
};

},{}],21:[function(require,module,exports){
'use strict';

module.exports = function (value) {
	value = Number(value);
	if (isNaN(value) || (value === 0)) return value;
	return (value > 0) ? 1 : -1;
};

},{}],22:[function(require,module,exports){
'use strict';

var sign = require('../math/sign')

  , abs = Math.abs, floor = Math.floor;

module.exports = function (value) {
	if (isNaN(value)) return 0;
	value = Number(value);
	if ((value === 0) || !isFinite(value)) return value;
	return sign(value) * floor(abs(value));
};

},{"../math/sign":19}],23:[function(require,module,exports){
'use strict';

var toInteger = require('./to-integer')

  , max = Math.max;

module.exports = function (value) { return max(0, toInteger(value)); };

},{"./to-integer":22}],24:[function(require,module,exports){
// Internal method, used by iteration functions.
// Calls a function for each key-value pair found in object
// Optionally takes compareFn to iterate object in specific order

'use strict';

var callable = require('./valid-callable')
  , value    = require('./valid-value')

  , bind = Function.prototype.bind, call = Function.prototype.call, keys = Object.keys
  , propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function (method, defVal) {
	return function (obj, cb/*, thisArg, compareFn*/) {
		var list, thisArg = arguments[2], compareFn = arguments[3];
		obj = Object(value(obj));
		callable(cb);

		list = keys(obj);
		if (compareFn) {
			list.sort((typeof compareFn === 'function') ? bind.call(compareFn, obj) : undefined);
		}
		if (typeof method !== 'function') method = list[method];
		return call.call(method, list, function (key, index) {
			if (!propertyIsEnumerable.call(obj, key)) return defVal;
			return call.call(cb, thisArg, obj[key], key, obj, index);
		});
	};
};

},{"./valid-callable":36,"./valid-value":37}],25:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.assign
	: require('./shim');

},{"./is-implemented":26,"./shim":27}],26:[function(require,module,exports){
'use strict';

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== 'function') return false;
	obj = { foo: 'raz' };
	assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
	return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
};

},{}],27:[function(require,module,exports){
'use strict';

var keys  = require('../keys')
  , value = require('../valid-value')

  , max = Math.max;

module.exports = function (dest, src/*, …srcn*/) {
	var error, i, l = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try { dest[key] = src[key]; } catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < l; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

},{"../keys":30,"../valid-value":37}],28:[function(require,module,exports){
'use strict';

module.exports = require('./_iterate')('forEach');

},{"./_iterate":24}],29:[function(require,module,exports){
// Deprecated

'use strict';

module.exports = function (obj) { return typeof obj === 'function'; };

},{}],30:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.keys
	: require('./shim');

},{"./is-implemented":31,"./shim":32}],31:[function(require,module,exports){
'use strict';

module.exports = function () {
	try {
		Object.keys('primitive');
		return true;
	} catch (e) { return false; }
};

},{}],32:[function(require,module,exports){
'use strict';

var keys = Object.keys;

module.exports = function (object) {
	return keys(object == null ? object : Object(object));
};

},{}],33:[function(require,module,exports){
'use strict';

var value = require('./valid-value')

  , defineProperty = Object.defineProperty
  , getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
  , getOwnPropertyNames = Object.getOwnPropertyNames
  , getOwnPropertySymbols = Object.getOwnPropertySymbols;

module.exports = function (target, source) {
	var error, sourceObject = Object(value(source));
	target = Object(value(target));
	getOwnPropertyNames(sourceObject).forEach(function (name) {
		try {
			defineProperty(target, name, getOwnPropertyDescriptor(source, name));
		} catch (e) { error = e; }
	});
	if (typeof getOwnPropertySymbols === 'function') {
		getOwnPropertySymbols(sourceObject).forEach(function (symbol) {
			try {
				defineProperty(target, symbol, getOwnPropertyDescriptor(source, symbol));
			} catch (e) { error = e; }
		});
	}
	if (error !== undefined) throw error;
	return target;
};

},{"./valid-value":37}],34:[function(require,module,exports){
'use strict';

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

module.exports = function (options/*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (options == null) return;
		process(Object(options), result);
	});
	return result;
};

},{}],35:[function(require,module,exports){
'use strict';

var forEach = Array.prototype.forEach, create = Object.create;

module.exports = function (arg/*, …args*/) {
	var set = create(null);
	forEach.call(arguments, function (name) { set[name] = true; });
	return set;
};

},{}],36:[function(require,module,exports){
'use strict';

module.exports = function (fn) {
	if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
	return fn;
};

},{}],37:[function(require,module,exports){
'use strict';

module.exports = function (value) {
	if (value == null) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{}],38:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? String.prototype.contains
	: require('./shim');

},{"./is-implemented":39,"./shim":40}],39:[function(require,module,exports){
'use strict';

var str = 'razdwatrzy';

module.exports = function () {
	if (typeof str.contains !== 'function') return false;
	return ((str.contains('dwa') === true) && (str.contains('foo') === false));
};

},{}],40:[function(require,module,exports){
'use strict';

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],41:[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString

  , id = toString.call('');

module.exports = function (x) {
	return (typeof x === 'string') || (x && (typeof x === 'object') &&
		((x instanceof String) || (toString.call(x) === id))) || false;
};

},{}],42:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')() ? Symbol : require('./polyfill');

},{"./is-implemented":43,"./polyfill":46}],43:[function(require,module,exports){
'use strict';

var validTypes = { object: true, symbol: true };

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try { String(symbol); } catch (e) { return false; }

	// Return 'true' also for polyfills
	if (!validTypes[typeof Symbol.iterator]) return false;
	if (!validTypes[typeof Symbol.toPrimitive]) return false;
	if (!validTypes[typeof Symbol.toStringTag]) return false;

	return true;
};

},{}],44:[function(require,module,exports){
'use strict';

module.exports = function (x) {
	if (!x) return false;
	if (typeof x === 'symbol') return true;
	if (!x.constructor) return false;
	if (x.constructor.name !== 'Symbol') return false;
	return (x[x.constructor.toStringTag] === 'Symbol');
};

},{}],45:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8,"es5-ext/object/assign":25,"es5-ext/object/is-callable":29,"es5-ext/object/normalize-options":34,"es5-ext/string/#/contains":38}],46:[function(require,module,exports){
// ES2015 Symbol polyfill for environments that do not support it (or partially support it)

'use strict';

var d              = require('d')
  , validateSymbol = require('./validate-symbol')

  , create = Object.create, defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
  , isNativeSafe;

if (typeof Symbol === 'function') {
	NativeSymbol = Symbol;
	try {
		String(NativeSymbol());
		isNativeSafe = true;
	} catch (ignore) {}
}

var generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0, name, ie11BugWorkaround;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		name = '@@' + desc;
		defineProperty(objPrototype, name, d.gs(null, function (value) {
			// For IE11 issue see:
			// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
			//    ie11-broken-getters-on-dom-objects
			// https://github.com/medikoo/es6-symbol/issues/12
			if (ie11BugWorkaround) return;
			ie11BugWorkaround = true;
			defineProperty(this, name, d(value));
			ie11BugWorkaround = false;
		}));
		return name;
	};
}());

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError('TypeError: Symbol is not a constructor');
	return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
module.exports = SymbolPolyfill = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError('TypeError: Symbol is not a constructor');
	if (isNativeSafe) return NativeSymbol(description);
	symbol = create(HiddenSymbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};
defineProperties(SymbolPolyfill, {
	for: d(function (key) {
		if (globalSymbols[key]) return globalSymbols[key];
		return (globalSymbols[key] = SymbolPolyfill(String(key)));
	}),
	keyFor: d(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) if (globalSymbols[key] === s) return key;
	}),

	// If there's native implementation of given symbol, let's fallback to it
	// to ensure proper interoperability with other native functions e.g. Array.from
	hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
	isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
		SymbolPolyfill('isConcatSpreadable')),
	iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
	match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
	replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
	search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
	species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
	split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
	toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
	toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
	unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
});

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
	constructor: d(SymbolPolyfill),
	toString: d('', function () { return this.__name__; })
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
	toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
	var symbol = validateSymbol(this);
	if (typeof symbol === 'symbol') return symbol;
	return symbol.toString();
}));
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));

},{"./validate-symbol":47,"d":45}],47:[function(require,module,exports){
'use strict';

var isSymbol = require('./is-symbol');

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};

},{"./is-symbol":44}],48:[function(require,module,exports){
'use strict';

var d        = require('d')
  , callable = require('es5-ext/object/valid-callable')

  , apply = Function.prototype.apply, call = Function.prototype.call
  , create = Object.create, defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , descriptor = { configurable: true, enumerable: false, writable: true }

  , on, once, off, emit, methods, descriptors, base;

on = function (type, listener) {
	var data;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) {
		data = descriptor.value = create(null);
		defineProperty(this, '__ee__', descriptor);
		descriptor.value = null;
	} else {
		data = this.__ee__;
	}
	if (!data[type]) data[type] = listener;
	else if (typeof data[type] === 'object') data[type].push(listener);
	else data[type] = [data[type], listener];

	return this;
};

once = function (type, listener) {
	var once, self;

	callable(listener);
	self = this;
	on.call(this, type, once = function () {
		off.call(self, type, once);
		apply.call(listener, this, arguments);
	});

	once.__eeOnceListener__ = listener;
	return this;
};

off = function (type, listener) {
	var data, listeners, candidate, i;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) return this;
	data = this.__ee__;
	if (!data[type]) return this;
	listeners = data[type];

	if (typeof listeners === 'object') {
		for (i = 0; (candidate = listeners[i]); ++i) {
			if ((candidate === listener) ||
					(candidate.__eeOnceListener__ === listener)) {
				if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
				else listeners.splice(i, 1);
			}
		}
	} else {
		if ((listeners === listener) ||
				(listeners.__eeOnceListener__ === listener)) {
			delete data[type];
		}
	}

	return this;
};

emit = function (type) {
	var i, l, listener, listeners, args;

	if (!hasOwnProperty.call(this, '__ee__')) return;
	listeners = this.__ee__[type];
	if (!listeners) return;

	if (typeof listeners === 'object') {
		l = arguments.length;
		args = new Array(l - 1);
		for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

		listeners = listeners.slice();
		for (i = 0; (listener = listeners[i]); ++i) {
			apply.call(listener, this, args);
		}
	} else {
		switch (arguments.length) {
		case 1:
			call.call(listeners, this);
			break;
		case 2:
			call.call(listeners, this, arguments[1]);
			break;
		case 3:
			call.call(listeners, this, arguments[1], arguments[2]);
			break;
		default:
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) {
				args[i - 1] = arguments[i];
			}
			apply.call(listeners, this, args);
		}
	}
};

methods = {
	on: on,
	once: once,
	off: off,
	emit: emit
};

descriptors = {
	on: d(on),
	once: d(once),
	off: d(off),
	emit: d(emit)
};

base = defineProperties({}, descriptors);

module.exports = exports = function (o) {
	return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
};
exports.methods = methods;

},{"d":49,"es5-ext/object/valid-callable":36}],49:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8,"es5-ext/object/assign":25,"es5-ext/object/is-callable":29,"es5-ext/object/normalize-options":34,"es5-ext/string/#/contains":38}],50:[function(require,module,exports){
'use strict';

var customError      = require('es5-ext/error/custom')
  , defineLength     = require('es5-ext/function/_define-length')
  , d                = require('d')
  , ee               = require('event-emitter').methods
  , resolveResolve   = require('./resolve-resolve')
  , resolveNormalize = require('./resolve-normalize')

  , apply = Function.prototype.apply, call = Function.prototype.call
  , create = Object.create, hasOwnProperty = Object.prototype.hasOwnProperty
  , defineProperties = Object.defineProperties
  , on = ee.on, emit = ee.emit;

module.exports = function (original, length, options) {
	var cache = create(null), conf, memLength, get, set, del, clear, extDel, normalizer
	  , getListeners, setListeners, deleteListeners, memoized, resolve;
	if (length !== false) memLength = length;
	else if (isNaN(original.length)) memLength = 1;
	else memLength = original.length;

	if (options.normalizer) {
		normalizer = resolveNormalize(options.normalizer);
		get = normalizer.get;
		set = normalizer.set;
		del = normalizer.delete;
		clear = normalizer.clear;
	}
	if (options.resolvers != null) resolve = resolveResolve(options.resolvers);

	if (get) {
		memoized = defineLength(function (arg) {
			var id, result, args = arguments;
			if (resolve) args = resolve(args);
			id = get(args);
			if (id !== null) {
				if (hasOwnProperty.call(cache, id)) {
					if (getListeners) conf.emit('get', id, args, this);
					return cache[id];
				}
			}
			if (args.length === 1) result = call.call(original, this, args[0]);
			else result = apply.call(original, this, args);
			if (id === null) {
				id = get(args);
				if (id !== null) throw customError("Circular invocation", 'CIRCULAR_INVOCATION');
				id = set(args);
			} else if (hasOwnProperty.call(cache, id)) {
				throw customError("Circular invocation", 'CIRCULAR_INVOCATION');
			}
			cache[id] = result;
			if (setListeners) conf.emit('set', id, null, result);
			return result;
		}, memLength);
	} else if (length === 0) {
		memoized = function () {
			var result;
			if (hasOwnProperty.call(cache, 'data')) {
				if (getListeners) conf.emit('get', 'data', arguments, this);
				return cache.data;
			}
			if (!arguments.length) result = call.call(original, this);
			else result = apply.call(original, this, arguments);
			if (hasOwnProperty.call(cache, 'data')) {
				throw customError("Circular invocation", 'CIRCULAR_INVOCATION');
			}
			cache.data = result;
			if (setListeners) conf.emit('set', 'data', null, result);
			return result;
		};
	} else {
		memoized = function (arg) {
			var result, args = arguments, id;
			if (resolve) args = resolve(arguments);
			id = String(args[0]);
			if (hasOwnProperty.call(cache, id)) {
				if (getListeners) conf.emit('get', id, args, this);
				return cache[id];
			}
			if (args.length === 1) result = call.call(original, this, args[0]);
			else result = apply.call(original, this, args);
			if (hasOwnProperty.call(cache, id)) {
				throw customError("Circular invocation", 'CIRCULAR_INVOCATION');
			}
			cache[id] = result;
			if (setListeners) conf.emit('set', id, null, result);
			return result;
		};
	}
	conf = {
		original: original,
		memoized: memoized,
		get: function (args) {
			if (resolve) args = resolve(args);
			if (get) return get(args);
			return String(args[0]);
		},
		has: function (id) { return hasOwnProperty.call(cache, id); },
		delete: function (id) {
			var result;
			if (!hasOwnProperty.call(cache, id)) return;
			if (del) del(id);
			result = cache[id];
			delete cache[id];
			if (deleteListeners) conf.emit('delete', id, result);
		},
		clear: function () {
			var oldCache = cache;
			if (clear) clear();
			cache = create(null);
			conf.emit('clear', oldCache);
		},
		on: function (type, listener) {
			if (type === 'get') getListeners = true;
			else if (type === 'set') setListeners = true;
			else if (type === 'delete') deleteListeners = true;
			return on.call(this, type, listener);
		},
		emit: emit,
		updateEnv: function () { original = conf.original; }
	};
	if (get) {
		extDel = defineLength(function (arg) {
			var id, args = arguments;
			if (resolve) args = resolve(args);
			id = get(args);
			if (id === null) return;
			conf.delete(id);
		}, memLength);
	} else if (length === 0) {
		extDel = function () { return conf.delete('data'); };
	} else {
		extDel = function (arg) {
			if (resolve) arg = resolve(arguments)[0];
			return conf.delete(arg);
		};
	}
	defineProperties(memoized, {
		__memoized__: d(true),
		delete: d(extDel),
		clear: d(conf.clear)
	});
	return conf;
};

},{"./resolve-normalize":53,"./resolve-resolve":54,"d":8,"es5-ext/error/custom":14,"es5-ext/function/_define-length":15,"event-emitter":48}],51:[function(require,module,exports){
'use strict';

},{}],52:[function(require,module,exports){
'use strict';

var toPosInt = require('es5-ext/number/to-pos-integer');

module.exports = function (optsLength, fnLength, isAsync) {
	var length;
	if (isNaN(optsLength)) {
		length = fnLength;
		if (!(length >= 0)) return 1;
		if (isAsync && length) return length - 1;
		return length;
	}
	if (optsLength === false) return false;
	return toPosInt(optsLength);
};

},{"es5-ext/number/to-pos-integer":23}],53:[function(require,module,exports){
'use strict';

var callable = require('es5-ext/object/valid-callable');

module.exports = function (userNormalizer) {
	var normalizer;
	if (typeof userNormalizer === 'function') return { set: userNormalizer, get: userNormalizer };
	normalizer = { get: callable(userNormalizer.get) };
	if (userNormalizer.set !== undefined) {
		normalizer.set = callable(userNormalizer.set);
		normalizer.delete = callable(userNormalizer.delete);
		normalizer.clear = callable(userNormalizer.clear);
		return normalizer;
	}
	normalizer.set = normalizer.get;
	return normalizer;
};

},{"es5-ext/object/valid-callable":36}],54:[function(require,module,exports){
'use strict';

var toArray  = require('es5-ext/array/to-array')
  , callable = require('es5-ext/object/valid-callable')

  , slice = Array.prototype.slice
  , resolveArgs;

resolveArgs = function (args) {
	return this.map(function (r, i) {
		return r ? r(args[i]) : args[i];
	}).concat(slice.call(args, this.length));
};

module.exports = function (resolvers) {
	resolvers = toArray(resolvers);
	resolvers.forEach(function (r) {
		if (r != null) callable(r);
	});
	return resolveArgs.bind(resolvers);
};

},{"es5-ext/array/to-array":13,"es5-ext/object/valid-callable":36}],55:[function(require,module,exports){
'use strict';

var indexOf = require('es5-ext/array/#/e-index-of');

module.exports = function () {
	var lastId = 0, argsMap = [], cache = [];
	return {
		get: function (args) {
			var index = indexOf.call(argsMap, args[0]);
			return (index === -1) ? null : cache[index];
		},
		set: function (args) {
			argsMap.push(args[0]);
			cache.push(++lastId);
			return lastId;
		},
		delete: function (id) {
			var index = indexOf.call(cache, id);
			if (index !== -1) {
				argsMap.splice(index, 1);
				cache.splice(index, 1);
			}
		},
		clear: function () {
			argsMap = [];
			cache = [];
		}
	};
};

},{"es5-ext/array/#/e-index-of":9}],56:[function(require,module,exports){
'use strict';

var callable      = require('es5-ext/object/valid-callable')
  , forEach       = require('es5-ext/object/for-each')
  , extensions    = require('./lib/registered-extensions')
  , configure     = require('./lib/configure-map')
  , resolveLength = require('./lib/resolve-length')

  , hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = function self(fn/*, options */) {
	var options, length, conf;

	callable(fn);
	options = Object(arguments[1]);

	if (options.async && options.promise) {
		throw new Error("Options 'async' and 'promise' cannot be used together");
	}

	// Do not memoize already memoized function
	if (hasOwnProperty.call(fn, '__memoized__') && !options.force) return fn;

	// Resolve length;
	length = resolveLength(options.length, fn.length, options.async && extensions.async);

	// Configure cache map
	conf = configure(fn, length, options);

	// Bind eventual extensions
	forEach(extensions, function (fn, name) {
		if (options[name]) fn(options[name], conf, options);
	});

	if (self.__profiler__) self.__profiler__(conf);

	conf.updateEnv();
	return conf.memoized;
};

},{"./lib/configure-map":50,"./lib/registered-extensions":51,"./lib/resolve-length":52,"es5-ext/object/for-each":28,"es5-ext/object/valid-callable":36}],57:[function(require,module,exports){

require('cmz').upsertCss('src/components/rank.css', `.src_components_rank__rank {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  background: white;
}

.src_components_rank__avatar {
  width: 5rem;
  border-radius: 10rem;
}

.src_components_rank__name {
  font-weight: bold;
}

.src_components_rank__score {
  color: grey;
}

`)

},{"cmz":7}],58:[function(require,module,exports){
const bespoke = require('bespoke')
const backdrop = require('bespoke-backdrop')
const classes = require('bespoke-classes')
const keys = require('bespoke-keys')
const hash = require('bespoke-hash')
const substeps = require('bespoke-substeps/dom')

const renderSlides = require('./slides')
document.getElementById('pres').innerHTML = renderSlides()

window.bespoke = bespoke.from('#pres', [
  //  backdrop(),
  classes(),
  keys(),
  hash(),
  substeps()
])

if (module.hot) {
  module.hot.accept()
}

},{"./slides":72,"bespoke":6,"bespoke-backdrop":1,"bespoke-classes":2,"bespoke-hash":3,"bespoke-keys":4,"bespoke-substeps/dom":5}],59:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/about-me.js:2', `
.src_slides_about-me___image {
  width: 25vw;
  margin-left: -2vw;
}

.src_slides_about-me___image:nth-child(2) {
  width: 20vw;
}

.src_slides_about-me___image:first-child {
  margin-left: 0;
}
`)
 && cmz.createClassname.bind(null, 'src_slides_about-me_', {
  '': 'flex-row',
  'image': 'substep substep-fade-up'
}))

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  const srcs = [
    'src/images/alchemix.png',
    'src/images/x-team-logo.png',
    'src/images/css-modules-logo.png'
  ]

  const images = srcs.map( (src, i) => tag('img.image', { src: src, 'z-index': srcs.length - i }) )

  return tag('slide.&', {}, images)
}

},{"../util/tag":87,"cmz":7}],60:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/bundling.js:2', `
.src_slides_bundling_ {
  -ms-flex-pack: distribute;
      justify-content: space-around;
}

.src_slides_bundling___old,
.src_slides_bundling___new {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
      -ms-flex-direction: row;
          flex-direction: row;
  text-align: center;
}

.src_slides_bundling___js-files,
.src_slides_bundling___css-files {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
  margin-right: 1vw;
}

.src_slides_bundling___file {
  margin: .2vw 1vw;
  width: 5vw;
  height: 5vw;
  background: #fff;
  border-radius: 10vw;
  border: .5vw solid #333;
  line-height: 5vw;
}

.src_slides_bundling___divider {
  border-bottom: .5vw solid #000;
}

.src_slides_bundling___arrow {
  width: 0;
  height: 5vw;
  border-left: .3vw dashed #000;
  margin-left: 4vw;
}

.src_slides_bundling___output {
  font-size: 2vw;
}

.src_slides_bundling___new {
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
}

.src_slides_bundling___new .src_slides_bundling___col:nth-child(2) {
  border-left: .3vw solid #000;
}

.src_slides_bundling___new .src_slides_bundling___col:nth-child(2) .src_slides_bundling___file {

}

`)
 && cmz.createClassname.bind(null, 'src_slides_bundling_', {
  '': 'flex-row',
  'js-files': 'substep substep-fade',
  'css-files': 'substep substep-fade',
  'new': 'substep substep-fade'
}))

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('.old', {}, [
      tag('.js-files', {}, [
        tag('.file', {}, 'js'),
        tag('.file', {}, 'js'),
        tag('.file', {}, 'js'),
        tag('.file', {}, 'js'),
        tag('.divider', {}, ''),
        tag('.arrow', {}, ''),
        tag('.point', {}, '▼'),
        tag('.output', {}, 'bundle.js')
      ]),
      tag('.css-files', {}, [
        tag('.file', {}, 'css'),
        tag('.file', {}, 'css'),
        tag('.file', {}, 'css'),
        tag('.file', {}, 'css'),
        tag('.divider', {}, ''),
        tag('.arrow', {}, ''),
        tag('.point', {}, '▼'),
        tag('.output', {}, 'bundle.css')
      ])
    ]),
    tag('.new', {}, `
<!-- http://codepen.io/Pestov/pen/BLpgm -->
<div class="tree">
	<ul>
		<li>
			<a href="#">js</a>
			<ul class="substep substep-fade">
				<li>
					<a href="#">js</a>
					<ul>
						<li>
							<a href="#">js</a>
						</li>
						<li>
							<a href="#">js</a>
						</li>
					</ul>
				</li>
				<li>
					<a href="#">js</a>
					<ul class="ui-dep">
						<li>
                                                  <a href="#">js</a>
                                                  <ul class="substep substep-fade css-dep">
                                                    <li><a href="#">css</a></li>
                                                  </ul>
                                                </li>
						<li>
                                                  <a href="#">js</a>
                                                  <ul class="substep substep-fade css-dep">
                                                    <li><a href="#">css</a></li>
                                                  </ul>
                                                </li>
						<li>
                                                  <a href="#">js</a>
                                                  <ul class="substep substep-fade css-dep">
                                                    <li><a href="#">css</a></li>
                                                  </ul>
                                                </li>
					</ul>
				</li>
			</ul>
		</li>
	</ul>
</div>
`)
  ])
}

},{"../util/tag":87,"cmz":7}],61:[function(require,module,exports){
const cmz = require('cmz')
const campjs = require('./campjs').styles
const styles = (
require('cmz').upsertCss('src/slides/campjs-2.js:3', `

.src_slides_campjs-2___images {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  display: -webkit-box;

  display: -ms-flexbox;

  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
      -ms-flex-direction: row;
          flex-direction: row;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
}

.src_slides_campjs-2___image {
  width: 30vw;
  margin-left: -4vw;
  border: 0.5vw solid #fff;
  border-radius: 200vw;
}

.src_slides_campjs-2___image:first-child {
  margin-left: 0;
}
`)
 && cmz.createClassname.bind(null, 'src_slides_campjs-2_', {
  'bg': campjs('bg'),
  'image': 'substep substep-fade-up'
}))

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('img.bg', { src: 'src/images/campjs-bg.png' }),
    tag('.images', {}, [
      tag('img.image', { src: 'src/images/bugwolf-examples.png', style: 'z-index: 2' }),
      tag('img.image', { src: 'src/images/bugwolf-logo.png', style: 'z-index: 1' })
    ])
  ])
}

},{"../util/tag":87,"./campjs":62,"cmz":7}],62:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/campjs.js:2', `
.src_slides_campjs___bg {
  min-height: 101vh;
  -webkit-animation: zoomin 40s infinite ease-in-out;
          animation: zoomin 40s infinite ease-in-out;
}

@-webkit-keyframes zoomin {
  0% { -webkit-transform:scale(1.0); transform:scale(1.0); }
  50% { -webkit-transform:scale(1.2); transform:scale(1.2); }
  100% { -webkit-transform:scale(1.0); transform:scale(1.0); }
}

@keyframes zoomin {
  0% { -webkit-transform:scale(1.0); transform:scale(1.0); }
  50% { -webkit-transform:scale(1.2); transform:scale(1.2); }
  100% { -webkit-transform:scale(1.0); transform:scale(1.0); }
}

.src_slides_campjs___images {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  display: -webkit-box;

  display: -ms-flexbox;

  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
      -ms-flex-direction: row;
          flex-direction: row;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
}

.src_slides_campjs___image {
  width: 20vw;
  margin-left: -2vw;
  border: 0.5vw solid #fff;
  border-radius: 200vw;
}

.src_slides_campjs___image:first-child {
  margin-left: 0;
}
`)
 && cmz.createClassname.bind(null, 'src_slides_campjs_', {
  'image': 'substep substep-fade-up'
}))

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('img.bg', { src: 'src/images/campjs-bg.png' }),
    tag('.images', {}, [
      tag('img.image', { src: 'src/images/mark.jpg', style: 'z-index: 3' }),
      tag('img.image', { src: 'src/images/sokra.jpg', style: 'z-index: 2' }),
      tag('img.image', { src: 'src/images/glen.jpg', style: 'z-index: 1' })
    ])
  ])
}

module.exports.styles = styles

},{"../util/tag":87,"cmz":7}],63:[function(require,module,exports){
const cmz = require('cmz')

// use this for the browser screenshot
cmz.createClassname.bind(null, 'src_components_rank', {})
require('/Users/josh/projects/cssconf-talk/02/src/components/rank.css')


const styles = (
require('cmz').upsertCss('src/slides/compare-src-and-output.js:6', `

.src_slides_compare-src-and-output___leaderboard {
  width: 40vw;
}

`)
 && cmz.createClassname.bind(null, 'src_slides_compare-src-and-output_', {
  '': 'flex-row',
  'file': 'file'
}))

const tag = require('../util/tag').bind(null, styles)

function renderFileA () {
  return tag('.file', {}, [
    'rank.css',
    tag('pre', {}, [
      tag('code', {},
`.rank {
  display: flex;
  background: white;
}

.avatar {
  width: 5rem;
  border-radius: 10rem;
}

.name {
  font-weight: bold;
}

.score {
  color: grey;
}
`)
    ])
  ])
}

module.exports = function () {
  return tag('slide.&', {}, [
    renderFileA(),
    tag('img.leaderboard', { src: 'src/images/css-output.png' }),
  ])
}

},{"../util/tag":87,"/Users/josh/projects/cssconf-talk/02/src/components/rank.css":57,"cmz":7}],64:[function(require,module,exports){
module.exports = `
      <section>
<!-- http://codepen.io/Pestov/pen/BLpgm -->
<div class="tree">
	<ul>
		<li>
			<a href="#">js</a>
			<ul>
				<li>
					<a href="#">js</a>
					<ul>
						<li>
							<a href="#">js</a>
						</li>
						<li>
							<a href="#">js</a>
						</li>
					</ul>
				</li>
				<li>
					<a href="#">js</a>
					<ul class="ui-dep">
						<li>
                                                  <a href="#">js</a>
                                                  <ul class=" css-dep">
                                                    <li><a href="#">css</a></li>
                                                  </ul>
                                                </li>
						<li>
                                                  <a href="#">js</a>
                                                  <ul class=" css-dep">
                                                    <li><a href="#">css</a></li>
                                                  </ul>
                                                </li>
						<li>
                                                  <a href="#">js</a>
                                                  <ul class="css-dep">
                                                    <li><a href="#">css</a></li>
                                                  </ul>
                                                </li>
					</ul>
				</li>
			</ul>
		</li>
	</ul>
</div>
</section>
`

},{}],65:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/curve-2.js:2', `
.src_slides_curve-2___heading {
  margin-bottom: 10vh;
}

.src_slides_curve-2___images {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
      -ms-flex-direction: row;
          flex-direction: row;
}

.src_slides_curve-2___image {
  height: 30vw;
  max-width: 30vw;
  margin-left: -4vw;
  border: 0.5vw solid #fff;
  border-radius: 200vw;
}

.src_slides_curve-2___image:first-child {
  margin-left: 0;
}
`)
 && cmz.createClassname.bind(null, 'src_slides_curve-2_', {
  'heading': 'font-l heading-shadow',
  'image': 'substep substep-fade-up'
}))

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  const srcs = [
    'src/images/feels-good.png',
    'src/images/fine.png',
    'src/images/homer-bomb.gif'
  ]

  const images = srcs.map( (src, i) => tag('img.image', { src: src, 'z-index': srcs.length - i }) )

  return tag('slide.&', {}, [
    tag('h1.heading', {}, '3 Stages of CSS'),
    tag('.images', {}, images)
  ])
}

},{"../util/tag":87,"cmz":7}],66:[function(require,module,exports){

module.exports = `
      <section class="flex-row">
<div class="bubble">
  <div class="bubbleText font-xl">
    🎉
  </div>
</div>

<div class="defn" style="margin-left: 2vw">
        <pre><code style="font-family: Courier; font-size: 3vw;">
<b>win&middot;ing</b>
<i>noun</i>

a constant state of enjoying life.
It does not end, otherwise one was
not truly winning to begin with.
Hence, the suffix "ing"

source: urbandictionary.com
        </code></pre>
</div>
      </section>
`

},{}],67:[function(require,module,exports){
module.exports = `
      <section class="ewok">
        <img class="full-h substep substep-fade" src="src/images/ewok/css-land.png" />
        <img class="full-h substep substep-fade" src="src/images/ewok/js-land.png" />
        <img class="full-h substep substep-fade" src="src/images/ewok/css-modules.png" />
        <img class="full-h substep substep-wipe-up" src="src/images/ewok-bridge.png" />
      </section>
`

},{}],68:[function(require,module,exports){
module.exports = `
      <section class="cm-example">
        <div class="font-m label substep substep-fade substep-drop-v" data-order=1>
          <div>a component</div>
          
          <span class="line"></span>
          
        </div>

        <div class="files">
          <div class="file css">

            <div class="substep substep-fade substep-drop-v font-s font-label" data-order=2>Styles</div>
index.css
        <code><pre>
<span class="import substep" data-order=4>.root</span> {
  display: flex;
}

<span class="import substep" data-order=5>.avatar</span> {
  width: 30px;
  border-radius: 30px;
}

<span class="import substep" data-order=6>.name</span> {
  font-size: small;
  font-weight: 800;
}
        </pre></code></div>

          <div class="file js">

            <div class="substep substep-fade substep-drop-v font-s font-label" data-order=2>DOM &amp; Logic</div>
index.js
<code><pre>
<span class="import substep" data-order=3>import styles from './index.css'</span>

export default function (props) {
  return \`
    &lt;div class=\${<span class="import substep" data-order=4>styles.root</span>}&gt;
      &lt;img class=\${<span class="import substep" data-order=5>styles.avatar</span>} src=\${props.url} /&gt;
      &lt;span class=\${<span class="import substep" data-order=6>styles.name</span>}&gt;\${props.name}&lt;/span&gt;
    &lt;/div&gt;
  \`
}
          </pre></code></div>
        </div>
      </section>
`

},{}],69:[function(require,module,exports){
module.exports = `
      <section class="cm-example">
        <div class="files">
          <div class="file css">
index.css
        <code><pre>
<span class="import substep" data-order=1>.root</span> {
  display: flex;
}

<span class="import substep" data-order=1>.avatar</span> {
  width: 30px;
  border-radius: 30px;
}

<span class="import substep" data-order=1>.name</span> {
  font-size: small;
  font-weight: 800;
}
        </pre></code></div>

          <div class="file js">
index.js
<code><pre>
<span class="import substep" data-order=1>import styles from './index.css'</span>

export default function (props) {
  return \`
    &lt;div class=\${<span class="import substep" data-order=1>styles.root</span>}&gt;
      &lt;img class=\${<span class="import substep" data-order=1>styles.avatar</span>} src=\${props.url} /&gt;
      &lt;span class=\${<span class="import substep" data-order=1>styles.name</span>}&gt;\${props.name}&lt;/span&gt;
    &lt;/div&gt;
  \`
}
          </pre></code></div>
        </div>
      </section>
`

},{}],70:[function(require,module,exports){
module.exports = `
      <section class="cm-example">
        <div class="files">
          <div class="file css">
index.css
        <code><pre>
<span class="import substep" data-order=2>.root</span> {
  display: flex;
}

<span class="import substep" data-order=3>.avatar</span> {
  width: 30px;
  border-radius: 30px;
}

.name {
  font-size: small;
  font-weight: 800;
}
        </pre></code></div>

          <div class="file js">
index.html
<code><pre>
<span class="import substep" data-order=1></span>&lt;div class="<span class="import substep" data-order=2>root</span>"&gt;
  &lt;img class="<span class="import substep" data-order=3>avatar</span>" src="{{ props.url }}" /&gt;
  &lt;span class="<span class="import substep" data-order=4>heading</span>"&gt;{{ props.name }}&lt;/span&gt;
&lt;/div&gt;
          </pre></code></div>
        </div>
      </section>
`

},{}],71:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/hammer.js:2', `
.src_slides_hammer___image {
  height: 60vh;
  -webkit-filter: drop-shadow(-4px 4px 0px #0FF);
}
`)
 && cmz.createClassname.bind(null, 'src_slides_hammer_', {

}))

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('img.image', { src: 'src/images/hammer-and-screw.png' })
  ])
}

},{"../util/tag":87,"cmz":7}],72:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/index.js:2', `

.src_slides_index___heading-l {
  text-align: center;
  padding: 0 2vw;
}

.src_slides_index___ewokBubble,
.src_slides_index___bubble {
  width: 22vw;
  height: 22vw;
  background: #FFF;
  border-radius: 200vw;
}

.src_slides_index___ewokBubble {
  max-width: 15vw;
  max-height: 15vw;
  border: .5vw solid #fff;
}

.src_slides_index___bubbleText {
  font-weight: 800;
  text-align: center;
  line-height: 22vw;
}

.src_slides_index___bubbleHeading {
  width: 70vw;
  padding-left: 2vw;
}

.src_slides_index___bubbleImage {
  width: 17vw;
  padding: 2vw 3vw;
}

`)
 && cmz.createClassname.bind(null, 'src_slides_index_', {
  'win': 'flex-row',
  'problem': 'flex-row',
  'problemHeading': 'font-l heading-shadow',
  'problemSub': 'font-s',
  'problemLabel': 'font-s heading-label',

  'bubbleText': 'font-xl',

  'winHeading': 'font-l heading-shadow',
  'winLabel': 'font-s heading-label',

  'heading-l': 'font-l heading-shadow',

  'image-full-h': 'full-h'
}))

const tag = require('../util/tag').bind(null, styles)

function setDefaultBackdrop (id, attr) {
  const backdropAttr = 'data-bespoke-backdrop'

  attr = attr || {}
  if (!attr[backdropAttr]) {
    attr[backdropAttr] = `backdrop--${id}`
  }
  return attr
}

function heading (text, attr) {
  attr = setDefaultBackdrop('footer', attr)

  return tag('section', attr, [
    tag('h1.heading-l', {}, text)
  ])
}

function placeholder (text) {
  return tag('section', {}, [
    tag('p', {}, text)
  ])
}

function fullImage (src) {
  return tag('section', {}, [
    tag('img.image-full-h', { src })
  ])
}

function bubble (children) {
  return tag('.bubble', {}, [
    tag('.bubbleText', {}, children)
  ])
}

function win (num, text) {
  let b = (num === 2) ?
      tag('img.ewokBubble', { src: 'src/images/ewok-face-2.png' }) :
      bubble('🎉')

  const attr = setDefaultBackdrop('footer', {})
  return tag('section.win', attr, [
    b,
    tag('.bubbleHeading', {}, [
      tag('.winLabel', {}, `Way to Win #${num}`),
      tag('h1.winHeading', {}, `#${num}: ${text}`)
    ])
  ])
}

function problem (text, sub) {
  const attr = setDefaultBackdrop('footer', {})

  return tag('section.problem', attr, [
    // bubble(`!@#^`),
    bubble('☠️'),
    tag('.bubbleHeading', {}, [
      tag('.problemLabel', {}, 'problem'),
      tag('h1.problemHeading', {}, text),
      tag('h1.problemSub', {}, sub)
    ])
  ])
}

module.exports = function () {
  return [
    require('./title')(),

    require('./about-me')(),
    require('./campjs')(),
    require('./campjs-2')(),
    fullImage('src/images/shiny.jpg'),
    heading('18 months later'),

    require('./hammer')(),
    require('./yahoo-answers')(),
    require('./some-things-are-hard')(),
    heading('Could these things be related?'),

    tag('section', { class: 'flex-row' }, [
      bubble(tag('img.bubbleImage', { src: 'src/images/css-modules-logo.png' })),
      tag('.bubbleHeading', {}, [
        tag('h1.heading-l', { style: 'text-align: left' }, 'What are CSS&nbsp;Modules?')
      ])
    ]),
    require('./example-1b'),
    require('./js-modules-css-modules'),

    heading('At Least 6 Ways to <em>Win</em> with CSS Modules'),
    heading('Why <em>&ldquo;Win&rdquo;</em>?'),
    require('./curve-2')(),
    heading('That winning feeling'),
    fullImage('src/images/solitaire.gif'),
    require('./sheen')(),
    require('./defn-of-winning'),
    require('./stages')(),

    problem('CSS Modules might not have the features you&rsquo;re used to'),
    require('./nesting')(),
    require('./nesting-2')(),
    heading('CSS Modules automatically namespaces classes <div class="substep substep-fade"><code style="font-size: 5vw">.score -> .components_rank__score</code></div>'),
    heading('You can improve your code by deleting it??'),
    win(1, 'Don&rsquo;t manually namespace your classes'),

    require('./magic')(),
    require('./compare-src-and-output')(),
    heading('CSS Modules is not exactly &ldquo;css in js&rdquo;...'),
    require('./ewok'),
    win(2, 'Write real css, with less hacks'),

    problem('CSS Modules will make you type more'),
    require('./example-html'),
    require('./example-1c'),
    require('./with-flow')(),
    win(3, 'Have an explicit mapping between CSS and the DOM'),

    problem('CSS Modules breaks some familiar patterns'),
    require('./label-example')(),
    require('./reusing-the-avatar')(),
    require('./logic-in-css')(),
    win(4, 'Embrace immutability'),

    problem('You&rsquo;ll need a build tool', 'like browserify or webpack'),
    require('./bundling')(),
    win(5, 'Give your JS modules CSS dependencies'),

    tag('section', {}, [
      tag('h1.heading-l', { style: 'font-size: 16vw' }, 'FORC'),
      tag('div', { class: 'substep substep-fade', style: 'font-size: 5vw' }, 'Fear of Removing CSS')
    ]),
    require('./css-in-the-tree.js'),
    win(6, 'Defeat FORC'),

    heading('Everything is a tradeoff'),
    require('./stages')(),

    heading('Thanks!'),

    // backdrops
    tag('div', { class: 'backdrop backdrop--footer' }, [
      tag('h1', {}, '@joshwnj')
    ])
  ].join('\n')
}

},{"../util/tag":87,"./about-me":59,"./bundling":60,"./campjs":62,"./campjs-2":61,"./compare-src-and-output":63,"./css-in-the-tree.js":64,"./curve-2":65,"./defn-of-winning":66,"./ewok":67,"./example-1b":68,"./example-1c":69,"./example-html":70,"./hammer":71,"./js-modules-css-modules":73,"./label-example":74,"./logic-in-css":75,"./magic":76,"./nesting":78,"./nesting-2":77,"./reusing-the-avatar":79,"./sheen":80,"./some-things-are-hard":81,"./stages":82,"./title":83,"./with-flow":84,"./yahoo-answers":85,"cmz":7}],73:[function(require,module,exports){
module.exports = `
      <section class="js-modules-css-modules">
        <div class="js">
          <h1 class="font-m">js module</h1>
          <div class="circle substep" data-order=4></div>
          <ul class="font-s">
            <li class="substep substep-fade" data-order=1>self-contained scope</li>
            <li class="substep substep-fade" data-order=2>imports/exports</li>
          </ul>
        </div>

        <div class="css">
          <h1 class="font-m">css module</h1>
          <div class="circle substep" data-order=4></div>
          <ul class="font-s">
            <li class="substep substep-fade" data-order=3>same</li>
            <li class="substep substep-fade" data-order=3>same</li>
          </ul>
        </div>
      </section>
`

},{}],74:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/label-example.js:2', `
.src_slides_label-example___examples {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
}

.src_slides_label-example___questions {
  text-align: left;
}

`)
 && cmz.createClassname.bind(null, 'src_slides_label-example_', {
  'heading': 'font-m heading-shadow',
  'examples': 'flex-row',
  'file': 'file',
  'questions': 'font-m',
  'q': 'substep substep-fade'
}))

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('h1.heading', {}, 'c is for cascading'),
    tag('.examples', {}, [
      tag('.file', {}, `example.css<code><pre>.label {
  <span style="color: #F66">color: red;</span>
}

/*...1000 lines of code
or whatever...*/

.module .label {
  <span style="color: #3CC">color: blue;</span>
}
</pre></code>`),
      tag('.questions', {}, [
        tag('.q', {}, 'Q. Is there 1 label or 2?'),
        tag('.q', {}, 'Q. What colour is a label?'),
      ])
    ])
  ])
}

},{"../util/tag":87,"cmz":7}],75:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/logic-in-css.js:2', `
.src_slides_logic-in-css___examples-1,
.src_slides_logic-in-css___examples-2 {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
}

.src_slides_logic-in-css___examples-2 {
  -webkit-box-align: baseline;
      -ms-flex-align: baseline;
          align-items: baseline;
  margin-top: -30vh;
}

.src_slides_logic-in-css___logic {
  white-space: pre;
}

`)
 && cmz.createClassname.bind(null, 'src_slides_logic-in-css_', {
  'heading': 'font-l heading-shadow',
  'examples-1': 'flex-row substep substep-out',
  'examples-2': 'flex-row substep substep-fade',
  'file': 'file',
  'logic': 'font-s'
}))

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('h1.heading', {}, 'There&rsquo;s Logic in our CSS!'),
    tag('.examples-1', {}, [
      tag('.file', {}, `<code><pre>.leaderboard .avatar {
  width: 5rem;
}</pre></code>`),
      tag('code.logic', {}, `<b>if</b> the Avatar appears within a Leaderboard,
<b>then</b> make it smaller`)
    ]),
    tag('.examples-2', {}, [
      tag('.file', {}, `<code><pre>.avatar {
  ...
}

.big {
  width: 10rem;
}

.small {
  width: 5rem;
}</pre></code>`),
      tag('.file', {}, `<code><pre>
// normal avatar
Avatar()

// avatar in a leaderboard
Avatar({ small: true })
</pre></code>`)
    ])
  ])
}

},{"../util/tag":87,"cmz":7}],76:[function(require,module,exports){
const cmz = require('cmz')

const styles = (
require('cmz').upsertCss('src/slides/magic.js:3', `
.src_slides_magic___image {
  width: 22vw;
  height: 22vw;
  background: #FFF;
  border: 0.5vw solid #fff;
  border-radius: 200vw;
}

.src_slides_magic___heading {
  width: 70vw;
  padding-left: 2vw;
  text-align: left;
}
`)
 && cmz.createClassname.bind(null, 'src_slides_magic_', {
  '': 'flex-row',
  'heading': 'font-l heading-shadow'
}))

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('img.image', { src: 'src/images/bowie.png' }),
    tag('h1.heading', {}, 'What kind of magic spell to use?')
  ])
}

},{"../util/tag":87,"cmz":7}],77:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/nesting-2.js:2', `

.src_slides_nesting-2___rhs {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
      -ms-flex-direction: row;
          flex-direction: row;
}

.src_slides_nesting-2___file del {
  color: #f66;
}

`)
 && cmz.createClassname.bind(null, 'src_slides_nesting-2_', {
  '': 'flex-row nofade',
  'file': 'file',
  'rewrite-2': 'file'
}))

const tag = require('../util/tag').bind(null, styles)

function renderFileA () {
  return tag('.file', {}, [
    'rank.css',
    tag('pre', {}, [
      tag('code', {},
`.rank {
  ...
}

<del>.rank </del>.avatar {
  ...
}

<del>.rank </del>.name {
  ...
}

<del>.rank </del>.score {
  ...
}
`)
    ])
  ])
}

function renderFileC () {
  return tag('.rewrite-2', {}, [
    'rewrite 2',
    tag('pre', {}, [
      tag('code', {},
`.rank {
  ...
}

.avatar {
  ...
}

.name {
  ...
}

.score {
  ...
}
`)
    ])
  ])
}

module.exports = function () {
  return tag('slide.&', {}, [
    renderFileA(),
    renderFileC()
  ])
}

},{"../util/tag":87,"cmz":7}],78:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/nesting.js:2', `

.src_slides_nesting___leaderboard {
  width: 40vw;
}

.src_slides_nesting___rhs {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
      -ms-flex-direction: row;
          flex-direction: row;
}

.src_slides_nesting___leaderboard {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.src_slides_nesting___rewrite-1 ins {
  color: #0C9;
  text-decoration: none;
}

`)
 && cmz.createClassname.bind(null, 'src_slides_nesting_', {
  '': 'flex-row',
  'file': 'file',
  'leaderboard': 'substep substep-out',
  'rewrite-1': 'file substep substep-fade'
}))

const tag = require('../util/tag').bind(null, styles)

function renderFileA () {
  return tag('.file', {}, [
    'rank.css',
    tag('pre', {}, [
      tag('code', {},
`.rank {
  ...
}

.rank .avatar {
  ...
}

.rank .name {
  ...
}

.rank .score {
  ...
}
`)
    ])
  ])
}

function renderFileB () {
  return tag('.rewrite-1', {}, [
    'rewrite 1',
    tag('pre', {}, [
      tag('code', {},
`.rank {
  ...

<ins>    </ins>.avatar {
      ...
    }

<ins>    </ins>.name {
      ...
    }

<ins>    </ins>.score {
      ...
    }
}
`)
    ])
  ])
}

module.exports = function () {
  return tag('slide.&', {}, [
    renderFileA(),
    tag('.rhs', {}, [
      tag('img.leaderboard', { src: 'src/images/leaderboard.png' }),
      renderFileB()
    ])
  ])
}

},{"../util/tag":87,"cmz":7}],79:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/reusing-the-avatar.js:2', `

.src_slides_reusing-the-avatar___images {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
}

.src_slides_reusing-the-avatar___images img {
  margin-top: 5vh;
  max-width: 30vw;
}

`)
 && cmz.createClassname.bind(null, 'src_slides_reusing-the-avatar_', {
  '': 'flex-row',
  'file': 'file',
  'leaderboard-css': 'file substep substep-fade'
}))

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('.examples', {}, [
      tag('.file', {}, `avatar.css<code><pre>.avatar {
  ...
  width: 10rem;
}</pre></code>`),
      tag('.leaderboard-css', {}, `leaderboard.css<code><pre>.leaderboard .avatar {
  width: 5rem;
}
</pre></code>`),
    ]),
    tag('.images', {}, [
      tag('img.profile', { src: 'src/images/profile.png' }),
      tag('img.leaderboard', { src: 'src/images/leaderboard.png' }),
    ])
  ])
}

},{"../util/tag":87,"cmz":7}],80:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/sheen.js:2', `
.src_slides_sheen___grow {
  -webkit-transform:scale(0.1);
          transform:scale(0.1);
}

.src_slides_sheen___head {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  background: url(src/images/sheen-head.png) 0 0 no-repeat;
}

.src_slides_sheen___mouth {
  width: 100%;
  -webkit-transform: translateX(-0.5vw);
          transform: translateX(-0.5vw);
  -webkit-animation: talk 1s infinite ease-in-out;
          animation: talk 1s infinite ease-in-out;
}

.src_slides_sheen___words {
  margin-top: 14vw;
}

@-webkit-keyframes talk {
  0% { -webkit-transform:translate(-0.5vw, 0); transform:translate(-0.5vw, 0); }
  10% { -webkit-transform:translate(-0.5vw, 2vw); transform:translate(-0.5vw, 2vw);}
  30% { -webkit-transform:translate(-0.5vw, 0); transform:translate(-0.5vw, 0);}
  40% { -webkit-transform:translate(-0.5vw, 2vw); transform:translate(-0.5vw, 2vw);}
  50% { -webkit-transform:translate(-0.5vw, 0); transform:translate(-0.5vw, 0);}
}

@keyframes talk {
  0% { -webkit-transform:translate(-0.5vw, 0); transform:translate(-0.5vw, 0); }
  10% { -webkit-transform:translate(-0.5vw, 2vw); transform:translate(-0.5vw, 2vw);}
  30% { -webkit-transform:translate(-0.5vw, 0); transform:translate(-0.5vw, 0);}
  40% { -webkit-transform:translate(-0.5vw, 2vw); transform:translate(-0.5vw, 2vw);}
  50% { -webkit-transform:translate(-0.5vw, 0); transform:translate(-0.5vw, 0);}
}

`)
 && cmz.createClassname.bind(null, 'src_slides_sheen_', {
  '': 'flex-row',
  'grow': 'substep substep-grow',
  'head': 'substep substep-rotate',
  'words': 'substep substep-fade font-m'
}))

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('.grow', { 'data-order': 1 }, [
      tag('.head', { 'data-order': 1 }, [
        tag('img.mouth', { src: 'src/images/sheen-mouth.png' }),
      ])
    ]),
    tag('.words', { 'data-order': 2 }, 'winning')
  ])
}

},{"../util/tag":87,"cmz":7}],81:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/some-things-are-hard.js:2', `
.src_slides_some-things-are-hard___bubble {
  width: 22vw;
  height: 22vw;
  background: #FFF;
  border-radius: 200vw;
}

.src_slides_some-things-are-hard___bubbleImage {
  width: 20vw;
  padding: 4vw 2.5vw;
}

.src_slides_some-things-are-hard___heading {
  width: 70vw;
  padding-left: 2vw;
  text-align: left;
}
`)
 && cmz.createClassname.bind(null, 'src_slides_some-things-are-hard_', {
  '': 'flex-row',
  'heading': 'font-l heading-shadow'
}))

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('.bubble', {}, tag('img.bubbleImage', { src: 'src/images/hammer-and-screw-small-2.png' })),
    tag('h1.heading', {}, 'Some things are <em>very difficult</em> to do with CSS&nbsp;Modules')
  ])
}

},{"../util/tag":87,"cmz":7}],82:[function(require,module,exports){
const cmz = require('cmz')

const size = '25vw';
const styles = (
require('cmz').upsertCss('src/slides/stages.js:4', `
.src_slides_stages___stages {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
      -ms-flex-direction: row;
          flex-direction: row;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
}

.src_slides_stages___stage {
  width: ${size};
  height: ${size};
  margin-right: 4vw;
  background: #fff;
  border-radius: 200vw;
  text-align: center;
  line-height: ${size};
}

.src_slides_stages___stage:first-child {
  margin-left: 0;
}
`)
 && cmz.createClassname.bind(null, 'src_slides_stages_', {
  'stage': 'substep substep-fade-up font-m'
}))

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('.stages', {}, [
      tag('.stage', {}, 'Authoring'),
      tag('.stage', {}, 'Debugging'),
      tag('.stage', {}, 'Refactoring'),
    ])
  ])
}

},{"../util/tag":87,"cmz":7}],83:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/title.js:2', `
.src_slides_title___heading {
  position: relative;
  line-height: 8.5vw;
}

.src_slides_title___atleast {
  position: absolute;
  top: -2vw;
  left: -10vw;
  font-family: 'Courgette';
  font-size: 5vw;
  font-weight: 100;
  -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
  text-shadow: none;
}

.src_slides_title___six {
  font-size: 20vw;
}

.src_slides_title___ways-to {
  position: absolute;
  line-height: 5vw;
  margin: 1.5vw 0 0 .5vw;
}

.src_slides_title___win {
  font-size: 12vw;
  text-transform: uppercase;
  font-weight: 800;
  font-style: italic;
}

.src_slides_title___with {
  font-family: 'Courgette';
  font-weight: 100;
  letter-spacing: .01vw;
  font-size: 3vw;
  position: relative;
  top: -3vw;
  margin-left: 2vw;
}

.src_slides_title___bubble {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -15vw 0 0 -25vw;
  width: 30vw;
  height: 30vw;
  background: #fff;
  border-radius: 200vw;
}
`)
 && cmz.createClassname.bind(null, 'src_slides_title_', {
  'heading': 'font-l',
  'win': 'heading-shadow'
}))

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('section.&', {}, [
    tag('.bubble', {}, []),
    tag('h1.heading', {}, [
      tag('span.atleast', {}, 'At Least'),
      tag('span.six', {}, '6'),
      tag('span.ways-to', {}, 'ways<br/>to'),
      tag('.win', {}, 'Win!'),
      tag('span.with', {}, 'with'),
      tag('span', {}, 'CSS Modules')
    ])
  ])
}

},{"../util/tag":87,"cmz":7}],84:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/with-flow.js:2', `
.src_slides_with-flow___heading {
  margin-bottom: 10vh;
}

.src_slides_with-flow___holder {
  max-height: 70vh;
  overflow: hidden;
}

.src_slides_with-flow___file {
  position: absolute;
  top: 50%;
  left: 25%;
}

.src_slides_with-flow___code {
  font-size: 1.5vw;
}

.src_slides_with-flow___code b {
  color: #f66;
}
`)
 && cmz.createClassname.bind(null, 'src_slides_with-flow_', {
  'heading': 'font-m heading-shadow',
  'examples': 'flex-row',
  'file': 'file'
}))

const tag = require('../util/tag').bind(null, styles)

function renderCode () {
  return tag('.file', {}, [
    tag('pre', {}, [
      tag('code.code', {},
` 10: &lt;div class="\${ styles.outer }"&gt;
                           <b>^^^^^ property \`outer\`. Property not found in</b>
 10: &lt;div class="\${ styles.outer }"&gt;
                    <b>^^^^^^ object literal</b>`)
    ])
  ])
}

module.exports = function () {
  return tag('slide.&', {}, [
    tag('h1.heading', {}, 'Typechecking CSS'),
    tag('.holder', {}, [
      tag('img', { src: 'src/images/with-flow.png' }),
    ]),
    renderCode()
  ])
}

},{"../util/tag":87,"cmz":7}],85:[function(require,module,exports){
const cmz = require('cmz')
const styles = (
require('cmz').upsertCss('src/slides/yahoo-answers.js:2', `
.src_slides_yahoo-answers___heading {
  margin-bottom: 5vh;
}

.src_slides_yahoo-answers___image {
  width: 85vw;
}
`)
 && cmz.createClassname.bind(null, 'src_slides_yahoo-answers_', {
  heading: 'font-s heading-shadow'
}))

const tag = require('../util/tag').bind(null, styles)

module.exports = function () {
  return tag('slide.&', {}, [
    tag('h1.heading', {}, 'Can you hammer a screw into the wall?'),
    tag('img.image', { src: 'src/images/yahoo-answers.png' })
  ])
}

},{"../util/tag":87,"cmz":7}],86:[function(require,module,exports){
module.exports = function renderChildren (children) {
  if (!children) { return '' }
  const output = Array.isArray(children) ? children : [children]
  return output.join('\n')
}

},{}],87:[function(require,module,exports){
const renderChildren = require('./render-children')

module.exports = function tag (styles, name, attr, children) {
  const parts = name.split('.')
  const type = parts[0] || 'div'
  const classname = parts[1]

  const output = []
  output.push(`<${type} `)

  if (classname) {
    attr = attr || {}

    // '&' is shorthand for the root classname of the cmz module
    attr.class = styles(classname === '&' ? '' : classname)
  }

  if (attr) {
    Object.keys(attr).forEach(key => output.push(`${key}="${attr[key]}" `))
  }

  if (typeof children === 'undefined') {
    output.push('/>')
  }
  else {
    output.push(`>${renderChildren(children)}</${type}>`)
  }

  return output.join('')
}

},{"./render-children":86}]},{},[58]);
