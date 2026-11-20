(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tsdotnet/collection-base'), require('@tsdotnet/exceptions')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tsdotnet/collection-base', '@tsdotnet/exceptions'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.tsdotnet = global.tsdotnet || {}, global.tsdotnet.queue = global.tsdotnet.queue || {}), global.tsdotnet.collectionBase, global.tsdotnet.exceptions));
})(this, (function (exports, collectionBase, exceptions) { 'use strict';

    /*!
     * @author electricessence / https://github.com/electricessence/
     * @license MIT
     */
    class QueueBase extends collectionBase.IterableCollectionBase {
        get count() {
            return this.getCount();
        }
        get isEmpty() {
            return this.getCount() === 0;
        }
        enqueue(value) {
            this._enqueueInternal(value);
            this.incrementVersion();
            return this;
        }
        enqueueMultiple(values) {
            if (!values)
                return this;
            let hasValues = false;
            for (const v of values) {
                hasValues = true;
                this._enqueueInternal(v);
            }
            if (hasValues)
                this.incrementVersion();
            return this;
        }
        enqueueThese(...values) {
            return this.enqueueMultiple(values);
        }
        consumer() {
            const _ = this;
            return {
                *[Symbol.iterator]() {
                    while (_.getCount()) {
                        yield _.dequeue(true);
                    }
                }
            };
        }
        dequeue(throwIfEmpty = false) {
            if (throwIfEmpty && this.isEmpty)
                throw new exceptions.InvalidOperationException('Cannot dequeue an empty queue.');
            const item = this._dequeueInternal();
            this.incrementVersion();
            return item;
        }
        tryDequeue(out) {
            if (!out)
                throw new exceptions.ArgumentNullException('out');
            if (this.isEmpty)
                return false;
            const item = this._dequeueInternal();
            this.incrementVersion();
            out(item);
            return true;
        }
        peek(throwIfEmpty = false) {
            if (throwIfEmpty && this.isEmpty)
                throw new exceptions.InvalidOperationException('Cannot call peek on an empty queue.');
            return this._peekInternal();
        }
        dispose() {
            this.clear();
        }
        recycle() {
            this.clear();
        }
    }

    const MINIMUM_GROW = 4;
    const DEFAULT_CAPACITY = 4;
    const SHRINK_THRESHOLD = 42;
    class Queue extends QueueBase {
        _array;
        _head = 0;
        _tail = 0;
        _size = 0;
        constructor(initialEntries) {
            super();
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
            if (head < tail && capacity >= tail) {
                array.length = capacity;
                return this;
            }
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
        tryDequeue(out) {
            const _ = this;
            if (super.tryDequeue(out)) {
                if (_._size < _._array.length / 2)
                    _.trimExcess(SHRINK_THRESHOLD);
                return true;
            }
            return false;
        }
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
            array[head] = undefined;
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

    /*!
     * @author electricessence / https://github.com/electricessence/
     * @license MIT
     */
    class LinkQueue extends QueueBase {
        _root = {};
        _tail;
        _count = 0;
        constructor(initialEntries) {
            super();
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
            return this._root.next?.value;
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

    exports.LinkQueue = LinkQueue;
    exports.Queue = Queue;
    exports.QueueBase = QueueBase;
    exports.default = Queue;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=queue.js.map
