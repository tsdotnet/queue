/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import IterableCollectionBase from '@tsdotnet/collection-base/dist/IterableCollectionBase';
export default class Queue<T> extends IterableCollectionBase<T> {
    private _root;
    private _tail?;
    constructor(initialEntries?: Iterable<T> | null);
    private _count;
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
     * Returns the number of items currently in the queue.
     * @returns {number}
     */
    getCount(): number;
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
     * Pulls an entry from the head of the queue and returns it.
     * Returns undefined if the queue is already empty.
     */
    dequeue(): T | undefined;
    /**
     * Pulls an entry from the head of the queue and returns it.
     * Returns undefined if the queue is already empty and throwIfEmpty is false.
     * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
     * @param throwIfEmpty
     */
    dequeue(throwIfEmpty: true): T | never;
    /**
     * Pulls an entry from the head of the queue and returns it.
     * Returns undefined if the queue is already empty and throwIfEmpty is false.
     * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
     * @param throwIfEmpty
     */
    dequeue(throwIfEmpty: boolean): T | undefined | never;
    /**
     * Checks to see if the queue has entries an pulls an entry from the head of the queue and passes it to the out handler.
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
     * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
     * @param throwIfEmpty
     */
    peek(throwIfEmpty: true): T | never;
    /**
     * Returns the entry at the head of the queue.
     * Returns undefined if the queue is already empty and throwIfEmpty is false.
     * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
     * @param throwIfEmpty
     */
    peek(throwIfEmpty: boolean): T | undefined | never;
    /**
     * Dequeues entries into an array.
     */
    dump(max?: number): T[];
    /**
     * Produces an iterable that dequeues items when iterated.  Stops when empty.
     * @return {Iterable}
     */
    consumer(): Iterable<T>;
    /**
     * Clears the list.
     */
    clear(): number;
    /**
     * Clears the list.
     */
    dispose(): void;
    /**
     * Clears the list.
     */
    recycle(): void;
    protected _getIterator(): Iterator<T>;
    private _enqueueInternal;
    private _dequeueInternal;
}
