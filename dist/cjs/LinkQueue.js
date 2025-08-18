"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const QueueBase_1 = tslib_1.__importDefault(require("./QueueBase"));
class LinkQueue extends QueueBase_1.default {
    constructor(initialEntries) {
        super();
        this._root = {};
        this._count = 0;
        if (initialEntries)
            this.enqueueMultiple(initialEntries);
    }
    getCount() {
        return this._count;
    }
    dump(max = Infinity) {
        if (!this.count)
            return [];
        const result = [];
        const root = this._root;
        if (isFinite(max)) {
            while (0 <= --max) {
                const n = root.next;
                if (!this._dequeueNodeInternal(n))
                    break;
                result.push(n.value);
            }
        }
        else {
            let n = root.next;
            while (this._dequeueNodeInternal(n)) {
                result.push(n.value);
                n = root.next;
            }
        }
        this.incrementVersion();
        return result;
    }
    clear() {
        const count = this._count;
        this._root.next = undefined;
        this._tail = undefined;
        this._count = 0;
        return count;
    }
    _dequeueInternal() {
        const n = this._root.next;
        return this._dequeueNodeInternal(n) ? n.value : undefined;
    }
    _peekInternal() {
        var _a;
        return (_a = this._root.next) === null || _a === void 0 ? void 0 : _a.value;
    }
    *_getIterator() {
        let current, next = this._root.next;
        while (next) {
            current = next;
            next = current.next;
            yield current.value;
        }
    }
    _enqueueInternal(value) {
        const newTail = { value: value };
        const tail = this._tail;
        if (tail)
            tail.next = newTail;
        else
            this._root.next = newTail;
        this._tail = newTail;
        this._count++;
    }
    _dequeueNodeInternal(n) {
        if (!n)
            return false;
        this._root.next = n.next;
        if (n.next)
            n.next = undefined;
        else
            this._tail = undefined;
        const count = this._count;
        if (!count)
            throw new Error('Dequeuing empty collection.');
        this._count = count - 1;
        return true;
    }
}
exports.default = LinkQueue;
//# sourceMappingURL=LinkQueue.js.map