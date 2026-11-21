var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/gl-matrix/cjs/common.js
var require_common = __commonJS({
  "node_modules/gl-matrix/cjs/common.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.RANDOM = exports2.EPSILON = exports2.ARRAY_TYPE = exports2.ANGLE_ORDER = void 0;
    exports2.equals = equals;
    exports2.round = round;
    exports2.setMatrixArrayType = setMatrixArrayType;
    exports2.toDegree = toDegree;
    exports2.toRadian = toRadian;
    var EPSILON = exports2.EPSILON = 1e-6;
    var ARRAY_TYPE = exports2.ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
    var RANDOM = exports2.RANDOM = Math.random;
    var ANGLE_ORDER = exports2.ANGLE_ORDER = "zyx";
    function round(a) {
      if (a >= 0) return Math.round(a);
      return a % 0.5 === 0 ? Math.floor(a) : Math.round(a);
    }
    function setMatrixArrayType(type) {
      exports2.ARRAY_TYPE = ARRAY_TYPE = type;
    }
    var degree = Math.PI / 180;
    var radian = 180 / Math.PI;
    function toRadian(a) {
      return a * degree;
    }
    function toDegree(a) {
      return a * radian;
    }
    function equals(a, b) {
      var tolerance = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : EPSILON;
      return Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b));
    }
  }
});

// node_modules/gl-matrix/cjs/mat2.js
var require_mat2 = __commonJS({
  "node_modules/gl-matrix/cjs/mat2.js"(exports2) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.LDU = LDU;
    exports2.add = add;
    exports2.adjoint = adjoint;
    exports2.clone = clone;
    exports2.copy = copy;
    exports2.create = create;
    exports2.determinant = determinant;
    exports2.equals = equals;
    exports2.exactEquals = exactEquals;
    exports2.frob = frob;
    exports2.fromRotation = fromRotation;
    exports2.fromScaling = fromScaling;
    exports2.fromValues = fromValues;
    exports2.identity = identity;
    exports2.invert = invert;
    exports2.mul = void 0;
    exports2.multiply = multiply;
    exports2.multiplyScalar = multiplyScalar;
    exports2.multiplyScalarAndAdd = multiplyScalarAndAdd;
    exports2.rotate = rotate;
    exports2.scale = scale;
    exports2.set = set;
    exports2.str = str;
    exports2.sub = void 0;
    exports2.subtract = subtract;
    exports2.transpose = transpose;
    var glMatrix = _interopRequireWildcard(require_common());
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function _interopRequireWildcard2(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, "default": e2 };
        if (null === e2 || "object" != _typeof(e2) && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (var _t in e2) "default" !== _t && {}.hasOwnProperty.call(e2, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e2[_t]);
        return f;
      })(e, t);
    }
    function create() {
      var out = new glMatrix.ARRAY_TYPE(4);
      if (glMatrix.ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
      }
      out[0] = 1;
      out[3] = 1;
      return out;
    }
    function clone(a) {
      var out = new glMatrix.ARRAY_TYPE(4);
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      return out;
    }
    function copy(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      return out;
    }
    function identity(out) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    }
    function fromValues(m00, m01, m10, m11) {
      var out = new glMatrix.ARRAY_TYPE(4);
      out[0] = m00;
      out[1] = m01;
      out[2] = m10;
      out[3] = m11;
      return out;
    }
    function set(out, m00, m01, m10, m11) {
      out[0] = m00;
      out[1] = m01;
      out[2] = m10;
      out[3] = m11;
      return out;
    }
    function transpose(out, a) {
      if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
      } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
      }
      return out;
    }
    function invert(out, a) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
      var det = a0 * a3 - a2 * a1;
      if (!det) {
        return null;
      }
      det = 1 / det;
      out[0] = a3 * det;
      out[1] = -a1 * det;
      out[2] = -a2 * det;
      out[3] = a0 * det;
      return out;
    }
    function adjoint(out, a) {
      var a0 = a[0];
      out[0] = a[3];
      out[1] = -a[1];
      out[2] = -a[2];
      out[3] = a0;
      return out;
    }
    function determinant(a) {
      return a[0] * a[3] - a[2] * a[1];
    }
    function multiply(out, a, b) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
      var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
      out[0] = a0 * b0 + a2 * b1;
      out[1] = a1 * b0 + a3 * b1;
      out[2] = a0 * b2 + a2 * b3;
      out[3] = a1 * b2 + a3 * b3;
      return out;
    }
    function rotate(out, a, rad) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      out[0] = a0 * c + a2 * s;
      out[1] = a1 * c + a3 * s;
      out[2] = a0 * -s + a2 * c;
      out[3] = a1 * -s + a3 * c;
      return out;
    }
    function scale(out, a, v) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
      var v0 = v[0], v1 = v[1];
      out[0] = a0 * v0;
      out[1] = a1 * v0;
      out[2] = a2 * v1;
      out[3] = a3 * v1;
      return out;
    }
    function fromRotation(out, rad) {
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      out[0] = c;
      out[1] = s;
      out[2] = -s;
      out[3] = c;
      return out;
    }
    function fromScaling(out, v) {
      out[0] = v[0];
      out[1] = 0;
      out[2] = 0;
      out[3] = v[1];
      return out;
    }
    function str(a) {
      return "mat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
    }
    function frob(a) {
      return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]);
    }
    function LDU(L, D, U, a) {
      L[2] = a[2] / a[0];
      U[0] = a[0];
      U[1] = a[1];
      U[3] = a[3] - L[2] * U[1];
      return [L, D, U];
    }
    function add(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      out[3] = a[3] + b[3];
      return out;
    }
    function subtract(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      out[3] = a[3] - b[3];
      return out;
    }
    function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }
    function equals(a, b) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
      var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
      return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3));
    }
    function multiplyScalar(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      out[3] = a[3] * b;
      return out;
    }
    function multiplyScalarAndAdd(out, a, b, scale2) {
      out[0] = a[0] + b[0] * scale2;
      out[1] = a[1] + b[1] * scale2;
      out[2] = a[2] + b[2] * scale2;
      out[3] = a[3] + b[3] * scale2;
      return out;
    }
    var mul = exports2.mul = multiply;
    var sub = exports2.sub = subtract;
  }
});

// node_modules/gl-matrix/cjs/mat2d.js
var require_mat2d = __commonJS({
  "node_modules/gl-matrix/cjs/mat2d.js"(exports2) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.add = add;
    exports2.clone = clone;
    exports2.copy = copy;
    exports2.create = create;
    exports2.determinant = determinant;
    exports2.equals = equals;
    exports2.exactEquals = exactEquals;
    exports2.frob = frob;
    exports2.fromRotation = fromRotation;
    exports2.fromScaling = fromScaling;
    exports2.fromTranslation = fromTranslation;
    exports2.fromValues = fromValues;
    exports2.identity = identity;
    exports2.invert = invert;
    exports2.mul = void 0;
    exports2.multiply = multiply;
    exports2.multiplyScalar = multiplyScalar;
    exports2.multiplyScalarAndAdd = multiplyScalarAndAdd;
    exports2.rotate = rotate;
    exports2.scale = scale;
    exports2.set = set;
    exports2.str = str;
    exports2.sub = void 0;
    exports2.subtract = subtract;
    exports2.translate = translate;
    var glMatrix = _interopRequireWildcard(require_common());
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function _interopRequireWildcard2(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, "default": e2 };
        if (null === e2 || "object" != _typeof(e2) && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (var _t in e2) "default" !== _t && {}.hasOwnProperty.call(e2, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e2[_t]);
        return f;
      })(e, t);
    }
    function create() {
      var out = new glMatrix.ARRAY_TYPE(6);
      if (glMatrix.ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[4] = 0;
        out[5] = 0;
      }
      out[0] = 1;
      out[3] = 1;
      return out;
    }
    function clone(a) {
      var out = new glMatrix.ARRAY_TYPE(6);
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[4] = a[4];
      out[5] = a[5];
      return out;
    }
    function copy(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[4] = a[4];
      out[5] = a[5];
      return out;
    }
    function identity(out) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      out[4] = 0;
      out[5] = 0;
      return out;
    }
    function fromValues(a, b, c, d, tx, ty) {
      var out = new glMatrix.ARRAY_TYPE(6);
      out[0] = a;
      out[1] = b;
      out[2] = c;
      out[3] = d;
      out[4] = tx;
      out[5] = ty;
      return out;
    }
    function set(out, a, b, c, d, tx, ty) {
      out[0] = a;
      out[1] = b;
      out[2] = c;
      out[3] = d;
      out[4] = tx;
      out[5] = ty;
      return out;
    }
    function invert(out, a) {
      var aa = a[0], ab = a[1], ac = a[2], ad = a[3];
      var atx = a[4], aty = a[5];
      var det = aa * ad - ab * ac;
      if (!det) {
        return null;
      }
      det = 1 / det;
      out[0] = ad * det;
      out[1] = -ab * det;
      out[2] = -ac * det;
      out[3] = aa * det;
      out[4] = (ac * aty - ad * atx) * det;
      out[5] = (ab * atx - aa * aty) * det;
      return out;
    }
    function determinant(a) {
      return a[0] * a[3] - a[1] * a[2];
    }
    function multiply(out, a, b) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
      var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
      out[0] = a0 * b0 + a2 * b1;
      out[1] = a1 * b0 + a3 * b1;
      out[2] = a0 * b2 + a2 * b3;
      out[3] = a1 * b2 + a3 * b3;
      out[4] = a0 * b4 + a2 * b5 + a4;
      out[5] = a1 * b4 + a3 * b5 + a5;
      return out;
    }
    function rotate(out, a, rad) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      out[0] = a0 * c + a2 * s;
      out[1] = a1 * c + a3 * s;
      out[2] = a0 * -s + a2 * c;
      out[3] = a1 * -s + a3 * c;
      out[4] = a4;
      out[5] = a5;
      return out;
    }
    function scale(out, a, v) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
      var v0 = v[0], v1 = v[1];
      out[0] = a0 * v0;
      out[1] = a1 * v0;
      out[2] = a2 * v1;
      out[3] = a3 * v1;
      out[4] = a4;
      out[5] = a5;
      return out;
    }
    function translate(out, a, v) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
      var v0 = v[0], v1 = v[1];
      out[0] = a0;
      out[1] = a1;
      out[2] = a2;
      out[3] = a3;
      out[4] = a0 * v0 + a2 * v1 + a4;
      out[5] = a1 * v0 + a3 * v1 + a5;
      return out;
    }
    function fromRotation(out, rad) {
      var s = Math.sin(rad), c = Math.cos(rad);
      out[0] = c;
      out[1] = s;
      out[2] = -s;
      out[3] = c;
      out[4] = 0;
      out[5] = 0;
      return out;
    }
    function fromScaling(out, v) {
      out[0] = v[0];
      out[1] = 0;
      out[2] = 0;
      out[3] = v[1];
      out[4] = 0;
      out[5] = 0;
      return out;
    }
    function fromTranslation(out, v) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      out[4] = v[0];
      out[5] = v[1];
      return out;
    }
    function str(a) {
      return "mat2d(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ")";
    }
    function frob(a) {
      return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3] + a[4] * a[4] + a[5] * a[5] + 1);
    }
    function add(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      out[3] = a[3] + b[3];
      out[4] = a[4] + b[4];
      out[5] = a[5] + b[5];
      return out;
    }
    function subtract(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      out[3] = a[3] - b[3];
      out[4] = a[4] - b[4];
      out[5] = a[5] - b[5];
      return out;
    }
    function multiplyScalar(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      out[3] = a[3] * b;
      out[4] = a[4] * b;
      out[5] = a[5] * b;
      return out;
    }
    function multiplyScalarAndAdd(out, a, b, scale2) {
      out[0] = a[0] + b[0] * scale2;
      out[1] = a[1] + b[1] * scale2;
      out[2] = a[2] + b[2] * scale2;
      out[3] = a[3] + b[3] * scale2;
      out[4] = a[4] + b[4] * scale2;
      out[5] = a[5] + b[5] * scale2;
      return out;
    }
    function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
    }
    function equals(a, b) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
      var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
      return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5));
    }
    var mul = exports2.mul = multiply;
    var sub = exports2.sub = subtract;
  }
});

// node_modules/gl-matrix/cjs/mat3.js
var require_mat3 = __commonJS({
  "node_modules/gl-matrix/cjs/mat3.js"(exports2) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.add = add;
    exports2.adjoint = adjoint;
    exports2.clone = clone;
    exports2.copy = copy;
    exports2.create = create;
    exports2.determinant = determinant;
    exports2.equals = equals;
    exports2.exactEquals = exactEquals;
    exports2.frob = frob;
    exports2.fromMat2d = fromMat2d;
    exports2.fromMat4 = fromMat4;
    exports2.fromQuat = fromQuat;
    exports2.fromRotation = fromRotation;
    exports2.fromScaling = fromScaling;
    exports2.fromTranslation = fromTranslation;
    exports2.fromValues = fromValues;
    exports2.identity = identity;
    exports2.invert = invert;
    exports2.mul = void 0;
    exports2.multiply = multiply;
    exports2.multiplyScalar = multiplyScalar;
    exports2.multiplyScalarAndAdd = multiplyScalarAndAdd;
    exports2.normalFromMat4 = normalFromMat4;
    exports2.projection = projection;
    exports2.rotate = rotate;
    exports2.scale = scale;
    exports2.set = set;
    exports2.str = str;
    exports2.sub = void 0;
    exports2.subtract = subtract;
    exports2.translate = translate;
    exports2.transpose = transpose;
    var glMatrix = _interopRequireWildcard(require_common());
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function _interopRequireWildcard2(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, "default": e2 };
        if (null === e2 || "object" != _typeof(e2) && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (var _t in e2) "default" !== _t && {}.hasOwnProperty.call(e2, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e2[_t]);
        return f;
      })(e, t);
    }
    function create() {
      var out = new glMatrix.ARRAY_TYPE(9);
      if (glMatrix.ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
      }
      out[0] = 1;
      out[4] = 1;
      out[8] = 1;
      return out;
    }
    function fromMat4(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[4];
      out[4] = a[5];
      out[5] = a[6];
      out[6] = a[8];
      out[7] = a[9];
      out[8] = a[10];
      return out;
    }
    function clone(a) {
      var out = new glMatrix.ARRAY_TYPE(9);
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[8] = a[8];
      return out;
    }
    function copy(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[8] = a[8];
      return out;
    }
    function fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
      var out = new glMatrix.ARRAY_TYPE(9);
      out[0] = m00;
      out[1] = m01;
      out[2] = m02;
      out[3] = m10;
      out[4] = m11;
      out[5] = m12;
      out[6] = m20;
      out[7] = m21;
      out[8] = m22;
      return out;
    }
    function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
      out[0] = m00;
      out[1] = m01;
      out[2] = m02;
      out[3] = m10;
      out[4] = m11;
      out[5] = m12;
      out[6] = m20;
      out[7] = m21;
      out[8] = m22;
      return out;
    }
    function identity(out) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 1;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 1;
      return out;
    }
    function transpose(out, a) {
      if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
      } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
      }
      return out;
    }
    function invert(out, a) {
      var a00 = a[0], a01 = a[1], a02 = a[2];
      var a10 = a[3], a11 = a[4], a12 = a[5];
      var a20 = a[6], a21 = a[7], a22 = a[8];
      var b01 = a22 * a11 - a12 * a21;
      var b11 = -a22 * a10 + a12 * a20;
      var b21 = a21 * a10 - a11 * a20;
      var det = a00 * b01 + a01 * b11 + a02 * b21;
      if (!det) {
        return null;
      }
      det = 1 / det;
      out[0] = b01 * det;
      out[1] = (-a22 * a01 + a02 * a21) * det;
      out[2] = (a12 * a01 - a02 * a11) * det;
      out[3] = b11 * det;
      out[4] = (a22 * a00 - a02 * a20) * det;
      out[5] = (-a12 * a00 + a02 * a10) * det;
      out[6] = b21 * det;
      out[7] = (-a21 * a00 + a01 * a20) * det;
      out[8] = (a11 * a00 - a01 * a10) * det;
      return out;
    }
    function adjoint(out, a) {
      var a00 = a[0], a01 = a[1], a02 = a[2];
      var a10 = a[3], a11 = a[4], a12 = a[5];
      var a20 = a[6], a21 = a[7], a22 = a[8];
      out[0] = a11 * a22 - a12 * a21;
      out[1] = a02 * a21 - a01 * a22;
      out[2] = a01 * a12 - a02 * a11;
      out[3] = a12 * a20 - a10 * a22;
      out[4] = a00 * a22 - a02 * a20;
      out[5] = a02 * a10 - a00 * a12;
      out[6] = a10 * a21 - a11 * a20;
      out[7] = a01 * a20 - a00 * a21;
      out[8] = a00 * a11 - a01 * a10;
      return out;
    }
    function determinant(a) {
      var a00 = a[0], a01 = a[1], a02 = a[2];
      var a10 = a[3], a11 = a[4], a12 = a[5];
      var a20 = a[6], a21 = a[7], a22 = a[8];
      return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
    }
    function multiply(out, a, b) {
      var a00 = a[0], a01 = a[1], a02 = a[2];
      var a10 = a[3], a11 = a[4], a12 = a[5];
      var a20 = a[6], a21 = a[7], a22 = a[8];
      var b00 = b[0], b01 = b[1], b02 = b[2];
      var b10 = b[3], b11 = b[4], b12 = b[5];
      var b20 = b[6], b21 = b[7], b22 = b[8];
      out[0] = b00 * a00 + b01 * a10 + b02 * a20;
      out[1] = b00 * a01 + b01 * a11 + b02 * a21;
      out[2] = b00 * a02 + b01 * a12 + b02 * a22;
      out[3] = b10 * a00 + b11 * a10 + b12 * a20;
      out[4] = b10 * a01 + b11 * a11 + b12 * a21;
      out[5] = b10 * a02 + b11 * a12 + b12 * a22;
      out[6] = b20 * a00 + b21 * a10 + b22 * a20;
      out[7] = b20 * a01 + b21 * a11 + b22 * a21;
      out[8] = b20 * a02 + b21 * a12 + b22 * a22;
      return out;
    }
    function translate(out, a, v) {
      var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], x = v[0], y = v[1];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a10;
      out[4] = a11;
      out[5] = a12;
      out[6] = x * a00 + y * a10 + a20;
      out[7] = x * a01 + y * a11 + a21;
      out[8] = x * a02 + y * a12 + a22;
      return out;
    }
    function rotate(out, a, rad) {
      var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], s = Math.sin(rad), c = Math.cos(rad);
      out[0] = c * a00 + s * a10;
      out[1] = c * a01 + s * a11;
      out[2] = c * a02 + s * a12;
      out[3] = c * a10 - s * a00;
      out[4] = c * a11 - s * a01;
      out[5] = c * a12 - s * a02;
      out[6] = a20;
      out[7] = a21;
      out[8] = a22;
      return out;
    }
    function scale(out, a, v) {
      var x = v[0], y = v[1];
      out[0] = x * a[0];
      out[1] = x * a[1];
      out[2] = x * a[2];
      out[3] = y * a[3];
      out[4] = y * a[4];
      out[5] = y * a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[8] = a[8];
      return out;
    }
    function fromTranslation(out, v) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 1;
      out[5] = 0;
      out[6] = v[0];
      out[7] = v[1];
      out[8] = 1;
      return out;
    }
    function fromRotation(out, rad) {
      var s = Math.sin(rad), c = Math.cos(rad);
      out[0] = c;
      out[1] = s;
      out[2] = 0;
      out[3] = -s;
      out[4] = c;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 1;
      return out;
    }
    function fromScaling(out, v) {
      out[0] = v[0];
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = v[1];
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 1;
      return out;
    }
    function fromMat2d(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = 0;
      out[3] = a[2];
      out[4] = a[3];
      out[5] = 0;
      out[6] = a[4];
      out[7] = a[5];
      out[8] = 1;
      return out;
    }
    function fromQuat(out, q) {
      var x = q[0], y = q[1], z = q[2], w = q[3];
      var x2 = x + x;
      var y2 = y + y;
      var z2 = z + z;
      var xx = x * x2;
      var yx = y * x2;
      var yy = y * y2;
      var zx = z * x2;
      var zy = z * y2;
      var zz = z * z2;
      var wx = w * x2;
      var wy = w * y2;
      var wz = w * z2;
      out[0] = 1 - yy - zz;
      out[3] = yx - wz;
      out[6] = zx + wy;
      out[1] = yx + wz;
      out[4] = 1 - xx - zz;
      out[7] = zy - wx;
      out[2] = zx - wy;
      out[5] = zy + wx;
      out[8] = 1 - xx - yy;
      return out;
    }
    function normalFromMat4(out, a) {
      var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
      var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
      var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
      var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
      var b00 = a00 * a11 - a01 * a10;
      var b01 = a00 * a12 - a02 * a10;
      var b02 = a00 * a13 - a03 * a10;
      var b03 = a01 * a12 - a02 * a11;
      var b04 = a01 * a13 - a03 * a11;
      var b05 = a02 * a13 - a03 * a12;
      var b06 = a20 * a31 - a21 * a30;
      var b07 = a20 * a32 - a22 * a30;
      var b08 = a20 * a33 - a23 * a30;
      var b09 = a21 * a32 - a22 * a31;
      var b10 = a21 * a33 - a23 * a31;
      var b11 = a22 * a33 - a23 * a32;
      var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      if (!det) {
        return null;
      }
      det = 1 / det;
      out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
      out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
      out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
      out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
      out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
      out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
      out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
      out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
      out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
      return out;
    }
    function projection(out, width, height) {
      out[0] = 2 / width;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = -2 / height;
      out[5] = 0;
      out[6] = -1;
      out[7] = 1;
      out[8] = 1;
      return out;
    }
    function str(a) {
      return "mat3(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ")";
    }
    function frob(a) {
      return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3] + a[4] * a[4] + a[5] * a[5] + a[6] * a[6] + a[7] * a[7] + a[8] * a[8]);
    }
    function add(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      out[3] = a[3] + b[3];
      out[4] = a[4] + b[4];
      out[5] = a[5] + b[5];
      out[6] = a[6] + b[6];
      out[7] = a[7] + b[7];
      out[8] = a[8] + b[8];
      return out;
    }
    function subtract(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      out[3] = a[3] - b[3];
      out[4] = a[4] - b[4];
      out[5] = a[5] - b[5];
      out[6] = a[6] - b[6];
      out[7] = a[7] - b[7];
      out[8] = a[8] - b[8];
      return out;
    }
    function multiplyScalar(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      out[3] = a[3] * b;
      out[4] = a[4] * b;
      out[5] = a[5] * b;
      out[6] = a[6] * b;
      out[7] = a[7] * b;
      out[8] = a[8] * b;
      return out;
    }
    function multiplyScalarAndAdd(out, a, b, scale2) {
      out[0] = a[0] + b[0] * scale2;
      out[1] = a[1] + b[1] * scale2;
      out[2] = a[2] + b[2] * scale2;
      out[3] = a[3] + b[3] * scale2;
      out[4] = a[4] + b[4] * scale2;
      out[5] = a[5] + b[5] * scale2;
      out[6] = a[6] + b[6] * scale2;
      out[7] = a[7] + b[7] * scale2;
      out[8] = a[8] + b[8] * scale2;
      return out;
    }
    function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
    }
    function equals(a, b) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8];
      var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8];
      return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8));
    }
    var mul = exports2.mul = multiply;
    var sub = exports2.sub = subtract;
  }
});

