"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IterableCollectionBase_1 = (0, tslib_1.__importDefault)(require("@tsdotnet/collection-base/dist/IterableCollectionBase"));
const InvalidOperationException_1 = (0, tslib_1.__importDefault)(require("@tsdotnet/exceptions/dist/InvalidOperationException"));
const ArgumentNullException_1 = (0, tslib_1.__importDefault)(require("@tsdotnet/exceptions/dist/ArgumentNullException"));
class QueueBase extends IterableCollectionBase_1.default {
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
            throw new InvalidOperationException_1.default('Cannot dequeue an empty queue.');
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
            throw new ArgumentNullException_1.default('out');
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
            throw new InvalidOperationException_1.default('Cannot call peek on an empty queue.');
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
exports.default = QueueBase;
//# sourceMappingURL=QueueBase.js.map