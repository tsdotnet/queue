"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueBase = exports.LinkQueue = exports.Queue = void 0;
const tslib_1 = require("tslib");
const Queue_js_1 = tslib_1.__importDefault(require("./Queue.js"));
exports.Queue = Queue_js_1.default;
var LinkQueue_js_1 = require("./LinkQueue.js");
Object.defineProperty(exports, "LinkQueue", { enumerable: true, get: function () { return tslib_1.__importDefault(LinkQueue_js_1).default; } });
var QueueBase_js_1 = require("./QueueBase.js");
Object.defineProperty(exports, "QueueBase", { enumerable: true, get: function () { return tslib_1.__importDefault(QueueBase_js_1).default; } });
exports.default = Queue_js_1.default;
//# sourceMappingURL=index.js.map