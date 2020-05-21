import QueueBase from './QueueBase';
export default class Queue<T> extends QueueBase<T> {
    protected _array: T[];
    protected _head: number;
    protected _tail: number;
    protected _size: number;
    constructor(initialEntries?: T[]);
    getCount(): number;
    clear(): number;
    /**
     * Dequeues entries into an array.
     */
    dump(max?: number): T[];
    setCapacity(capacity: number): this;
    /**
     * Checks to see if the queue has entries an pulls an entry from the head of the queue and passes it to the out handler.
     * @param out The 'out' handler that receives the value if it exists.
     * @returns {boolean} True if a value was retrieved.  False if not.
     */
    tryDequeue(out: (value: T) => void): boolean;
    /**
     * Trims excess items in the underlying array.
     * @param {number} threshold
     */
    trimExcess(threshold?: number): void;
    protected _enqueueInternal(item: T): void;
    protected _dequeueInternal(): T | undefined;
    protected _peekInternal(): T | undefined;
    protected _getIterator(): Iterator<T>;
    private _getElement;
}