// node_modules/gl-matrix/cjs/mat4.js
var require_mat4 = __commonJS({
  "node_modules/gl-matrix/cjs/mat4.js"(exports2) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.add = add;
    exports2.adjoint = adjoint;
    exports2.clone = clone;
    exports2.copy = copy;
    exports2.create = create;
    exports2.decompose = decompose;
    exports2.determinant = determinant;
    exports2.equals = equals;
    exports2.exactEquals = exactEquals;
    exports2.frob = frob;
    exports2.fromQuat = fromQuat;
    exports2.fromQuat2 = fromQuat2;
    exports2.fromRotation = fromRotation;
    exports2.fromRotationTranslation = fromRotationTranslation;
    exports2.fromRotationTranslationScale = fromRotationTranslationScale;
    exports2.fromRotationTranslationScaleOrigin = fromRotationTranslationScaleOrigin;
    exports2.fromScaling = fromScaling;
    exports2.fromTranslation = fromTranslation;
    exports2.fromValues = fromValues;
    exports2.fromXRotation = fromXRotation;
    exports2.fromYRotation = fromYRotation;
    exports2.fromZRotation = fromZRotation;
    exports2.frustum = frustum;
    exports2.getRotation = getRotation;
    exports2.getScaling = getScaling;
    exports2.getTranslation = getTranslation;
    exports2.identity = identity;
    exports2.invert = invert;
    exports2.lookAt = lookAt;
    exports2.mul = void 0;
    exports2.multiply = multiply;
    exports2.multiplyScalar = multiplyScalar;
    exports2.multiplyScalarAndAdd = multiplyScalarAndAdd;
    exports2.ortho = void 0;
    exports2.orthoNO = orthoNO;
    exports2.orthoZO = orthoZO;
    exports2.perspective = void 0;
    exports2.perspectiveFromFieldOfView = perspectiveFromFieldOfView;
    exports2.perspectiveNO = perspectiveNO;
    exports2.perspectiveZO = perspectiveZO;
    exports2.rotate = rotate;
    exports2.rotateX = rotateX;
    exports2.rotateY = rotateY;
    exports2.rotateZ = rotateZ;
    exports2.scale = scale;
    exports2.set = set;
    exports2.str = str;
    exports2.sub = void 0;
    exports2.subtract = subtract;
    exports2.targetTo = targetTo;
    exports2.translate = translate;
    exports2.transpose = transpose;
    var glMatrix = _interopRequireWildcard(require_common());
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function _interopRequireWildcard2(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, "default": e2 };
        if (null === e2 || "object" != _typeof(e2) && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (var _t in e2) "default" !== _t && {}.hasOwnProperty.call(e2, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e2[_t]);
        return f;
      })(e, t);
    }
    function create() {
      var out = new glMatrix.ARRAY_TYPE(16);
      if (glMatrix.ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
      }
      out[0] = 1;
      out[5] = 1;
      out[10] = 1;
      out[15] = 1;
      return out;
    }
    function clone(a) {
      var out = new glMatrix.ARRAY_TYPE(16);
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
      return out;
    }
    function copy(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
      return out;
    }
    function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
      var out = new glMatrix.ARRAY_TYPE(16);
      out[0] = m00;
      out[1] = m01;
      out[2] = m02;
      out[3] = m03;
      out[4] = m10;
      out[5] = m11;
      out[6] = m12;
      out[7] = m13;
      out[8] = m20;
      out[9] = m21;
      out[10] = m22;
      out[11] = m23;
      out[12] = m30;
      out[13] = m31;
      out[14] = m32;
      out[15] = m33;
      return out;
    }
    function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
      out[0] = m00;
      out[1] = m01;
      out[2] = m02;
      out[3] = m03;
      out[4] = m10;
      out[5] = m11;
      out[6] = m12;
      out[7] = m13;
      out[8] = m20;
      out[9] = m21;
      out[10] = m22;
      out[11] = m23;
      out[12] = m30;
      out[13] = m31;
      out[14] = m32;
      out[15] = m33;
      return out;
    }
    function identity(out) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = 1;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = 1;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    function transpose(out, a) {
      if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3];
        var a12 = a[6], a13 = a[7];
        var a23 = a[11];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
      } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
      }
      return out;
    }
    function invert(out, a) {
      var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
      var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
      var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
      var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
      var b00 = a00 * a11 - a01 * a10;
      var b01 = a00 * a12 - a02 * a10;
      var b02 = a00 * a13 - a03 * a10;
      var b03 = a01 * a12 - a02 * a11;
      var b04 = a01 * a13 - a03 * a11;
      var b05 = a02 * a13 - a03 * a12;
      var b06 = a20 * a31 - a21 * a30;
      var b07 = a20 * a32 - a22 * a30;
      var b08 = a20 * a33 - a23 * a30;
      var b09 = a21 * a32 - a22 * a31;
      var b10 = a21 * a33 - a23 * a31;
      var b11 = a22 * a33 - a23 * a32;
      var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      if (!det) {
        return null;
      }
      det = 1 / det;
      out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
      out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
      out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
      out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
      out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
      out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
      out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
      out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
      out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
      out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
      out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
      out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
      out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
      out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
      out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
      out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
      return out;
    }
    function adjoint(out, a) {
      var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
      var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
      var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
      var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
      var b00 = a00 * a11 - a01 * a10;
      var b01 = a00 * a12 - a02 * a10;
      var b02 = a00 * a13 - a03 * a10;
      var b03 = a01 * a12 - a02 * a11;
      var b04 = a01 * a13 - a03 * a11;
      var b05 = a02 * a13 - a03 * a12;
      var b06 = a20 * a31 - a21 * a30;
      var b07 = a20 * a32 - a22 * a30;
      var b08 = a20 * a33 - a23 * a30;
      var b09 = a21 * a32 - a22 * a31;
      var b10 = a21 * a33 - a23 * a31;
      var b11 = a22 * a33 - a23 * a32;
      out[0] = a11 * b11 - a12 * b10 + a13 * b09;
      out[1] = a02 * b10 - a01 * b11 - a03 * b09;
      out[2] = a31 * b05 - a32 * b04 + a33 * b03;
      out[3] = a22 * b04 - a21 * b05 - a23 * b03;
      out[4] = a12 * b08 - a10 * b11 - a13 * b07;
      out[5] = a00 * b11 - a02 * b08 + a03 * b07;
      out[6] = a32 * b02 - a30 * b05 - a33 * b01;
      out[7] = a20 * b05 - a22 * b02 + a23 * b01;
      out[8] = a10 * b10 - a11 * b08 + a13 * b06;
      out[9] = a01 * b08 - a00 * b10 - a03 * b06;
      out[10] = a30 * b04 - a31 * b02 + a33 * b00;
      out[11] = a21 * b02 - a20 * b04 - a23 * b00;
      out[12] = a11 * b07 - a10 * b09 - a12 * b06;
      out[13] = a00 * b09 - a01 * b07 + a02 * b06;
      out[14] = a31 * b01 - a30 * b03 - a32 * b00;
      out[15] = a20 * b03 - a21 * b01 + a22 * b00;
      return out;
    }
    function determinant(a) {
      var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
      var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
      var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
      var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
      var b0 = a00 * a11 - a01 * a10;
      var b1 = a00 * a12 - a02 * a10;
      var b2 = a01 * a12 - a02 * a11;
      var b3 = a20 * a31 - a21 * a30;
      var b4 = a20 * a32 - a22 * a30;
      var b5 = a21 * a32 - a22 * a31;
      var b6 = a00 * b5 - a01 * b4 + a02 * b3;
      var b7 = a10 * b5 - a11 * b4 + a12 * b3;
      var b8 = a20 * b2 - a21 * b1 + a22 * b0;
      var b9 = a30 * b2 - a31 * b1 + a32 * b0;
      return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
    }
    function multiply(out, a, b) {
      var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
      var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
      var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
      var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
      var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
      out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      b0 = b[4];
      b1 = b[5];
      b2 = b[6];
      b3 = b[7];
      out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      b0 = b[8];
      b1 = b[9];
      b2 = b[10];
      b3 = b[11];
      out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      b0 = b[12];
      b1 = b[13];
      b2 = b[14];
      b3 = b[15];
      out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      return out;
    }
    function translate(out, a, v) {
      var x = v[0], y = v[1], z = v[2];
      var a00, a01, a02, a03;
      var a10, a11, a12, a13;
      var a20, a21, a22, a23;
      if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
      } else {
        a00 = a[0];
        a01 = a[1];
        a02 = a[2];
        a03 = a[3];
        a10 = a[4];
        a11 = a[5];
        a12 = a[6];
        a13 = a[7];
        a20 = a[8];
        a21 = a[9];
        a22 = a[10];
        a23 = a[11];
        out[0] = a00;
        out[1] = a01;
        out[2] = a02;
        out[3] = a03;
        out[4] = a10;
        out[5] = a11;
        out[6] = a12;
        out[7] = a13;
        out[8] = a20;
        out[9] = a21;
        out[10] = a22;
        out[11] = a23;
        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
      }
      return out;
    }
    function scale(out, a, v) {
      var x = v[0], y = v[1], z = v[2];
      out[0] = a[0] * x;
      out[1] = a[1] * x;
      out[2] = a[2] * x;
      out[3] = a[3] * x;
      out[4] = a[4] * y;
      out[5] = a[5] * y;
      out[6] = a[6] * y;
      out[7] = a[7] * y;
      out[8] = a[8] * z;
      out[9] = a[9] * z;
      out[10] = a[10] * z;
      out[11] = a[11] * z;
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
      return out;
    }
    function rotate(out, a, rad, axis) {
      var x = axis[0], y = axis[1], z = axis[2];
      var len = Math.sqrt(x * x + y * y + z * z);
      var s, c, t;
      var a00, a01, a02, a03;
      var a10, a11, a12, a13;
      var a20, a21, a22, a23;
      var b00, b01, b02;
      var b10, b11, b12;
      var b20, b21, b22;
      if (len < glMatrix.EPSILON) {
        return null;
      }
      len = 1 / len;
      x *= len;
      y *= len;
      z *= len;
      s = Math.sin(rad);
      c = Math.cos(rad);
      t = 1 - c;
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      b00 = x * x * t + c;
      b01 = y * x * t + z * s;
      b02 = z * x * t - y * s;
      b10 = x * y * t - z * s;
      b11 = y * y * t + c;
      b12 = z * y * t + x * s;
      b20 = x * z * t + y * s;
      b21 = y * z * t - x * s;
      b22 = z * z * t + c;
      out[0] = a00 * b00 + a10 * b01 + a20 * b02;
      out[1] = a01 * b00 + a11 * b01 + a21 * b02;
      out[2] = a02 * b00 + a12 * b01 + a22 * b02;
      out[3] = a03 * b00 + a13 * b01 + a23 * b02;
      out[4] = a00 * b10 + a10 * b11 + a20 * b12;
      out[5] = a01 * b10 + a11 * b11 + a21 * b12;
      out[6] = a02 * b10 + a12 * b11 + a22 * b12;
      out[7] = a03 * b10 + a13 * b11 + a23 * b12;
      out[8] = a00 * b20 + a10 * b21 + a20 * b22;
      out[9] = a01 * b20 + a11 * b21 + a21 * b22;
      out[10] = a02 * b20 + a12 * b21 + a22 * b22;
      out[11] = a03 * b20 + a13 * b21 + a23 * b22;
      if (a !== out) {
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
      }
      return out;
    }
    function rotateX(out, a, rad) {
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      var a10 = a[4];
      var a11 = a[5];
      var a12 = a[6];
      var a13 = a[7];
      var a20 = a[8];
      var a21 = a[9];
      var a22 = a[10];
      var a23 = a[11];
      if (a !== out) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
      }
      out[4] = a10 * c + a20 * s;
      out[5] = a11 * c + a21 * s;
      out[6] = a12 * c + a22 * s;
      out[7] = a13 * c + a23 * s;
      out[8] = a20 * c - a10 * s;
      out[9] = a21 * c - a11 * s;
      out[10] = a22 * c - a12 * s;
      out[11] = a23 * c - a13 * s;
      return out;
    }
    function rotateY(out, a, rad) {
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      var a00 = a[0];
      var a01 = a[1];
      var a02 = a[2];
      var a03 = a[3];
      var a20 = a[8];
      var a21 = a[9];
      var a22 = a[10];
      var a23 = a[11];
      if (a !== out) {
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
      }
      out[0] = a00 * c - a20 * s;
      out[1] = a01 * c - a21 * s;
      out[2] = a02 * c - a22 * s;
      out[3] = a03 * c - a23 * s;
      out[8] = a00 * s + a20 * c;
      out[9] = a01 * s + a21 * c;
      out[10] = a02 * s + a22 * c;
      out[11] = a03 * s + a23 * c;
      return out;
    }
    function rotateZ(out, a, rad) {
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      var a00 = a[0];
      var a01 = a[1];
      var a02 = a[2];
      var a03 = a[3];
      var a10 = a[4];
      var a11 = a[5];
      var a12 = a[6];
      var a13 = a[7];
      if (a !== out) {
        out[8] = a[8];
        out[9] = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
      }
      out[0] = a00 * c + a10 * s;
      out[1] = a01 * c + a11 * s;
      out[2] = a02 * c + a12 * s;
      out[3] = a03 * c + a13 * s;
      out[4] = a10 * c - a00 * s;
      out[5] = a11 * c - a01 * s;
      out[6] = a12 * c - a02 * s;
      out[7] = a13 * c - a03 * s;
      return out;
    }
    function fromTranslation(out, v) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = 1;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = 1;
      out[11] = 0;
      out[12] = v[0];
      out[13] = v[1];
      out[14] = v[2];
      out[15] = 1;
      return out;
    }
    function fromScaling(out, v) {
      out[0] = v[0];
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = v[1];
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = v[2];
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    function fromRotation(out, rad, axis) {
      var x = axis[0], y = axis[1], z = axis[2];
      var len = Math.sqrt(x * x + y * y + z * z);
      var s, c, t;
      if (len < glMatrix.EPSILON) {
        return null;
      }
      len = 1 / len;
      x *= len;
      y *= len;
      z *= len;
      s = Math.sin(rad);
      c = Math.cos(rad);
      t = 1 - c;
      out[0] = x * x * t + c;
      out[1] = y * x * t + z * s;
      out[2] = z * x * t - y * s;
      out[3] = 0;
      out[4] = x * y * t - z * s;
      out[5] = y * y * t + c;
      out[6] = z * y * t + x * s;
      out[7] = 0;
      out[8] = x * z * t + y * s;
      out[9] = y * z * t - x * s;
      out[10] = z * z * t + c;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    function fromXRotation(out, rad) {
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = c;
      out[6] = s;
      out[7] = 0;
      out[8] = 0;
      out[9] = -s;
      out[10] = c;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    function fromYRotation(out, rad) {
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      out[0] = c;
      out[1] = 0;
      out[2] = -s;
      out[3] = 0;
      out[4] = 0;
      out[5] = 1;
      out[6] = 0;
      out[7] = 0;
      out[8] = s;
      out[9] = 0;
      out[10] = c;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    function fromZRotation(out, rad) {
      var s = Math.sin(rad);
      var c = Math.cos(rad);
      out[0] = c;
      out[1] = s;
      out[2] = 0;
      out[3] = 0;
      out[4] = -s;
      out[5] = c;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = 1;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    function fromRotationTranslation(out, q, v) {
      var x = q[0], y = q[1], z = q[2], w = q[3];
      var x2 = x + x;
      var y2 = y + y;
      var z2 = z + z;
      var xx = x * x2;
      var xy = x * y2;
      var xz = x * z2;
      var yy = y * y2;
      var yz = y * z2;
      var zz = z * z2;
      var wx = w * x2;
      var wy = w * y2;
      var wz = w * z2;
      out[0] = 1 - (yy + zz);
      out[1] = xy + wz;
      out[2] = xz - wy;
      out[3] = 0;
      out[4] = xy - wz;
      out[5] = 1 - (xx + zz);
      out[6] = yz + wx;
      out[7] = 0;
      out[8] = xz + wy;
      out[9] = yz - wx;
      out[10] = 1 - (xx + yy);
      out[11] = 0;
      out[12] = v[0];
      out[13] = v[1];
      out[14] = v[2];
      out[15] = 1;
      return out;
    }
    function fromQuat2(out, a) {
      var translation = new glMatrix.ARRAY_TYPE(3);
      var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
      var magnitude = bx * bx + by * by + bz * bz + bw * bw;
      if (magnitude > 0) {
        translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
        translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
        translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
      } else {
        translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
        translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
        translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
      }
      fromRotationTranslation(out, a, translation);
      return out;
    }
    function getTranslation(out, mat) {
      out[0] = mat[12];
      out[1] = mat[13];
      out[2] = mat[14];
      return out;
    }
    function getScaling(out, mat) {
      var m11 = mat[0];
      var m12 = mat[1];
      var m13 = mat[2];
      var m21 = mat[4];
      var m22 = mat[5];
      var m23 = mat[6];
      var m31 = mat[8];
      var m32 = mat[9];
      var m33 = mat[10];
      out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
      out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
      out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
      return out;
    }
    function getRotation(out, mat) {
      var scaling = new glMatrix.ARRAY_TYPE(3);
      getScaling(scaling, mat);
      var is1 = 1 / scaling[0];
      var is2 = 1 / scaling[1];
      var is3 = 1 / scaling[2];
      var sm11 = mat[0] * is1;
      var sm12 = mat[1] * is2;
      var sm13 = mat[2] * is3;
      var sm21 = mat[4] * is1;
      var sm22 = mat[5] * is2;
      var sm23 = mat[6] * is3;
      var sm31 = mat[8] * is1;
      var sm32 = mat[9] * is2;
      var sm33 = mat[10] * is3;
      var trace = sm11 + sm22 + sm33;
      var S = 0;
      if (trace > 0) {
        S = Math.sqrt(trace + 1) * 2;
        out[3] = 0.25 * S;
        out[0] = (sm23 - sm32) / S;
        out[1] = (sm31 - sm13) / S;
        out[2] = (sm12 - sm21) / S;
      } else if (sm11 > sm22 && sm11 > sm33) {
        S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
        out[3] = (sm23 - sm32) / S;
        out[0] = 0.25 * S;
        out[1] = (sm12 + sm21) / S;
        out[2] = (sm31 + sm13) / S;
      } else if (sm22 > sm33) {
        S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
        out[3] = (sm31 - sm13) / S;
        out[0] = (sm12 + sm21) / S;
        out[1] = 0.25 * S;
        out[2] = (sm23 + sm32) / S;
      } else {
        S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
        out[3] = (sm12 - sm21) / S;
        out[0] = (sm31 + sm13) / S;
        out[1] = (sm23 + sm32) / S;
        out[2] = 0.25 * S;
      }
      return out;
    }
    function decompose(out_r, out_t, out_s, mat) {
      out_t[0] = mat[12];
      out_t[1] = mat[13];
      out_t[2] = mat[14];
      var m11 = mat[0];
      var m12 = mat[1];
      var m13 = mat[2];
      var m21 = mat[4];
      var m22 = mat[5];
      var m23 = mat[6];
      var m31 = mat[8];
      var m32 = mat[9];
      var m33 = mat[10];
      out_s[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
      out_s[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
      out_s[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
      var is1 = 1 / out_s[0];
      var is2 = 1 / out_s[1];
      var is3 = 1 / out_s[2];
      var sm11 = m11 * is1;
      var sm12 = m12 * is2;
      var sm13 = m13 * is3;
      var sm21 = m21 * is1;
      var sm22 = m22 * is2;
      var sm23 = m23 * is3;
      var sm31 = m31 * is1;
      var sm32 = m32 * is2;
      var sm33 = m33 * is3;
      var trace = sm11 + sm22 + sm33;
      var S = 0;
      if (trace > 0) {
        S = Math.sqrt(trace + 1) * 2;
        out_r[3] = 0.25 * S;
        out_r[0] = (sm23 - sm32) / S;
        out_r[1] = (sm31 - sm13) / S;
        out_r[2] = (sm12 - sm21) / S;
      } else if (sm11 > sm22 && sm11 > sm33) {
        S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
        out_r[3] = (sm23 - sm32) / S;
        out_r[0] = 0.25 * S;
        out_r[1] = (sm12 + sm21) / S;
        out_r[2] = (sm31 + sm13) / S;
      } else if (sm22 > sm33) {
        S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
        out_r[3] = (sm31 - sm13) / S;
        out_r[0] = (sm12 + sm21) / S;
        out_r[1] = 0.25 * S;
        out_r[2] = (sm23 + sm32) / S;
      } else {
        S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
        out_r[3] = (sm12 - sm21) / S;
        out_r[0] = (sm31 + sm13) / S;
        out_r[1] = (sm23 + sm32) / S;
        out_r[2] = 0.25 * S;
      }
      return out_r;
    }
    function fromRotationTranslationScale(out, q, v, s) {
      var x = q[0], y = q[1], z = q[2], w = q[3];
      var x2 = x + x;
      var y2 = y + y;
      var z2 = z + z;
      var xx = x * x2;
      var xy = x * y2;
      var xz = x * z2;
      var yy = y * y2;
      var yz = y * z2;
      var zz = z * z2;
      var wx = w * x2;
      var wy = w * y2;
      var wz = w * z2;
      var sx = s[0];
      var sy = s[1];
      var sz = s[2];
      out[0] = (1 - (yy + zz)) * sx;
      out[1] = (xy + wz) * sx;
      out[2] = (xz - wy) * sx;
      out[3] = 0;
      out[4] = (xy - wz) * sy;
      out[5] = (1 - (xx + zz)) * sy;
      out[6] = (yz + wx) * sy;
      out[7] = 0;
      out[8] = (xz + wy) * sz;
      out[9] = (yz - wx) * sz;
      out[10] = (1 - (xx + yy)) * sz;
      out[11] = 0;
      out[12] = v[0];
      out[13] = v[1];
      out[14] = v[2];
      out[15] = 1;
      return out;
    }
    function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
      var x = q[0], y = q[1], z = q[2], w = q[3];
      var x2 = x + x;
      var y2 = y + y;
      var z2 = z + z;
      var xx = x * x2;
      var xy = x * y2;
      var xz = x * z2;
      var yy = y * y2;
      var yz = y * z2;
      var zz = z * z2;
      var wx = w * x2;
      var wy = w * y2;
      var wz = w * z2;
      var sx = s[0];
      var sy = s[1];
      var sz = s[2];
      var ox = o[0];
      var oy = o[1];
      var oz = o[2];
      var out0 = (1 - (yy + zz)) * sx;
      var out1 = (xy + wz) * sx;
      var out2 = (xz - wy) * sx;
      var out4 = (xy - wz) * sy;
      var out5 = (1 - (xx + zz)) * sy;
      var out6 = (yz + wx) * sy;
      var out8 = (xz + wy) * sz;
      var out9 = (yz - wx) * sz;
      var out10 = (1 - (xx + yy)) * sz;
      out[0] = out0;
      out[1] = out1;
      out[2] = out2;
      out[3] = 0;
      out[4] = out4;
      out[5] = out5;
      out[6] = out6;
      out[7] = 0;
      out[8] = out8;
      out[9] = out9;
      out[10] = out10;
      out[11] = 0;
      out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
      out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
      out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
      out[15] = 1;
      return out;
    }
    function fromQuat(out, q) {
      var x = q[0], y = q[1], z = q[2], w = q[3];
      var x2 = x + x;
      var y2 = y + y;
      var z2 = z + z;
      var xx = x * x2;
      var yx = y * x2;
      var yy = y * y2;
      var zx = z * x2;
      var zy = z * y2;
      var zz = z * z2;
      var wx = w * x2;
      var wy = w * y2;
      var wz = w * z2;
      out[0] = 1 - yy - zz;
      out[1] = yx + wz;
      out[2] = zx - wy;
      out[3] = 0;
      out[4] = yx - wz;
      out[5] = 1 - xx - zz;
      out[6] = zy + wx;
      out[7] = 0;
      out[8] = zx + wy;
      out[9] = zy - wx;
      out[10] = 1 - xx - yy;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    }
    function frustum(out, left, right, bottom, top, near, far) {
      var rl = 1 / (right - left);
      var tb = 1 / (top - bottom);
      var nf = 1 / (near - far);
      out[0] = near * 2 * rl;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = near * 2 * tb;
      out[6] = 0;
      out[7] = 0;
      out[8] = (right + left) * rl;
      out[9] = (top + bottom) * tb;
      out[10] = (far + near) * nf;
      out[11] = -1;
      out[12] = 0;
      out[13] = 0;
      out[14] = far * near * 2 * nf;
      out[15] = 0;
      return out;
    }
    function perspectiveNO(out, fovy, aspect, near, far) {
      var f = 1 / Math.tan(fovy / 2);
      out[0] = f / aspect;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = f;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = -1;
      out[12] = 0;
      out[13] = 0;
      out[15] = 0;
      if (far != null && far !== Infinity) {
        var nf = 1 / (near - far);
        out[10] = (far + near) * nf;
        out[14] = 2 * far * near * nf;
      } else {
        out[10] = -1;
        out[14] = -2 * near;
      }
      return out;
    }
    var perspective = exports2.perspective = perspectiveNO;
    function perspectiveZO(out, fovy, aspect, near, far) {
      var f = 1 / Math.tan(fovy / 2);
      out[0] = f / aspect;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = f;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = -1;
      out[12] = 0;
      out[13] = 0;
      out[15] = 0;
      if (far != null && far !== Infinity) {
        var nf = 1 / (near - far);
        out[10] = far * nf;
        out[14] = far * near * nf;
      } else {
        out[10] = -1;
        out[14] = -near;
      }
      return out;
    }
    function perspectiveFromFieldOfView(out, fov, near, far) {
      var upTan = Math.tan(fov.upDegrees * Math.PI / 180);
      var downTan = Math.tan(fov.downDegrees * Math.PI / 180);
      var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
      var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
      var xScale = 2 / (leftTan + rightTan);
      var yScale = 2 / (upTan + downTan);
      out[0] = xScale;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = yScale;
      out[6] = 0;
      out[7] = 0;
      out[8] = -((leftTan - rightTan) * xScale * 0.5);
      out[9] = (upTan - downTan) * yScale * 0.5;
      out[10] = far / (near - far);
      out[11] = -1;
      out[12] = 0;
      out[13] = 0;
      out[14] = far * near / (near - far);
      out[15] = 0;
      return out;
    }
    function orthoNO(out, left, right, bottom, top, near, far) {
      var lr = 1 / (left - right);
      var bt = 1 / (bottom - top);
      var nf = 1 / (near - far);
      out[0] = -2 * lr;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = -2 * bt;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = 2 * nf;
      out[11] = 0;
      out[12] = (left + right) * lr;
      out[13] = (top + bottom) * bt;
      out[14] = (far + near) * nf;
      out[15] = 1;
      return out;
    }
    var ortho = exports2.ortho = orthoNO;
    function orthoZO(out, left, right, bottom, top, near, far) {
      var lr = 1 / (left - right);
      var bt = 1 / (bottom - top);
      var nf = 1 / (near - far);
      out[0] = -2 * lr;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = -2 * bt;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = nf;
      out[11] = 0;
      out[12] = (left + right) * lr;
      out[13] = (top + bottom) * bt;
      out[14] = near * nf;
      out[15] = 1;
      return out;
    }
    function lookAt(out, eye, center, up) {
      var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
      var eyex = eye[0];
      var eyey = eye[1];
      var eyez = eye[2];
      var upx = up[0];
      var upy = up[1];
      var upz = up[2];
      var centerx = center[0];
      var centery = center[1];
      var centerz = center[2];
      if (Math.abs(eyex - centerx) < glMatrix.EPSILON && Math.abs(eyey - centery) < glMatrix.EPSILON && Math.abs(eyez - centerz) < glMatrix.EPSILON) {
        return identity(out);
      }
      z0 = eyex - centerx;
      z1 = eyey - centery;
      z2 = eyez - centerz;
      len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
      z0 *= len;
      z1 *= len;
      z2 *= len;
      x0 = upy * z2 - upz * z1;
      x1 = upz * z0 - upx * z2;
      x2 = upx * z1 - upy * z0;
      len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
      if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
      } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
      }
      y0 = z1 * x2 - z2 * x1;
      y1 = z2 * x0 - z0 * x2;
      y2 = z0 * x1 - z1 * x0;
      len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
      if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
      } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
      }
      out[0] = x0;
      out[1] = y0;
      out[2] = z0;
      out[3] = 0;
      out[4] = x1;
      out[5] = y1;
      out[6] = z1;
      out[7] = 0;
      out[8] = x2;
      out[9] = y2;
      out[10] = z2;
      out[11] = 0;
      out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
      out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
      out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
      out[15] = 1;
      return out;
    }
    function targetTo(out, eye, target, up) {
      var eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
      var z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
      var len = z0 * z0 + z1 * z1 + z2 * z2;
      if (len > 0) {
        len = 1 / Math.sqrt(len);
        z0 *= len;
        z1 *= len;
        z2 *= len;
      }
      var x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
      len = x0 * x0 + x1 * x1 + x2 * x2;
      if (len > 0) {
        len = 1 / Math.sqrt(len);
        x0 *= len;
        x1 *= len;
        x2 *= len;
      }
      out[0] = x0;
      out[1] = x1;
      out[2] = x2;
      out[3] = 0;
      out[4] = z1 * x2 - z2 * x1;
      out[5] = z2 * x0 - z0 * x2;
      out[6] = z0 * x1 - z1 * x0;
      out[7] = 0;
      out[8] = z0;
      out[9] = z1;
      out[10] = z2;
      out[11] = 0;
      out[12] = eyex;
      out[13] = eyey;
      out[14] = eyez;
      out[15] = 1;
      return out;
    }
    function str(a) {
      return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
    }
    function frob(a) {
      return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3] + a[4] * a[4] + a[5] * a[5] + a[6] * a[6] + a[7] * a[7] + a[8] * a[8] + a[9] * a[9] + a[10] * a[10] + a[11] * a[11] + a[12] * a[12] + a[13] * a[13] + a[14] * a[14] + a[15] * a[15]);
    }
    function add(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      out[3] = a[3] + b[3];
      out[4] = a[4] + b[4];
      out[5] = a[5] + b[5];
      out[6] = a[6] + b[6];
      out[7] = a[7] + b[7];
      out[8] = a[8] + b[8];
      out[9] = a[9] + b[9];
      out[10] = a[10] + b[10];
      out[11] = a[11] + b[11];
      out[12] = a[12] + b[12];
      out[13] = a[13] + b[13];
      out[14] = a[14] + b[14];
      out[15] = a[15] + b[15];
      return out;
    }
    function subtract(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      out[3] = a[3] - b[3];
      out[4] = a[4] - b[4];
      out[5] = a[5] - b[5];
      out[6] = a[6] - b[6];
      out[7] = a[7] - b[7];
      out[8] = a[8] - b[8];
      out[9] = a[9] - b[9];
      out[10] = a[10] - b[10];
      out[11] = a[11] - b[11];
      out[12] = a[12] - b[12];
      out[13] = a[13] - b[13];
      out[14] = a[14] - b[14];
      out[15] = a[15] - b[15];
      return out;
    }
    function multiplyScalar(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      out[3] = a[3] * b;
      out[4] = a[4] * b;
      out[5] = a[5] * b;
      out[6] = a[6] * b;
      out[7] = a[7] * b;
      out[8] = a[8] * b;
      out[9] = a[9] * b;
      out[10] = a[10] * b;
      out[11] = a[11] * b;
      out[12] = a[12] * b;
      out[13] = a[13] * b;
      out[14] = a[14] * b;
      out[15] = a[15] * b;
      return out;
    }
    function multiplyScalarAndAdd(out, a, b, scale2) {
      out[0] = a[0] + b[0] * scale2;
      out[1] = a[1] + b[1] * scale2;
      out[2] = a[2] + b[2] * scale2;
      out[3] = a[3] + b[3] * scale2;
      out[4] = a[4] + b[4] * scale2;
      out[5] = a[5] + b[5] * scale2;
      out[6] = a[6] + b[6] * scale2;
      out[7] = a[7] + b[7] * scale2;
      out[8] = a[8] + b[8] * scale2;
      out[9] = a[9] + b[9] * scale2;
      out[10] = a[10] + b[10] * scale2;
      out[11] = a[11] + b[11] * scale2;
      out[12] = a[12] + b[12] * scale2;
      out[13] = a[13] + b[13] * scale2;
      out[14] = a[14] + b[14] * scale2;
      out[15] = a[15] + b[15] * scale2;
      return out;
    }
    function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
    }
    function equals(a, b) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
      var a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
      var a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
      var a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
      var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
      var b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
      var b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
      var b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
      return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= glMatrix.EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= glMatrix.EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= glMatrix.EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= glMatrix.EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= glMatrix.EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= glMatrix.EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= glMatrix.EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
    }
    var mul = exports2.mul = multiply;
    var sub = exports2.sub = subtract;
  }
});

// node_modules/gl-matrix/cjs/vec3.js
var require_vec3 = __commonJS({
  "node_modules/gl-matrix/cjs/vec3.js"(exports2) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.add = add;
    exports2.angle = angle;
    exports2.bezier = bezier;
    exports2.ceil = ceil;
    exports2.clone = clone;
    exports2.copy = copy;
    exports2.create = create;
    exports2.cross = cross;
    exports2.dist = void 0;
    exports2.distance = distance;
    exports2.div = void 0;
    exports2.divide = divide;
    exports2.dot = dot;
    exports2.equals = equals;
    exports2.exactEquals = exactEquals;
    exports2.floor = floor;
    exports2.forEach = void 0;
    exports2.fromValues = fromValues;
    exports2.hermite = hermite;
    exports2.inverse = inverse;
    exports2.len = void 0;
    exports2.length = length;
    exports2.lerp = lerp;
    exports2.max = max;
    exports2.min = min;
    exports2.mul = void 0;
    exports2.multiply = multiply;
    exports2.negate = negate;
    exports2.normalize = normalize;
    exports2.random = random;
    exports2.rotateX = rotateX;
    exports2.rotateY = rotateY;
    exports2.rotateZ = rotateZ;
    exports2.round = round;
    exports2.scale = scale;
    exports2.scaleAndAdd = scaleAndAdd;
    exports2.set = set;
    exports2.slerp = slerp;
    exports2.sqrLen = exports2.sqrDist = void 0;
    exports2.squaredDistance = squaredDistance;
    exports2.squaredLength = squaredLength;
    exports2.str = str;
    exports2.sub = void 0;
    exports2.subtract = subtract;
    exports2.transformMat3 = transformMat3;
    exports2.transformMat4 = transformMat4;
    exports2.transformQuat = transformQuat;
    exports2.zero = zero;
    var glMatrix = _interopRequireWildcard(require_common());
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function _interopRequireWildcard2(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, "default": e2 };
        if (null === e2 || "object" != _typeof(e2) && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (var _t in e2) "default" !== _t && {}.hasOwnProperty.call(e2, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e2[_t]);
        return f;
      })(e, t);
    }
    function create() {
      var out = new glMatrix.ARRAY_TYPE(3);
      if (glMatrix.ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
      }
      return out;
    }
    function clone(a) {
      var out = new glMatrix.ARRAY_TYPE(3);
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      return out;
    }
    function length(a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      return Math.sqrt(x * x + y * y + z * z);
    }
    function fromValues(x, y, z) {
      var out = new glMatrix.ARRAY_TYPE(3);
      out[0] = x;
      out[1] = y;
      out[2] = z;
      return out;
    }
    function copy(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      return out;
    }
    function set(out, x, y, z) {
      out[0] = x;
      out[1] = y;
      out[2] = z;
      return out;
    }
    function add(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      return out;
    }
    function subtract(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      return out;
    }
    function multiply(out, a, b) {
      out[0] = a[0] * b[0];
      out[1] = a[1] * b[1];
      out[2] = a[2] * b[2];
      return out;
    }
    function divide(out, a, b) {
      out[0] = a[0] / b[0];
      out[1] = a[1] / b[1];
      out[2] = a[2] / b[2];
      return out;
    }
    function ceil(out, a) {
      out[0] = Math.ceil(a[0]);
      out[1] = Math.ceil(a[1]);
      out[2] = Math.ceil(a[2]);
      return out;
    }
    function floor(out, a) {
      out[0] = Math.floor(a[0]);
      out[1] = Math.floor(a[1]);
      out[2] = Math.floor(a[2]);
      return out;
    }
    function min(out, a, b) {
      out[0] = Math.min(a[0], b[0]);
      out[1] = Math.min(a[1], b[1]);
      out[2] = Math.min(a[2], b[2]);
      return out;
    }
    function max(out, a, b) {
      out[0] = Math.max(a[0], b[0]);
      out[1] = Math.max(a[1], b[1]);
      out[2] = Math.max(a[2], b[2]);
      return out;
    }
    function round(out, a) {
      out[0] = glMatrix.round(a[0]);
      out[1] = glMatrix.round(a[1]);
      out[2] = glMatrix.round(a[2]);
      return out;
    }
    function scale(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      return out;
    }
    function scaleAndAdd(out, a, b, scale2) {
      out[0] = a[0] + b[0] * scale2;
      out[1] = a[1] + b[1] * scale2;
      out[2] = a[2] + b[2] * scale2;
      return out;
    }
    function distance(a, b) {
      var x = b[0] - a[0];
      var y = b[1] - a[1];
      var z = b[2] - a[2];
      return Math.sqrt(x * x + y * y + z * z);
    }
    function squaredDistance(a, b) {
      var x = b[0] - a[0];
      var y = b[1] - a[1];
      var z = b[2] - a[2];
      return x * x + y * y + z * z;
    }
    function squaredLength(a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      return x * x + y * y + z * z;
    }
    function negate(out, a) {
      out[0] = -a[0];
      out[1] = -a[1];
      out[2] = -a[2];
      return out;
    }
    function inverse(out, a) {
      out[0] = 1 / a[0];
      out[1] = 1 / a[1];
      out[2] = 1 / a[2];
      return out;
    }
    function normalize(out, a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      var len2 = x * x + y * y + z * z;
      if (len2 > 0) {
        len2 = 1 / Math.sqrt(len2);
      }
      out[0] = a[0] * len2;
      out[1] = a[1] * len2;
      out[2] = a[2] * len2;
      return out;
    }
    function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }
    function cross(out, a, b) {
      var ax = a[0], ay = a[1], az = a[2];
      var bx = b[0], by = b[1], bz = b[2];
      out[0] = ay * bz - az * by;
      out[1] = az * bx - ax * bz;
      out[2] = ax * by - ay * bx;
      return out;
    }
    function lerp(out, a, b, t) {
      var ax = a[0];
      var ay = a[1];
      var az = a[2];
      out[0] = ax + t * (b[0] - ax);
      out[1] = ay + t * (b[1] - ay);
      out[2] = az + t * (b[2] - az);
      return out;
    }
    function slerp(out, a, b, t) {
      var angle2 = Math.acos(Math.min(Math.max(dot(a, b), -1), 1));
      var sinTotal = Math.sin(angle2);
      var ratioA = Math.sin((1 - t) * angle2) / sinTotal;
      var ratioB = Math.sin(t * angle2) / sinTotal;
      out[0] = ratioA * a[0] + ratioB * b[0];
      out[1] = ratioA * a[1] + ratioB * b[1];
      out[2] = ratioA * a[2] + ratioB * b[2];
      return out;
    }
    function hermite(out, a, b, c, d, t) {
      var factorTimes2 = t * t;
      var factor1 = factorTimes2 * (2 * t - 3) + 1;
      var factor2 = factorTimes2 * (t - 2) + t;
      var factor3 = factorTimes2 * (t - 1);
      var factor4 = factorTimes2 * (3 - 2 * t);
      out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
      out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
      out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
      return out;
    }
    function bezier(out, a, b, c, d, t) {
      var inverseFactor = 1 - t;
      var inverseFactorTimesTwo = inverseFactor * inverseFactor;
      var factorTimes2 = t * t;
      var factor1 = inverseFactorTimesTwo * inverseFactor;
      var factor2 = 3 * t * inverseFactorTimesTwo;
      var factor3 = 3 * factorTimes2 * inverseFactor;
      var factor4 = factorTimes2 * t;
      out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
      out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
      out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
      return out;
    }
    function random(out, scale2) {
      scale2 = scale2 === void 0 ? 1 : scale2;
      var r = glMatrix.RANDOM() * 2 * Math.PI;
      var z = glMatrix.RANDOM() * 2 - 1;
      var zScale = Math.sqrt(1 - z * z) * scale2;
      out[0] = Math.cos(r) * zScale;
      out[1] = Math.sin(r) * zScale;
      out[2] = z * scale2;
      return out;
    }
    function transformMat4(out, a, m) {
      var x = a[0], y = a[1], z = a[2];
      var w = m[3] * x + m[7] * y + m[11] * z + m[15];
      w = w || 1;
      out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
      out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
      out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
      return out;
    }
    function transformMat3(out, a, m) {
      var x = a[0], y = a[1], z = a[2];
      out[0] = x * m[0] + y * m[3] + z * m[6];
      out[1] = x * m[1] + y * m[4] + z * m[7];
      out[2] = x * m[2] + y * m[5] + z * m[8];
      return out;
    }
    function transformQuat(out, a, q) {
      var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
      var vx = a[0], vy = a[1], vz = a[2];
      var tx = qy * vz - qz * vy;
      var ty = qz * vx - qx * vz;
      var tz = qx * vy - qy * vx;
      tx = tx + tx;
      ty = ty + ty;
      tz = tz + tz;
      out[0] = vx + qw * tx + qy * tz - qz * ty;
      out[1] = vy + qw * ty + qz * tx - qx * tz;
      out[2] = vz + qw * tz + qx * ty - qy * tx;
      return out;
    }
    function rotateX(out, a, b, rad) {
      var p = [], r = [];
      p[0] = a[0] - b[0];
      p[1] = a[1] - b[1];
      p[2] = a[2] - b[2];
      r[0] = p[0];
      r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
      r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
      out[0] = r[0] + b[0];
      out[1] = r[1] + b[1];
      out[2] = r[2] + b[2];
      return out;
    }
    function rotateY(out, a, b, rad) {
      var p = [], r = [];
      p[0] = a[0] - b[0];
      p[1] = a[1] - b[1];
      p[2] = a[2] - b[2];
      r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
      r[1] = p[1];
      r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
      out[0] = r[0] + b[0];
      out[1] = r[1] + b[1];
      out[2] = r[2] + b[2];
      return out;
    }
    function rotateZ(out, a, b, rad) {
      var p = [], r = [];
      p[0] = a[0] - b[0];
      p[1] = a[1] - b[1];
      p[2] = a[2] - b[2];
      r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
      r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
      r[2] = p[2];
      out[0] = r[0] + b[0];
      out[1] = r[1] + b[1];
      out[2] = r[2] + b[2];
      return out;
    }
    function angle(a, b) {
      var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2], mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz)), cosine = mag && dot(a, b) / mag;
      return Math.acos(Math.min(Math.max(cosine, -1), 1));
    }
    function zero(out) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      return out;
    }
    function str(a) {
      return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
    }
    function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
    }
    function equals(a, b) {
      var a0 = a[0], a1 = a[1], a2 = a[2];
      var b0 = b[0], b1 = b[1], b2 = b[2];
      return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
    }
    var sub = exports2.sub = subtract;
    var mul = exports2.mul = multiply;
    var div = exports2.div = divide;
    var dist = exports2.dist = distance;
    var sqrDist = exports2.sqrDist = squaredDistance;
    var len = exports2.len = length;
    var sqrLen = exports2.sqrLen = squaredLength;
    var forEach = exports2.forEach = (function() {
      var vec = create();
      return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if (!stride) {
          stride = 3;
        }
        if (!offset) {
          offset = 0;
        }
        if (count) {
          l = Math.min(count * stride + offset, a.length);
        } else {
          l = a.length;
        }
        for (i = offset; i < l; i += stride) {
          vec[0] = a[i];
          vec[1] = a[i + 1];
          vec[2] = a[i + 2];
          fn(vec, vec, arg);
          a[i] = vec[0];
          a[i + 1] = vec[1];
          a[i + 2] = vec[2];
        }
        return a;
      };
    })();
  }
});

