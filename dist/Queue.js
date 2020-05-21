"use strict";
/*
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 * Based Upon: http://referencesource.microsoft.com/#System/CompMod/system/collections/generic/queue.cs
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-this-alias */
const QueueBase_1 = tslib_1.__importDefault(require("./QueueBase"));
const MINIMUM_GROW = 4;
const DEFAULT_CAPACITY = 4;
const SHRINK_THRESHOLD = 42;
class Queue extends QueueBase_1.default {
    constructor(initialEntries) {
        super();
        this._head = 0; // First valid element in the queue
        this._tail = 0; // Last valid element in the queue
        this._size = 0; // Number of elements.
        if (!initialEntries)
            this._array = new Array(DEFAULT_CAPACITY);
        else {
            this._array = initialEntries.slice();
            this._tail = this._size = this._array.length;
        }
    }
    getCount() {
        return this._size;
    }
    clear() {
        const _ = this, size = _._size;
        _._array.length = 0;
        _._head = 0;
        _._tail = 0;
        _._size = 0;
        _.incrementVersion();
        return size;
    }
    /**
     * Dequeues entries into an array.
     */
    dump(max = Infinity) {
        const _ = this;
        const result = new Array(Math.min(max, _._size));
        if (isFinite(max)) {
            if (max !== 0) {
                let i = 0;
                while (max-- && _._size)
                    result[i++] = _._dequeueInternal();
            }
        }
        else {
            while (_._size)
                result.push(_._dequeueInternal());
        }
        _.incrementVersion();
        return result;
    }
    setCapacity(capacity) {
        if (isNaN(capacity))
            return this;
        if (capacity < 0)
            capacity = 0;
        const _ = this;
        const array = _._array, len = array.length;
        if (capacity == len)
            return this;
        const head = _._head, tail = _._tail, size = _._size;
        if (!size) {
            array.length = capacity;
            this._head = 0;
            this._tail = 0;
            return this;
        }
        // Special case where we can simply extend or shrink the length of the array.
        if (head < tail && capacity >= tail) {
            array.length = capacity;
            return this;
        }
        // We create a new array because modifying an existing one could be slow.
        const newArray = new Array(capacity);
        let i, n = 0;
        if (head < tail) {
            for (i = head; i < tail; i++)
                newArray[n++] = array[i];
        }
        else {
            for (i = head; i < len; i++)
                newArray[n++] = array[i];
            for (i = 0; i < tail; i++)
                newArray[n++] = array[i];
        }
        this._array = newArray;
        _._head = 0;
        _._tail = (size == capacity) ? 0 : size;
        _.incrementVersion();
        return this;
    }
    /**
     * Checks to see if the queue has entries an pulls an entry from the head of the queue and passes it to the out handler.
     * @param out The 'out' handler that receives the value if it exists.
     * @returns {boolean} True if a value was retrieved.  False if not.
     */
    tryDequeue(out) {
        const _ = this;
        if (super.tryDequeue(out)) {
            if (_._size < _._array.length / 2)
                _.trimExcess(SHRINK_THRESHOLD);
            _.incrementVersion();
            return true;
        }
        return false;
    }
    /**
     * Trims excess items in the underlying array.
     * @param {number} threshold
     */
    trimExcess(threshold) {
        const _ = this;
        const size = _._size;
        if (size < Math.floor(_._array.length * 0.9) && (!threshold && threshold !== 0 || isNaN(threshold) || threshold < size))
            _.setCapacity(size);
    }
    _enqueueInternal(item) {
        const _ = this;
        const size = _._size;
        let len = _._array.length;
        if (size === len) {
            let newCapacity = len * 2;
            if (newCapacity < len + MINIMUM_GROW)
                newCapacity = len + MINIMUM_GROW;
            _.setCapacity(newCapacity);
            len = _._array.length;
        }
        const tail = _._tail % len;
        _._array[tail] = item;
        _._tail = (tail + 1) % len;
        _._size = size + 1;
    }
    _dequeueInternal() {
        if (!this._size)
            return undefined;
        const array = this._array, head = this._head;
        const removed = array[head];
        array[head] = undefined; // protect the data.
        this._head = (head + 1) % array.length;
        this._size--;
        return removed;
    }
    _peekInternal() {
        const _ = this;
        return _._size ? _._array[_._head] : undefined;
    }
    *_getIterator() {
        const _ = this, size = _._size;
        for (let i = 0; i < size; i++)
            yield _._getElement(i);
    }
    _getElement(index) {
        const _ = this, a = _._array;
        return _._size ? a[(_._head + index) % a.length] : undefined;
    }
}
exports.default = Queue;
//# sourceMappingURL=Queue.js.map