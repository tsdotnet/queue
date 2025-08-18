import QueueBase from './QueueBase';
export default class Queue<T> extends QueueBase<T> {
    protected _array: T[];
    protected _head: number;
    protected _tail: number;
    protected _size: number;
    constructor(initialEntries?: T[]);
    getCount(): number;
    clear(): number;
    dump(max?: number): T[];
    setCapacity(capacity: number): this;
    tryDequeue(out: (value: T) => void): boolean;
    trimExcess(threshold?: number): void;
    protected _enqueueInternal(item: T): void;
    protected _dequeueInternal(): T | undefined;
    protected _peekInternal(): T | undefined;
    protected _getIterator(): Iterator<T>;
    private _getElement;
}