// node_modules/gl-matrix/cjs/vec4.js
var require_vec4 = __commonJS({
  "node_modules/gl-matrix/cjs/vec4.js"(exports2) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.add = add;
    exports2.ceil = ceil;
    exports2.clone = clone;
    exports2.copy = copy;
    exports2.create = create;
    exports2.cross = cross;
    exports2.dist = void 0;
    exports2.distance = distance;
    exports2.div = void 0;
    exports2.divide = divide;
    exports2.dot = dot;
    exports2.equals = equals;
    exports2.exactEquals = exactEquals;
    exports2.floor = floor;
    exports2.forEach = void 0;
    exports2.fromValues = fromValues;
    exports2.inverse = inverse;
    exports2.len = void 0;
    exports2.length = length;
    exports2.lerp = lerp;
    exports2.max = max;
    exports2.min = min;
    exports2.mul = void 0;
    exports2.multiply = multiply;
    exports2.negate = negate;
    exports2.normalize = normalize;
    exports2.random = random;
    exports2.round = round;
    exports2.scale = scale;
    exports2.scaleAndAdd = scaleAndAdd;
    exports2.set = set;
    exports2.sqrLen = exports2.sqrDist = void 0;
    exports2.squaredDistance = squaredDistance;
    exports2.squaredLength = squaredLength;
    exports2.str = str;
    exports2.sub = void 0;
    exports2.subtract = subtract;
    exports2.transformMat4 = transformMat4;
    exports2.transformQuat = transformQuat;
    exports2.zero = zero;
    var glMatrix = _interopRequireWildcard(require_common());
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function _interopRequireWildcard2(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, "default": e2 };
        if (null === e2 || "object" != _typeof(e2) && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (var _t in e2) "default" !== _t && {}.hasOwnProperty.call(e2, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e2[_t]);
        return f;
      })(e, t);
    }
    function create() {
      var out = new glMatrix.ARRAY_TYPE(4);
      if (glMatrix.ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
      }
      return out;
    }
    function clone(a) {
      var out = new glMatrix.ARRAY_TYPE(4);
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      return out;
    }
    function fromValues(x, y, z, w) {
      var out = new glMatrix.ARRAY_TYPE(4);
      out[0] = x;
      out[1] = y;
      out[2] = z;
      out[3] = w;
      return out;
    }
    function copy(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      return out;
    }
    function set(out, x, y, z, w) {
      out[0] = x;
      out[1] = y;
      out[2] = z;
      out[3] = w;
      return out;
    }
    function add(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      out[3] = a[3] + b[3];
      return out;
    }
    function subtract(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      out[3] = a[3] - b[3];
      return out;
    }
    function multiply(out, a, b) {
      out[0] = a[0] * b[0];
      out[1] = a[1] * b[1];
      out[2] = a[2] * b[2];
      out[3] = a[3] * b[3];
      return out;
    }
    function divide(out, a, b) {
      out[0] = a[0] / b[0];
      out[1] = a[1] / b[1];
      out[2] = a[2] / b[2];
      out[3] = a[3] / b[3];
      return out;
    }
    function ceil(out, a) {
      out[0] = Math.ceil(a[0]);
      out[1] = Math.ceil(a[1]);
      out[2] = Math.ceil(a[2]);
      out[3] = Math.ceil(a[3]);
      return out;
    }
    function floor(out, a) {
      out[0] = Math.floor(a[0]);
      out[1] = Math.floor(a[1]);
      out[2] = Math.floor(a[2]);
      out[3] = Math.floor(a[3]);
      return out;
    }
    function min(out, a, b) {
      out[0] = Math.min(a[0], b[0]);
      out[1] = Math.min(a[1], b[1]);
      out[2] = Math.min(a[2], b[2]);
      out[3] = Math.min(a[3], b[3]);
      return out;
    }
    function max(out, a, b) {
      out[0] = Math.max(a[0], b[0]);
      out[1] = Math.max(a[1], b[1]);
      out[2] = Math.max(a[2], b[2]);
      out[3] = Math.max(a[3], b[3]);
      return out;
    }
    function round(out, a) {
      out[0] = glMatrix.round(a[0]);
      out[1] = glMatrix.round(a[1]);
      out[2] = glMatrix.round(a[2]);
      out[3] = glMatrix.round(a[3]);
      return out;
    }
    function scale(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      out[3] = a[3] * b;
      return out;
    }
    function scaleAndAdd(out, a, b, scale2) {
      out[0] = a[0] + b[0] * scale2;
      out[1] = a[1] + b[1] * scale2;
      out[2] = a[2] + b[2] * scale2;
      out[3] = a[3] + b[3] * scale2;
      return out;
    }
    function distance(a, b) {
      var x = b[0] - a[0];
      var y = b[1] - a[1];
      var z = b[2] - a[2];
      var w = b[3] - a[3];
      return Math.sqrt(x * x + y * y + z * z + w * w);
    }
    function squaredDistance(a, b) {
      var x = b[0] - a[0];
      var y = b[1] - a[1];
      var z = b[2] - a[2];
      var w = b[3] - a[3];
      return x * x + y * y + z * z + w * w;
    }
    function length(a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      var w = a[3];
      return Math.sqrt(x * x + y * y + z * z + w * w);
    }
    function squaredLength(a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      var w = a[3];
      return x * x + y * y + z * z + w * w;
    }
    function negate(out, a) {
      out[0] = -a[0];
      out[1] = -a[1];
      out[2] = -a[2];
      out[3] = -a[3];
      return out;
    }
    function inverse(out, a) {
      out[0] = 1 / a[0];
      out[1] = 1 / a[1];
      out[2] = 1 / a[2];
      out[3] = 1 / a[3];
      return out;
    }
    function normalize(out, a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      var w = a[3];
      var len2 = x * x + y * y + z * z + w * w;
      if (len2 > 0) {
        len2 = 1 / Math.sqrt(len2);
      }
      out[0] = x * len2;
      out[1] = y * len2;
      out[2] = z * len2;
      out[3] = w * len2;
      return out;
    }
    function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    }
    function cross(out, u, v, w) {
      var A = v[0] * w[1] - v[1] * w[0], B = v[0] * w[2] - v[2] * w[0], C = v[0] * w[3] - v[3] * w[0], D = v[1] * w[2] - v[2] * w[1], E = v[1] * w[3] - v[3] * w[1], F = v[2] * w[3] - v[3] * w[2];
      var G = u[0];
      var H = u[1];
      var I = u[2];
      var J = u[3];
      out[0] = H * F - I * E + J * D;
      out[1] = -(G * F) + I * C - J * B;
      out[2] = G * E - H * C + J * A;
      out[3] = -(G * D) + H * B - I * A;
      return out;
    }
    function lerp(out, a, b, t) {
      var ax = a[0];
      var ay = a[1];
      var az = a[2];
      var aw = a[3];
      out[0] = ax + t * (b[0] - ax);
      out[1] = ay + t * (b[1] - ay);
      out[2] = az + t * (b[2] - az);
      out[3] = aw + t * (b[3] - aw);
      return out;
    }
    function random(out, scale2) {
      scale2 = scale2 === void 0 ? 1 : scale2;
      var v1, v2, v3, v4;
      var s1, s2;
      var rand;
      rand = glMatrix.RANDOM();
      v1 = rand * 2 - 1;
      v2 = (4 * glMatrix.RANDOM() - 2) * Math.sqrt(rand * -rand + rand);
      s1 = v1 * v1 + v2 * v2;
      rand = glMatrix.RANDOM();
      v3 = rand * 2 - 1;
      v4 = (4 * glMatrix.RANDOM() - 2) * Math.sqrt(rand * -rand + rand);
      s2 = v3 * v3 + v4 * v4;
      var d = Math.sqrt((1 - s1) / s2);
      out[0] = scale2 * v1;
      out[1] = scale2 * v2;
      out[2] = scale2 * v3 * d;
      out[3] = scale2 * v4 * d;
      return out;
    }
    function transformMat4(out, a, m) {
      var x = a[0], y = a[1], z = a[2], w = a[3];
      out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
      out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
      out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
      out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
      return out;
    }
    function transformQuat(out, a, q) {
      var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
      var vx = a[0], vy = a[1], vz = a[2];
      var tx = qy * vz - qz * vy;
      var ty = qz * vx - qx * vz;
      var tz = qx * vy - qy * vx;
      tx = tx + tx;
      ty = ty + ty;
      tz = tz + tz;
      out[0] = vx + qw * tx + qy * tz - qz * ty;
      out[1] = vy + qw * ty + qz * tx - qx * tz;
      out[2] = vz + qw * tz + qx * ty - qy * tx;
      out[3] = a[3];
      return out;
    }
    function zero(out) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      return out;
    }
    function str(a) {
      return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
    }
    function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }
    function equals(a, b) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
      var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
      return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3));
    }
    var sub = exports2.sub = subtract;
    var mul = exports2.mul = multiply;
    var div = exports2.div = divide;
    var dist = exports2.dist = distance;
    var sqrDist = exports2.sqrDist = squaredDistance;
    var len = exports2.len = length;
    var sqrLen = exports2.sqrLen = squaredLength;
    var forEach = exports2.forEach = (function() {
      var vec = create();
      return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if (!stride) {
          stride = 4;
        }
        if (!offset) {
          offset = 0;
        }
        if (count) {
          l = Math.min(count * stride + offset, a.length);
        } else {
          l = a.length;
        }
        for (i = offset; i < l; i += stride) {
          vec[0] = a[i];
          vec[1] = a[i + 1];
          vec[2] = a[i + 2];
          vec[3] = a[i + 3];
          fn(vec, vec, arg);
          a[i] = vec[0];
          a[i + 1] = vec[1];
          a[i + 2] = vec[2];
          a[i + 3] = vec[3];
        }
        return a;
      };
    })();
  }
});

// node_modules/gl-matrix/cjs/quat.js
var require_quat = __commonJS({
  "node_modules/gl-matrix/cjs/quat.js"(exports2) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.add = void 0;
    exports2.calculateW = calculateW;
    exports2.clone = void 0;
    exports2.conjugate = conjugate;
    exports2.copy = void 0;
    exports2.create = create;
    exports2.dot = void 0;
    exports2.equals = equals;
    exports2.exactEquals = void 0;
    exports2.exp = exp;
    exports2.fromEuler = fromEuler;
    exports2.fromMat3 = fromMat3;
    exports2.fromValues = void 0;
    exports2.getAngle = getAngle;
    exports2.getAxisAngle = getAxisAngle;
    exports2.identity = identity;
    exports2.invert = invert;
    exports2.lerp = exports2.length = exports2.len = void 0;
    exports2.ln = ln;
    exports2.mul = void 0;
    exports2.multiply = multiply;
    exports2.normalize = void 0;
    exports2.pow = pow;
    exports2.random = random;
    exports2.rotateX = rotateX;
    exports2.rotateY = rotateY;
    exports2.rotateZ = rotateZ;
    exports2.setAxes = exports2.set = exports2.scale = exports2.rotationTo = void 0;
    exports2.setAxisAngle = setAxisAngle;
    exports2.slerp = slerp;
    exports2.squaredLength = exports2.sqrLen = exports2.sqlerp = void 0;
    exports2.str = str;
    var glMatrix = _interopRequireWildcard(require_common());
    var mat3 = _interopRequireWildcard(require_mat3());
    var vec33 = _interopRequireWildcard(require_vec3());
    var vec4 = _interopRequireWildcard(require_vec4());
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function _interopRequireWildcard2(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, "default": e2 };
        if (null === e2 || "object" != _typeof(e2) && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (var _t in e2) "default" !== _t && {}.hasOwnProperty.call(e2, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e2[_t]);
        return f;
      })(e, t);
    }
    function create() {
      var out = new glMatrix.ARRAY_TYPE(4);
      if (glMatrix.ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
      }
      out[3] = 1;
      return out;
    }
    function identity(out) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    }
    function setAxisAngle(out, axis, rad) {
      rad = rad * 0.5;
      var s = Math.sin(rad);
      out[0] = s * axis[0];
      out[1] = s * axis[1];
      out[2] = s * axis[2];
      out[3] = Math.cos(rad);
      return out;
    }
    function getAxisAngle(out_axis, q) {
      var rad = Math.acos(q[3]) * 2;
      var s = Math.sin(rad / 2);
      if (s > glMatrix.EPSILON) {
        out_axis[0] = q[0] / s;
        out_axis[1] = q[1] / s;
        out_axis[2] = q[2] / s;
      } else {
        out_axis[0] = 1;
        out_axis[1] = 0;
        out_axis[2] = 0;
      }
      return rad;
    }
    function getAngle(a, b) {
      var dotproduct = dot(a, b);
      return Math.acos(2 * dotproduct * dotproduct - 1);
    }
    function multiply(out, a, b) {
      var ax = a[0], ay = a[1], az = a[2], aw = a[3];
      var bx = b[0], by = b[1], bz = b[2], bw = b[3];
      out[0] = ax * bw + aw * bx + ay * bz - az * by;
      out[1] = ay * bw + aw * by + az * bx - ax * bz;
      out[2] = az * bw + aw * bz + ax * by - ay * bx;
      out[3] = aw * bw - ax * bx - ay * by - az * bz;
      return out;
    }
    function rotateX(out, a, rad) {
      rad *= 0.5;
      var ax = a[0], ay = a[1], az = a[2], aw = a[3];
      var bx = Math.sin(rad), bw = Math.cos(rad);
      out[0] = ax * bw + aw * bx;
      out[1] = ay * bw + az * bx;
      out[2] = az * bw - ay * bx;
      out[3] = aw * bw - ax * bx;
      return out;
    }
    function rotateY(out, a, rad) {
      rad *= 0.5;
      var ax = a[0], ay = a[1], az = a[2], aw = a[3];
      var by = Math.sin(rad), bw = Math.cos(rad);
      out[0] = ax * bw - az * by;
      out[1] = ay * bw + aw * by;
      out[2] = az * bw + ax * by;
      out[3] = aw * bw - ay * by;
      return out;
    }
    function rotateZ(out, a, rad) {
      rad *= 0.5;
      var ax = a[0], ay = a[1], az = a[2], aw = a[3];
      var bz = Math.sin(rad), bw = Math.cos(rad);
      out[0] = ax * bw + ay * bz;
      out[1] = ay * bw - ax * bz;
      out[2] = az * bw + aw * bz;
      out[3] = aw * bw - az * bz;
      return out;
    }
    function calculateW(out, a) {
      var x = a[0], y = a[1], z = a[2];
      out[0] = x;
      out[1] = y;
      out[2] = z;
      out[3] = Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
      return out;
    }
    function exp(out, a) {
      var x = a[0], y = a[1], z = a[2], w = a[3];
      var r = Math.sqrt(x * x + y * y + z * z);
      var et = Math.exp(w);
      var s = r > 0 ? et * Math.sin(r) / r : 0;
      out[0] = x * s;
      out[1] = y * s;
      out[2] = z * s;
      out[3] = et * Math.cos(r);
      return out;
    }
    function ln(out, a) {
      var x = a[0], y = a[1], z = a[2], w = a[3];
      var r = Math.sqrt(x * x + y * y + z * z);
      var t = r > 0 ? Math.atan2(r, w) / r : 0;
      out[0] = x * t;
      out[1] = y * t;
      out[2] = z * t;
      out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
      return out;
    }
    function pow(out, a, b) {
      ln(out, a);
      scale(out, out, b);
      exp(out, out);
      return out;
    }
    function slerp(out, a, b, t) {
      var ax = a[0], ay = a[1], az = a[2], aw = a[3];
      var bx = b[0], by = b[1], bz = b[2], bw = b[3];
      var omega, cosom, sinom, scale0, scale1;
      cosom = ax * bx + ay * by + az * bz + aw * bw;
      if (cosom < 0) {
        cosom = -cosom;
        bx = -bx;
        by = -by;
        bz = -bz;
        bw = -bw;
      }
      if (1 - cosom > glMatrix.EPSILON) {
        omega = Math.acos(cosom);
        sinom = Math.sin(omega);
        scale0 = Math.sin((1 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
      } else {
        scale0 = 1 - t;
        scale1 = t;
      }
      out[0] = scale0 * ax + scale1 * bx;
      out[1] = scale0 * ay + scale1 * by;
      out[2] = scale0 * az + scale1 * bz;
      out[3] = scale0 * aw + scale1 * bw;
      return out;
    }
    function random(out) {
      var u1 = glMatrix.RANDOM();
      var u2 = glMatrix.RANDOM();
      var u3 = glMatrix.RANDOM();
      var sqrt1MinusU1 = Math.sqrt(1 - u1);
      var sqrtU1 = Math.sqrt(u1);
      out[0] = sqrt1MinusU1 * Math.sin(2 * Math.PI * u2);
      out[1] = sqrt1MinusU1 * Math.cos(2 * Math.PI * u2);
      out[2] = sqrtU1 * Math.sin(2 * Math.PI * u3);
      out[3] = sqrtU1 * Math.cos(2 * Math.PI * u3);
      return out;
    }
    function invert(out, a) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
      var dot2 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
      var invDot = dot2 ? 1 / dot2 : 0;
      out[0] = -a0 * invDot;
      out[1] = -a1 * invDot;
      out[2] = -a2 * invDot;
      out[3] = a3 * invDot;
      return out;
    }
    function conjugate(out, a) {
      out[0] = -a[0];
      out[1] = -a[1];
      out[2] = -a[2];
      out[3] = a[3];
      return out;
    }
    function fromMat3(out, m) {
      var fTrace = m[0] + m[4] + m[8];
      var fRoot;
      if (fTrace > 0) {
        fRoot = Math.sqrt(fTrace + 1);
        out[3] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[0] = (m[5] - m[7]) * fRoot;
        out[1] = (m[6] - m[2]) * fRoot;
        out[2] = (m[1] - m[3]) * fRoot;
      } else {
        var i = 0;
        if (m[4] > m[0]) i = 1;
        if (m[8] > m[i * 3 + i]) i = 2;
        var j = (i + 1) % 3;
        var k = (i + 2) % 3;
        fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
        out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
        out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
      }
      return out;
    }
    function fromEuler(out, x, y, z) {
      var order = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : glMatrix.ANGLE_ORDER;
      var halfToRad = Math.PI / 360;
      x *= halfToRad;
      z *= halfToRad;
      y *= halfToRad;
      var sx = Math.sin(x);
      var cx = Math.cos(x);
      var sy = Math.sin(y);
      var cy = Math.cos(y);
      var sz = Math.sin(z);
      var cz = Math.cos(z);
      switch (order) {
        case "xyz":
          out[0] = sx * cy * cz + cx * sy * sz;
          out[1] = cx * sy * cz - sx * cy * sz;
          out[2] = cx * cy * sz + sx * sy * cz;
          out[3] = cx * cy * cz - sx * sy * sz;
          break;
        case "xzy":
          out[0] = sx * cy * cz - cx * sy * sz;
          out[1] = cx * sy * cz - sx * cy * sz;
          out[2] = cx * cy * sz + sx * sy * cz;
          out[3] = cx * cy * cz + sx * sy * sz;
          break;
        case "yxz":
          out[0] = sx * cy * cz + cx * sy * sz;
          out[1] = cx * sy * cz - sx * cy * sz;
          out[2] = cx * cy * sz - sx * sy * cz;
          out[3] = cx * cy * cz + sx * sy * sz;
          break;
        case "yzx":
          out[0] = sx * cy * cz + cx * sy * sz;
          out[1] = cx * sy * cz + sx * cy * sz;
          out[2] = cx * cy * sz - sx * sy * cz;
          out[3] = cx * cy * cz - sx * sy * sz;
          break;
        case "zxy":
          out[0] = sx * cy * cz - cx * sy * sz;
          out[1] = cx * sy * cz + sx * cy * sz;
          out[2] = cx * cy * sz + sx * sy * cz;
          out[3] = cx * cy * cz - sx * sy * sz;
          break;
        case "zyx":
          out[0] = sx * cy * cz - cx * sy * sz;
          out[1] = cx * sy * cz + sx * cy * sz;
          out[2] = cx * cy * sz - sx * sy * cz;
          out[3] = cx * cy * cz + sx * sy * sz;
          break;
        default:
          throw new Error("Unknown angle order " + order);
      }
      return out;
    }
    function str(a) {
      return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
    }
    var clone = exports2.clone = vec4.clone;
    var fromValues = exports2.fromValues = vec4.fromValues;
    var copy = exports2.copy = vec4.copy;
    var set = exports2.set = vec4.set;
    var add = exports2.add = vec4.add;
    var mul = exports2.mul = multiply;
    var scale = exports2.scale = vec4.scale;
    var dot = exports2.dot = vec4.dot;
    var lerp = exports2.lerp = vec4.lerp;
    var length = exports2.length = vec4.length;
    var len = exports2.len = length;
    var squaredLength = exports2.squaredLength = vec4.squaredLength;
    var sqrLen = exports2.sqrLen = squaredLength;
    var normalize = exports2.normalize = vec4.normalize;
    var exactEquals = exports2.exactEquals = vec4.exactEquals;
    function equals(a, b) {
      return Math.abs(vec4.dot(a, b)) >= 1 - glMatrix.EPSILON;
    }
    var rotationTo = exports2.rotationTo = (function() {
      var tmpvec3 = vec33.create();
      var xUnitVec3 = vec33.fromValues(1, 0, 0);
      var yUnitVec3 = vec33.fromValues(0, 1, 0);
      return function(out, a, b) {
        var dot2 = vec33.dot(a, b);
        if (dot2 < -0.999999) {
          vec33.cross(tmpvec3, xUnitVec3, a);
          if (vec33.len(tmpvec3) < 1e-6) vec33.cross(tmpvec3, yUnitVec3, a);
          vec33.normalize(tmpvec3, tmpvec3);
          setAxisAngle(out, tmpvec3, Math.PI);
          return out;
        } else if (dot2 > 0.999999) {
          out[0] = 0;
          out[1] = 0;
          out[2] = 0;
          out[3] = 1;
          return out;
        } else {
          vec33.cross(tmpvec3, a, b);
          out[0] = tmpvec3[0];
          out[1] = tmpvec3[1];
          out[2] = tmpvec3[2];
          out[3] = 1 + dot2;
          return normalize(out, out);
        }
      };
    })();
    var sqlerp = exports2.sqlerp = (function() {
      var temp1 = create();
      var temp2 = create();
      return function(out, a, b, c, d, t) {
        slerp(temp1, a, d, t);
        slerp(temp2, b, c, t);
        slerp(out, temp1, temp2, 2 * t * (1 - t));
        return out;
      };
    })();
    var setAxes = exports2.setAxes = (function() {
      var matr = mat3.create();
      return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];
        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];
        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];
        return normalize(out, fromMat3(out, matr));
      };
    })();
  }
});

