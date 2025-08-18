"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueBase = exports.LinkQueue = exports.Queue = void 0;
const tslib_1 = require("tslib");
const Queue_1 = tslib_1.__importDefault(require("./Queue"));
exports.Queue = Queue_1.default;
var LinkQueue_1 = require("./LinkQueue");
Object.defineProperty(exports, "LinkQueue", { enumerable: true, get: function () { return tslib_1.__importDefault(LinkQueue_1).default; } });
var QueueBase_1 = require("./QueueBase");
Object.defineProperty(exports, "QueueBase", { enumerable: true, get: function () { return tslib_1.__importDefault(QueueBase_1).default; } });
exports.default = Queue_1.default;
//# sourceMappingURL=index.js.map