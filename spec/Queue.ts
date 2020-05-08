import Queue from '../src/Queue';

describe('Queue', () => {
	it('should add nodes as expected', () => {
		const q = new Queue<string>(['a', 'b', 'c', 'd']);
		let result: string = '';
		for(const e of q)
		{
			result += e;
		}
		expect(q.count).toBe(4);
		// noinspection SpellCheckingInspection
		expect(result).toBe('abcd');
		expect(() => {
			for(const e of q)
			{
				q.enqueue(e);
			}
		}).toThrow(); // collection modified.

		q.clear();
		expect(q.count).toBe(0);

		q.enqueueThese('a', 'b', 'c', 'd');
		result = '';
		for(const e of q)
		{
			result += e;
		}
		expect(q.count).toBe(4);
		// noinspection SpellCheckingInspection
		expect(result).toBe('abcd');
	});

	it('should stop dequeuing', () => {
		const source = ['a', 'b', 'c', 'd'];
		const q = new Queue<string>(source);
		for(const e of source)
		{
			expect(q.dequeue()).toBe(e);
		}
		expect(q.dequeue()).toBeUndefined();
		expect(() => q.dequeue(true)).toThrow();
		q.enqueueThese('e', 'f');
		expect(q.dequeue()).toBe('e');
		expect(q.tryDequeue(d => expect(d).toBe('f'))).toBeTrue();
		expect(q.tryDequeue(() => { throw 'should not execute';})).toBeFalse();
	});
});