// node_modules/gl-matrix/cjs/quat2.js
var require_quat2 = __commonJS({
  "node_modules/gl-matrix/cjs/quat2.js"(exports2) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.add = add;
    exports2.clone = clone;
    exports2.conjugate = conjugate;
    exports2.copy = copy;
    exports2.create = create;
    exports2.dot = void 0;
    exports2.equals = equals;
    exports2.exactEquals = exactEquals;
    exports2.fromMat4 = fromMat4;
    exports2.fromRotation = fromRotation;
    exports2.fromRotationTranslation = fromRotationTranslation;
    exports2.fromRotationTranslationValues = fromRotationTranslationValues;
    exports2.fromTranslation = fromTranslation;
    exports2.fromValues = fromValues;
    exports2.getDual = getDual;
    exports2.getReal = void 0;
    exports2.getTranslation = getTranslation;
    exports2.identity = identity;
    exports2.invert = invert;
    exports2.length = exports2.len = void 0;
    exports2.lerp = lerp;
    exports2.mul = void 0;
    exports2.multiply = multiply;
    exports2.normalize = normalize;
    exports2.rotateAroundAxis = rotateAroundAxis;
    exports2.rotateByQuatAppend = rotateByQuatAppend;
    exports2.rotateByQuatPrepend = rotateByQuatPrepend;
    exports2.rotateX = rotateX;
    exports2.rotateY = rotateY;
    exports2.rotateZ = rotateZ;
    exports2.scale = scale;
    exports2.set = set;
    exports2.setDual = setDual;
    exports2.squaredLength = exports2.sqrLen = exports2.setReal = void 0;
    exports2.str = str;
    exports2.translate = translate;
    var glMatrix = _interopRequireWildcard(require_common());
    var quat3 = _interopRequireWildcard(require_quat());
    var mat43 = _interopRequireWildcard(require_mat4());
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function _interopRequireWildcard2(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, "default": e2 };
        if (null === e2 || "object" != _typeof(e2) && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (var _t in e2) "default" !== _t && {}.hasOwnProperty.call(e2, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e2[_t]);
        return f;
      })(e, t);
    }
    function create() {
      var dq = new glMatrix.ARRAY_TYPE(8);
      if (glMatrix.ARRAY_TYPE != Float32Array) {
        dq[0] = 0;
        dq[1] = 0;
        dq[2] = 0;
        dq[4] = 0;
        dq[5] = 0;
        dq[6] = 0;
        dq[7] = 0;
      }
      dq[3] = 1;
      return dq;
    }
    function clone(a) {
      var dq = new glMatrix.ARRAY_TYPE(8);
      dq[0] = a[0];
      dq[1] = a[1];
      dq[2] = a[2];
      dq[3] = a[3];
      dq[4] = a[4];
      dq[5] = a[5];
      dq[6] = a[6];
      dq[7] = a[7];
      return dq;
    }
    function fromValues(x1, y1, z1, w1, x2, y2, z2, w2) {
      var dq = new glMatrix.ARRAY_TYPE(8);
      dq[0] = x1;
      dq[1] = y1;
      dq[2] = z1;
      dq[3] = w1;
      dq[4] = x2;
      dq[5] = y2;
      dq[6] = z2;
      dq[7] = w2;
      return dq;
    }
    function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
      var dq = new glMatrix.ARRAY_TYPE(8);
      dq[0] = x1;
      dq[1] = y1;
      dq[2] = z1;
      dq[3] = w1;
      var ax = x2 * 0.5, ay = y2 * 0.5, az = z2 * 0.5;
      dq[4] = ax * w1 + ay * z1 - az * y1;
      dq[5] = ay * w1 + az * x1 - ax * z1;
      dq[6] = az * w1 + ax * y1 - ay * x1;
      dq[7] = -ax * x1 - ay * y1 - az * z1;
      return dq;
    }
    function fromRotationTranslation(out, q, t) {
      var ax = t[0] * 0.5, ay = t[1] * 0.5, az = t[2] * 0.5, bx = q[0], by = q[1], bz = q[2], bw = q[3];
      out[0] = bx;
      out[1] = by;
      out[2] = bz;
      out[3] = bw;
      out[4] = ax * bw + ay * bz - az * by;
      out[5] = ay * bw + az * bx - ax * bz;
      out[6] = az * bw + ax * by - ay * bx;
      out[7] = -ax * bx - ay * by - az * bz;
      return out;
    }
    function fromTranslation(out, t) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      out[4] = t[0] * 0.5;
      out[5] = t[1] * 0.5;
      out[6] = t[2] * 0.5;
      out[7] = 0;
      return out;
    }
    function fromRotation(out, q) {
      out[0] = q[0];
      out[1] = q[1];
      out[2] = q[2];
      out[3] = q[3];
      out[4] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
      return out;
    }
    function fromMat4(out, a) {
      var outer = quat3.create();
      mat43.getRotation(outer, a);
      var t = new glMatrix.ARRAY_TYPE(3);
      mat43.getTranslation(t, a);
      fromRotationTranslation(out, outer, t);
      return out;
    }
    function copy(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      return out;
    }
    function identity(out) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      out[4] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
      return out;
    }
    function set(out, x1, y1, z1, w1, x2, y2, z2, w2) {
      out[0] = x1;
      out[1] = y1;
      out[2] = z1;
      out[3] = w1;
      out[4] = x2;
      out[5] = y2;
      out[6] = z2;
      out[7] = w2;
      return out;
    }
    var getReal = exports2.getReal = quat3.copy;
    function getDual(out, a) {
      out[0] = a[4];
      out[1] = a[5];
      out[2] = a[6];
      out[3] = a[7];
      return out;
    }
    var setReal = exports2.setReal = quat3.copy;
    function setDual(out, q) {
      out[4] = q[0];
      out[5] = q[1];
      out[6] = q[2];
      out[7] = q[3];
      return out;
    }
    function getTranslation(out, a) {
      var ax = a[4], ay = a[5], az = a[6], aw = a[7], bx = -a[0], by = -a[1], bz = -a[2], bw = a[3];
      out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
      out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
      out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
      return out;
    }
    function translate(out, a, v) {
      var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3], bx1 = v[0] * 0.5, by1 = v[1] * 0.5, bz1 = v[2] * 0.5, ax2 = a[4], ay2 = a[5], az2 = a[6], aw2 = a[7];
      out[0] = ax1;
      out[1] = ay1;
      out[2] = az1;
      out[3] = aw1;
      out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
      out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
      out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
      out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
      return out;
    }
    function rotateX(out, a, rad) {
      var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
      quat3.rotateX(out, a, rad);
      bx = out[0];
      by = out[1];
      bz = out[2];
      bw = out[3];
      out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
      out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
      out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
      out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
      return out;
    }
    function rotateY(out, a, rad) {
      var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
      quat3.rotateY(out, a, rad);
      bx = out[0];
      by = out[1];
      bz = out[2];
      bw = out[3];
      out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
      out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
      out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
      out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
      return out;
    }
    function rotateZ(out, a, rad) {
      var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
      quat3.rotateZ(out, a, rad);
      bx = out[0];
      by = out[1];
      bz = out[2];
      bw = out[3];
      out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
      out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
      out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
      out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
      return out;
    }
    function rotateByQuatAppend(out, a, q) {
      var qx = q[0], qy = q[1], qz = q[2], qw = q[3], ax = a[0], ay = a[1], az = a[2], aw = a[3];
      out[0] = ax * qw + aw * qx + ay * qz - az * qy;
      out[1] = ay * qw + aw * qy + az * qx - ax * qz;
      out[2] = az * qw + aw * qz + ax * qy - ay * qx;
      out[3] = aw * qw - ax * qx - ay * qy - az * qz;
      ax = a[4];
      ay = a[5];
      az = a[6];
      aw = a[7];
      out[4] = ax * qw + aw * qx + ay * qz - az * qy;
      out[5] = ay * qw + aw * qy + az * qx - ax * qz;
      out[6] = az * qw + aw * qz + ax * qy - ay * qx;
      out[7] = aw * qw - ax * qx - ay * qy - az * qz;
      return out;
    }
    function rotateByQuatPrepend(out, q, a) {
      var qx = q[0], qy = q[1], qz = q[2], qw = q[3], bx = a[0], by = a[1], bz = a[2], bw = a[3];
      out[0] = qx * bw + qw * bx + qy * bz - qz * by;
      out[1] = qy * bw + qw * by + qz * bx - qx * bz;
      out[2] = qz * bw + qw * bz + qx * by - qy * bx;
      out[3] = qw * bw - qx * bx - qy * by - qz * bz;
      bx = a[4];
      by = a[5];
      bz = a[6];
      bw = a[7];
      out[4] = qx * bw + qw * bx + qy * bz - qz * by;
      out[5] = qy * bw + qw * by + qz * bx - qx * bz;
      out[6] = qz * bw + qw * bz + qx * by - qy * bx;
      out[7] = qw * bw - qx * bx - qy * by - qz * bz;
      return out;
    }
    function rotateAroundAxis(out, a, axis, rad) {
      if (Math.abs(rad) < glMatrix.EPSILON) {
        return copy(out, a);
      }
      var axisLength = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
      rad = rad * 0.5;
      var s = Math.sin(rad);
      var bx = s * axis[0] / axisLength;
      var by = s * axis[1] / axisLength;
      var bz = s * axis[2] / axisLength;
      var bw = Math.cos(rad);
      var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3];
      out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
      out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
      out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
      out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
      var ax = a[4], ay = a[5], az = a[6], aw = a[7];
      out[4] = ax * bw + aw * bx + ay * bz - az * by;
      out[5] = ay * bw + aw * by + az * bx - ax * bz;
      out[6] = az * bw + aw * bz + ax * by - ay * bx;
      out[7] = aw * bw - ax * bx - ay * by - az * bz;
      return out;
    }
    function add(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      out[3] = a[3] + b[3];
      out[4] = a[4] + b[4];
      out[5] = a[5] + b[5];
      out[6] = a[6] + b[6];
      out[7] = a[7] + b[7];
      return out;
    }
    function multiply(out, a, b) {
      var ax0 = a[0], ay0 = a[1], az0 = a[2], aw0 = a[3], bx1 = b[4], by1 = b[5], bz1 = b[6], bw1 = b[7], ax1 = a[4], ay1 = a[5], az1 = a[6], aw1 = a[7], bx0 = b[0], by0 = b[1], bz0 = b[2], bw0 = b[3];
      out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
      out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
      out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
      out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
      out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
      out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
      out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
      out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
      return out;
    }
    var mul = exports2.mul = multiply;
    function scale(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      out[3] = a[3] * b;
      out[4] = a[4] * b;
      out[5] = a[5] * b;
      out[6] = a[6] * b;
      out[7] = a[7] * b;
      return out;
    }
    var dot = exports2.dot = quat3.dot;
    function lerp(out, a, b, t) {
      var mt = 1 - t;
      if (dot(a, b) < 0) t = -t;
      out[0] = a[0] * mt + b[0] * t;
      out[1] = a[1] * mt + b[1] * t;
      out[2] = a[2] * mt + b[2] * t;
      out[3] = a[3] * mt + b[3] * t;
      out[4] = a[4] * mt + b[4] * t;
      out[5] = a[5] * mt + b[5] * t;
      out[6] = a[6] * mt + b[6] * t;
      out[7] = a[7] * mt + b[7] * t;
      return out;
    }
    function invert(out, a) {
      var sqlen = squaredLength(a);
      out[0] = -a[0] / sqlen;
      out[1] = -a[1] / sqlen;
      out[2] = -a[2] / sqlen;
      out[3] = a[3] / sqlen;
      out[4] = -a[4] / sqlen;
      out[5] = -a[5] / sqlen;
      out[6] = -a[6] / sqlen;
      out[7] = a[7] / sqlen;
      return out;
    }
    function conjugate(out, a) {
      out[0] = -a[0];
      out[1] = -a[1];
      out[2] = -a[2];
      out[3] = a[3];
      out[4] = -a[4];
      out[5] = -a[5];
      out[6] = -a[6];
      out[7] = a[7];
      return out;
    }
    var length = exports2.length = quat3.length;
    var len = exports2.len = length;
    var squaredLength = exports2.squaredLength = quat3.squaredLength;
    var sqrLen = exports2.sqrLen = squaredLength;
    function normalize(out, a) {
      var magnitude = squaredLength(a);
      if (magnitude > 0) {
        magnitude = Math.sqrt(magnitude);
        var a0 = a[0] / magnitude;
        var a1 = a[1] / magnitude;
        var a2 = a[2] / magnitude;
        var a3 = a[3] / magnitude;
        var b0 = a[4];
        var b1 = a[5];
        var b2 = a[6];
        var b3 = a[7];
        var a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
        out[0] = a0;
        out[1] = a1;
        out[2] = a2;
        out[3] = a3;
        out[4] = (b0 - a0 * a_dot_b) / magnitude;
        out[5] = (b1 - a1 * a_dot_b) / magnitude;
        out[6] = (b2 - a2 * a_dot_b) / magnitude;
        out[7] = (b3 - a3 * a_dot_b) / magnitude;
      }
      return out;
    }
    function str(a) {
      return "quat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ")";
    }
    function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7];
    }
    function equals(a, b) {
      var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
      var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
      return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7));
    }
  }
});

// node_modules/gl-matrix/cjs/vec2.js
var require_vec2 = __commonJS({
  "node_modules/gl-matrix/cjs/vec2.js"(exports2) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.add = add;
    exports2.angle = angle;
    exports2.ceil = ceil;
    exports2.clone = clone;
    exports2.copy = copy;
    exports2.create = create;
    exports2.cross = cross;
    exports2.dist = void 0;
    exports2.distance = distance;
    exports2.div = void 0;
    exports2.divide = divide;
    exports2.dot = dot;
    exports2.equals = equals;
    exports2.exactEquals = exactEquals;
    exports2.floor = floor;
    exports2.forEach = void 0;
    exports2.fromValues = fromValues;
    exports2.inverse = inverse;
    exports2.len = void 0;
    exports2.length = length;
    exports2.lerp = lerp;
    exports2.max = max;
    exports2.min = min;
    exports2.mul = void 0;
    exports2.multiply = multiply;
    exports2.negate = negate;
    exports2.normalize = normalize;
    exports2.random = random;
    exports2.rotate = rotate;
    exports2.round = round;
    exports2.scale = scale;
    exports2.scaleAndAdd = scaleAndAdd;
    exports2.set = set;
    exports2.signedAngle = signedAngle;
    exports2.sqrLen = exports2.sqrDist = void 0;
    exports2.squaredDistance = squaredDistance;
    exports2.squaredLength = squaredLength;
    exports2.str = str;
    exports2.sub = void 0;
    exports2.subtract = subtract;
    exports2.transformMat2 = transformMat2;
    exports2.transformMat2d = transformMat2d;
    exports2.transformMat3 = transformMat3;
    exports2.transformMat4 = transformMat4;
    exports2.zero = zero;
    var glMatrix = _interopRequireWildcard(require_common());
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function _interopRequireWildcard2(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, "default": e2 };
        if (null === e2 || "object" != _typeof(e2) && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (var _t in e2) "default" !== _t && {}.hasOwnProperty.call(e2, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e2[_t]);
        return f;
      })(e, t);
    }
    function create() {
      var out = new glMatrix.ARRAY_TYPE(2);
      if (glMatrix.ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
      }
      return out;
    }
    function clone(a) {
      var out = new glMatrix.ARRAY_TYPE(2);
      out[0] = a[0];
      out[1] = a[1];
      return out;
    }
    function fromValues(x, y) {
      var out = new glMatrix.ARRAY_TYPE(2);
      out[0] = x;
      out[1] = y;
      return out;
    }
    function copy(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      return out;
    }
    function set(out, x, y) {
      out[0] = x;
      out[1] = y;
      return out;
    }
    function add(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      return out;
    }
    function subtract(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      return out;
    }
    function multiply(out, a, b) {
      out[0] = a[0] * b[0];
      out[1] = a[1] * b[1];
      return out;
    }
    function divide(out, a, b) {
      out[0] = a[0] / b[0];
      out[1] = a[1] / b[1];
      return out;
    }
    function ceil(out, a) {
      out[0] = Math.ceil(a[0]);
      out[1] = Math.ceil(a[1]);
      return out;
    }
    function floor(out, a) {
      out[0] = Math.floor(a[0]);
      out[1] = Math.floor(a[1]);
      return out;
    }
    function min(out, a, b) {
      out[0] = Math.min(a[0], b[0]);
      out[1] = Math.min(a[1], b[1]);
      return out;
    }
    function max(out, a, b) {
      out[0] = Math.max(a[0], b[0]);
      out[1] = Math.max(a[1], b[1]);
      return out;
    }
    function round(out, a) {
      out[0] = glMatrix.round(a[0]);
      out[1] = glMatrix.round(a[1]);
      return out;
    }
    function scale(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      return out;
    }
    function scaleAndAdd(out, a, b, scale2) {
      out[0] = a[0] + b[0] * scale2;
      out[1] = a[1] + b[1] * scale2;
      return out;
    }
    function distance(a, b) {
      var x = b[0] - a[0], y = b[1] - a[1];
      return Math.sqrt(x * x + y * y);
    }
    function squaredDistance(a, b) {
      var x = b[0] - a[0], y = b[1] - a[1];
      return x * x + y * y;
    }
    function length(a) {
      var x = a[0], y = a[1];
      return Math.sqrt(x * x + y * y);
    }
    function squaredLength(a) {
      var x = a[0], y = a[1];
      return x * x + y * y;
    }
    function negate(out, a) {
      out[0] = -a[0];
      out[1] = -a[1];
      return out;
    }
    function inverse(out, a) {
      out[0] = 1 / a[0];
      out[1] = 1 / a[1];
      return out;
    }
    function normalize(out, a) {
      var x = a[0], y = a[1];
      var len2 = x * x + y * y;
      if (len2 > 0) {
        len2 = 1 / Math.sqrt(len2);
      }
      out[0] = a[0] * len2;
      out[1] = a[1] * len2;
      return out;
    }
    function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1];
    }
    function cross(out, a, b) {
      var z = a[0] * b[1] - a[1] * b[0];
      out[0] = out[1] = 0;
      out[2] = z;
      return out;
    }
    function lerp(out, a, b, t) {
      var ax = a[0], ay = a[1];
      out[0] = ax + t * (b[0] - ax);
      out[1] = ay + t * (b[1] - ay);
      return out;
    }
    function random(out, scale2) {
      scale2 = scale2 === void 0 ? 1 : scale2;
      var r = glMatrix.RANDOM() * 2 * Math.PI;
      out[0] = Math.cos(r) * scale2;
      out[1] = Math.sin(r) * scale2;
      return out;
    }
    function transformMat2(out, a, m) {
      var x = a[0], y = a[1];
      out[0] = m[0] * x + m[2] * y;
      out[1] = m[1] * x + m[3] * y;
      return out;
    }
    function transformMat2d(out, a, m) {
      var x = a[0], y = a[1];
      out[0] = m[0] * x + m[2] * y + m[4];
      out[1] = m[1] * x + m[3] * y + m[5];
      return out;
    }
    function transformMat3(out, a, m) {
      var x = a[0], y = a[1];
      out[0] = m[0] * x + m[3] * y + m[6];
      out[1] = m[1] * x + m[4] * y + m[7];
      return out;
    }
    function transformMat4(out, a, m) {
      var x = a[0];
      var y = a[1];
      out[0] = m[0] * x + m[4] * y + m[12];
      out[1] = m[1] * x + m[5] * y + m[13];
      return out;
    }
    function rotate(out, a, b, rad) {
      var p0 = a[0] - b[0], p1 = a[1] - b[1], sinC = Math.sin(rad), cosC = Math.cos(rad);
      out[0] = p0 * cosC - p1 * sinC + b[0];
      out[1] = p0 * sinC + p1 * cosC + b[1];
      return out;
    }
    function angle(a, b) {
      var ax = a[0], ay = a[1], bx = b[0], by = b[1];
      return Math.abs(Math.atan2(ay * bx - ax * by, ax * bx + ay * by));
    }
    function signedAngle(a, b) {
      var ax = a[0], ay = a[1], bx = b[0], by = b[1];
      return Math.atan2(ax * by - ay * bx, ax * bx + ay * by);
    }
    function zero(out) {
      out[0] = 0;
      out[1] = 0;
      return out;
    }
    function str(a) {
      return "vec2(" + a[0] + ", " + a[1] + ")";
    }
    function exactEquals(a, b) {
      return a[0] === b[0] && a[1] === b[1];
    }
    function equals(a, b) {
      var a0 = a[0], a1 = a[1];
      var b0 = b[0], b1 = b[1];
      return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1));
    }
    var len = exports2.len = length;
    var sub = exports2.sub = subtract;
    var mul = exports2.mul = multiply;
    var div = exports2.div = divide;
    var dist = exports2.dist = distance;
    var sqrDist = exports2.sqrDist = squaredDistance;
    var sqrLen = exports2.sqrLen = squaredLength;
    var forEach = exports2.forEach = (function() {
      var vec = create();
      return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if (!stride) {
          stride = 2;
        }
        if (!offset) {
          offset = 0;
        }
        if (count) {
          l = Math.min(count * stride + offset, a.length);
        } else {
          l = a.length;
        }
        for (i = offset; i < l; i += stride) {
          vec[0] = a[i];
          vec[1] = a[i + 1];
          fn(vec, vec, arg);
          a[i] = vec[0];
          a[i + 1] = vec[1];
        }
        return a;
      };
    })();
  }
});

// node_modules/gl-matrix/cjs/index.js
var require_cjs = __commonJS({
  "node_modules/gl-matrix/cjs/index.js"(exports2) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.vec4 = exports2.vec3 = exports2.vec2 = exports2.quat2 = exports2.quat = exports2.mat4 = exports2.mat3 = exports2.mat2d = exports2.mat2 = exports2.glMatrix = void 0;
    var glMatrix = _interopRequireWildcard(require_common());
    exports2.glMatrix = glMatrix;
    var mat2 = _interopRequireWildcard(require_mat2());
    exports2.mat2 = mat2;
    var mat2d = _interopRequireWildcard(require_mat2d());
    exports2.mat2d = mat2d;
    var mat3 = _interopRequireWildcard(require_mat3());
    exports2.mat3 = mat3;
    var mat43 = _interopRequireWildcard(require_mat4());
    exports2.mat4 = mat43;
    var quat3 = _interopRequireWildcard(require_quat());
    exports2.quat = quat3;
    var quat22 = _interopRequireWildcard(require_quat2());
    exports2.quat2 = quat22;
    var vec2 = _interopRequireWildcard(require_vec2());
    exports2.vec2 = vec2;
    var vec33 = _interopRequireWildcard(require_vec3());
    exports2.vec3 = vec33;
    var vec4 = _interopRequireWildcard(require_vec4());
    exports2.vec4 = vec4;
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function _interopRequireWildcard2(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, "default": e2 };
        if (null === e2 || "object" != _typeof(e2) && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (var _t in e2) "default" !== _t && {}.hasOwnProperty.call(e2, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e2[_t]);
        return f;
      })(e, t);
    }
  }
});

// validate_animation.ts
var import_node_fs = __toESM(require("node:fs"));
var import_node_path = __toESM(require("node:path"));

// package/src/common/utf8.ts
var decoder = new TextDecoder();
var encoder = new TextEncoder();
function decodeUtf8(buffer2) {
  return decoder.decode(buffer2);
}
function encodeUtf8(utf8) {
  return encoder.encode(utf8);
}

// package/src/common/bytesof.ts
function bytesOf(buffer2) {
  if (buffer2 instanceof Uint8Array) {
    return buffer2;
  } else if (typeof buffer2 === "string") {
    return encodeUtf8(buffer2);
  } else {
    return new Uint8Array(buffer2);
  }
}

// package/src/common/searches.ts
function isStringInBytes(buffer2, target, offset = 0, length = Infinity) {
  let start = Math.max(offset, 0);
  let end = Math.min(start + length, buffer2.length);
  let whichByte = 0;
  let targetByte = target.charCodeAt(0);
  for (let i = start; i < end; i++) {
    let byte = buffer2[i];
    if (byte === targetByte) {
      whichByte += 1;
      if (whichByte === target.length) {
        return true;
      }
      targetByte = target.charCodeAt(whichByte);
    } else if (whichByte > 0) {
      whichByte = 0;
      targetByte = target.charCodeAt(0);
    }
  }
  return false;
}
function isStringInString(buffer2, target, offset = 0, length = Infinity) {
  let start = Math.max(offset, 0);
  let end = Math.min(start + length, buffer2.length);
  let whichByte = 0;
  let targetByte = target[0];
  for (let i = start; i < end; i++) {
    let byte = buffer2[i];
    if (byte === targetByte) {
      whichByte += 1;
      if (whichByte === target.length) {
        return true;
      }
      targetByte = target[whichByte];
    } else if (whichByte > 0) {
      whichByte = 0;
      targetByte = target[0];
    }
  }
  return false;
}
function boundIndexOf(buffer2, target, offset = 0, length = Infinity) {
  let start = Math.max(offset, 0);
  let end = Math.min(start + length, buffer2.length);
  for (let i = start; i < end; i++) {
    if (buffer2[i] === target) {
      return i;
    }
  }
  return -1;
}

// package/src/common/typecast.ts
var buffer = new ArrayBuffer(8);
var int8 = new Int8Array(buffer);
var int16 = new Int16Array(buffer);
var int32 = new Int32Array(buffer);
var uint8 = new Uint8Array(buffer);
var uint16 = new Uint16Array(buffer);
var uint32 = new Uint32Array(buffer);
var float32 = new Float32Array(buffer);
var float64 = new Float64Array(buffer);
function uint8ToInt8(a) {
  uint8[0] = a;
  return int8[0];
}
function uint8ToInt16(a, b) {
  uint8[0] = a;
  uint8[1] = b;
  return int16[0];
}
function uint8ToInt32(a, b, c, d) {
  uint8[0] = a;
  uint8[1] = b;
  uint8[2] = c;
  uint8[3] = d;
  return int32[0];
}
function uint8ToUint16(a, b) {
  uint8[0] = a;
  uint8[1] = b;
  return uint16[0];
}
function uint8ToUint32(a, b, c, d) {
  uint8[0] = a;
  uint8[1] = b;
  uint8[2] = c;
  uint8[3] = d;
  return uint32[0];
}
function uint8ToFloat32(a, b, c, d) {
  uint8[0] = a;
  uint8[1] = b;
  uint8[2] = c;
  uint8[3] = d;
  return float32[0];
}
function uint8ToFloat64(a, b, c, d, e, f, g, h) {
  uint8[0] = a;
  uint8[1] = b;
  uint8[2] = c;
  uint8[3] = d;
  uint8[4] = e;
  uint8[5] = f;
  uint8[6] = g;
  uint8[7] = h;
  return float64[0];
}
function int8ToUint8(a) {
  uint8[0] = a;
  return int8[0];
}
function int16ToUint8(out, a) {
  int16[0] = a;
  out[0] = uint8[0];
  out[1] = uint8[1];
  return out;
}
function int32ToUint8(out, a) {
  int32[0] = a;
  out[0] = uint8[0];
  out[1] = uint8[1];
  out[2] = uint8[2];
  out[3] = uint8[3];
  return out;
}
function uint16ToUint8(out, a) {
  uint16[0] = a;
  out[0] = uint8[0];
  out[1] = uint8[1];
  return out;
}
function uint32ToUint8(out, a) {
  uint32[0] = a;
  out[0] = uint8[0];
  out[1] = uint8[1];
  out[2] = uint8[2];
  out[3] = uint8[3];
  return out;
}
function float32ToUint8(out, a) {
  float32[0] = a;
  out[0] = uint8[0];
  out[1] = uint8[1];
  out[2] = uint8[2];
  out[3] = uint8[3];
  return out;
}
function float64ToUint8(out, a) {
  float64[0] = a;
  out[0] = uint8[0];
  out[1] = uint8[1];
  out[2] = uint8[2];
  out[3] = uint8[3];
  out[4] = uint8[4];
  out[5] = uint8[5];
  out[6] = uint8[6];
  out[7] = uint8[7];
  return out;
}

// package/src/common/binarystream.ts
var uint82 = new Uint8Array(8);
var BinaryStream = class _BinaryStream {
  constructor(buffer2, byteOffset, byteLength) {
    this.index = 0;
    let bytes2 = bytesOf(buffer2);
    byteOffset = byteOffset || 0;
    byteLength = byteLength || bytes2.length;
    this.buffer = buffer2;
    this.uint8array = bytes2.subarray(byteOffset, byteOffset + byteLength);
    this.byteLength = byteLength;
    this.remaining = byteLength;
  }
  /**
   * Create a subreader of this reader, at its position, with the given byte length.
   */
  substream(byteLength) {
    if (this.remaining < byteLength) {
      throw new Error(`ByteStream: substream: want ${byteLength} bytes but have ${this.remaining}`);
    }
    let index = this.index;
    this.index += byteLength;
    return new _BinaryStream(this.uint8array.subarray(index, index + byteLength));
  }
  /**
   * Skip a number of bytes.
   */
  skip(bytes2) {
    if (this.remaining < bytes2) {
      throw new Error(`ByteStream: skip: premature end - want ${bytes2} bytes but have ${this.remaining}`);
    }
    this.index += bytes2;
    this.remaining -= bytes2;
  }
  /**
   * Set the reader's index.
   */
  seek(index) {
    this.index = index;
    this.remaining = this.byteLength - index;
  }
  /**
   * Read a UTF8 string with the given number of bytes.
   * 
   * The entire size will be read, however the string returned is NULL terminated in its memory block.
   * 
   * For example, the MDX format has many strings that have a constant maximum size, where any bytes after the string are NULLs.
   * Such strings will be loaded correctly given the maximum size.
   */
  read(bytes2) {
    if (this.remaining < bytes2) {
      throw new Error(`ByteStream: read: premature end - want ${bytes2} bytes but have ${this.remaining}`);
    }
    let uint8array = this.uint8array;
    let start = this.index;
    let end = boundIndexOf(uint8array, 0, start, bytes2);
    if (end === -1) {
      end = start + bytes2;
    }
    this.index += bytes2;
    this.remaining -= bytes2;
    return decodeUtf8(uint8array.subarray(start, end));
  }
  /**
   * Read a UTF8 NULL terminated string.
   */
  readNull() {
    if (this.remaining < 1) {
      throw new Error(`ByteStream: readNull: premature end - want at least 1 byte but have 0`);
    }
    let uint8array = this.uint8array;
    let start = this.index;
    let end = uint8array.indexOf(0, start);
    if (end === -1) {
      end = uint8array.length - 1;
    }
    let bytes2 = end - start + 1;
    this.index += bytes2;
    this.remaining -= bytes2;
    return decodeUtf8(uint8array.subarray(start, end));
  }
  /**
   * Read a binary string with the given number of bytes.
   */
  readBinary(bytes2) {
    if (this.remaining < bytes2) {
      throw new Error(`ByteStream: readBinary: premature end - want ${bytes2} bytes but have ${this.remaining}`);
    }
    let uint8array = this.uint8array;
    let index = this.index;
    let data = "";
    for (let i = 0; i < bytes2; i++) {
      data += String.fromCharCode(uint8array[index + i]);
    }
    this.index += bytes2;
    this.remaining -= bytes2;
    return data;
  }
  /**
   * Read a 8 bit signed integer.
   */
  readInt8() {
    if (this.remaining < 1) {
      throw new Error(`ByteStream: readInt8: premature end - want 1 byte but have ${this.remaining}`);
    }
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToInt8(uint8array[index]);
    this.index += 1;
    this.remaining -= 1;
    return data;
  }
  /**
   * Read a 16 bit signed integer.
   */
  readInt16() {
    if (this.remaining < 2) {
      throw new Error(`ByteStream: readInt16: premature end - want 2 bytes but have ${this.remaining}`);
    }
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToInt16(uint8array[index], uint8array[index + 1]);
    this.index += 2;
    this.remaining -= 2;
    return data;
  }
  /**
   * Read a 32 bit signed integer.
   */
  readInt32() {
    if (this.remaining < 4) {
      throw new Error(`ByteStream: readInt32: premature end - want 4 bytes but have ${this.remaining}`);
    }
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToInt32(uint8array[index], uint8array[index + 1], uint8array[index + 2], uint8array[index + 3]);
    this.index += 4;
    this.remaining -= 4;
    return data;
  }
  /**
   * Read a 8 bit unsigned integer.
   */
  readUint8() {
    if (this.remaining < 1) {
      throw new Error(`ByteStream: readUint8: premature end - want 1 byte but have ${this.remaining}`);
    }
    let data = this.uint8array[this.index];
    this.index += 1;
    this.remaining -= 1;
    return data;
  }
  /**
   * Read a 16 bit unsigned integer.
   */
  readUint16() {
    if (this.remaining < 2) {
      throw new Error(`ByteStream: readUint16: premature end - want 2 bytes but have ${this.remaining}`);
    }
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToUint16(uint8array[index], uint8array[index + 1]);
    this.index += 2;
    this.remaining -= 2;
    return data;
  }
  /**
   * Read a 32 bit unsigned integer.
   */
  readUint32() {
    if (this.remaining < 4) {
      throw new Error(`ByteStream: readUint32: premature end - want 4 bytes but have ${this.remaining}`);
    }
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToUint32(uint8array[index], uint8array[index + 1], uint8array[index + 2], uint8array[index + 3]);
    this.index += 4;
    this.remaining -= 4;
    return data;
  }
  /**
   * Read a 32 bit float.
   */
  readFloat32() {
    if (this.remaining < 4) {
      throw new Error(`ByteStream: readFloat32: premature end - want 4 bytes but have ${this.remaining}`);
    }
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToFloat32(uint8array[index], uint8array[index + 1], uint8array[index + 2], uint8array[index + 3]);
    this.index += 4;
    this.remaining -= 4;
    return data;
  }
  /**
   * Read a 64 bit float.
   */
  readFloat64() {
    if (this.remaining < 8) {
      throw new Error(`ByteStream: readFloat64: premature end - want 8 bytes but have ${this.remaining}`);
    }
    let index = this.index;
    let uint8array = this.uint8array;
    let data = uint8ToFloat64(uint8array[index], uint8array[index + 1], uint8array[index + 2], uint8array[index + 3], uint8array[index + 4], uint8array[index + 5], uint8array[index + 6], uint8array[index + 7]);
    this.index += 8;
    this.remaining -= 8;
    return data;
  }
  /**
   * Read an array of 8 bit signed integers.
   */
  readInt8Array(view) {
    if (!ArrayBuffer.isView(view)) {
      view = new Int8Array(view);
    }
    if (this.remaining < view.byteLength) {
      throw new Error(`ByteStream: readInt8Array: premature end - want ${view.byteLength} bytes but have ${this.remaining}`);
    }
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      view[i] = uint8ToInt8(uint8array[index + i]);
    }
    this.index += view.byteLength;
    this.remaining -= view.byteLength;
    return view;
  }
  /**
   * Read an array of 16 bit signed integers.
   */
  readInt16Array(view) {
    if (!ArrayBuffer.isView(view)) {
      view = new Int16Array(view);
    }
    if (this.remaining < view.byteLength) {
      throw new Error(`ByteStream: readInt16Array: premature end - want ${view.byteLength} bytes but have ${this.remaining}`);
    }
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 2;
      view[i] = uint8ToInt16(uint8array[offset], uint8array[offset + 1]);
    }
    this.index += view.byteLength;
    this.remaining -= view.byteLength;
    return view;
  }
  /**
   * Read an array of 32 bit signed integers.
   */
  readInt32Array(view) {
    if (!ArrayBuffer.isView(view)) {
      view = new Int32Array(view);
    }
    if (this.remaining < view.byteLength) {
      throw new Error(`ByteStream: readInt32Array: premature end - want ${view.byteLength} bytes but have ${this.remaining}`);
    }
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 4;
      view[i] = uint8ToInt32(uint8array[offset], uint8array[offset + 1], uint8array[offset + 2], uint8array[offset + 3]);
    }
    this.index += view.byteLength;
    this.remaining -= view.byteLength;
    return view;
  }
  /**
   * Read an array of 8 bit unsigned integers.
   */
  readUint8Array(view) {
    if (!ArrayBuffer.isView(view)) {
      view = new Uint8Array(view);
    }
    if (this.remaining < view.byteLength) {
      throw new Error(`ByteStream: readUint8Array: premature end - want ${view.byteLength} bytes but have ${this.remaining}`);
    }
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      view[i] = uint8array[index + i];
    }
    this.index += view.byteLength;
    this.remaining -= view.byteLength;
    return view;
  }
  /**
   * Read an array of 16 bit unsigned integers.
   */
  readUint16Array(view) {
    if (!ArrayBuffer.isView(view)) {
      view = new Uint16Array(view);
    }
    if (this.remaining < view.byteLength) {
      throw new Error(`ByteStream: readUint16Array: premature end - want ${view.byteLength} bytes but have ${this.remaining}`);
    }
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 2;
      view[i] = uint8ToUint16(uint8array[offset], uint8array[offset + 1]);
    }
    this.index += view.byteLength;
    this.remaining -= view.byteLength;
    return view;
  }
  /**
   * Read an array of 32 bit unsigned integers.
   */
  readUint32Array(view) {
    if (!ArrayBuffer.isView(view)) {
      view = new Uint32Array(view);
    }
    if (this.remaining < view.byteLength) {
      throw new Error(`ByteStream: readUint32Array: premature end - want ${view.byteLength} bytes but have ${this.remaining}`);
    }
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 4;
      view[i] = uint8ToUint32(uint8array[offset], uint8array[offset + 1], uint8array[offset + 2], uint8array[offset + 3]);
    }
    this.index += view.byteLength;
    this.remaining -= view.byteLength;
    return view;
  }
  /**
   * Read an array of 32 bit floats.
   */
  readFloat32Array(view) {
    if (!ArrayBuffer.isView(view)) {
      view = new Float32Array(view);
    }
    if (this.remaining < view.byteLength) {
      throw new Error(`ByteStream: readFloat32Array: premature end - want ${view.byteLength} bytes but have ${this.remaining}`);
    }
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 4;
      view[i] = uint8ToFloat32(uint8array[offset], uint8array[offset + 1], uint8array[offset + 2], uint8array[offset + 3]);
    }
    this.index += view.byteLength;
    this.remaining -= view.byteLength;
    return view;
  }
  /**
   * Read an array of 64 bit floats.
   */
  readFloat64Array(view) {
    if (!ArrayBuffer.isView(view)) {
      view = new Float64Array(view);
    }
    if (this.remaining < view.byteLength) {
      throw new Error(`ByteStream: readFloat64Array: premature end - want ${view.byteLength} bytes but have ${this.remaining}`);
    }
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 8;
      view[i] = uint8ToFloat64(uint8array[offset], uint8array[offset + 1], uint8array[offset + 2], uint8array[offset + 3], uint8array[offset + 4], uint8array[offset + 5], uint8array[offset + 6], uint8array[offset + 7]);
    }
    this.index += view.byteLength;
    this.remaining -= view.byteLength;
    return view;
  }
  /**
   * Write a UTF8 string.
   * 
   * Returns the number of bytes that were written,
   */
  write(utf8) {
    let bytes2 = encodeUtf8(utf8);
    this.writeUint8Array(bytes2);
    return bytes2.length;
  }
  /**
   * Write a UTF8 string as a NULL terminated string.
   * 
   * Returns the number of bytes that were written, including the terminating NULL.
   */
  writeNull(utf8) {
    let bytes2 = this.write(utf8);
    this.index++;
    this.remaining--;
    return bytes2 + 1;
  }
  /**
   * Write a binary string.
   */
  writeBinary(value) {
    let index = this.index;
    let uint8array = this.uint8array;
    let count = value.length;
    for (let i = 0; i < count; i++) {
      uint8array[index + i] = value.charCodeAt(i);
    }
    this.index += count;
  }
  /**
   * Write a 8 bit signed integer.
   */
  writeInt8(value) {
    this.uint8array[this.index] = int8ToUint8(value);
    this.index += 1;
  }
  /**
   * Write a 16 bit signed integer.
   */
  writeInt16(value) {
    let index = this.index;
    let uint8array = this.uint8array;
    int16ToUint8(uint82, value);
    uint8array[index] = uint82[0];
    uint8array[index + 1] = uint82[1];
    this.index += 2;
  }
  /**
   * Write a 32 bit signed integer.
   */
  writeInt32(value) {
    let index = this.index;
    let uint8array = this.uint8array;
    int32ToUint8(uint82, value);
    uint8array[index] = uint82[0];
    uint8array[index + 1] = uint82[1];
    uint8array[index + 2] = uint82[2];
    uint8array[index + 3] = uint82[3];
    this.index += 4;
  }
  /**
   * Write a 8 bit unsigned integer.
   */
  writeUint8(value) {
    this.uint8array[this.index] = value;
    this.index += 1;
  }
  /**
   * Write a 16 bit unsigned integer.
   */
  writeUint16(value) {
    let index = this.index;
    let uint8array = this.uint8array;
    uint16ToUint8(uint82, value);
    uint8array[index] = uint82[0];
    uint8array[index + 1] = uint82[1];
    this.index += 2;
  }
  /**
   * Write a 32 bit unsigned integer.
   */
  writeUint32(value) {
    let index = this.index;
    let uint8array = this.uint8array;
    uint32ToUint8(uint82, value);
    uint8array[index] = uint82[0];
    uint8array[index + 1] = uint82[1];
    uint8array[index + 2] = uint82[2];
    uint8array[index + 3] = uint82[3];
    this.index += 4;
  }
  /**
   * Write a 32 bit float.
   */
  writeFloat32(value) {
    let index = this.index;
    let uint8array = this.uint8array;
    float32ToUint8(uint82, value);
    uint8array[index] = uint82[0];
    uint8array[index + 1] = uint82[1];
    uint8array[index + 2] = uint82[2];
    uint8array[index + 3] = uint82[3];
    this.index += 4;
  }
  /**
   * Write a 64 bit float.
   */
  writeFloat64(value) {
    let index = this.index;
    let uint8array = this.uint8array;
    float64ToUint8(uint82, value);
    uint8array[index] = uint82[0];
    uint8array[index + 1] = uint82[1];
    uint8array[index + 2] = uint82[2];
    uint8array[index + 3] = uint82[3];
    uint8array[index + 4] = uint82[4];
    uint8array[index + 5] = uint82[5];
    uint8array[index + 6] = uint82[6];
    uint8array[index + 7] = uint82[7];
    this.index += 8;
  }
  /**
   * Write an array of 8 bit signed integers.
   */
  writeInt8Array(view) {
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      uint8array[index + i] = int8ToUint8(view[i]);
    }
    this.index += view.byteLength;
  }
  /**
   * Write an array of 16 bit signed integers.
   */
  writeInt16Array(view) {
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 2;
      int16ToUint8(uint82, view[i]);
      uint8array[offset] = uint82[0];
      uint8array[offset + 1] = uint82[1];
    }
    this.index += view.byteLength;
  }
  /**
   * Write an array of 32 bit signed integers.
   */
  writeInt32Array(view) {
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 4;
      int32ToUint8(uint82, view[i]);
      uint8array[offset] = uint82[0];
      uint8array[offset + 1] = uint82[1];
      uint8array[offset + 2] = uint82[2];
      uint8array[offset + 3] = uint82[3];
    }
    this.index += view.byteLength;
  }
  /**
   * Write an array of 8 bit unsigned integers.
   */
  writeUint8Array(view) {
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      uint8array[index + i] = view[i];
    }
    this.index += view.byteLength;
  }
  /**
   * Write an array of 16 bit unsigned integers.
   */
  writeUint16Array(view) {
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 2;
      uint16ToUint8(uint82, view[i]);
      uint8array[offset] = uint82[0];
      uint8array[offset + 1] = uint82[1];
    }
    this.index += view.byteLength;
  }
  /**
   * Write an array of 32 bit unsigned integers.
   */
  writeUint32Array(view) {
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 4;
      uint32ToUint8(uint82, view[i]);
      uint8array[offset] = uint82[0];
      uint8array[offset + 1] = uint82[1];
      uint8array[offset + 2] = uint82[2];
      uint8array[offset + 3] = uint82[3];
    }
    this.index += view.byteLength;
  }
  /**
   * Write an array of 32 bit floats.
   */
  writeFloat32Array(view) {
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 4;
      float32ToUint8(uint82, view[i]);
      uint8array[offset] = uint82[0];
      uint8array[offset + 1] = uint82[1];
      uint8array[offset + 2] = uint82[2];
      uint8array[offset + 3] = uint82[3];
    }
    this.index += view.byteLength;
  }
  /**
   * Write an array of 64 bit floats.
   */
  writeFloat64Array(view) {
    let index = this.index;
    let uint8array = this.uint8array;
    for (let i = 0, l = view.length; i < l; i++) {
      let offset = index + i * 8;
      float64ToUint8(uint82, view[i]);
      uint8array[offset] = uint82[0];
      uint8array[offset + 1] = uint82[1];
      uint8array[offset + 2] = uint82[2];
      uint8array[offset + 3] = uint82[3];
      uint8array[offset + 4] = uint82[4];
      uint8array[offset + 5] = uint82[5];
      uint8array[offset + 6] = uint82[6];
      uint8array[offset + 7] = uint82[7];
    }
    this.index += view.byteLength;
  }
};

