/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import ArgumentNullException from '@tsdotnet/exceptions/dist/ArgumentNullException';
import InvalidOperationException from '@tsdotnet/exceptions/dist/InvalidOperationException';
import IterableCollectionBase from '@tsdotnet/collection-base/dist/IterableCollectionBase';
export default class Queue extends IterableCollectionBase {
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
     * Returns true if the queue is empty.
     * @return {boolean}
     */
    get isEmpty() {
        return this._count === 0;
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
        this.incrementVersion();
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
        this.incrementVersion();
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
            this.incrementVersion();
            return n.value;
        }
        if (throwIfEmpty)
            throw new InvalidOperationException('Cannot dequeue an empty queue.');
        return undefined;
    }
    /**
     * Checks to see if the queue has entries an pulls an entry from the head of the queue and passes it to the out handler.
     * @param out The 'out' handler that receives the value if it exists.
     * @returns {boolean} True if a value was retrieved.  False if not.
     */
    tryDequeue(out) {
        if (!out)
            throw new ArgumentNullException('out');
        const n = this._root.next;
        if (!this._dequeueInternal(n))
            return false;
        this.incrementVersion();
        out(n.value);
        return true;
    }
    peek(throwIfEmpty = false) {
        const n = this._root.next;
        if (n)
            return n.value;
        if (throwIfEmpty)
            throw new InvalidOperationException('Cannot call peek on an empty queue.');
        return undefined;
    }
    /**
     * Dequeues entries into an array.
     */
    dump(max = Infinity) {
        if (!this.count)
            return [];
        const result = [];
        const root = this._root;
        if (isFinite(max)) {
            while (0 <= --max) {
                const n = root.next;
                if (!this._dequeueInternal(n))
                    break;
                result.push(n.value);
            }
        }
        else {
            let n = root.next;
            while (this._dequeueInternal(n)) {
                result.push(n.value);
                n = root.next;
            }
        }
        this.incrementVersion();
        return result;
    }
    /**
     * Produces an iterable that dequeues items when iterated.  Stops when empty.
     * @return {Iterable}
     */
    consumer() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _ = this, root = this._root;
        return {
            *[Symbol.iterator]() {
                while (true) {
                    const n = root.next;
                    if (!_._dequeueInternal(n))
                        break;
                    _.incrementVersion();
                    yield n.value;
                }
            }
        };
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
        const count = this._count;
        if (!count)
            throw new Error('Dequeuing empty collection.');
        this._count = count - 1;
        return true;
    }
}
//# sourceMappingURL=Queue.js.map