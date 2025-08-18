/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import QueueBase from './QueueBase';
export default class LinkQueue<T> extends QueueBase<T> {
    private _root;
    private _tail?;
    private _count;
    constructor(initialEntries?: Iterable<T> | null);
    getCount(): number;
    dump(max?: number): T[];
    clear(): number;
    protected _dequeueInternal(): T | undefined;
    protected _peekInternal(): T | undefined | never;
    protected _getIterator(): Iterator<T>;
    protected _enqueueInternal(value: T): void;
    private _dequeueNodeInternal;
}
