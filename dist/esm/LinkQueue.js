import QueueBase from './QueueBase.js';

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

export { LinkQueue as default };
//# sourceMappingURL=LinkQueue.js.map
