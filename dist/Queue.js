"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ArgumentNullException_1 = tslib_1.__importDefault(require("@tsdotnet/exceptions/dist/ArgumentNullException"));
const InvalidOperationException_1 = tslib_1.__importDefault(require("@tsdotnet/exceptions/dist/InvalidOperationException"));
const IterableCollectionBase_1 = tslib_1.__importDefault(require("@tsdotnet/collection-base/dist/IterableCollectionBase"));
class Queue extends IterableCollectionBase_1.default {
    constructor(initialEntries) {
        super();
        this._root = {};
        this._count = 0;
        if (initialEntries)
            this.enqueueMultiple(initialEntries);
    }
    /**
     * The number of items currently in the queue.
     * @returns {number}
     */
    get count() {
        return this._count;
    }
    /**
     * Returns the number of items currently in the queue.
     * @returns {number}
     */
    getCount() {
        return this._count;
    }
    /**
     * Adds an item to the end of the queue.
     * @param value
     * @returns {this}
     */
    enqueue(value) {
        this._enqueueInternal(value);
        this._incrementVersion();
        return this;
    }
    /**
     * Adds items to the end of the queue.
     * @param {Iterable} values
     * @returns {this}
     */
    enqueueMultiple(values) {
        if (!values)
            return this;
        for (const v of values) {
            this._enqueueInternal(v);
        }
        this._incrementVersion();
        return this;
    }
    /**
     * Adds items to the end of the queue.
     * @param values
     * @returns {this}
     */
    enqueueThese(...values) {
        return this.enqueueMultiple(values);
    }
    dequeue(throwIfEmpty = false) {
        const n = this._root.next;
        if (this._dequeueInternal(n)) {
            this._incrementVersion();
            return n.value;
        }
        if (throwIfEmpty)
            throw new InvalidOperationException_1.default('Cannot dequeue an empty queue.');
        return undefined;
    }
    /**
     * Checks to see if the queue has entries an pulls an entry from the head of the queue and passes it to the out handler.
     * @param out The 'out' handler that receives the value if it exists.
     * @returns {boolean} True if a value was retrieved.  False if not.
     */
    tryDequeue(out) {
        if (!out)
            throw new ArgumentNullException_1.default('out');
        const n = this._root.next;
        if (!this._dequeueInternal(n))
            return false;
        this._incrementVersion();
        out(n.value);
        return true;
    }
    peek(throwIfEmpty = false) {
        const n = this._root.next;
        if (n)
            return n.value;
        if (throwIfEmpty)
            throw new InvalidOperationException_1.default('Cannot call peek on an empty queue.');
        return undefined;
    }
    /**
     * Dequeues entries into an array.
     */
    dump(max = Infinity) {
        if (!this.count)
            return [];
        const result = [];
        if (isFinite(max)) {
            while (max-- >= 0) {
                const n = this._root.next;
                if (!this._dequeueInternal(n))
                    break;
                result.push(n.value);
            }
        }
        else {
            let n = this._root.next;
            while (this._dequeueInternal(n)) {
                result.push(n.value);
                n = this._root.next;
            }
        }
        this._incrementVersion();
        return result;
    }
    /**
     * Clears the list.
     */
    clear() {
        const count = this._count;
        this._root.next = undefined;
        this._tail = undefined;
        this._count = 0;
        return count;
    }
    /**
     * Clears the list.
     */
    dispose() {
        this.clear();
    }
    /**
     * Clears the list.
     */
    recycle() {
        this.clear();
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
    _dequeueInternal(n) {
        if (!n)
            return false;
        this._root.next = n.next;
        if (n.next)
            n.next = undefined;
        else
            this._tail = undefined;
        this._count--;
        return true;
    }
}
exports.default = Queue;
//# sourceMappingURL=Queue.js.map