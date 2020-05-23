/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import IterableCollectionBase from '@tsdotnet/collection-base/dist/IterableCollectionBase';
import InvalidOperationException from '@tsdotnet/exceptions/dist/InvalidOperationException';
import ArgumentNullException from '@tsdotnet/exceptions/dist/ArgumentNullException';
export default class QueueBase extends IterableCollectionBase {
    /**
     * The number of items currently in the queue.
     * @returns {number}
     */
    get count() {
        return this.getCount();
    }
    /**
     * Returns true if the queue is empty.
     * @return {boolean}
     */
    get isEmpty() {
        return this.getCount() === 0;
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
        let hasValues = false;
        for (const v of values) {
            hasValues = true;
            this._enqueueInternal(v);
        }
        if (hasValues)
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
    /**
     * Produces an iterable that dequeues items when iterated.  Stops when empty.
     * @return {Iterable}
     */
    consumer() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _ = this;
        return {
            *[Symbol.iterator]() {
                while (_.getCount()) {
                    yield _.dequeue(true);
                }
            }
        };
    }
    /**
     * Pulls an entry from the head of the queue and returns it.
     * Returns undefined if the queue is already empty and throwIfEmpty is false.
     * @throws {InvalidOperationException} If the queue is already empty and throwIfEmpty is true.
     * @param throwIfEmpty
     */
    dequeue(throwIfEmpty = false) {
        if (throwIfEmpty && this.isEmpty)
            throw new InvalidOperationException('Cannot dequeue an empty queue.');
        const item = this._dequeueInternal();
        this.incrementVersion();
        return item;
    }
    /**
     * Checks to see if the queue has entries an pulls an entry from the head of the queue and passes it to the out handler.
     * @throws {ArgumentNullException} If no out delegate was specified.
     * @param out The 'out' handler that receives the value if it exists.
     * @returns {boolean} True if a value was retrieved.  False if not.
     */
    tryDequeue(out) {
        if (!out)
            throw new ArgumentNullException('out');
        if (this.isEmpty)
            return false;
        const item = this._dequeueInternal();
        this.incrementVersion();
        out(item);
        return true;
    }
    /**
     * Returns the entry at the head of the queue.
     * Returns undefined if the queue is already empty and throwIfEmpty is false.
     * @throws {InvalidOperationException} If the queue is already empty and throwIfEmpty is true.
     * @param {boolean} throwIfEmpty
     * @return {T | undefined}
     */
    peek(throwIfEmpty = false) {
        if (throwIfEmpty && this.isEmpty)
            throw new InvalidOperationException('Cannot call peek on an empty queue.');
        return this._peekInternal();
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
}
//# sourceMappingURL=QueueBase.js.map