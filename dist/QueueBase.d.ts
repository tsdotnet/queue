/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import IterableCollectionBase from '@tsdotnet/collection-base/dist/IterableCollectionBase';
export default abstract class QueueBase<T> extends IterableCollectionBase<T> {
    /**
     * The number of items currently in the queue.
     * @returns {number}
     */
    get count(): number;
    /**
     * Returns true if the queue is empty.
     * @return {boolean}
     */
    get isEmpty(): boolean;
    /**
     * Adds an item to the end of the queue.
     * @param value
     * @returns {this}
     */
    enqueue(value: T): this;
    /**
     * Adds items to the end of the queue.
     * @param {Iterable} values
     * @returns {this}
     */
    enqueueMultiple(values: Iterable<T>): this;
    /**
     * Adds items to the end of the queue.
     * @param values
     * @returns {this}
     */
    enqueueThese(...values: T[]): this;
    /**
     * Produces an iterable that dequeues items when iterated.  Stops when empty.
     * @return {Iterable}
     */
    consumer(): Iterable<T>;
    /**
     * Pulls an entry from the head of the queue and returns it.
     * Returns undefined if the queue is already empty.
     */
    dequeue(): T | undefined;
    /**
     * Pulls an entry from the head of the queue and returns it.
     * Returns undefined if the queue is already empty and throwIfEmpty is false.
     * @throws {InvalidOperationException} If the queue is already empty and throwIfEmpty is true.
     * @param throwIfEmpty
     */
    dequeue(throwIfEmpty: true): T | never;
    /**
     * Pulls an entry from the head of the queue and returns it.
     * Returns undefined if the queue is already empty and throwIfEmpty is false.
     * @throws {InvalidOperationException} If the queue is already empty and throwIfEmpty is true.
     * @param throwIfEmpty
     */
    dequeue(throwIfEmpty: boolean): T | undefined | never;
    /**
     * Checks to see if the queue has entries an pulls an entry from the head of the queue and passes it to the out handler.
     * @throws {ArgumentNullException} If no out delegate was specified.
     * @param out The 'out' handler that receives the value if it exists.
     * @returns {boolean} True if a value was retrieved.  False if not.
     */
    tryDequeue(out: (dequeued: T) => void): boolean;
    /**
     * Returns the entry at the head of the queue.
     * Returns undefined if the queue is already empty.
     */
    peek(): T | undefined;
    /**
     * Returns the entry at the head of the queue.
     * Returns undefined if the queue is already empty and throwIfEmpty is false.
     * @throws {InvalidOperationException} If the queue is already empty and throwIfEmpty is true.
     * @param throwIfEmpty
     */
    peek(throwIfEmpty: true): T | never;
    /**
     * Returns the entry at the head of the queue.
     * Returns undefined if the queue is already empty and throwIfEmpty is false.
     * @throws {InvalidOperationException} If the queue is already empty and throwIfEmpty is true.
     * @param throwIfEmpty
     */
    peek(throwIfEmpty: boolean): T | undefined | never;
    /**
     * Dequeues entries into an array.
     * @param {number} max
     * @return {T[]}
     */
    abstract dump(max?: number): T[];
    /**
     * Clears the list.
     */
    abstract clear(): number;
    /**
     * Clears the list.
     */
    dispose(): void;
    /**
     * Clears the list.
     */
    recycle(): void;
    protected abstract _dequeueInternal(): T | undefined;
    protected abstract _peekInternal(): T | undefined;
    protected abstract _enqueueInternal(value: T): void;
}
