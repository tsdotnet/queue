/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import LinkQueue from '../src/LinkQueue';
import ShiftyQueue from './ShiftyQueue';

export default class HybridQueue<T>
	extends LinkQueue<T>
{
	private _miniQueue = new ShiftyQueue<T>();

	constructor (initialEntries?: Iterable<T> | null)
	{
		super();
		if(initialEntries) this.enqueueMultiple(initialEntries);
	}

	getCount (): number
	{
		return this._miniQueue.count + super.getCount();
	}

	clear (): number
	{
		return this._miniQueue.clear() + super.clear();
	}

	dump (max: number = Infinity): T[]
	{
		const mini = this._miniQueue.dump(max);
		max -= mini.length;
		const next = super.dump(max);
		if(!next.length && mini.length) this.incrementVersion();
		return mini.concat(next);
	}

	protected* _getIterator (): Iterator<T>
	{
		const version = this.version;
		for(const e of this._miniQueue)
		{
			this.assertVersion(version);
			yield e;
		}

		const iterator = super._getIterator();
		let n = iterator.next();
		while(!n.done)
		{
			this.assertVersion(version);
			yield n.value;
			n = iterator.next();
		}
	}

	protected _enqueueInternal (value: T): void
	{
		const miniQueue = this._miniQueue;
		if(super.getCount() || miniQueue.count===42) return super._enqueueInternal(value);
		miniQueue.enqueue(value);
	}

	protected _dequeueInternal (): T | undefined | never
	{
		const miniQueue = this._miniQueue;
		if(miniQueue.count) return miniQueue.dequeue();
		return super._dequeueInternal();
	}

	protected _peekInternal (): T | undefined
	{
		const miniQueue = this._miniQueue;
		if(miniQueue.count) return miniQueue.peek();
		return super._peekInternal();
	}
}
