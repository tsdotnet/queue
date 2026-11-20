/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import { IterableCollectionBase } from '@tsdotnet/collection-base';
export default abstract class QueueBase<T> extends IterableCollectionBase<T> {
    get count(): number;
    get isEmpty(): boolean;
    enqueue(value: T): this;
    enqueueMultiple(values: Iterable<T>): this;
    enqueueThese(...values: T[]): this;
    consumer(): Iterable<T>;
    dequeue(): T | undefined;
    dequeue(throwIfEmpty: true): T | never;
    dequeue(throwIfEmpty: boolean): T | undefined | never;
    tryDequeue(out: (dequeued: T) => void): boolean;
    peek(): T | undefined;
    peek(throwIfEmpty: true): T | never;
    peek(throwIfEmpty: boolean): T | undefined | never;
    abstract dump(max?: number): T[];
    abstract clear(): number;
    dispose(): void;
    recycle(): void;
    protected abstract _dequeueInternal(): T | undefined;
    protected abstract _peekInternal(): T | undefined;
    protected abstract _enqueueInternal(value: T): void;
}