// package/src/parsers/mdlx/tokenstream.ts
var TokenStream = class {
  // 6 digits after the decimal point.
  constructor(buffer2) {
    this.index = 0;
    this.ident = 0;
    this.indentSpaces = 4;
    this.precision = 1e6;
    this.buffer = buffer2 || "";
  }
  /**
   * Clear the stream from whatever buffer it had.
   */
  clear() {
    this.buffer = "";
    this.index = 0;
    this.ident = 0;
  }
  /**
   * Reads the next token in the stream.
   * Whitespaces are ignored outside of strings in the form of "".
   * Comments in the form of // are ignored.
   * Commas and colons are ignored as well.
   * Curly braces are used as separators, generally to denote text blocks.
   *
   * For example, given the following string:
   *
   *     Header "A String" {
   *         Name Value, // A Comment
   *     }
   *
   * Read will return the values in order:
   *
   *     Header
   *     "A String"
   *     {
   *     Name
   *     Value
   *     }
   *
   * There are wrappers around read, below, that help to read structured code, check them out!
   */
  readToken() {
    let buffer2 = this.buffer;
    let length = buffer2.length;
    let inComment = false;
    let inString = false;
    let token = "";
    while (this.index < length) {
      let c = buffer2[this.index++];
      if (inComment) {
        if (c === "\n") {
          inComment = false;
        }
      } else if (inString) {
        if (c === "\\") {
          token += c + buffer2[this.index++];
        } else if (c === "\n") {
          token += "\\n";
        } else if (c === "\r") {
          token += "\\r";
        } else if (c === '"') {
          return token;
        } else {
          token += c;
        }
      } else if (c === " " || c === "," || c === "	" || c === "\n" || c === ":" || c === "\r") {
        if (token.length) {
          return token;
        }
      } else if (c === "{" || c === "}") {
        if (token.length) {
          this.index--;
          return token;
        } else {
          return c;
        }
      } else if (c === "/" && buffer2[this.index] === "/") {
        if (token.length) {
          this.index--;
          return token;
        } else {
          inComment = true;
        }
      } else if (c === '"') {
        if (token.length) {
          this.index--;
          return token;
        } else {
          inString = true;
        }
      } else {
        token += c;
      }
    }
  }
  /**
   * Same as readToken, but if the end of the stream was encountered, an exception will be thrown.
   */
  read() {
    let value = this.readToken();
    if (value === void 0) {
      throw new Error("End of stream reached prematurely");
    }
    return value;
  }
  /**
   * Reads the next token without advancing the stream.
   */
  peek() {
    let index = this.index;
    let value = this.read();
    this.index = index;
    return value;
  }
  /**
   * Reads the next token, and parses it as an integer.
   */
  readInt() {
    return parseInt(this.read());
  }
  /**
   * Reads the next token, and parses it as a float.
   */
  readFloat() {
    return parseFloat(this.read());
  }
  /**
   * { Number0, Number1, ..., NumberN }
   */
  readVector(view) {
    this.read();
    for (let i = 0, l = view.length; i < l; i++) {
      view[i] = this.readFloat();
    }
    this.read();
    return view;
  }
  /**
   * {
   *     { Value1, Value2, ..., ValueSize },
   *     { Value1, Value2, ..., ValueSize },
   *     ...
   * }
   */
  readVectorsBlock(view, size) {
    this.read();
    for (let i = 0, l = view.length; i < l; i += size) {
      this.readVector(view.subarray(i, i + size));
    }
    this.read();
    return view;
  }
  /**
   * Reads a color in the form:
   *
   *      { R, G, B }
   *
   * The color is sizzled to BGR.
   */
  readColor(view) {
    this.read();
    view[2] = this.readFloat();
    view[1] = this.readFloat();
    view[0] = this.readFloat();
    this.read();
    return view;
  }
  /**
   * Helper generator for block reading.
   * Let's say we have a block like so:
   * 
   *     {
   *         Key1 Value1
   *         Key2 Value2
   *         ...
   *         KeyN ValueN
   *     }
   * 
   * The generator yields the keys one by one, and the caller needs to read the values based on the keys.
   * It is used for most MDL blocks.
   */
  *readBlock() {
    this.read();
    let token = this.read();
    while (token !== "}") {
      yield token;
      token = this.read();
    }
  }
  /**
   * Adds the given string to the buffer.
   * The current indentation level is prepended, and the stream goes to the next line after the write.
   */
  writeLine(line) {
    this.buffer += `${" ".repeat(this.ident * this.indentSpaces)}${line}
`;
  }
  /**
   * Flag,
   */
  writeFlag(flag) {
    this.writeLine(`${flag},`);
  }
  /**
   * Name Flag,
   */
  writeFlagAttrib(name, flag) {
    this.writeLine(`${name} ${flag},`);
  }
  /**
   * Name Value,
   */
  writeNumberAttrib(name, value) {
    this.writeLine(`${name} ${this.floatDecimals(value)},`);
  }
  /**
   * Name "Value",
   */
  writeStringAttrib(name, value) {
    this.writeLine(`${name} "${value}",`);
  }
  /**
   * Name { Value0, Value1, ..., ValueN }
   */
  writeVectorAttrib(name, value) {
    this.writeLine(`${name} { ${this.floatArrayDecimals(value)} },`);
  }
  /**
   * Writes a color in the form:
   *
   *      { B, G, R }
   *
   * The color is sizzled to RGB.
   * The name can be either "Color" or "static Color", depending on the context.
   */
  writeColor(name, value) {
    let b = this.floatDecimals(value[0]);
    let g = this.floatDecimals(value[1]);
    let r = this.floatDecimals(value[2]);
    this.writeLine(`${name} { ${r}, ${g}, ${b} },`);
  }
  /**
   * { Value0, Value1, ..., ValueN },
   */
  writeVector(value) {
    this.writeLine(`{ ${this.floatArrayDecimals(value)} },`);
  }
  /**
   * Name Vectors {
   *     { Value1, Value2, ..., ValueSize },
   *     { Value1, Value2, ..., ValueSize },
   *     ...
   * }
   */
  writeVectorArrayBlock(name, view, size) {
    this.startBlock(name, view.length / size);
    for (let i = 0, l = view.length; i < l; i += size) {
      this.writeVector(view.subarray(i, i + size));
    }
    this.endBlock();
  }
  /**
   * Starts a new block in the form:
   *
   *      Header1 Header2 ... HeaderN {
   *          ...
   *      }
   */
  startBlock(name, ...headers) {
    if (headers.length) {
      name = `${name} ${headers.join(" ")}`;
    }
    this.writeLine(`${name} {`);
    this.ident += 1;
  }
  /**
   * Starts a new block in the form:
   *
   *      Header "Name" {
   *          ...
   *      }
   */
  startObjectBlock(header, name) {
    this.writeLine(`${header} "${name.replace(/"/g, '\\"')}" {`);
    this.ident += 1;
  }
  /**
   * Ends a previously started block, and handles the indentation.
   */
  endBlock() {
    this.ident -= 1;
    this.writeLine("}");
  }
  /**
   * Ends a previously started block, and handles the indentation.
   * Adds a comma after the block end.
   */
  endBlockComma() {
    this.ident -= 1;
    this.writeLine("},");
  }
  /**
   * Increases the indentation level for following line writes.
   */
  indent() {
    this.ident += 1;
  }
  /**
   * Decreases the indentation level for following line writes.
   */
  unindent() {
    this.ident -= 1;
  }
  /**
  * Given a number, truncates digits after the decimal point.
  * The given precision should be in base 10.
  * E.g. for a precision of two digits after the decimal point, the precision should be 100.
  * The result is returned as a string.
  */
  floatDecimals(value) {
    return `${Math.trunc(value * this.precision) / this.precision}`;
  }
  /**
   * Uses floatDecimals on a typed array, and returns its string representation. 
   */
  floatArrayDecimals(value) {
    if (value instanceof Float32Array) {
      let array = [];
      for (let i = 0, l = value.length; i < l; i++) {
        array[i] = this.floatDecimals(value[i]);
      }
      return array.join(", ");
    } else {
      return value.join(", ");
    }
  }
};

// package/src/parsers/mdlx/extent.ts
var Extent = class {
  constructor() {
    this.boundsRadius = 0;
    this.min = new Float32Array(3);
    this.max = new Float32Array(3);
  }
  readMdx(stream) {
    this.boundsRadius = stream.readFloat32();
    stream.readFloat32Array(this.min);
    stream.readFloat32Array(this.max);
  }
  writeMdx(stream) {
    stream.writeFloat32(this.boundsRadius);
    stream.writeFloat32Array(this.min);
    stream.writeFloat32Array(this.max);
  }
  writeMdl(stream) {
    if (this.min[0] !== 0 || this.min[1] !== 0 || this.min[2] !== 0) {
      stream.writeVectorAttrib("MinimumExtent", this.min);
    }
    if (this.max[0] !== 0 || this.max[1] !== 0 || this.max[2] !== 0) {
      stream.writeVectorAttrib("MaximumExtent", this.max);
    }
    if (this.boundsRadius !== 0) {
      stream.writeNumberAttrib("BoundsRadius", this.boundsRadius);
    }
  }
};

// package/src/parsers/mdlx/sequence.ts
var Sequence = class {
  constructor() {
    this.name = "";
    this.interval = new Uint32Array(2);
    this.moveSpeed = 0;
    this.flags = 0;
    this.rarity = 0;
    this.syncPoint = 0;
    this.extent = new Extent();
  }
  readMdx(stream) {
    this.name = stream.read(80);
    stream.readUint32Array(this.interval);
    this.moveSpeed = stream.readFloat32();
    this.flags = stream.readUint32();
    this.rarity = stream.readFloat32();
    this.syncPoint = stream.readUint32();
    this.extent.readMdx(stream);
  }
  writeMdx(stream) {
    stream.skip(80 - stream.write(this.name));
    stream.writeUint32Array(this.interval);
    stream.writeFloat32(this.moveSpeed);
    stream.writeUint32(this.flags);
    stream.writeFloat32(this.rarity);
    stream.writeUint32(this.syncPoint);
    this.extent.writeMdx(stream);
  }
  readMdl(stream) {
    this.name = stream.read();
    for (let token of stream.readBlock()) {
      if (token === "Interval") {
        stream.readVector(this.interval);
      } else if (token === "NonLooping") {
        this.flags = 1;
      } else if (token === "MoveSpeed") {
        this.moveSpeed = stream.readFloat();
      } else if (token === "Rarity") {
        this.rarity = stream.readFloat();
      } else if (token === "MinimumExtent") {
        stream.readVector(this.extent.min);
      } else if (token === "MaximumExtent") {
        stream.readVector(this.extent.max);
      } else if (token === "BoundsRadius") {
        this.extent.boundsRadius = stream.readFloat();
      } else {
        throw new Error(`Unknown token in Sequence: "${token}"`);
      }
    }
  }
  writeMdl(stream) {
    stream.startObjectBlock("Anim", this.name);
    stream.writeVectorAttrib("Interval", this.interval);
    if (this.flags === 1) {
      stream.writeFlag("NonLooping");
    }
    if (this.moveSpeed !== 0) {
      stream.writeNumberAttrib("MoveSpeed", this.moveSpeed);
    }
    if (this.rarity !== 0) {
      stream.writeNumberAttrib("Rarity", this.rarity);
    }
    this.extent.writeMdl(stream);
    stream.endBlock();
  }
};

// package/src/parsers/mdlx/animations.ts
var Animation = class {
  constructor() {
    this.name = "";
    this.interpolationType = 0;
    this.globalSequenceId = -1;
    this.frames = [];
    this.values = [];
    this.inTans = [];
    this.outTans = [];
  }
  readMdx(stream, name) {
    let frames = this.frames;
    let values = this.values;
    let inTans = this.inTans;
    let outTans = this.outTans;
    let tracksCount = stream.readUint32();
    let interpolationType = stream.readUint32();
    this.name = name;
    this.interpolationType = interpolationType;
    this.globalSequenceId = stream.readInt32();
    for (let i = 0; i < tracksCount; i++) {
      frames.push(stream.readInt32());
      values.push(this.readMdxValue(stream));
      if (interpolationType > 1) {
        inTans.push(this.readMdxValue(stream));
        outTans.push(this.readMdxValue(stream));
      }
    }
  }
  writeMdx(stream) {
    let interpolationType = this.interpolationType;
    let frames = this.frames;
    let values = this.values;
    let inTans = this.inTans;
    let outTans = this.outTans;
    let tracksCount = frames.length;
    stream.writeBinary(this.name);
    stream.writeUint32(tracksCount);
    stream.writeUint32(interpolationType);
    stream.writeInt32(this.globalSequenceId);
    for (let i = 0; i < tracksCount; i++) {
      stream.writeInt32(frames[i]);
      this.writeMdxValue(stream, values[i]);
      if (interpolationType > 1) {
        this.writeMdxValue(stream, inTans[i]);
        this.writeMdxValue(stream, outTans[i]);
      }
    }
  }
  readMdl(stream, name) {
    let frames = this.frames;
    let values = this.values;
    let inTans = this.inTans;
    let outTans = this.outTans;
    this.name = name;
    let tracksCount = stream.readInt();
    stream.read();
    let interpolationType = 0;
    let token = stream.read();
    if (token === "DontInterp") {
      interpolationType = 0;
    } else if (token === "Linear") {
      interpolationType = 1;
    } else if (token === "Hermite") {
      interpolationType = 2;
    } else if (token === "Bezier") {
      interpolationType = 3;
    }
    this.interpolationType = interpolationType;
    if (stream.peek() === "GlobalSeqId") {
      stream.read();
      this.globalSequenceId = stream.readInt();
    }
    for (let i = 0; i < tracksCount; i++) {
      frames[i] = stream.readInt();
      values[i] = this.readMdlValue(stream);
      if (interpolationType > 1) {
        stream.read();
        inTans[i] = this.readMdlValue(stream);
        stream.read();
        outTans[i] = this.readMdlValue(stream);
      }
    }
    stream.read();
  }
  writeMdl(stream, name) {
    let interpolationType = this.interpolationType;
    let frames = this.frames;
    let values = this.values;
    let inTans = this.inTans;
    let outTans = this.outTans;
    let tracksCount = frames.length;
    stream.startBlock(name, this.frames.length);
    let token = "";
    if (this.interpolationType === 0) {
      token = "DontInterp";
    } else if (this.interpolationType === 1) {
      token = "Linear";
    } else if (this.interpolationType === 2) {
      token = "Hermite";
    } else if (this.interpolationType === 3) {
      token = "Bezier";
    }
    stream.writeFlag(token);
    if (this.globalSequenceId !== -1) {
      stream.writeNumberAttrib("GlobalSeqId", this.globalSequenceId);
    }
    for (let i = 0; i < tracksCount; i++) {
      this.writeMdlValue(stream, `${frames[i]}:`, values[i]);
      if (interpolationType > 1) {
        stream.indent();
        this.writeMdlValue(stream, "InTan", inTans[i]);
        this.writeMdlValue(stream, "OutTan", outTans[i]);
        stream.unindent();
      }
    }
    stream.endBlock();
  }
  getByteLength() {
    let tracksCount = this.frames.length;
    let size = 16;
    if (tracksCount) {
      let bytesPerValue = this.values[0].byteLength;
      let valuesPerTrack = 1;
      if (this.interpolationType > 1) {
        valuesPerTrack = 3;
      }
      size += (4 + valuesPerTrack * bytesPerValue) * tracksCount;
    }
    return size;
  }
};
var UintAnimation = class extends Animation {
  readMdxValue(stream) {
    return stream.readUint32Array(1);
  }
  writeMdxValue(stream, value) {
    stream.writeUint32(value[0]);
  }
  readMdlValue(stream) {
    return new Uint32Array([stream.readInt()]);
  }
  writeMdlValue(stream, name, value) {
    stream.writeNumberAttrib(name, value[0]);
  }
};
var FloatAnimation = class extends Animation {
  readMdxValue(stream) {
    return stream.readFloat32Array(1);
  }
  writeMdxValue(stream, value) {
    stream.writeFloat32(value[0]);
  }
  readMdlValue(stream) {
    return new Float32Array([stream.readFloat()]);
  }
  writeMdlValue(stream, name, value) {
    stream.writeNumberAttrib(name, value[0]);
  }
};
var Vector3Animation = class extends Animation {
  readMdxValue(stream) {
    return stream.readFloat32Array(3);
  }
  writeMdxValue(stream, value) {
    stream.writeFloat32Array(value);
  }
  readMdlValue(stream) {
    return stream.readVector(new Float32Array(3));
  }
  writeMdlValue(stream, name, value) {
    stream.writeVectorAttrib(name, value);
  }
};
var Vector4Animation = class extends Animation {
  readMdxValue(stream) {
    return stream.readFloat32Array(4);
  }
  writeMdxValue(stream, value) {
    stream.writeFloat32Array(value);
  }
  readMdlValue(stream) {
    return stream.readVector(new Float32Array(4));
  }
  writeMdlValue(stream, name, value) {
    stream.writeVectorAttrib(name, value);
  }
};

// package/src/parsers/mdlx/animationmap.ts
var animationmap_default = {
  // Layer
  KMTF: ["TextureID", UintAnimation],
  KMTA: ["Alpha", FloatAnimation],
  KMTE: ["EmissiveGain", FloatAnimation],
  KFC3: ["FresnelColor", Vector3Animation],
  KFCA: ["FresnelOpacity", FloatAnimation],
  KFTC: ["FresnelTeamColor", FloatAnimation],
  // TextureAnimation
  KTAT: ["Translation", Vector3Animation],
  KTAR: ["Rotation", Vector4Animation],
  KTAS: ["Scaling", Vector3Animation],
  // GeosetAnimation
  KGAO: ["Alpha", FloatAnimation],
  KGAC: ["Color", Vector3Animation],
  // GenericObject
  KGTR: ["Translation", Vector3Animation],
  KGRT: ["Rotation", Vector4Animation],
  KGSC: ["Scaling", Vector3Animation],
  // Light
  KLAS: ["AttenuationStart", FloatAnimation],
  KLAE: ["AttenuationEnd", FloatAnimation],
  KLAC: ["Color", Vector3Animation],
  KLAI: ["Intensity", FloatAnimation],
  KLBI: ["AmbIntensity", FloatAnimation],
  KLBC: ["AmbColor", Vector3Animation],
  KLAV: ["Visibility", FloatAnimation],
  // Attachment
  KATV: ["Visibility", FloatAnimation],
  // ParticleEmitter
  KPEE: ["EmissionRate", FloatAnimation],
  KPEG: ["Gravity", FloatAnimation],
  KPLN: ["Longitude", FloatAnimation],
  KPLT: ["Latitude", FloatAnimation],
  KPEL: ["LifeSpan", FloatAnimation],
  KPES: ["InitVelocity", FloatAnimation],
  KPEV: ["Visibility", FloatAnimation],
  // ParticleEmitter2
  KP2S: ["Speed", FloatAnimation],
  KP2R: ["Variation", FloatAnimation],
  KP2L: ["Latitude", FloatAnimation],
  KP2G: ["Gravity", FloatAnimation],
  KP2E: ["EmissionRate", FloatAnimation],
  KP2N: ["Width", FloatAnimation],
  KP2W: ["Length", FloatAnimation],
  KP2V: ["Visibility", FloatAnimation],
  // ParticleEmitterCorn
  KPPA: ["Alpha", FloatAnimation],
  KPPC: ["Color", Vector3Animation],
  KPPE: ["EmissionRate", FloatAnimation],
  KPPL: ["LifeSpan", FloatAnimation],
  KPPS: ["Speed", FloatAnimation],
  KPPV: ["Visibility", FloatAnimation],
  // RibbonEmitter
  KRHA: ["HeightAbove", FloatAnimation],
  KRHB: ["HeightBelow", FloatAnimation],
  KRAL: ["Alpha", FloatAnimation],
  KRCO: ["Color", Vector3Animation],
  KRTX: ["TextureSlot", UintAnimation],
  KRVS: ["Visibility", FloatAnimation],
  // Camera
  KCTR: ["Translation", Vector3Animation],
  KTTR: ["Translation", Vector3Animation],
  KCRL: ["Rotation", FloatAnimation]
};

// package/src/parsers/mdlx/animatedobject.ts
var AnimatedObject = class {
  constructor() {
    this.animations = [];
  }
  readAnimations(stream, size) {
    let end = stream.index + size;
    while (stream.index < end) {
      let name = stream.readBinary(4);
      let animation = new animationmap_default[name][1]();
      animation.readMdx(stream, name);
      this.animations.push(animation);
    }
  }
  writeAnimations(stream) {
    for (let animation of this.animations) {
      animation.writeMdx(stream);
    }
  }
  /**
   * A wrapper around readBlock() which merges static tokens.
   * E.g.: static Color
   * This makes the condition blocks in the parent objects linear and simple.
   */
  *readAnimatedBlock(stream) {
    for (let token of stream.readBlock()) {
      if (token === "static") {
        yield `static ${stream.read()}`;
      } else {
        yield token;
      }
    }
  }
  readAnimation(stream, name) {
    let animation = new animationmap_default[name][1]();
    animation.readMdl(stream, name);
    this.animations.push(animation);
  }
  writeAnimation(stream, name) {
    for (let animation of this.animations) {
      if (animation.name === name) {
        animation.writeMdl(stream, animationmap_default[name][0]);
        return true;
      }
    }
    return false;
  }
  /**
   * AnimatedObject itself doesn't care about versions, however objects that inherit it do.
   */
  getByteLength(version) {
    let size = 0;
    for (let animation of this.animations) {
      size += animation.getByteLength();
    }
    return size;
  }
};

