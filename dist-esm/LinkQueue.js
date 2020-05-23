/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import QueueBase from './QueueBase';
/**
 * A `LinkQueue<T>` will have different performance characteristics than a Queue using an array as its storage.
 * Most cases will be served well by `Queue<T>`.
 * `LinkQueue<T>` may outperform `Queue<T>` within a capacity range above 50 and below 50,000.
 */
export default class LinkQueue extends QueueBase {
    constructor(initialEntries) {
        super();
        this._root = {};
        this._count = 0;
        if (initialEntries)
            this.enqueueMultiple(initialEntries);
    }
    /**
     * Returns the number of items currently in the queue.
     * @returns {number}
     */
    getCount() {
        return this._count;
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
//# sourceMappingURL=LinkQueue.js.map