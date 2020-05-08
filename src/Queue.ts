/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import ArgumentNullException from '@tsdotnet/exceptions/dist/ArgumentNullException';
import InvalidOperationException from '@tsdotnet/exceptions/dist/InvalidOperationException';
import IterableCollectionBase from '@tsdotnet/collection-base/dist/IterableCollectionBase';

export default class Queue<T>
	extends IterableCollectionBase<T>
{
	private _root: Node<T> = {};
	private _tail?: ValueNode<T>;

	constructor (initialEntries?: Iterable<T>)
	{
		super();
		if(initialEntries) this.enqueueMultiple(initialEntries);
	}

	private _count: number = 0;

	/**
	 * The number of items currently in the queue.
	 * @returns {number}
	 */
	get count (): number
	{
		return this._count;
	}

	/**
	 * Returns the number of items currently in the queue.
	 * @returns {number}
	 */
	getCount (): number
	{
		return this._count;
	}

	/**
	 * Adds an item to the end of the queue.
	 * @param value
	 * @returns {this}
	 */
	enqueue (value: T): this
	{
		this._enqueueInternal(value);
		this.incrementVersion();
		return this;
	}

	/**
	 * Adds items to the end of the queue.
	 * @param {Iterable} values
	 * @returns {this}
	 */
	enqueueMultiple (values: Iterable<T>): this
	{
		if(!values) return this;
		for(const v of values)
		{
			this._enqueueInternal(v);
		}
		this.incrementVersion();
		return this;
	}

	/**
	 * Adds items to the end of the queue.
	 * @param values
	 * @returns {this}
	 */
	enqueueThese (...values: T[]): this
	{
		return this.enqueueMultiple(values);
	}

	/**
	 * Pulls an entry from the head of the queue and returns it.
	 * Returns undefined if the queue is already empty.
	 */
	dequeue (): T | undefined

	/**
	 * Pulls an entry from the head of the queue and returns it.
	 * Returns undefined if the queue is already empty and throwIfEmpty is false.
	 * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
	 * @param throwIfEmpty
	 */
	dequeue (throwIfEmpty: true): T | never

	/**
	 * Pulls an entry from the head of the queue and returns it.
	 * Returns undefined if the queue is already empty and throwIfEmpty is false.
	 * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
	 * @param throwIfEmpty
	 */
	dequeue (throwIfEmpty: boolean): T | undefined | never

	dequeue (throwIfEmpty: boolean = false): T | undefined | never
	{
		const n = this._root.next;
		if(this._dequeueInternal(n))
		{
			this.incrementVersion();
			return n.value;
		}
		if(throwIfEmpty) throw new InvalidOperationException('Cannot dequeue an empty queue.');
		return undefined;
	}

	/**
	 * Checks to see if the queue has entries an pulls an entry from the head of the queue and passes it to the out handler.
	 * @param out The 'out' handler that receives the value if it exists.
	 * @returns {boolean} True if a value was retrieved.  False if not.
	 */
	tryDequeue (out: (dequeued: T) => void): boolean
	{
		if(!out) throw new ArgumentNullException('out');
		const n = this._root.next;
		if(!this._dequeueInternal(n)) return false;
		this.incrementVersion();
		out(n.value);
		return true;
	}

	/**
	 * Returns the entry at the head of the queue.
	 * Returns undefined if the queue is already empty.
	 */
	peek (): T | undefined

	/**
	 * Returns the entry at the head of the queue.
	 * Returns undefined if the queue is already empty and throwIfEmpty is false.
	 * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
	 * @param throwIfEmpty
	 */
	peek (throwIfEmpty: true): T | never

	/**
	 * Returns the entry at the head of the queue.
	 * Returns undefined if the queue is already empty and throwIfEmpty is false.
	 * Throws an InvalidOperationException if the queue is already empty and throwIfEmpty is true.
	 * @param throwIfEmpty
	 */
	peek (throwIfEmpty: boolean): T | undefined | never

	peek (throwIfEmpty: boolean = false): T | undefined | never
	{
		const n = this._root.next;
		if(n) return n.value;
		if(throwIfEmpty) throw new InvalidOperationException('Cannot call peek on an empty queue.');
		return undefined;
	}

	/**
	 * Dequeues entries into an array.
	 */
	dump (max: number = Infinity): T[]
	{
		if(!this.count) return [];
		const result: T[] = [];

		if(isFinite(max))
		{
			while(max-->=0)
			{
				const n = this._root.next;
				if(!this._dequeueInternal(n)) break;
				result.push(n.value);
			}
		}
		else
		{
			let n = this._root.next;
			while(this._dequeueInternal(n))
			{
				result.push(n.value);
				n = this._root.next;
			}
		}

		this.incrementVersion();

		return result;
	}

	/**
	 * Clears the list.
	 */
	clear (): number
	{
		const count = this._count;
		this._root.next = undefined;
		this._tail = undefined;
		this._count = 0;
		return count;
	}

	/**
	 * Clears the list.
	 */
	dispose (): void
	{
		this.clear();
	}

	/**
	 * Clears the list.
	 */
	recycle (): void
	{
		this.clear();
	}

	protected* _getIterator (): Iterator<T>
	{
		let current: ValueNode<T> | undefined, next = this._root.next;

		while(next)
		{
			current = next;
			next = current.next;
			yield current.value;
		}
	}

	private _enqueueInternal (value: T): void
	{
		const newTail = {value: value};
		const tail = this._tail;
		if(tail) tail.next = newTail;
		else this._root.next = newTail;
		this._tail = newTail;
		this._count++;
	}

	private _dequeueInternal (n: ValueNode<T> | undefined): n is ValueNode<T>
	{
		if(!n) return false;
		this._root.next = n.next;
		if(n.next) n.next = undefined;
		else this._tail = undefined;
		this._count--;
		return true;
	}

}

interface Node<T>
{
	next?: ValueNode<T>;
}

interface ValueNode<T>
	extends Node<T>
{
	value: T;
}