// package/src/parsers/mdlx/layer.ts
var filterModeToMdx = {
  None: 0,
  Transparent: 1,
  Blend: 2,
  Additive: 3,
  AddAlpha: 4,
  Modulate: 5,
  Modulate2x: 6
};
var filterModeToMdl = {
  0: "None",
  1: "Transparent",
  2: "Blend",
  3: "Additive",
  4: "AddAlpha",
  5: "Modulate",
  6: "Modulate2x"
};
var Layer = class extends AnimatedObject {
  constructor() {
    super(...arguments);
    this.filterMode = 0;
    this.flags = 0;
    this.textureId = -1;
    this.textureAnimationId = -1;
    this.coordId = 0;
    this.alpha = 1;
    /** 
     * @since 900
     */
    this.emissiveGain = 1;
    /** 
     * @since 1000
     */
    this.fresnelColor = new Float32Array([1, 1, 1]);
    /** 
     * @since 1000
     */
    this.fresnelOpacity = 0;
    /** 
     * @since 1000
     */
    this.fresnelTeamColor = 0;
  }
  readMdx(stream, version) {
    const start = stream.index;
    const size = stream.readUint32();
    this.filterMode = stream.readUint32();
    this.flags = stream.readUint32();
    this.textureId = stream.readInt32();
    this.textureAnimationId = stream.readInt32();
    this.coordId = stream.readUint32();
    this.alpha = stream.readFloat32();
    if (version > 800) {
      this.emissiveGain = stream.readFloat32();
      stream.readFloat32Array(this.fresnelColor);
      this.fresnelOpacity = stream.readFloat32();
      this.fresnelTeamColor = stream.readFloat32();
    }
    this.readAnimations(stream, size - (stream.index - start));
  }
  writeMdx(stream, version) {
    stream.writeUint32(this.getByteLength(version));
    stream.writeUint32(this.filterMode);
    stream.writeUint32(this.flags);
    stream.writeInt32(this.textureId);
    stream.writeInt32(this.textureAnimationId);
    stream.writeUint32(this.coordId);
    stream.writeFloat32(this.alpha);
    if (version > 800) {
      stream.writeFloat32(this.emissiveGain);
      stream.writeFloat32Array(this.fresnelColor);
      stream.writeFloat32(this.fresnelOpacity);
      stream.writeFloat32(this.fresnelTeamColor);
    }
    this.writeAnimations(stream);
  }
  readMdl(stream) {
    for (let token of super.readAnimatedBlock(stream)) {
      if (token === "FilterMode") {
        this.filterMode = filterModeToMdx[stream.read()];
      } else if (token === "Unshaded") {
        this.flags |= 1;
      } else if (token === "SphereEnvMap") {
        this.flags |= 2;
      } else if (token === "TwoSided") {
        this.flags |= 16;
      } else if (token === "Unfogged") {
        this.flags |= 32;
      } else if (token === "NoDepthTest") {
        this.flags |= 64;
      } else if (token === "NoDepthSet") {
        this.flags |= 128;
      } else if (token === "Unlit") {
        this.flags |= 256;
      } else if (token === "static TextureID") {
        this.textureId = stream.readInt();
      } else if (token === "TextureID") {
        this.readAnimation(stream, "KMTF");
      } else if (token === "TVertexAnimId") {
        this.textureAnimationId = stream.readInt();
      } else if (token === "CoordId") {
        this.coordId = stream.readInt();
      } else if (token === "static Alpha") {
        this.alpha = stream.readFloat();
      } else if (token === "Alpha") {
        this.readAnimation(stream, "KMTA");
      } else if (token === "static EmissiveGain") {
        this.emissiveGain = stream.readFloat();
      } else if (token === "EmissiveGain") {
        this.readAnimation(stream, "KMTE");
      } else if (token === "static FresnelColor") {
        stream.readVector(this.fresnelColor);
      } else if (token === "FresnelColor") {
        this.readAnimation(stream, "KFC3");
      } else if (token === "static FresnelOpacity") {
        this.fresnelOpacity = stream.readFloat();
      } else if (token === "FresnelOpacity") {
        this.readAnimation(stream, "KFCA");
      } else if (token === "static FresnelTeamColor") {
        this.fresnelTeamColor = stream.readFloat();
      } else if (token === "FresnelTeamColor") {
        this.readAnimation(stream, "KFTC");
      } else {
        throw new Error(`Unknown token in Layer: "${token}"`);
      }
    }
  }
  writeMdl(stream, version) {
    stream.startBlock("Layer");
    stream.writeFlagAttrib("FilterMode", filterModeToMdl[this.filterMode]);
    if (this.flags & 1) {
      stream.writeFlag("Unshaded");
    }
    if (this.flags & 2) {
      stream.writeFlag("SphereEnvMap");
    }
    if (this.flags & 16) {
      stream.writeFlag("TwoSided");
    }
    if (this.flags & 32) {
      stream.writeFlag("Unfogged");
    }
    if (this.flags & 64) {
      stream.writeFlag("NoDepthTest");
    }
    if (this.flags & 128) {
      stream.writeFlag("NoDepthSet");
    }
    if (version > 800) {
      if (this.flags & 256) {
        stream.writeFlag("Unlit");
      }
    }
    if (!this.writeAnimation(stream, "KMTF")) {
      stream.writeNumberAttrib("static TextureID", this.textureId);
    }
    if (this.textureAnimationId !== -1) {
      stream.writeNumberAttrib("TVertexAnimId", this.textureAnimationId);
    }
    if (this.coordId !== 0) {
      stream.writeNumberAttrib("CoordId", this.coordId);
    }
    if (!this.writeAnimation(stream, "KMTA") && this.alpha !== 1) {
      stream.writeNumberAttrib("static Alpha", this.alpha);
    }
    if (version > 800) {
      if (!this.writeAnimation(stream, "KMTE") && this.emissiveGain !== 1) {
        stream.writeNumberAttrib("static EmissiveGain", this.emissiveGain);
      }
      if (!this.writeAnimation(stream, "KFC3") && (this.fresnelColor[0] !== 1 || this.fresnelColor[1] !== 1 || this.fresnelColor[2] !== 1)) {
        stream.writeVectorAttrib("static FresnelColor", this.fresnelColor);
      }
      if (!this.writeAnimation(stream, "KFCA") && this.fresnelOpacity !== 0) {
        stream.writeNumberAttrib("static FresnelOpacity", this.fresnelOpacity);
      }
      if (!this.writeAnimation(stream, "KFTC") && this.fresnelTeamColor !== 0) {
        stream.writeNumberAttrib("static FresnelTeamColor", this.fresnelTeamColor);
      }
    }
    stream.endBlock();
  }
  getByteLength(version) {
    let size = 28 + super.getByteLength();
    if (version > 800) {
      size += 24;
    }
    return size;
  }
};

// package/src/parsers/mdlx/material.ts
var Material = class {
  constructor() {
    this.priorityPlane = 0;
    this.flags = 0;
    /** 
     * @since 900
     */
    this.shader = "";
    this.layers = [];
  }
  readMdx(stream, version) {
    stream.readUint32();
    this.priorityPlane = stream.readInt32();
    this.flags = stream.readUint32();
    if (version > 800) {
      this.shader = stream.read(80);
    }
    stream.skip(4);
    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let layer = new Layer();
      layer.readMdx(stream, version);
      this.layers.push(layer);
    }
  }
  writeMdx(stream, version) {
    stream.writeUint32(this.getByteLength(version));
    stream.writeInt32(this.priorityPlane);
    stream.writeUint32(this.flags);
    if (version > 800) {
      stream.skip(80 - stream.write(this.shader));
    }
    stream.writeBinary("LAYS");
    stream.writeUint32(this.layers.length);
    for (let layer of this.layers) {
      layer.writeMdx(stream, version);
    }
  }
  readMdl(stream) {
    for (let token of stream.readBlock()) {
      if (token === "ConstantColor") {
        this.flags |= 1;
      } else if (token === "TwoSided") {
        this.flags |= 2;
      } else if (token === "SortPrimsNearZ") {
        this.flags |= 8;
      } else if (token === "SortPrimsFarZ") {
        this.flags |= 16;
      } else if (token === "FullResolution") {
        this.flags |= 32;
      } else if (token === "PriorityPlane") {
        this.priorityPlane = stream.readInt();
      } else if (token === "Shader") {
        this.shader = stream.read();
      } else if (token === "Layer") {
        let layer = new Layer();
        layer.readMdl(stream);
        this.layers.push(layer);
      } else {
        throw new Error(`Unknown token in Material: "${token}"`);
      }
    }
  }
  writeMdl(stream, version) {
    stream.startBlock("Material");
    if (this.flags & 1) {
      stream.writeFlag("ConstantColor");
    }
    if (version > 800) {
      if (this.flags & 2) {
        stream.writeFlag("TwoSided");
      }
    }
    if (this.flags & 8) {
      stream.writeFlag("SortPrimsNearZ");
    }
    if (this.flags & 16) {
      stream.writeFlag("SortPrimsFarZ");
    }
    if (this.flags & 32) {
      stream.writeFlag("FullResolution");
    }
    if (this.priorityPlane !== 0) {
      stream.writeNumberAttrib("PriorityPlane", this.priorityPlane);
    }
    if (version > 800) {
      stream.writeStringAttrib("Shader", this.shader);
    }
    for (let layer of this.layers) {
      layer.writeMdl(stream, version);
    }
    stream.endBlock();
  }
  getByteLength(version) {
    let size = 20;
    if (version > 800) {
      size += 80;
    }
    for (let layer of this.layers) {
      size += layer.getByteLength(version);
    }
    return size;
  }
};

// package/src/parsers/mdlx/texture.ts
var Texture = class {
  constructor() {
    this.replaceableId = 0;
    this.path = "";
    this.flags = 0;
  }
  readMdx(stream) {
    this.replaceableId = stream.readUint32();
    this.path = stream.read(260);
    this.flags = stream.readUint32();
  }
  writeMdx(stream) {
    stream.writeUint32(this.replaceableId);
    stream.skip(260 - stream.write(this.path));
    stream.writeUint32(this.flags);
  }
  readMdl(stream) {
    for (let token of stream.readBlock()) {
      if (token === "Image") {
        this.path = stream.read();
      } else if (token === "ReplaceableId") {
        this.replaceableId = stream.readInt();
      } else if (token === "WrapWidth") {
        this.flags |= 1;
      } else if (token === "WrapHeight") {
        this.flags |= 2;
      } else {
        throw new Error(`Unknown token in Texture: "${token}"`);
      }
    }
  }
  writeMdl(stream) {
    stream.startBlock("Bitmap");
    if (this.path.length) {
      stream.writeStringAttrib("Image", this.path);
    }
    if (this.replaceableId !== 0) {
      stream.writeNumberAttrib("ReplaceableId", this.replaceableId);
    }
    if (this.flags & 1) {
      stream.writeFlag(`WrapWidth`);
    }
    if (this.flags & 2) {
      stream.writeFlag(`WrapHeight`);
    }
    stream.endBlock();
  }
};

// package/src/parsers/mdlx/textureanimation.ts
var TextureAnimation = class extends AnimatedObject {
  readMdx(stream) {
    let size = stream.readUint32();
    this.readAnimations(stream, size - 4);
  }
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());
    this.writeAnimations(stream);
  }
  readMdl(stream) {
    for (let token of stream.readBlock()) {
      if (token === "Translation") {
        this.readAnimation(stream, "KTAT");
      } else if (token === "Rotation") {
        this.readAnimation(stream, "KTAR");
      } else if (token === "Scaling") {
        this.readAnimation(stream, "KTAS");
      } else {
        throw new Error(`Unknown token in TextureAnimation: "${token}"`);
      }
    }
  }
  writeMdl(stream) {
    stream.startBlock("TVertexAnim ");
    this.writeAnimation(stream, "KTAT");
    this.writeAnimation(stream, "KTAR");
    this.writeAnimation(stream, "KTAS");
    stream.endBlock();
  }
  getByteLength() {
    return 4 + super.getByteLength();
  }
};

// package/src/parsers/mdlx/geoset.ts
var Geoset = class {
  constructor() {
    this.vertices = new Float32Array(0);
    this.normals = new Float32Array(0);
    this.faceTypeGroups = new Uint32Array(0);
    this.faceGroups = new Uint32Array(0);
    this.faces = new Uint16Array(0);
    this.vertexGroups = new Uint8Array(0);
    this.matrixGroups = new Uint32Array(0);
    this.matrixIndices = new Uint32Array(0);
    this.materialId = 0;
    this.selectionGroup = 0;
    this.selectionFlags = 0;
    /** 
     * @since 900
     */
    this.lod = -1;
    /** 
     * @since 900
     */
    this.lodName = "";
    this.extent = new Extent();
    this.sequenceExtents = [];
    /** 
     * @since 900
     */
    this.tangents = new Float32Array(0);
    /**
     * An array of bone indices and weights.
     * Every 8 consecutive elements describe the following:
     *    [B0, B1, B2, B3, W0, W1, W2, W3]
     * Where:
     *     Bn is a bone index.
     *     Wn is a weight, which can be normalized with Wn/255.
     *
     * @since 900
     */
    this.skin = new Uint8Array(0);
    this.uvSets = [];
  }
  readMdx(stream, version) {
    stream.readUint32();
    stream.skip(4);
    this.vertices = stream.readFloat32Array(stream.readUint32() * 3);
    stream.skip(4);
    this.normals = stream.readFloat32Array(stream.readUint32() * 3);
    stream.skip(4);
    this.faceTypeGroups = stream.readUint32Array(stream.readUint32());
    stream.skip(4);
    this.faceGroups = stream.readUint32Array(stream.readUint32());
    stream.skip(4);
    this.faces = stream.readUint16Array(stream.readUint32());
    stream.skip(4);
    this.vertexGroups = stream.readUint8Array(stream.readUint32());
    stream.skip(4);
    this.matrixGroups = stream.readUint32Array(stream.readUint32());
    stream.skip(4);
    this.matrixIndices = stream.readUint32Array(stream.readUint32());
    this.materialId = stream.readUint32();
    this.selectionGroup = stream.readUint32();
    this.selectionFlags = stream.readUint32();
    if (version > 800) {
      this.lod = stream.readInt32();
      this.lodName = stream.read(80);
    }
    this.extent.readMdx(stream);
    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let extent = new Extent();
      extent.readMdx(stream);
      this.sequenceExtents.push(extent);
    }
    if (version > 800) {
      if (stream.readBinary(4) === "TANG") {
        this.tangents = stream.readFloat32Array(stream.readUint32() * 4);
      } else {
        stream.skip(-4);
      }
      if (stream.readBinary(4) === "SKIN") {
        this.skin = stream.readUint8Array(stream.readUint32());
      } else {
        stream.skip(-4);
      }
    }
    stream.skip(4);
    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      stream.skip(4);
      this.uvSets.push(stream.readFloat32Array(stream.readUint32() * 2));
    }
  }
  writeMdx(stream, version) {
    stream.writeUint32(this.getByteLength(version));
    stream.writeBinary("VRTX");
    stream.writeUint32(this.vertices.length / 3);
    stream.writeFloat32Array(this.vertices);
    stream.writeBinary("NRMS");
    stream.writeUint32(this.normals.length / 3);
    stream.writeFloat32Array(this.normals);
    stream.writeBinary("PTYP");
    stream.writeUint32(this.faceTypeGroups.length);
    stream.writeUint32Array(this.faceTypeGroups);
    stream.writeBinary("PCNT");
    stream.writeUint32(this.faceGroups.length);
    stream.writeUint32Array(this.faceGroups);
    stream.writeBinary("PVTX");
    stream.writeUint32(this.faces.length);
    stream.writeUint16Array(this.faces);
    stream.writeBinary("GNDX");
    stream.writeUint32(this.vertexGroups.length);
    stream.writeUint8Array(this.vertexGroups);
    stream.writeBinary("MTGC");
    stream.writeUint32(this.matrixGroups.length);
    stream.writeUint32Array(this.matrixGroups);
    stream.writeBinary("MATS");
    stream.writeUint32(this.matrixIndices.length);
    stream.writeUint32Array(this.matrixIndices);
    stream.writeUint32(this.materialId);
    stream.writeUint32(this.selectionGroup);
    stream.writeUint32(this.selectionFlags);
    if (version > 800) {
      stream.writeInt32(this.lod);
      stream.skip(80 - stream.write(this.lodName));
    }
    this.extent.writeMdx(stream);
    stream.writeUint32(this.sequenceExtents.length);
    for (let sequenceExtent of this.sequenceExtents) {
      sequenceExtent.writeMdx(stream);
    }
    if (version > 800) {
      if (this.tangents.length) {
        stream.writeBinary("TANG");
        stream.writeUint32(this.tangents.length / 4);
        stream.writeFloat32Array(this.tangents);
      }
      if (this.skin.length) {
        stream.writeBinary("SKIN");
        stream.writeUint32(this.skin.length);
        stream.writeUint8Array(this.skin);
      }
    }
    stream.writeBinary("UVAS");
    stream.writeUint32(this.uvSets.length);
    for (let uvSet of this.uvSets) {
      stream.writeBinary("UVBS");
      stream.writeUint32(uvSet.length / 2);
      stream.writeFloat32Array(uvSet);
    }
  }
  readMdl(stream) {
    for (let token of stream.readBlock()) {
      if (token === "Vertices") {
        this.vertices = stream.readVectorsBlock(new Float32Array(stream.readInt() * 3), 3);
      } else if (token === "Normals") {
        this.normals = stream.readVectorsBlock(new Float32Array(stream.readInt() * 3), 3);
      } else if (token === "TVertices") {
        this.uvSets.push(stream.readVectorsBlock(new Float32Array(stream.readInt() * 2), 2));
      } else if (token === "VertexGroup") {
        let vertexGroups = [];
        for (let vertexGroup of stream.readBlock()) {
          vertexGroups.push(parseInt(vertexGroup));
        }
        this.vertexGroups = new Uint8Array(vertexGroups);
      } else if (token === "Tangents") {
        this.tangents = stream.readVectorsBlock(new Float32Array(stream.readInt() * 4), 4);
      } else if (token === "SkinWeights") {
        this.skin = stream.readVector(new Uint8Array(stream.readInt() * 8));
      } else if (token === "Faces") {
        this.faceTypeGroups = new Uint32Array([4]);
        let vectors = stream.readInt();
        let count = stream.readInt();
        stream.read();
        stream.read();
        this.faces = stream.readVectorsBlock(new Uint16Array(count), count / vectors);
        this.faceGroups = new Uint32Array([count]);
        stream.read();
      } else if (token === "Groups") {
        let indices = [];
        let groups = [];
        stream.readInt();
        stream.readInt();
        for (let _ of stream.readBlock()) {
          let size = 0;
          for (let index of stream.readBlock()) {
            indices.push(parseInt(index));
            size += 1;
          }
          groups.push(size);
        }
        this.matrixIndices = new Uint32Array(indices);
        this.matrixGroups = new Uint32Array(groups);
      } else if (token === "MinimumExtent") {
        stream.readVector(this.extent.min);
      } else if (token === "MaximumExtent") {
        stream.readVector(this.extent.max);
      } else if (token === "BoundsRadius") {
        this.extent.boundsRadius = stream.readFloat();
      } else if (token === "Anim") {
        let extent = new Extent();
        for (token of stream.readBlock()) {
          if (token === "MinimumExtent") {
            stream.readVector(extent.min);
          } else if (token === "MaximumExtent") {
            stream.readVector(extent.max);
          } else if (token === "BoundsRadius") {
            extent.boundsRadius = stream.readFloat();
          }
        }
        this.sequenceExtents.push(extent);
      } else if (token === "MaterialID") {
        this.materialId = stream.readInt();
      } else if (token === "SelectionGroup") {
        this.selectionGroup = stream.readInt();
      } else if (token === "Unselectable") {
        this.selectionFlags = 4;
      } else if (token === "LevelOfDetail") {
        this.lod = stream.readInt();
      } else if (token === "Name") {
        this.lodName = stream.read();
      } else {
        throw new Error(`Unknown token in Geoset: "${token}"`);
      }
    }
  }
  writeMdl(stream, version) {
    stream.startBlock("Geoset");
    stream.writeVectorArrayBlock("Vertices", this.vertices, 3);
    stream.writeVectorArrayBlock("Normals", this.normals, 3);
    for (let uvSet of this.uvSets) {
      stream.writeVectorArrayBlock("TVertices", uvSet, 2);
    }
    if (version > 800 && this.tangents.length) {
      stream.writeVectorArrayBlock("Tangents", this.tangents, 4);
    }
    if (this.vertexGroups.length) {
      stream.startBlock("VertexGroup");
      for (let i = 0, l = this.vertexGroups.length; i < l; i++) {
        stream.writeLine(`${this.vertexGroups[i]},`);
      }
      stream.endBlock();
    }
    if (version > 800 && this.skin.length) {
      stream.startBlock("SkinWeights", this.skin.length / 8);
      for (let i = 0, l = this.skin.length; i < l; i += 8) {
        stream.writeLine(`${this.skin.subarray(i, i + 8).join(", ")},`);
      }
      stream.endBlock();
    }
    stream.startBlock("Faces", 1, this.faces.length);
    stream.startBlock("Triangles");
    stream.writeVector(this.faces);
    stream.endBlock();
    stream.endBlock();
    stream.startBlock("Groups", this.matrixGroups.length, this.matrixIndices.length);
    let index = 0;
    for (let groupSize of this.matrixGroups) {
      stream.writeVectorAttrib("Matrices", this.matrixIndices.subarray(index, index + groupSize));
      index += groupSize;
    }
    stream.endBlock();
    this.extent.writeMdl(stream);
    for (let sequenceExtent of this.sequenceExtents) {
      stream.startBlock("Anim");
      sequenceExtent.writeMdl(stream);
      stream.endBlock();
    }
    stream.writeNumberAttrib("MaterialID", this.materialId);
    stream.writeNumberAttrib("SelectionGroup", this.selectionGroup);
    if (this.selectionFlags === 4) {
      stream.writeFlag("Unselectable");
    }
    if (version > 800) {
      stream.writeNumberAttrib("LevelOfDetail", this.lod);
      if (this.lodName.length) {
        stream.writeStringAttrib("Name", this.lodName);
      }
    }
    stream.endBlock();
  }
  getByteLength(version) {
    let size = 120 + this.vertices.byteLength + this.normals.byteLength + this.faceTypeGroups.byteLength + this.faceGroups.byteLength + this.faces.byteLength + this.vertexGroups.byteLength + this.matrixGroups.byteLength + this.matrixIndices.byteLength + this.sequenceExtents.length * 28;
    if (version > 800) {
      size += 84;
      if (this.tangents.length) {
        size += 8 + this.tangents.byteLength;
      }
      if (this.skin.length) {
        size += 8 + this.skin.byteLength;
      }
    }
    for (let uvSet of this.uvSets) {
      size += 8 + uvSet.byteLength;
    }
    return size;
  }
};

// package/src/parsers/mdlx/geosetanimation.ts
var GeosetAnimation = class extends AnimatedObject {
  constructor() {
    super(...arguments);
    this.alpha = 1;
    this.flags = 0;
    this.color = new Float32Array([1, 1, 1]);
    this.geosetId = -1;
  }
  readMdx(stream) {
    let size = stream.readUint32();
    this.alpha = stream.readFloat32();
    this.flags = stream.readUint32();
    stream.readFloat32Array(this.color);
    this.geosetId = stream.readInt32();
    this.readAnimations(stream, size - 28);
  }
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());
    stream.writeFloat32(this.alpha);
    stream.writeUint32(this.flags);
    stream.writeFloat32Array(this.color);
    stream.writeInt32(this.geosetId);
    this.writeAnimations(stream);
  }
  readMdl(stream) {
    for (let token of super.readAnimatedBlock(stream)) {
      if (token === "DropShadow") {
        this.flags |= 1;
      } else if (token === "static Alpha") {
        this.alpha = stream.readFloat();
      } else if (token === "Alpha") {
        this.readAnimation(stream, "KGAO");
      } else if (token === "static Color") {
        this.flags |= 2;
        stream.readColor(this.color);
      } else if (token === "Color") {
        this.flags |= 2;
        this.readAnimation(stream, "KGAC");
      } else if (token === "GeosetId") {
        this.geosetId = stream.readInt();
      } else {
        throw new Error(`Unknown token in GeosetAnimation: "${token}"`);
      }
    }
  }
  writeMdl(stream) {
    stream.startBlock("GeosetAnim");
    if (this.flags & 1) {
      stream.writeFlag("DropShadow");
    }
    if (!this.writeAnimation(stream, "KGAO")) {
      stream.writeNumberAttrib("static Alpha", this.alpha);
    }
    if (this.flags & 2) {
      if (!this.writeAnimation(stream, "KGAC") && (this.color[0] !== 1 || this.color[1] !== 1 || this.color[2] !== 1)) {
        stream.writeColor("static Color ", this.color);
      }
    }
    stream.writeNumberAttrib("GeosetId", this.geosetId);
    stream.endBlock();
  }
  getByteLength() {
    return 28 + super.getByteLength();
  }
};

// package/src/parsers/mdlx/genericobject.ts
var GenericObject = class extends AnimatedObject {
  constructor(flags = 0) {
    super();
    this.name = "";
    this.objectId = -1;
    this.parentId = -1;
    this.flags = flags;
  }
  readMdx(stream) {
    let size = stream.readUint32();
    this.name = stream.read(80);
    this.objectId = stream.readInt32();
    this.parentId = stream.readInt32();
    this.flags = stream.readUint32();
    this.readAnimations(stream, size - 96);
  }
  writeMdx(stream) {
    stream.writeUint32(this.getGenericByteLength());
    stream.skip(80 - stream.write(this.name));
    stream.writeInt32(this.objectId);
    stream.writeInt32(this.parentId);
    stream.writeUint32(this.flags);
    for (let animation of this.eachAnimation(true)) {
      animation.writeMdx(stream);
    }
  }
  writeNonGenericAnimationChunks(stream) {
    for (let animation of this.eachAnimation(false)) {
      animation.writeMdx(stream);
    }
  }
  *readGenericBlock(stream) {
    this.name = stream.read();
    for (let token of this.readAnimatedBlock(stream)) {
      if (token === "ObjectId") {
        this.objectId = stream.readInt();
      } else if (token === "Parent") {
        this.parentId = stream.readInt();
      } else if (token === "BillboardedLockZ") {
        this.flags |= 64;
      } else if (token === "BillboardedLockY") {
        this.flags |= 32;
      } else if (token === "BillboardedLockX") {
        this.flags |= 16;
      } else if (token === "Billboarded") {
        this.flags |= 8;
      } else if (token === "CameraAnchored") {
        this.flags |= 128;
      } else if (token === "DontInherit") {
        for (token of stream.readBlock()) {
          if (token === "Rotation") {
            this.flags |= 2;
          } else if (token === "Translation") {
            this.flags |= 1;
          } else if (token === "Scaling") {
            this.flags |= 4;
          }
        }
      } else if (token === "Translation") {
        this.readAnimation(stream, "KGTR");
      } else if (token === "Rotation") {
        this.readAnimation(stream, "KGRT");
      } else if (token === "Scaling") {
        this.readAnimation(stream, "KGSC");
      } else {
        yield token;
      }
    }
  }
  writeGenericHeader(stream) {
    stream.writeNumberAttrib("ObjectId", this.objectId);
    if (this.parentId !== -1) {
      stream.writeNumberAttrib("Parent", this.parentId);
    }
    if (this.flags & 64) {
      stream.writeFlag("BillboardedLockZ");
    }
    if (this.flags & 32) {
      stream.writeFlag("BillboardedLockY");
    }
    if (this.flags & 16) {
      stream.writeFlag("BillboardedLockX");
    }
    if (this.flags & 8) {
      stream.writeFlag("Billboarded");
    }
    if (this.flags & 128) {
      stream.writeFlag("CameraAnchored");
    }
    if (this.flags & 2) {
      stream.writeFlag(`DontInherit { Rotation }`);
    }
    if (this.flags & 1) {
      stream.writeFlag(`DontInherit { Translation }`);
    }
    if (this.flags & 4) {
      stream.writeFlag(`DontInherit { Scaling }`);
    }
  }
  writeGenericAnimations(stream) {
    this.writeAnimation(stream, "KGTR");
    this.writeAnimation(stream, "KGRT");
    this.writeAnimation(stream, "KGSC");
  }
  /**
   * Allows to easily iterate either the GenericObject animations or the parent object animations.
   */
  *eachAnimation(wantGeneric) {
    for (let animation of this.animations) {
      let name = animation.name;
      let isGeneric = name === "KGTR" || name === "KGRT" || name === "KGSC";
      if (wantGeneric && isGeneric || !wantGeneric && !isGeneric) {
        yield animation;
      }
    }
  }
  /**
   * Gets the byte length of the GenericObject part of whatever this object this.
   * 
   * This is needed because only the KGTR, KGRT, and KGSC animations actually belong to it.
   */
  getGenericByteLength() {
    let size = 96;
    for (let animation of this.eachAnimation(true)) {
      size += animation.getByteLength();
    }
    return size;
  }
  getByteLength() {
    return 96 + super.getByteLength();
  }
};

// package/src/parsers/mdlx/bone.ts
var Bone = class extends GenericObject {
  constructor() {
    super(256);
    this.geosetId = -1;
    this.geosetAnimationId = -1;
  }
  readMdx(stream) {
    super.readMdx(stream);
    this.geosetId = stream.readInt32();
    this.geosetAnimationId = stream.readInt32();
  }
  writeMdx(stream) {
    super.writeMdx(stream);
    stream.writeInt32(this.geosetId);
    stream.writeInt32(this.geosetAnimationId);
  }
  readMdl(stream) {
    for (let token of super.readGenericBlock(stream)) {
      if (token === "GeosetId") {
        token = stream.read();
        if (token === "Multiple") {
          this.geosetId = -1;
        } else {
          this.geosetId = parseInt(token);
        }
      } else if (token === "GeosetAnimId") {
        token = stream.read();
        if (token === "None") {
          this.geosetAnimationId = -1;
        } else {
          this.geosetAnimationId = parseInt(token);
        }
      } else {
        throw new Error(`Unknown token in Bone ${this.name}: "${token}"`);
      }
    }
  }
  writeMdl(stream) {
    stream.startObjectBlock("Bone", this.name);
    this.writeGenericHeader(stream);
    if (this.geosetId === -1) {
      stream.writeFlagAttrib("GeosetId", "Multiple");
    } else {
      stream.writeNumberAttrib("GeosetId", this.geosetId);
    }
    if (this.geosetAnimationId === -1) {
      stream.writeFlagAttrib("GeosetAnimId", "None");
    } else {
      stream.writeNumberAttrib("GeosetAnimId", this.geosetAnimationId);
    }
    this.writeGenericAnimations(stream);
    stream.endBlock();
  }
  getByteLength() {
    return 8 + super.getByteLength();
  }
};

// package/src/parsers/mdlx/light.ts
var Light = class extends GenericObject {
  constructor() {
    super(512);
    this.type = -1;
    this.attenuation = new Float32Array(2);
    this.color = new Float32Array(3);
    this.intensity = 0;
    this.ambientColor = new Float32Array(3);
    this.ambientIntensity = 0;
  }
  readMdx(stream) {
    const start = stream.index;
    const size = stream.readUint32();
    super.readMdx(stream);
    this.type = stream.readUint32();
    stream.readFloat32Array(this.attenuation);
    stream.readFloat32Array(this.color);
    this.intensity = stream.readFloat32();
    stream.readFloat32Array(this.ambientColor);
    this.ambientIntensity = stream.readFloat32();
    this.readAnimations(stream, size - (stream.index - start));
  }
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());
    super.writeMdx(stream);
    stream.writeUint32(this.type);
    stream.writeFloat32Array(this.attenuation);
    stream.writeFloat32Array(this.color);
    stream.writeFloat32(this.intensity);
    stream.writeFloat32Array(this.ambientColor);
    stream.writeFloat32(this.ambientIntensity);
    this.writeNonGenericAnimationChunks(stream);
  }
  readMdl(stream) {
    for (let token of super.readGenericBlock(stream)) {
      if (token === "Omnidirectional") {
        this.type = 0;
      } else if (token === "Directional") {
        this.type = 1;
      } else if (token === "Ambient") {
        this.type = 2;
      } else if (token === "static AttenuationStart") {
        this.attenuation[0] = stream.readFloat();
      } else if (token === "AttenuationStart") {
        this.readAnimation(stream, "KLAS");
      } else if (token === "static AttenuationEnd") {
        this.attenuation[1] = stream.readFloat();
      } else if (token === "AttenuationEnd") {
        this.readAnimation(stream, "KLAE");
      } else if (token === "static Intensity") {
        this.intensity = stream.readFloat();
      } else if (token === "Intensity") {
        this.readAnimation(stream, "KLAI");
      } else if (token === "static Color") {
        stream.readColor(this.color);
      } else if (token === "Color") {
        this.readAnimation(stream, "KLAC");
      } else if (token === "static AmbIntensity") {
        this.ambientIntensity = stream.readFloat();
      } else if (token === "AmbIntensity") {
        this.readAnimation(stream, "KLBI");
      } else if (token === "static AmbColor") {
        stream.readColor(this.ambientColor);
      } else if (token === "AmbColor") {
        this.readAnimation(stream, "KLBC");
      } else if (token === "Visibility") {
        this.readAnimation(stream, "KLAV");
      } else {
        throw new Error(`Unknown token in Light: "${token}"`);
      }
    }
  }
  writeMdl(stream) {
    stream.startObjectBlock("Light", this.name);
    this.writeGenericHeader(stream);
    if (this.type === 0) {
      stream.writeFlag("Omnidirectional");
    } else if (this.type === 1) {
      stream.writeFlag("Directional");
    } else if (this.type === 2) {
      stream.writeFlag("Ambient");
    }
    if (!this.writeAnimation(stream, "KLAS")) {
      stream.writeNumberAttrib("static AttenuationStart", this.attenuation[0]);
    }
    if (!this.writeAnimation(stream, "KLAE")) {
      stream.writeNumberAttrib("static AttenuationEnd", this.attenuation[1]);
    }
    if (!this.writeAnimation(stream, "KLAI")) {
      stream.writeNumberAttrib("static Intensity", this.intensity);
    }
    if (!this.writeAnimation(stream, "KLAC")) {
      stream.writeColor("static Color", this.color);
    }
    if (!this.writeAnimation(stream, "KLBI")) {
      stream.writeNumberAttrib("static AmbIntensity", this.ambientIntensity);
    }
    if (!this.writeAnimation(stream, "KLBC")) {
      stream.writeColor("static AmbColor", this.ambientColor);
    }
    this.writeAnimation(stream, "KLAV");
    this.writeGenericAnimations(stream);
    stream.endBlock();
  }
  getByteLength() {
    return 48 + super.getByteLength();
  }
};

// package/src/parsers/mdlx/helper.ts
var Helper = class extends GenericObject {
  readMdl(stream) {
    for (let token of super.readGenericBlock(stream)) {
      throw new Error(`Unknown token in Helper: "${token}"`);
    }
  }
  writeMdl(stream) {
    stream.startObjectBlock("Helper", this.name);
    this.writeGenericHeader(stream);
    this.writeGenericAnimations(stream);
    stream.endBlock();
  }
};

