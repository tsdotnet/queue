/*
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 * Based Upon: http://referencesource.microsoft.com/#System/CompMod/system/collections/generic/queue.cs
 */

/* eslint-disable no-empty, @typescript-eslint/no-this-alias */

import QueueBase from '../src/QueueBase';

/**
 * A wrapper for an array.  Uses .push(item) and .shift().
 */
export default class ShiftyQueue<T>
	extends QueueBase<T>

{
	private _array: T[];

	constructor (initialEntries?: T[])
	{
		super();

		this._array = initialEntries?.slice() || [];
	}

	getCount (): number
	{
		return this._array.length;
	}

	clear (): number
	{
		const a = this._array, size = a.length;
		a.length = 0;
		this.incrementVersion();
		return size;
	}


	/**
	 * Dequeues entries into an array.
	 */
	dump (max: number = Infinity): T[]
	{
		const a = this._array;
		if(max<a.length)
		{
			this._array = a.slice(max);
			a.length = max;
		}
		else
		{
			this._array = [];
		}
		this.incrementVersion();
		return a;
	}

	protected _enqueueInternal (item: T): void
	{
		this._array.push(item);
	}


	protected _dequeueInternal (): T | undefined
	{
		return this._array.shift()!;
	}

	protected _peekInternal (): T | undefined
	{
		return this._array[0];
	}

	protected _getIterator (): Iterator<T>
	{
		return this._array[Symbol.iterator]();
	}
}
