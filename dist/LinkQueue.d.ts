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
export default class LinkQueue<T> extends QueueBase<T> {
    private _root;
    private _tail?;
    private _count;
    constructor(initialEntries?: Iterable<T> | null);
    /**
     * Returns the number of items currently in the queue.
     * @returns {number}
     */
    getCount(): number;
    /**
     * Dequeues entries into an array.
     */
    dump(max?: number): T[];
    /**
     * Clears the list.
     */
    clear(): number;
    protected _dequeueInternal(): T | undefined;
    protected _peekInternal(): T | undefined | never;
    protected _getIterator(): Iterator<T>;
    protected _enqueueInternal(value: T): void;
    private _dequeueNodeInternal;
}
