import Queue from '../src/Queue';

describe('LinkedNodeList', () => {
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
});