// package/src/parsers/mdlx/attachment.ts
var Attachment = class extends GenericObject {
  constructor() {
    super(2048);
    this.path = "";
    this.attachmentId = 0;
  }
  readMdx(stream) {
    const start = stream.index;
    const size = stream.readUint32();
    super.readMdx(stream);
    this.path = stream.read(260);
    this.attachmentId = stream.readInt32();
    this.readAnimations(stream, size - (stream.index - start));
  }
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());
    super.writeMdx(stream);
    stream.skip(260 - stream.write(this.path));
    stream.writeInt32(this.attachmentId);
    this.writeNonGenericAnimationChunks(stream);
  }
  readMdl(stream) {
    for (let token of super.readGenericBlock(stream)) {
      if (token === "AttachmentID") {
        this.attachmentId = stream.readInt();
      } else if (token === "Path") {
        this.path = stream.read();
      } else if (token === "Visibility") {
        this.readAnimation(stream, "KATV");
      } else {
        throw new Error(`Unknown token in Attachment ${this.name}: "${token}"`);
      }
    }
  }
  writeMdl(stream) {
    stream.startObjectBlock("Attachment", this.name);
    this.writeGenericHeader(stream);
    stream.writeNumberAttrib("AttachmentID", this.attachmentId);
    if (this.path.length) {
      stream.writeStringAttrib("Path", this.path);
    }
    this.writeAnimation(stream, "KATV");
    this.writeGenericAnimations(stream);
    stream.endBlock();
  }
  getByteLength() {
    return 268 + super.getByteLength();
  }
};

// package/src/parsers/mdlx/particleemitter.ts
var ParticleEmitter = class extends GenericObject {
  constructor() {
    super(4096);
    this.emissionRate = 0;
    this.gravity = 0;
    this.longitude = 0;
    this.latitude = 0;
    this.path = "";
    this.lifeSpan = 0;
    this.speed = 0;
  }
  readMdx(stream) {
    const start = stream.index;
    const size = stream.readUint32();
    super.readMdx(stream);
    this.emissionRate = stream.readFloat32();
    this.gravity = stream.readFloat32();
    this.longitude = stream.readFloat32();
    this.latitude = stream.readFloat32();
    this.path = stream.read(260);
    this.lifeSpan = stream.readFloat32();
    this.speed = stream.readFloat32();
    this.readAnimations(stream, size - (stream.index - start));
  }
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());
    super.writeMdx(stream);
    stream.writeFloat32(this.emissionRate);
    stream.writeFloat32(this.gravity);
    stream.writeFloat32(this.longitude);
    stream.writeFloat32(this.latitude);
    stream.skip(260 - stream.write(this.path));
    stream.writeFloat32(this.lifeSpan);
    stream.writeFloat32(this.speed);
    this.writeNonGenericAnimationChunks(stream);
  }
  readMdl(stream) {
    for (let token of super.readGenericBlock(stream)) {
      if (token === "EmitterUsesMDL") {
        this.flags |= 32768;
      } else if (token === "EmitterUsesTGA") {
        this.flags |= 65536;
      } else if (token === "static EmissionRate") {
        this.emissionRate = stream.readFloat();
      } else if (token === "EmissionRate") {
        this.readAnimation(stream, "KPEE");
      } else if (token === "static Gravity") {
        this.gravity = stream.readFloat();
      } else if (token === "Gravity") {
        this.readAnimation(stream, "KPEG");
      } else if (token === "static Longitude") {
        this.longitude = stream.readFloat();
      } else if (token === "Longitude") {
        this.readAnimation(stream, "KPLN");
      } else if (token === "static Latitude") {
        this.latitude = stream.readFloat();
      } else if (token === "Latitude") {
        this.readAnimation(stream, "KPLT");
      } else if (token === "Visibility") {
        this.readAnimation(stream, "KPEV");
      } else if (token === "Particle") {
        for (token of this.readAnimatedBlock(stream)) {
          if (token === "static LifeSpan") {
            this.lifeSpan = stream.readFloat();
          } else if (token === "LifeSpan") {
            this.readAnimation(stream, "KPEL");
          } else if (token === "static InitVelocity") {
            this.speed = stream.readFloat();
          } else if (token === "InitVelocity") {
            this.readAnimation(stream, "KPES");
          } else if (token === "Path") {
            this.path = stream.read();
          }
        }
      } else {
        throw new Error(`Unknown token in ParticleEmitter: "${token}"`);
      }
    }
  }
  writeMdl(stream) {
    stream.startObjectBlock("ParticleEmitter", this.name);
    this.writeGenericHeader(stream);
    if (this.flags & 32768) {
      stream.writeFlag("EmitterUsesMDL");
    }
    if (this.flags & 65536) {
      stream.writeFlag("EmitterUsesTGA");
    }
    if (!this.writeAnimation(stream, "KPEE")) {
      stream.writeNumberAttrib("static EmissionRate", this.emissionRate);
    }
    if (!this.writeAnimation(stream, "KPEG")) {
      stream.writeNumberAttrib("static Gravity", this.gravity);
    }
    if (!this.writeAnimation(stream, "KPLN")) {
      stream.writeNumberAttrib("static Longitude", this.longitude);
    }
    if (!this.writeAnimation(stream, "KPLT")) {
      stream.writeNumberAttrib("static Latitude", this.latitude);
    }
    this.writeAnimation(stream, "KPEV");
    stream.startBlock("Particle");
    if (!this.writeAnimation(stream, "KPEL")) {
      stream.writeNumberAttrib("static LifeSpan", this.lifeSpan);
    }
    if (!this.writeAnimation(stream, "KPES")) {
      stream.writeNumberAttrib("static InitVelocity", this.speed);
    }
    if (this.flags & 32768 || this.flags & 65536) {
      stream.writeStringAttrib("Path", this.path);
    }
    stream.endBlock();
    this.writeGenericAnimations(stream);
    stream.endBlock();
  }
  getByteLength() {
    return 288 + super.getByteLength();
  }
};

// package/src/parsers/mdlx/particleemitter2.ts
var ParticleEmitter2 = class extends GenericObject {
  constructor() {
    super(...arguments);
    this.speed = 0;
    this.variation = 0;
    this.latitude = 0;
    this.gravity = 0;
    this.lifeSpan = 0;
    this.emissionRate = 0;
    this.width = 0;
    this.length = 0;
    this.filterMode = 0;
    this.rows = 0;
    this.columns = 0;
    this.headOrTail = 0;
    this.tailLength = 0;
    this.timeMiddle = 0;
    this.segmentColors = [new Float32Array(3), new Float32Array(3), new Float32Array(3)];
    this.segmentAlphas = new Uint8Array(3);
    this.segmentScaling = new Float32Array(3);
    this.headIntervals = [new Uint32Array(3), new Uint32Array(3)];
    this.tailIntervals = [new Uint32Array(3), new Uint32Array(3)];
    this.textureId = -1;
    this.squirt = 0;
    this.priorityPlane = 0;
    this.replaceableId = 0;
  }
  readMdx(stream) {
    const start = stream.index;
    const size = stream.readUint32();
    super.readMdx(stream);
    this.speed = stream.readFloat32();
    this.variation = stream.readFloat32();
    this.latitude = stream.readFloat32();
    this.gravity = stream.readFloat32();
    this.lifeSpan = stream.readFloat32();
    this.emissionRate = stream.readFloat32();
    this.width = stream.readFloat32();
    this.length = stream.readFloat32();
    this.filterMode = stream.readUint32();
    this.rows = stream.readUint32();
    this.columns = stream.readUint32();
    this.headOrTail = stream.readUint32();
    this.tailLength = stream.readFloat32();
    this.timeMiddle = stream.readFloat32();
    stream.readFloat32Array(this.segmentColors[0]);
    stream.readFloat32Array(this.segmentColors[1]);
    stream.readFloat32Array(this.segmentColors[2]);
    stream.readUint8Array(this.segmentAlphas);
    stream.readFloat32Array(this.segmentScaling);
    stream.readUint32Array(this.headIntervals[0]);
    stream.readUint32Array(this.headIntervals[1]);
    stream.readUint32Array(this.tailIntervals[0]);
    stream.readUint32Array(this.tailIntervals[1]);
    this.textureId = stream.readInt32();
    this.squirt = stream.readUint32();
    this.priorityPlane = stream.readInt32();
    this.replaceableId = stream.readUint32();
    this.readAnimations(stream, size - (stream.index - start));
  }
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());
    super.writeMdx(stream);
    stream.writeFloat32(this.speed);
    stream.writeFloat32(this.variation);
    stream.writeFloat32(this.latitude);
    stream.writeFloat32(this.gravity);
    stream.writeFloat32(this.lifeSpan);
    stream.writeFloat32(this.emissionRate);
    stream.writeFloat32(this.width);
    stream.writeFloat32(this.length);
    stream.writeUint32(this.filterMode);
    stream.writeUint32(this.rows);
    stream.writeUint32(this.columns);
    stream.writeUint32(this.headOrTail);
    stream.writeFloat32(this.tailLength);
    stream.writeFloat32(this.timeMiddle);
    stream.writeFloat32Array(this.segmentColors[0]);
    stream.writeFloat32Array(this.segmentColors[1]);
    stream.writeFloat32Array(this.segmentColors[2]);
    stream.writeUint8Array(this.segmentAlphas);
    stream.writeFloat32Array(this.segmentScaling);
    stream.writeUint32Array(this.headIntervals[0]);
    stream.writeUint32Array(this.headIntervals[1]);
    stream.writeUint32Array(this.tailIntervals[0]);
    stream.writeUint32Array(this.tailIntervals[1]);
    stream.writeInt32(this.textureId);
    stream.writeUint32(this.squirt);
    stream.writeInt32(this.priorityPlane);
    stream.writeUint32(this.replaceableId);
    this.writeNonGenericAnimationChunks(stream);
  }
  readMdl(stream) {
    for (const token of super.readGenericBlock(stream)) {
      if (token === "SortPrimsFarZ") {
        this.flags |= 65536;
      } else if (token === "Unshaded") {
        this.flags |= 32768;
      } else if (token === "LineEmitter") {
        this.flags |= 131072;
      } else if (token === "Unfogged") {
        this.flags |= 262144;
      } else if (token === "ModelSpace") {
        this.flags |= 524288;
      } else if (token === "XYQuad") {
        this.flags |= 1048576;
      } else if (token === "static Speed") {
        this.speed = stream.readFloat();
      } else if (token === "Speed") {
        this.readAnimation(stream, "KP2S");
      } else if (token === "static Variation") {
        this.variation = stream.readFloat();
      } else if (token === "Variation") {
        this.readAnimation(stream, "KP2R");
      } else if (token === "static Latitude") {
        this.latitude = stream.readFloat();
      } else if (token === "Latitude") {
        this.readAnimation(stream, "KP2L");
      } else if (token === "static Gravity") {
        this.gravity = stream.readFloat();
      } else if (token === "Gravity") {
        this.readAnimation(stream, "KP2G");
      } else if (token === "Visibility") {
        this.readAnimation(stream, "KP2V");
      } else if (token === "Squirt") {
        this.squirt = 1;
      } else if (token === "LifeSpan") {
        this.lifeSpan = stream.readFloat();
      } else if (token === "static EmissionRate") {
        this.emissionRate = stream.readFloat();
      } else if (token === "EmissionRate") {
        this.readAnimation(stream, "KP2E");
      } else if (token === "static Width") {
        this.width = stream.readFloat();
      } else if (token === "Width") {
        this.readAnimation(stream, "KP2N");
      } else if (token === "static Length") {
        this.length = stream.readFloat();
      } else if (token === "Length") {
        this.readAnimation(stream, "KP2W");
      } else if (token === "Blend") {
        this.filterMode = 0;
      } else if (token === "Additive") {
        this.filterMode = 1;
      } else if (token === "Modulate") {
        this.filterMode = 2;
      } else if (token === "Modulate2x") {
        this.filterMode = 3;
      } else if (token === "AlphaKey") {
        this.filterMode = 4;
      } else if (token === "Rows") {
        this.rows = stream.readInt();
      } else if (token === "Columns") {
        this.columns = stream.readInt();
      } else if (token === "Head") {
        this.headOrTail = 0;
      } else if (token === "Tail") {
        this.headOrTail = 1;
      } else if (token === "Both") {
        this.headOrTail = 2;
      } else if (token === "TailLength") {
        this.tailLength = stream.readFloat();
      } else if (token === "Time") {
        this.timeMiddle = stream.readFloat();
      } else if (token === "SegmentColor") {
        stream.read();
        for (let i = 0; i < 3; i++) {
          stream.read();
          stream.readColor(this.segmentColors[i]);
        }
        stream.read();
      } else if (token === "Alpha") {
        stream.readVector(this.segmentAlphas);
      } else if (token === "ParticleScaling") {
        stream.readVector(this.segmentScaling);
      } else if (token === "LifeSpanUVAnim") {
        stream.readVector(this.headIntervals[0]);
      } else if (token === "DecayUVAnim") {
        stream.readVector(this.headIntervals[1]);
      } else if (token === "TailUVAnim") {
        stream.readVector(this.tailIntervals[0]);
      } else if (token === "TailDecayUVAnim") {
        stream.readVector(this.tailIntervals[1]);
      } else if (token === "TextureID") {
        this.textureId = stream.readInt();
      } else if (token === "ReplaceableId") {
        this.replaceableId = stream.readInt();
      } else if (token === "PriorityPlane") {
        this.priorityPlane = stream.readInt();
      } else {
        throw new Error(`Unknown token in ParticleEmitter2: "${token}"`);
      }
    }
  }
  writeMdl(stream) {
    stream.startObjectBlock("ParticleEmitter2", this.name);
    this.writeGenericHeader(stream);
    if (this.flags & 65536) {
      stream.writeFlag("SortPrimsFarZ");
    }
    if (this.flags & 32768) {
      stream.writeFlag("Unshaded");
    }
    if (this.flags & 131072) {
      stream.writeFlag("LineEmitter");
    }
    if (this.flags & 262144) {
      stream.writeFlag("Unfogged");
    }
    if (this.flags & 524288) {
      stream.writeFlag("ModelSpace");
    }
    if (this.flags & 1048576) {
      stream.writeFlag("XYQuad");
    }
    if (!this.writeAnimation(stream, "KP2S")) {
      stream.writeNumberAttrib("static Speed", this.speed);
    }
    if (!this.writeAnimation(stream, "KP2R")) {
      stream.writeNumberAttrib("static Variation", this.variation);
    }
    if (!this.writeAnimation(stream, "KP2L")) {
      stream.writeNumberAttrib("static Latitude", this.latitude);
    }
    if (!this.writeAnimation(stream, "KP2G")) {
      stream.writeNumberAttrib("static Gravity", this.gravity);
    }
    this.writeAnimation(stream, "KP2V");
    if (this.squirt) {
      stream.writeFlag("Squirt");
    }
    stream.writeNumberAttrib("LifeSpan", this.lifeSpan);
    if (!this.writeAnimation(stream, "KP2E")) {
      stream.writeNumberAttrib("static EmissionRate", this.emissionRate);
    }
    if (!this.writeAnimation(stream, "KP2N")) {
      stream.writeNumberAttrib("static Width", this.width);
    }
    if (!this.writeAnimation(stream, "KP2W")) {
      stream.writeNumberAttrib("static Length", this.length);
    }
    if (this.filterMode === 0) {
      stream.writeFlag("Blend");
    } else if (this.filterMode === 1) {
      stream.writeFlag("Additive");
    } else if (this.filterMode === 2) {
      stream.writeFlag("Modulate");
    } else if (this.filterMode === 3) {
      stream.writeFlag("Modulate2x");
    } else if (this.filterMode === 4) {
      stream.writeFlag("AlphaKey");
    }
    stream.writeNumberAttrib("Rows", this.rows);
    stream.writeNumberAttrib("Columns", this.columns);
    if (this.headOrTail === 0) {
      stream.writeFlag("Head");
    } else if (this.headOrTail === 1) {
      stream.writeFlag("Tail");
    } else if (this.headOrTail === 2) {
      stream.writeFlag("Both");
    }
    stream.writeNumberAttrib("TailLength", this.tailLength);
    stream.writeNumberAttrib("Time", this.timeMiddle);
    stream.startBlock("SegmentColor");
    stream.writeColor("Color", this.segmentColors[0]);
    stream.writeColor("Color", this.segmentColors[1]);
    stream.writeColor("Color", this.segmentColors[2]);
    stream.endBlockComma();
    stream.writeVectorAttrib("Alpha", this.segmentAlphas);
    stream.writeVectorAttrib("ParticleScaling", this.segmentScaling);
    stream.writeVectorAttrib("LifeSpanUVAnim", this.headIntervals[0]);
    stream.writeVectorAttrib("DecayUVAnim", this.headIntervals[1]);
    stream.writeVectorAttrib("TailUVAnim", this.tailIntervals[0]);
    stream.writeVectorAttrib("TailDecayUVAnim", this.tailIntervals[1]);
    stream.writeNumberAttrib("TextureID", this.textureId);
    if (this.replaceableId !== 0) {
      stream.writeNumberAttrib("ReplaceableId", this.replaceableId);
    }
    if (this.priorityPlane !== 0) {
      stream.writeNumberAttrib("PriorityPlane", this.priorityPlane);
    }
    this.writeGenericAnimations(stream);
    stream.endBlock();
  }
  getByteLength() {
    return 175 + super.getByteLength();
  }
};

// package/src/parsers/mdlx/particleemitterpopcorn.ts
var ParticleEmitterPopcorn = class extends GenericObject {
  constructor() {
    super(...arguments);
    this.lifeSpan = 0;
    this.emissionRate = 0;
    this.speed = 0;
    this.color = new Float32Array(3);
    this.alpha = 1;
    this.replaceableId = 0;
    this.path = "";
    this.animationVisiblityGuide = "";
  }
  readMdx(stream) {
    const start = stream.index;
    const size = stream.readUint32();
    super.readMdx(stream);
    this.lifeSpan = stream.readFloat32();
    this.emissionRate = stream.readFloat32();
    this.speed = stream.readFloat32();
    stream.readFloat32Array(this.color);
    this.alpha = stream.readFloat32();
    this.replaceableId = stream.readUint32();
    this.path = stream.read(260);
    this.animationVisiblityGuide = stream.read(260);
    this.readAnimations(stream, size - (stream.index - start));
  }
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());
    super.writeMdx(stream);
    stream.writeFloat32(this.lifeSpan);
    stream.writeFloat32(this.emissionRate);
    stream.writeFloat32(this.speed);
    stream.writeFloat32Array(this.color);
    stream.writeFloat32(this.alpha);
    stream.writeUint32(this.replaceableId);
    stream.skip(260 - stream.write(this.path));
    stream.skip(260 - stream.write(this.animationVisiblityGuide));
    this.writeNonGenericAnimationChunks(stream);
  }
  readMdl(stream) {
    for (let token of super.readGenericBlock(stream)) {
      if (token === "SortPrimsFarZ") {
        this.flags |= 65536;
      } else if (token === "Unshaded") {
        this.flags |= 32768;
      } else if (token === "Unfogged") {
        this.flags |= 262144;
      } else if (token === "static LifeSpan") {
        this.lifeSpan = stream.readFloat();
      } else if (token === "LifeSpan") {
        this.readAnimation(stream, "KPPL");
      } else if (token === "static EmissionRate") {
        this.emissionRate = stream.readFloat();
      } else if (token === "EmissionRate") {
        this.readAnimation(stream, "KPPE");
      } else if (token === "static Speed") {
        this.speed = stream.readFloat();
      } else if (token === "Speed") {
        this.readAnimation(stream, "KPPS");
      } else if (token === "static Color") {
        stream.readVector(this.color);
      } else if (token === "Color") {
        this.readAnimation(stream, "KPPC");
      } else if (token === "static Alpha") {
        this.alpha = stream.readFloat();
      } else if (token === "Alpha") {
        this.readAnimation(stream, "KPPA");
      } else if (token === "Visibility") {
        this.readAnimation(stream, "KPPV");
      } else if (token === "ReplaceableId") {
        this.replaceableId = stream.readInt();
      } else if (token === "Path") {
        this.path = stream.read();
      } else if (token === "AnimVisibilityGuide") {
        this.animationVisiblityGuide = stream.read();
      } else {
        throw new Error(`Unknown token in ParticleEmitterPopcorn: "${token}"`);
      }
    }
  }
  writeMdl(stream) {
    stream.startObjectBlock("ParticleEmitterPopcorn", this.name);
    this.writeGenericHeader(stream);
    if (this.flags & 65536) {
      stream.writeFlag("SortPrimsFarZ");
    }
    if (this.flags & 32768) {
      stream.writeFlag("Unshaded");
    }
    if (this.flags & 262144) {
      stream.writeFlag("Unfogged");
    }
    if (!this.writeAnimation(stream, "KPPL")) {
      stream.writeNumberAttrib("static LifeSpan", this.lifeSpan);
    }
    if (!this.writeAnimation(stream, "KPPE")) {
      stream.writeNumberAttrib("static EmissionRate", this.emissionRate);
    }
    if (!this.writeAnimation(stream, "KPPS")) {
      stream.writeNumberAttrib("static Speed", this.speed);
    }
    if (!this.writeAnimation(stream, "KPPC")) {
      stream.writeVectorAttrib("static Color", this.color);
    }
    if (!this.writeAnimation(stream, "KPPA")) {
      stream.writeNumberAttrib("static Alpha", this.alpha);
    }
    this.writeAnimation(stream, "KPPV");
    if (this.replaceableId !== 0) {
      stream.writeNumberAttrib("ReplaceableId", this.replaceableId);
    }
    if (this.path.length) {
      stream.writeStringAttrib("Path", this.path);
    }
    if (this.animationVisiblityGuide.length) {
      stream.writeStringAttrib("AnimVisibilityGuide", this.animationVisiblityGuide);
    }
    this.writeGenericAnimations(stream);
    stream.endBlock();
  }
  getByteLength() {
    return 556 + super.getByteLength();
  }
};

// package/src/parsers/mdlx/ribbonemitter.ts
var RibbonEmitter = class extends GenericObject {
  constructor() {
    super(16384);
    this.heightAbove = 0;
    this.heightBelow = 0;
    this.alpha = 0;
    this.color = new Float32Array(3);
    this.lifeSpan = 0;
    this.textureSlot = 0;
    this.emissionRate = 0;
    this.rows = 0;
    this.columns = 0;
    this.materialId = 0;
    this.gravity = 0;
  }
  readMdx(stream) {
    const start = stream.index;
    const size = stream.readUint32();
    super.readMdx(stream);
    this.heightAbove = stream.readFloat32();
    this.heightBelow = stream.readFloat32();
    this.alpha = stream.readFloat32();
    stream.readFloat32Array(this.color);
    this.lifeSpan = stream.readFloat32();
    this.textureSlot = stream.readUint32();
    this.emissionRate = stream.readUint32();
    this.rows = stream.readUint32();
    this.columns = stream.readUint32();
    this.materialId = stream.readInt32();
    this.gravity = stream.readFloat32();
    this.readAnimations(stream, size - (stream.index - start));
  }
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());
    super.writeMdx(stream);
    stream.writeFloat32(this.heightAbove);
    stream.writeFloat32(this.heightBelow);
    stream.writeFloat32(this.alpha);
    stream.writeFloat32Array(this.color);
    stream.writeFloat32(this.lifeSpan);
    stream.writeUint32(this.textureSlot);
    stream.writeUint32(this.emissionRate);
    stream.writeUint32(this.rows);
    stream.writeUint32(this.columns);
    stream.writeInt32(this.materialId);
    stream.writeFloat32(this.gravity);
    this.writeNonGenericAnimationChunks(stream);
  }
  readMdl(stream) {
    for (let token of super.readGenericBlock(stream)) {
      if (token === "static HeightAbove") {
        this.heightAbove = stream.readFloat();
      } else if (token === "HeightAbove") {
        this.readAnimation(stream, "KRHA");
      } else if (token === "static HeightBelow") {
        this.heightBelow = stream.readFloat();
      } else if (token === "HeightBelow") {
        this.readAnimation(stream, "KRHB");
      } else if (token === "static Alpha") {
        this.alpha = stream.readFloat();
      } else if (token === "Alpha") {
        this.readAnimation(stream, "KRAL");
      } else if (token === "static Color") {
        stream.readColor(this.color);
      } else if (token === "Color") {
        this.readAnimation(stream, "KRCO");
      } else if (token === "static TextureSlot") {
        this.textureSlot = stream.readInt();
      } else if (token === "TextureSlot") {
        this.readAnimation(stream, "KRTX");
      } else if (token === "Visibility") {
        this.readAnimation(stream, "KRVS");
      } else if (token === "EmissionRate") {
        this.emissionRate = stream.readInt();
      } else if (token === "LifeSpan") {
        this.lifeSpan = stream.readFloat();
      } else if (token === "Gravity") {
        this.gravity = stream.readFloat();
      } else if (token === "Rows") {
        this.rows = stream.readInt();
      } else if (token === "Columns") {
        this.columns = stream.readInt();
      } else if (token === "MaterialID") {
        this.materialId = stream.readInt();
      } else {
        throw new Error(`Unknown token in RibbonEmitter: "${token}"`);
      }
    }
  }
  writeMdl(stream) {
    stream.startObjectBlock("RibbonEmitter", this.name);
    this.writeGenericHeader(stream);
    if (!this.writeAnimation(stream, "KRHA")) {
      stream.writeNumberAttrib("static HeightAbove", this.heightAbove);
    }
    if (!this.writeAnimation(stream, "KRHB")) {
      stream.writeNumberAttrib("static HeightBelow", this.heightBelow);
    }
    if (!this.writeAnimation(stream, "KRAL")) {
      stream.writeNumberAttrib("static Alpha", this.alpha);
    }
    if (!this.writeAnimation(stream, "KRCO")) {
      stream.writeColor("static Color", this.color);
    }
    if (!this.writeAnimation(stream, "KRTX")) {
      stream.writeNumberAttrib("static TextureSlot", this.textureSlot);
    }
    this.writeAnimation(stream, "KRVS");
    stream.writeNumberAttrib("EmissionRate", this.emissionRate);
    stream.writeNumberAttrib("LifeSpan", this.lifeSpan);
    if (this.gravity !== 0) {
      stream.writeNumberAttrib("Gravity", this.gravity);
    }
    stream.writeNumberAttrib("Rows", this.rows);
    stream.writeNumberAttrib("Columns", this.columns);
    stream.writeNumberAttrib("MaterialID", this.materialId);
    this.writeGenericAnimations(stream);
    stream.endBlock();
  }
  getByteLength() {
    return 56 + super.getByteLength();
  }
};

// package/src/parsers/mdlx/camera.ts
var Camera = class extends AnimatedObject {
  constructor() {
    super(...arguments);
    this.name = "";
    this.position = new Float32Array(3);
    this.fieldOfView = 0;
    this.farClippingPlane = 0;
    this.nearClippingPlane = 0;
    this.targetPosition = new Float32Array(3);
  }
  readMdx(stream) {
    let size = stream.readUint32();
    this.name = stream.read(80);
    stream.readFloat32Array(this.position);
    this.fieldOfView = stream.readFloat32();
    this.farClippingPlane = stream.readFloat32();
    this.nearClippingPlane = stream.readFloat32();
    stream.readFloat32Array(this.targetPosition);
    this.readAnimations(stream, size - 120);
  }
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());
    stream.skip(80 - stream.write(this.name));
    stream.writeFloat32Array(this.position);
    stream.writeFloat32(this.fieldOfView);
    stream.writeFloat32(this.farClippingPlane);
    stream.writeFloat32(this.nearClippingPlane);
    stream.writeFloat32Array(this.targetPosition);
    this.writeAnimations(stream);
  }
  readMdl(stream) {
    this.name = stream.read();
    for (let token of stream.readBlock()) {
      if (token === "Position") {
        stream.readVector(this.position);
      } else if (token === "Translation") {
        this.readAnimation(stream, "KCTR");
      } else if (token === "Rotation") {
        this.readAnimation(stream, "KCRL");
      } else if (token === "FieldOfView") {
        this.fieldOfView = stream.readFloat();
      } else if (token === "FarClip") {
        this.farClippingPlane = stream.readFloat();
      } else if (token === "NearClip") {
        this.nearClippingPlane = stream.readFloat();
      } else if (token === "Target") {
        for (token of stream.readBlock()) {
          if (token === "Position") {
            stream.readVector(this.targetPosition);
          } else if (token === "Translation") {
            this.readAnimation(stream, "KTTR");
          } else {
            throw new Error(`Unknown token in Camera ${this.name}'s Target: "${token}"`);
          }
        }
      } else {
        throw new Error(`Unknown token in Camera ${this.name}: "${token}"`);
      }
    }
  }
  writeMdl(stream) {
    stream.startObjectBlock("Camera", this.name);
    stream.writeVectorAttrib("Position", this.position);
    this.writeAnimation(stream, "KCTR");
    this.writeAnimation(stream, "KCRL");
    stream.writeNumberAttrib("FieldOfView", this.fieldOfView);
    stream.writeNumberAttrib("FarClip", this.farClippingPlane);
    stream.writeNumberAttrib("NearClip", this.nearClippingPlane);
    stream.startBlock("Target");
    stream.writeVectorAttrib("Position", this.targetPosition);
    this.writeAnimation(stream, "KTTR");
    stream.endBlock();
    stream.endBlock();
  }
  getByteLength() {
    return 120 + super.getByteLength();
  }
};

// package/src/parsers/mdlx/eventobject.ts
var EventObject = class extends GenericObject {
  constructor() {
    super(1024);
    this.globalSequenceId = -1;
    this.tracks = new Uint32Array(0);
  }
  readMdx(stream) {
    super.readMdx(stream);
    stream.skip(4);
    let count = stream.readUint32();
    this.globalSequenceId = stream.readInt32();
    this.tracks = stream.readUint32Array(count);
  }
  writeMdx(stream) {
    super.writeMdx(stream);
    stream.writeBinary("KEVT");
    stream.writeUint32(this.tracks.length);
    stream.writeInt32(this.globalSequenceId);
    stream.writeUint32Array(this.tracks);
  }
  readMdl(stream) {
    for (let token of super.readGenericBlock(stream)) {
      if (token === "EventTrack") {
        let count = stream.readInt();
        this.tracks = new Uint32Array(count);
        stream.read();
        if (stream.peek() === "GlobalSeqId") {
          stream.read();
          this.globalSequenceId = stream.readInt();
        }
        for (let i = 0; i < count; i++) {
          this.tracks[i] = stream.readInt();
        }
        stream.read();
      } else {
        throw new Error(`Unknown token in EventObject: "${token}"`);
      }
    }
  }
  writeMdl(stream) {
    stream.startObjectBlock("EventObject", this.name);
    this.writeGenericHeader(stream);
    stream.startBlock("EventTrack", this.tracks.length);
    if (this.globalSequenceId !== -1) {
      stream.writeNumberAttrib("GlobalSeqId", this.globalSequenceId);
    }
    for (let track of this.tracks) {
      stream.writeFlag(`${track}`);
    }
    stream.endBlock();
    this.writeGenericAnimations(stream);
    stream.endBlock();
  }
  getByteLength() {
    return 12 + this.tracks.byteLength + super.getByteLength();
  }
};

