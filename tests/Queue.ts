import {expect} from 'chai';
import Queue from '../src/Queue';

describe('Queue', () => {
	it('should add nodes as expected', () => {
		const q = new Queue<string>(['a', 'b', 'c', 'd']);
		expect(q.getCount()).equal(q.count);
		expect(q.isEmpty).to.be.false;
		expect(q.peek()).equal('a');
		let result: string = '';
		for(const e of q)
		{
			result += e;
		}
		expect(q.count).equal(4);
		expect(result).equal('abcd');
		expect(() => {
			for(const e of q)
			{
				q.enqueue(e);
			}
		}).to.throw; // collection modified.

		result = q.dump(3).join('');
		expect(result).equal('abc');
		expect(q.dequeue()).equal('d');
		expect(q.isEmpty).to.be.true;
		expect(q.count).equal(0);
		expect(q.clear()).equal(0);

		q.enqueueThese('a', 'b', 'c');
		q.enqueue('d');
		result = '';
		for(const e of q)
		{
			result += e;
		}
		expect(q.count).equal(4);
		expect(result).equal('abcd');
		expect(q.dump().join('')).equal('abcd');
		q.enqueue('e');
		expect(q.isEmpty).to.be.false;
		q.dispose();
		expect(q.isEmpty).to.be.true;
		expect(q.peek()).to.be.undefined;
		expect(() => q.peek(true)).to.throw;
	});

	it('should stop dequeuing', () => {
		const source = ['a', 'b', 'c', 'd'];
		const q = new Queue<string>(source);
		for(const e of source)
		{
			expect(q.dequeue()).equal(e);
		}
		expect(q.isEmpty).to.be.true;
		expect(q.dequeue()).to.be.undefined;
		expect(() => q.dequeue(true)).to.throw;
		q.enqueueThese('e', 'f');
		expect(q.dequeue()).equal('e');
		expect(q.tryDequeue(d => expect(d).equal('f'))).to.be.true;
		expect(q.tryDequeue(() => { throw 'should not execute';})).to.be.false;
		q.recycle();
		expect(q.isEmpty).to.be.true;
	});
});