// package/src/parsers/mdlx/collisionshape.ts
var CollisionShape = class extends GenericObject {
  constructor() {
    super(8192);
    this.type = -1;
    this.vertices = [new Float32Array(3), new Float32Array(3)];
    this.boundsRadius = 0;
  }
  readMdx(stream) {
    super.readMdx(stream);
    this.type = stream.readUint32();
    stream.readFloat32Array(this.vertices[0]);
    if (this.type !== 2) {
      stream.readFloat32Array(this.vertices[1]);
    }
    if (this.type === 2 || this.type === 3) {
      this.boundsRadius = stream.readFloat32();
    }
  }
  writeMdx(stream) {
    super.writeMdx(stream);
    stream.writeUint32(this.type);
    stream.writeFloat32Array(this.vertices[0]);
    if (this.type !== 2) {
      stream.writeFloat32Array(this.vertices[1]);
    }
    if (this.type === 2 || this.type === 3) {
      stream.writeFloat32(this.boundsRadius);
    }
  }
  readMdl(stream) {
    for (let token of super.readGenericBlock(stream)) {
      if (token === "Box") {
        this.type = 0;
      } else if (token === "Plane") {
        this.type = 1;
      } else if (token === "Sphere") {
        this.type = 2;
      } else if (token === "Cylinder") {
        this.type = 3;
      } else if (token === "Vertices") {
        let count = stream.readInt();
        stream.read();
        stream.readVector(this.vertices[0]);
        if (count === 2) {
          stream.readVector(this.vertices[1]);
        }
        stream.read();
      } else if (token === "BoundsRadius") {
        this.boundsRadius = stream.readFloat();
      } else {
        throw new Error(`Unknown token in CollisionShape: "${token}"`);
      }
    }
  }
  writeMdl(stream) {
    stream.startObjectBlock("CollisionShape", this.name);
    this.writeGenericHeader(stream);
    let type = "";
    let vertices = 2;
    let boundsRadius = false;
    if (this.type === 0) {
      type = "Box";
    } else if (this.type === 1) {
      type = "Plane";
    } else if (this.type === 2) {
      type = "Sphere";
      vertices = 1;
      boundsRadius = true;
    } else if (this.type === 3) {
      type = "Cylinder";
      boundsRadius = true;
    }
    stream.writeFlag(type);
    stream.startBlock("Vertices", vertices);
    stream.writeVector(this.vertices[0]);
    if (vertices === 2) {
      stream.writeVector(this.vertices[1]);
    }
    stream.endBlock();
    if (boundsRadius) {
      stream.writeNumberAttrib("BoundsRadius", this.boundsRadius);
    }
    this.writeGenericAnimations(stream);
    stream.endBlock();
  }
  getByteLength() {
    let size = 16 + super.getByteLength();
    if (this.type !== 2) {
      size += 12;
    }
    if (this.type === 2 || this.type === 3) {
      size += 4;
    }
    return size;
  }
};

// package/src/parsers/mdlx/faceeffect.ts
var FaceEffect = class {
  constructor() {
    this.type = "";
    this.path = "";
  }
  readMdx(stream) {
    this.type = stream.read(80);
    this.path = stream.read(260);
  }
  writeMdx(stream) {
    stream.skip(80 - stream.write(this.type));
    stream.skip(260 - stream.write(this.path));
  }
  readMdl(stream) {
    this.type = stream.read();
    for (let token of stream.readBlock()) {
      if (token === "Path") {
        this.path = stream.read();
      } else {
        throw new Error(`Unknown token in FaceEffect: "${token}"`);
      }
    }
  }
  writeMdl(stream) {
    stream.startObjectBlock("FaceFX", this.type);
    stream.writeStringAttrib("Path", this.path);
    stream.endBlock();
  }
};

// package/src/parsers/mdlx/unknownchunk.ts
var UnknownChunk = class {
  constructor(stream, size, tag) {
    this.tag = tag;
    this.chunk = stream.readUint8Array(new Uint8Array(size));
  }
  writeMdx(stream) {
    stream.writeBinary(this.tag);
    stream.writeUint32(this.chunk.byteLength);
    stream.writeUint8Array(this.chunk);
  }
  getByteLength() {
    return 8 + this.chunk.byteLength;
  }
};

// package/src/parsers/mdlx/isformat.ts
function isMdx(bytes2) {
  if (bytes2 instanceof ArrayBuffer) {
    bytes2 = new Uint8Array(bytes2);
  }
  if (bytes2 instanceof Uint8Array) {
    if (bytes2[0] === 77 && bytes2[1] === 68 && bytes2[2] === 76 && bytes2[3] === 88) {
      return true;
    }
  }
  return false;
}
function isMdl(bytes2) {
  if (bytes2 instanceof ArrayBuffer) {
    bytes2 = new Uint8Array(bytes2);
  }
  if (bytes2 instanceof Uint8Array && isStringInBytes(bytes2, "FormatVersion", 0, 4096)) {
    return true;
  }
  if (typeof bytes2 === "string" && isStringInString(bytes2, "FormatVersion", 0, 4096)) {
    return true;
  }
  return false;
}

// package/src/parsers/mdlx/model.ts
var Model = class {
  constructor() {
    /**
     * 800 for Warcraft 3: RoC and TFT.
     * >800 for Warcraft 3: Reforged.
     */
    this.version = 800;
    this.name = "";
    /**
     * To the best of my knowledge, this should always be left empty.
     */
    this.animationFile = "";
    this.extent = new Extent();
    /**
     * This is only used by the now-defunct previewer that came with Art Tools.
     */
    this.blendTime = 0;
    this.sequences = [];
    this.globalSequences = [];
    this.materials = [];
    this.textures = [];
    this.textureAnimations = [];
    this.geosets = [];
    this.geosetAnimations = [];
    this.bones = [];
    this.lights = [];
    this.helpers = [];
    this.attachments = [];
    this.pivotPoints = [];
    this.particleEmitters = [];
    this.particleEmitters2 = [];
    /**
     * @since 900
     */
    this.particleEmittersPopcorn = [];
    this.ribbonEmitters = [];
    this.cameras = [];
    this.eventObjects = [];
    this.collisionShapes = [];
    /**
     * @since 900
     */
    this.faceEffects = [];
    /**
     * @since 900
     */
    this.bindPose = [];
    /**
     * The MDX format is chunk based, and Warcraft 3 does not mind there being unknown chunks in there.
     * Some 3rd party tools use this to attach metadata to models.
     * When an unknown chunk is encountered, it will be added here.
     * These chunks will be saved when saving as MDX.
     */
    this.unknownChunks = [];
  }
  /**
   * Load the model from MDX or MDL.
   * The format is detected automatically.
   */
  load(buffer2) {
    if (isMdx(buffer2)) {
      this.loadMdx(buffer2);
    } else if (isMdl(buffer2)) {
      if (typeof buffer2 === "string") {
        this.loadMdl(buffer2);
      } else {
        this.loadMdl(decodeUtf8(buffer2));
      }
    } else {
      throw new Error("Not a valid MDX/MDL buffer");
    }
  }
  /**
   * Load the model from MDX.
   */
  loadMdx(buffer2) {
    let stream = new BinaryStream(buffer2);
    let tag;
    let size;
    stream.skip(4);
    while (stream.remaining > 0) {
      tag = stream.readBinary(4);
      size = stream.readUint32();
      if (tag === "VERS") {
        this.loadVersionChunk(stream);
      } else if (tag === "MODL") {
        this.loadModelChunk(stream);
      } else if (tag === "SEQS") {
        this.loadStaticObjects(this.sequences, Sequence, stream, size / 132);
      } else if (tag === "GLBS") {
        this.loadGlobalSequenceChunk(stream, size);
      } else if (tag === "MTLS") {
        this.loadDynamicObjects(this.materials, Material, stream, size);
      } else if (tag === "TEXS") {
        this.loadStaticObjects(this.textures, Texture, stream, size / 268);
      } else if (tag === "TXAN") {
        this.loadDynamicObjects(this.textureAnimations, TextureAnimation, stream, size);
      } else if (tag === "GEOS") {
        this.loadDynamicObjects(this.geosets, Geoset, stream, size);
      } else if (tag === "GEOA") {
        this.loadDynamicObjects(this.geosetAnimations, GeosetAnimation, stream, size);
      } else if (tag === "BONE") {
        this.loadDynamicObjects(this.bones, Bone, stream, size);
      } else if (tag === "LITE") {
        this.loadDynamicObjects(this.lights, Light, stream, size);
      } else if (tag === "HELP") {
        this.loadDynamicObjects(this.helpers, Helper, stream, size);
      } else if (tag === "ATCH") {
        this.loadDynamicObjects(this.attachments, Attachment, stream, size);
      } else if (tag === "PIVT") {
        this.loadPivotPointChunk(stream, size);
      } else if (tag === "PREM") {
        this.loadDynamicObjects(this.particleEmitters, ParticleEmitter, stream, size);
      } else if (tag === "PRE2") {
        this.loadDynamicObjects(this.particleEmitters2, ParticleEmitter2, stream, size);
      } else if (tag === "CORN") {
        this.loadDynamicObjects(this.particleEmittersPopcorn, ParticleEmitterPopcorn, stream, size);
      } else if (tag === "RIBB") {
        this.loadDynamicObjects(this.ribbonEmitters, RibbonEmitter, stream, size);
      } else if (tag === "CAMS") {
        this.loadDynamicObjects(this.cameras, Camera, stream, size);
      } else if (tag === "EVTS") {
        this.loadDynamicObjects(this.eventObjects, EventObject, stream, size);
      } else if (tag === "CLID") {
        this.loadDynamicObjects(this.collisionShapes, CollisionShape, stream, size);
      } else if (tag === "FAFX") {
        this.loadStaticObjects(this.faceEffects, FaceEffect, stream, size / 340);
      } else if (tag === "BPOS") {
        this.loadBindPoseChunk(stream, size);
      } else {
        this.unknownChunks.push(new UnknownChunk(stream, size, tag));
      }
    }
  }
  loadVersionChunk(stream) {
    this.version = stream.readUint32();
  }
  loadModelChunk(stream) {
    this.name = stream.read(80);
    this.animationFile = stream.read(260);
    this.extent.readMdx(stream);
    this.blendTime = stream.readUint32();
  }
  loadStaticObjects(out, constructor, stream, count) {
    for (let i = 0; i < count; i++) {
      let object = new constructor();
      object.readMdx(stream);
      out.push(object);
    }
  }
  loadGlobalSequenceChunk(stream, size) {
    for (let i = 0, l = size / 4; i < l; i++) {
      this.globalSequences.push(stream.readUint32());
    }
  }
  loadDynamicObjects(out, constructor, stream, size) {
    let end = stream.index + size;
    while (stream.index < end) {
      let object = new constructor();
      object.readMdx(stream, this.version);
      out.push(object);
    }
  }
  loadPivotPointChunk(stream, size) {
    for (let i = 0, l = size / 12; i < l; i++) {
      this.pivotPoints.push(stream.readFloat32Array(3));
    }
  }
  loadBindPoseChunk(stream, size) {
    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      this.bindPose[i] = stream.readFloat32Array(12);
    }
  }
  /**
   * Save the model as MDX.
   */
  saveMdx() {
    let stream = new BinaryStream(new ArrayBuffer(this.getByteLength()));
    stream.writeBinary("MDLX");
    this.saveVersionChunk(stream);
    this.saveModelChunk(stream);
    this.saveStaticObjectChunk(stream, "SEQS", this.sequences, 132);
    this.saveGlobalSequenceChunk(stream);
    this.saveDynamicObjectChunk(stream, "MTLS", this.materials);
    this.saveStaticObjectChunk(stream, "TEXS", this.textures, 268);
    this.saveDynamicObjectChunk(stream, "TXAN", this.textureAnimations);
    this.saveDynamicObjectChunk(stream, "GEOS", this.geosets);
    this.saveDynamicObjectChunk(stream, "GEOA", this.geosetAnimations);
    this.saveDynamicObjectChunk(stream, "BONE", this.bones);
    this.saveDynamicObjectChunk(stream, "LITE", this.lights);
    this.saveDynamicObjectChunk(stream, "HELP", this.helpers);
    this.saveDynamicObjectChunk(stream, "ATCH", this.attachments);
    this.savePivotPointChunk(stream);
    this.saveDynamicObjectChunk(stream, "PREM", this.particleEmitters);
    this.saveDynamicObjectChunk(stream, "PRE2", this.particleEmitters2);
    if (this.version > 800) {
      this.saveDynamicObjectChunk(stream, "CORN", this.particleEmittersPopcorn);
    }
    this.saveDynamicObjectChunk(stream, "RIBB", this.ribbonEmitters);
    this.saveDynamicObjectChunk(stream, "CAMS", this.cameras);
    this.saveDynamicObjectChunk(stream, "EVTS", this.eventObjects);
    this.saveDynamicObjectChunk(stream, "CLID", this.collisionShapes);
    if (this.version > 800) {
      this.saveStaticObjectChunk(stream, "FAFX", this.faceEffects, 340);
      this.saveBindPoseChunk(stream);
    }
    for (let chunk of this.unknownChunks) {
      chunk.writeMdx(stream);
    }
    return stream.uint8array;
  }
  saveVersionChunk(stream) {
    stream.writeBinary("VERS");
    stream.writeUint32(4);
    stream.writeUint32(this.version);
  }
  saveModelChunk(stream) {
    stream.writeBinary("MODL");
    stream.writeUint32(372);
    stream.skip(80 - stream.write(this.name));
    stream.skip(260 - stream.write(this.animationFile));
    this.extent.writeMdx(stream);
    stream.writeUint32(this.blendTime);
  }
  saveStaticObjectChunk(stream, name, objects, size) {
    if (objects.length) {
      stream.writeBinary(name);
      stream.writeUint32(objects.length * size);
      for (let object of objects) {
        object.writeMdx(stream);
      }
    }
  }
  saveGlobalSequenceChunk(stream) {
    if (this.globalSequences.length) {
      stream.writeBinary("GLBS");
      stream.writeUint32(this.globalSequences.length * 4);
      for (let globalSequence of this.globalSequences) {
        stream.writeUint32(globalSequence);
      }
    }
  }
  saveDynamicObjectChunk(stream, name, objects) {
    if (objects.length) {
      stream.writeBinary(name);
      stream.writeUint32(this.getObjectsByteLength(objects));
      for (let object of objects) {
        object.writeMdx(stream, this.version);
      }
    }
  }
  savePivotPointChunk(stream) {
    if (this.pivotPoints.length) {
      stream.writeBinary("PIVT");
      stream.writeUint32(this.pivotPoints.length * 12);
      for (let pivotPoint of this.pivotPoints) {
        stream.writeFloat32Array(pivotPoint);
      }
    }
  }
  saveBindPoseChunk(stream) {
    if (this.bindPose.length) {
      stream.writeBinary("BPOS");
      stream.writeUint32(4 + this.bindPose.length * 48);
      stream.writeUint32(this.bindPose.length);
      for (let matrix of this.bindPose) {
        stream.writeFloat32Array(matrix);
      }
    }
  }
  /**
   * Load the model from MDL.
   */
  loadMdl(buffer2) {
    let token;
    let stream = new TokenStream(buffer2);
    while (token = stream.readToken()) {
      if (token === "Version") {
        this.loadVersionBlock(stream);
      } else if (token === "Model") {
        this.loadModelBlock(stream);
      } else if (token === "Sequences") {
        this.loadNumberedObjectBlock(this.sequences, Sequence, "Anim", stream);
      } else if (token === "GlobalSequences") {
        this.loadGlobalSequenceBlock(stream);
      } else if (token === "Textures") {
        this.loadNumberedObjectBlock(this.textures, Texture, "Bitmap", stream);
      } else if (token === "Materials") {
        this.loadNumberedObjectBlock(this.materials, Material, "Material", stream);
      } else if (token === "TextureAnims") {
        this.loadNumberedObjectBlock(this.textureAnimations, TextureAnimation, "TVertexAnim", stream);
      } else if (token === "Geoset") {
        this.loadObject(this.geosets, Geoset, stream);
      } else if (token === "GeosetAnim") {
        this.loadObject(this.geosetAnimations, GeosetAnimation, stream);
      } else if (token === "Bone") {
        this.loadObject(this.bones, Bone, stream);
      } else if (token === "Light") {
        this.loadObject(this.lights, Light, stream);
      } else if (token === "Helper") {
        this.loadObject(this.helpers, Helper, stream);
      } else if (token === "Attachment") {
        this.loadObject(this.attachments, Attachment, stream);
      } else if (token === "PivotPoints") {
        this.loadPivotPointBlock(stream);
      } else if (token === "ParticleEmitter") {
        this.loadObject(this.particleEmitters, ParticleEmitter, stream);
      } else if (token === "ParticleEmitter2") {
        this.loadObject(this.particleEmitters2, ParticleEmitter2, stream);
      } else if (token === "ParticleEmitterPopcorn") {
        this.loadObject(this.particleEmittersPopcorn, ParticleEmitterPopcorn, stream);
      } else if (token === "RibbonEmitter") {
        this.loadObject(this.ribbonEmitters, RibbonEmitter, stream);
      } else if (token === "Camera") {
        this.loadObject(this.cameras, Camera, stream);
      } else if (token === "EventObject") {
        this.loadObject(this.eventObjects, EventObject, stream);
      } else if (token === "CollisionShape") {
        this.loadObject(this.collisionShapes, CollisionShape, stream);
      } else if (token === "FaceFX") {
        this.loadObject(this.faceEffects, FaceEffect, stream);
      } else if (token === "BindPose") {
        this.loadBindPoseBlock(stream);
      } else {
        throw new Error(`Unsupported block: ${token}`);
      }
    }
  }
  loadVersionBlock(stream) {
    for (let token of stream.readBlock()) {
      if (token === "FormatVersion") {
        this.version = stream.readInt();
      } else {
        throw new Error(`Unknown token in Version: "${token}"`);
      }
    }
  }
  loadModelBlock(stream) {
    this.name = stream.read();
    for (let token of stream.readBlock()) {
      if (token.startsWith("Num")) {
        stream.read();
      } else if (token === "BlendTime") {
        this.blendTime = stream.readInt();
      } else if (token === "MinimumExtent") {
        stream.readVector(this.extent.min);
      } else if (token === "MaximumExtent") {
        stream.readVector(this.extent.max);
      } else if (token === "BoundsRadius") {
        this.extent.boundsRadius = stream.readFloat();
      } else if (token === "AnimationFile") {
        this.animationFile = stream.read();
      } else {
        throw new Error(`Unknown token in Model: "${token}"`);
      }
    }
  }
  loadNumberedObjectBlock(out, constructor, name, stream) {
    stream.read();
    for (let token of stream.readBlock()) {
      if (token === name) {
        let object = new constructor();
        object.readMdl(stream);
        out.push(object);
      } else {
        throw new Error(`Unknown token in ${name}: "${token}"`);
      }
    }
  }
  loadGlobalSequenceBlock(stream) {
    stream.read();
    for (let token of stream.readBlock()) {
      if (token === "Duration") {
        this.globalSequences.push(stream.readInt());
      } else {
        throw new Error(`Unknown token in GlobalSequences: "${token}"`);
      }
    }
  }
  loadObject(out, constructor, stream) {
    let object = new constructor();
    object.readMdl(stream);
    out.push(object);
  }
  loadPivotPointBlock(stream) {
    let count = stream.readInt();
    stream.read();
    for (let i = 0; i < count; i++) {
      this.pivotPoints.push(stream.readVector(new Float32Array(3)));
    }
    stream.read();
  }
  loadBindPoseBlock(stream) {
    for (let token of stream.readBlock()) {
      if (token === "Matrices") {
        let matrices = stream.readInt();
        stream.read();
        for (let i = 0; i < matrices; i++) {
          this.bindPose[i] = stream.readVector(new Float32Array(12));
        }
        stream.read();
      } else {
        throw new Error(`Unknown token in BindPose: "${token}"`);
      }
    }
  }
  /**
   * Save the model as MDL.
   */
  saveMdl() {
    let stream = new TokenStream();
    this.saveVersionBlock(stream);
    this.saveModelBlock(stream);
    this.saveStaticObjectsBlock(stream, "Sequences", this.sequences);
    this.saveGlobalSequenceBlock(stream);
    this.saveStaticObjectsBlock(stream, "Textures", this.textures);
    this.saveStaticObjectsBlock(stream, "Materials", this.materials);
    this.saveStaticObjectsBlock(stream, "TextureAnims", this.textureAnimations);
    this.saveObjects(stream, this.geosets);
    this.saveObjects(stream, this.geosetAnimations);
    this.saveObjects(stream, this.bones);
    this.saveObjects(stream, this.lights);
    this.saveObjects(stream, this.helpers);
    this.saveObjects(stream, this.attachments);
    this.savePivotPointBlock(stream);
    this.saveObjects(stream, this.particleEmitters);
    this.saveObjects(stream, this.particleEmitters2);
    if (this.version > 800) {
      this.saveObjects(stream, this.particleEmittersPopcorn);
    }
    this.saveObjects(stream, this.ribbonEmitters);
    this.saveObjects(stream, this.cameras);
    this.saveObjects(stream, this.eventObjects);
    this.saveObjects(stream, this.collisionShapes);
    if (this.version > 800) {
      this.saveObjects(stream, this.faceEffects);
      this.saveBindPoseBlock(stream);
    }
    return stream.buffer;
  }
  saveVersionBlock(stream) {
    stream.startBlock("Version");
    stream.writeNumberAttrib("FormatVersion", this.version);
    stream.endBlock();
  }
  saveModelBlock(stream) {
    stream.startObjectBlock("Model", this.name);
    stream.writeNumberAttrib("BlendTime", this.blendTime);
    this.extent.writeMdl(stream);
    if (this.animationFile.length) {
      stream.writeStringAttrib("AnimationFile", this.animationFile);
    }
    stream.endBlock();
  }
  saveStaticObjectsBlock(stream, name, objects) {
    if (objects.length) {
      stream.startBlock(name, objects.length);
      for (let object of objects) {
        object.writeMdl(stream, this.version);
      }
      stream.endBlock();
    }
  }
  saveGlobalSequenceBlock(stream) {
    if (this.globalSequences.length) {
      stream.startBlock("GlobalSequences", this.globalSequences.length);
      for (let globalSequence of this.globalSequences) {
        stream.writeNumberAttrib("Duration", globalSequence);
      }
      stream.endBlock();
    }
  }
  saveObjects(stream, objects) {
    for (let object of objects) {
      object.writeMdl(stream, this.version);
    }
  }
  savePivotPointBlock(stream) {
    if (this.pivotPoints.length) {
      stream.startBlock("PivotPoints", this.pivotPoints.length);
      for (let pivotPoint of this.pivotPoints) {
        stream.writeVector(pivotPoint);
      }
      stream.endBlock();
    }
  }
  saveBindPoseBlock(stream) {
    if (this.bindPose.length) {
      stream.startBlock("BindPose");
      stream.startBlock("Matrices", this.bindPose.length);
      for (let matrix of this.bindPose) {
        stream.writeVector(matrix);
      }
      stream.endBlock();
      stream.endBlock();
    }
  }
  /**
   * Calculate the size of the model as MDX.
   */
  getByteLength() {
    let size = 396;
    size += this.getStaticObjectsChunkByteLength(this.sequences, 132);
    size += this.getStaticObjectsChunkByteLength(this.globalSequences, 4);
    size += this.getDynamicObjectsChunkByteLength(this.materials);
    size += this.getStaticObjectsChunkByteLength(this.textures, 268);
    size += this.getDynamicObjectsChunkByteLength(this.textureAnimations);
    size += this.getDynamicObjectsChunkByteLength(this.geosets);
    size += this.getDynamicObjectsChunkByteLength(this.geosetAnimations);
    size += this.getDynamicObjectsChunkByteLength(this.bones);
    size += this.getDynamicObjectsChunkByteLength(this.lights);
    size += this.getDynamicObjectsChunkByteLength(this.helpers);
    size += this.getDynamicObjectsChunkByteLength(this.attachments);
    size += this.getStaticObjectsChunkByteLength(this.pivotPoints, 12);
    size += this.getDynamicObjectsChunkByteLength(this.particleEmitters);
    size += this.getDynamicObjectsChunkByteLength(this.particleEmitters2);
    if (this.version > 800) {
      size += this.getDynamicObjectsChunkByteLength(this.particleEmittersPopcorn);
    }
    size += this.getDynamicObjectsChunkByteLength(this.ribbonEmitters);
    size += this.getDynamicObjectsChunkByteLength(this.cameras);
    size += this.getDynamicObjectsChunkByteLength(this.eventObjects);
    size += this.getDynamicObjectsChunkByteLength(this.collisionShapes);
    if (this.version > 800) {
      size += this.getStaticObjectsChunkByteLength(this.faceEffects, 340);
      size += this.getBindPoseChunkByteLength();
    }
    size += this.getObjectsByteLength(this.unknownChunks);
    return size;
  }
  getObjectsByteLength(objects) {
    let size = 0;
    for (let object of objects) {
      size += object.getByteLength(this.version);
    }
    return size;
  }
  getDynamicObjectsChunkByteLength(objects) {
    if (objects.length) {
      return 8 + this.getObjectsByteLength(objects);
    }
    return 0;
  }
  getStaticObjectsChunkByteLength(objects, size) {
    if (objects.length) {
      return 8 + objects.length * size;
    }
    return 0;
  }
  getBindPoseChunkByteLength() {
    if (this.bindPose.length) {
      return 12 + this.bindPose.length * 48;
    }
    return 0;
  }
};

// package/src/viewer/skeletalnode.ts
var import_gl_matrix = __toESM(require_cjs());
var rotationHeap = import_gl_matrix.quat.create();
var scalingHeap = import_gl_matrix.vec3.create();
var SkeletalNode = class {
  constructor(pivot, localLocation, localRotation, localScale, worldLocation, worldRotation, worldScale, inverseWorldLocation, inverseWorldRotation, inverseWorldScale, localMatrix, worldMatrix) {
    this.dontInheritTranslation = false;
    this.dontInheritRotation = false;
    this.dontInheritScaling = false;
    this.billboarded = false;
    this.billboardedX = false;
    this.billboardedY = false;
    this.billboardedZ = false;
    this.dirty = true;
    this.wasDirty = false;
    this.parent = null;
    this.children = [];
    /**
     * The object associated with this node, if there is any.
     */
    this.object = null;
    this.pivot = pivot;
    this.localLocation = localLocation;
    this.localRotation = localRotation;
    this.localScale = localScale;
    this.worldLocation = worldLocation;
    this.worldRotation = worldRotation;
    this.worldScale = worldScale;
    this.inverseWorldLocation = inverseWorldLocation;
    this.inverseWorldRotation = inverseWorldRotation;
    this.inverseWorldScale = inverseWorldScale;
    this.localMatrix = localMatrix;
    this.worldMatrix = worldMatrix;
    this.localRotation[3] = 1;
    this.localScale.fill(1);
    this.localMatrix[0] = 1;
    this.localMatrix[5] = 1;
    this.localMatrix[10] = 1;
    this.localMatrix[15] = 1;
  }
  /**
   * Recalculate this skeletal node.
   */
  recalculateTransformation(scene) {
    let localMatrix = this.localMatrix;
    let localRotation = this.localRotation;
    let localScale = this.localScale;
    let worldMatrix = this.worldMatrix;
    let worldLocation = this.worldLocation;
    let worldRotation = this.worldRotation;
    let worldScale = this.worldScale;
    let pivot = this.pivot;
    let inverseWorldLocation = this.inverseWorldLocation;
    let inverseWorldRotation = this.inverseWorldRotation;
    let inverseWorldScale = this.inverseWorldScale;
    let parent = this.parent;
    let computedRotation;
    let computedScaling;
    if (this.dontInheritScaling) {
      computedScaling = scalingHeap;
      let parentInverseScale = parent.inverseWorldScale;
      computedScaling[0] = parentInverseScale[0] * localScale[0];
      computedScaling[1] = parentInverseScale[1] * localScale[1];
      computedScaling[2] = parentInverseScale[2] * localScale[2];
      worldScale[0] = localScale[0];
      worldScale[1] = localScale[1];
      worldScale[2] = localScale[2];
    } else {
      computedScaling = localScale;
      let parentScale = parent.worldScale;
      worldScale[0] = parentScale[0] * localScale[0];
      worldScale[1] = parentScale[1] * localScale[1];
      worldScale[2] = parentScale[2] * localScale[2];
    }
    if (this.billboarded) {
      computedRotation = rotationHeap;
      import_gl_matrix.quat.copy(computedRotation, parent.inverseWorldRotation);
      import_gl_matrix.quat.mul(computedRotation, computedRotation, scene.camera.inverseRotation);
      this.convertBasis(computedRotation);
    } else {
      computedRotation = localRotation;
    }
    import_gl_matrix.mat4.fromRotationTranslationScaleOrigin(localMatrix, computedRotation, this.localLocation, computedScaling, pivot);
    import_gl_matrix.mat4.mul(worldMatrix, parent.worldMatrix, localMatrix);
    import_gl_matrix.quat.mul(worldRotation, parent.worldRotation, computedRotation);
    inverseWorldRotation[0] = -worldRotation[0];
    inverseWorldRotation[1] = -worldRotation[1];
    inverseWorldRotation[2] = -worldRotation[2];
    inverseWorldRotation[3] = worldRotation[3];
    inverseWorldScale[0] = 1 / worldScale[0];
    inverseWorldScale[1] = 1 / worldScale[1];
    inverseWorldScale[2] = 1 / worldScale[2];
    let x = pivot[0];
    let y = pivot[1];
    let z = pivot[2];
    worldLocation[0] = worldMatrix[0] * x + worldMatrix[4] * y + worldMatrix[8] * z + worldMatrix[12];
    worldLocation[1] = worldMatrix[1] * x + worldMatrix[5] * y + worldMatrix[9] * z + worldMatrix[13];
    worldLocation[2] = worldMatrix[2] * x + worldMatrix[6] * y + worldMatrix[10] * z + worldMatrix[14];
    inverseWorldLocation[0] = -worldLocation[0];
    inverseWorldLocation[1] = -worldLocation[1];
    inverseWorldLocation[2] = -worldLocation[2];
  }
  /**
   * Allows inherited node classes to run extra transformations when billboarding.
   * 
   * This is needed because the different model formats are in different vector spaces.
   */
  convertBasis(rotation) {
  }
};
var NODE_SHARED_SIZE = 65;
function createSkeletalNodes(count, Node = SkeletalNode) {
  let data = new Float32Array(count * NODE_SHARED_SIZE);
  let nodes2 = [];
  let offset = 0;
  let count3 = count * 3;
  let count4 = count * 4;
  let count16 = count * 16;
  let pivots = data.subarray(offset, offset + count3);
  offset += count3;
  let localLocations = data.subarray(offset, offset + count3);
  offset += count3;
  let localRotations = data.subarray(offset, offset + count4);
  offset += count4;
  let localScales = data.subarray(offset, offset + count3);
  offset += count3;
  let worldLocations = data.subarray(offset, offset + count3);
  offset += count3;
  let worldRotations = data.subarray(offset, offset + count4);
  offset += count4;
  let worldScales = data.subarray(offset, offset + count3);
  offset += count3;
  let inverseWorldLocations = data.subarray(offset, offset + count3);
  offset += count3;
  let invereseWorldRotations = data.subarray(offset, offset + count4);
  offset += count4;
  let inverseWorldScales = data.subarray(offset, offset + count3);
  offset += count3;
  let localMatrices = data.subarray(offset, offset + count16);
  offset += count16;
  let worldMatrices = data.subarray(offset, offset + count16);
  for (let i = 0; i < count; i++) {
    let i3 = i * 3;
    let i33 = i3 + 3;
    let i4 = i * 4;
    let i44 = i4 + 4;
    let i16 = i * 16;
    let i1616 = i16 + 16;
    nodes2[i] = new Node(
      pivots.subarray(i3, i33),
      localLocations.subarray(i3, i33),
      localRotations.subarray(i4, i44),
      localScales.subarray(i3, i33),
      worldLocations.subarray(i3, i33),
      worldRotations.subarray(i4, i44),
      worldScales.subarray(i3, i33),
      inverseWorldLocations.subarray(i3, i33),
      invereseWorldRotations.subarray(i4, i44),
      inverseWorldScales.subarray(i3, i33),
      localMatrices.subarray(i16, i1616),
      worldMatrices.subarray(i16, i1616)
    );
  }
  return {
    data,
    nodes: nodes2,
    pivots,
    localLocations,
    localRotations,
    localScales,
    worldLocations,
    worldRotations,
    worldScales,
    inverseWorldLocations,
    invereseWorldRotations,
    inverseWorldScales,
    localMatrices,
    worldMatrices
  };
}

// validate_animation.ts
var import_gl_matrix2 = __toESM(require_cjs());

module.exports={Model,createSkeletalNodes,math:import_gl_matrix2};
