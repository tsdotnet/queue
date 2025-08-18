import { describe, it, expect } from 'vitest';
import LinkQueue from '../src/LinkQueue';
import QueueClassic from '../src/Queue';
import ShiftyQueue from '../archive/ShiftyQueue';
import HybridQueue from '../archive/HybridQueue';

type QueueConstructor<T> = new <T>(initialValues?: T[]) => (LinkQueue<T> | QueueClassic<T> | ShiftyQueue<T> | HybridQueue<T>);


QueueTest('Queue Classic', QueueClassic);
QueueTest('Link Queue', LinkQueue);

// Just to test assumptions about the base class.
QueueTest('Shifty Queue', ShiftyQueue);
QueueTest('Hybrid Queue', HybridQueue);

describe('Queue.setCapacity()', () => {
	it('should work for head flipping', () => {
		const q = new QueueClassic<number>();
		q.setCapacity(100);
		q.setCapacity(100);
		for(let i = 0; i<1000; i++)
		{
			q.enqueue(i);
		}
		q.setCapacity(1500);
		for(let i = 0; i<600; i++)
		{
			q.dequeue();
		}
		q.setCapacity(700);
		q.trimExcess();
	});
});

// describe('Hybrid Queue', () => {
// 	QueueTest(HybridQueue);
// });

function QueueTest<T> (
	name: string,
	Queue: QueueConstructor<T>,
	performanceTest: boolean = false): void
{
	describe(name, () => {
		it('should add deal with alternating enqueue dequeue', () => {
			{
				const q = new Queue<string>(['a', 'b', 'c', 'd']);
				q.enqueue(q.dequeue(true)!);
				q.enqueue(q.dequeue(true)!);
				let result: string = '';
				for(const e of q)
				{
					result += e;
				}
				expect(q.count).equal(4);
				// noinspection SpellCheckingInspection
				expect(result).equal('cdab');
			}
			{
				const q = new Queue<string>();
				q.enqueueThese('a', 'b', 'c', 'd');
				q.enqueue(q.dequeue(true)!);
				q.enqueue('e');
				q.enqueue(q.dequeue(true)!);
				let result: string = '';
				for(const e of q)
				{
					result += e;
				}
				expect(q.count).equal(5);
				// noinspection SpellCheckingInspection
				expect(result).equal('cdaeb');
			}
		});

		it('should add nodes as expected', () => {
			const q = new Queue<string>(['a', 'b', 'c', 'd']);
			expect(q.getCount()).equal(q.count);
			expect(q.isEmpty).toBe(false);
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
					q.enqueue(e); // note, this added an 'a' to end.
				}
			}).toThrow(); // collection modified.

			result = q.dump(3).join('');
			expect(result).equal('abc');
			expect(q.dequeue(), '.dequeue()').equal('d');
			expect(q.isEmpty).toBe(false);
			expect(q.dequeue(), '.dequeue()').equal('a');
			expect(q.isEmpty).toBe(true);
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
			expect(q.isEmpty).toBe(false);
			q.dispose();
			expect(q.isEmpty).toBe(true);
			expect(q.peek()).toBeUndefined();
			expect(() => q.peek(true)).toThrow();
		});

		it('should stop dequeuing', () => {
			const source = ['a', 'b', 'c', 'd'];
			const q = new Queue<string>(source);
			for(const e of source)
			{
				expect(q.dequeue()).equal(e);
			}
			expect(q.isEmpty).toBe(true);
			expect(q.dequeue()).toBeUndefined();
			expect(() => q.dequeue(true)).toThrow();
			q.enqueueThese('e', 'f');
			expect(q.dequeue()).equal('e');
			expect(q.tryDequeue(d => expect(d).equal('f'))).toBe(true);
			expect(q.tryDequeue(() => { throw 'should not execute';})).toBe(false);
			q.recycle();
			expect(q.isEmpty).toBe(true);
		});

		it('should consume as expected', () => {
			const source = ['a', 'b', 'c', 'd'];
			const q = new Queue<string>(source);
			let i = 0;
			for(const e of q.consumer())
			{
				expect(e).equal(source[i++]);
				expect(q.count).equal(source.length - i);
			}
			expect(q.isEmpty).toBe(true);
		});

		if(!performanceTest) return;

		test(10);
		test(42);
		test(100);
		test(1000);
		test(10000);
		test(50000);
		// test(65535);
		// test(100000);
		// test(1000000);
		// test(10000000);

		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		function test (size: number, repeat: number = Math.floor(50000000/size))
		{
			it(`${name} performance (size: ${size}, repeat: ${repeat})`, () => {

				const start = Date.now();
				const half = Math.floor(size/2);
				const quarter = Math.floor(size/4);
				for(let r = 0; r<repeat; r++)
				{
					const q = new Queue<number>();
					for(let i = 0; i<half; i++)
					{
						q.enqueue(i);
					}
					for(let i = 0; i<quarter; i++)
					{
						if(i!==q.dequeue(true))
							throw new Error('First quarter values not matching.');
					}
					for(let i = half; i<size; i++)
					{
						q.enqueue(i);
					}
					for(let i = quarter; i<size; i++)
					{
						const v = q.dequeue(true);
						if(i!==v)
							throw new Error(`Remaining values not matching. Actual: ${v}, Expected: ${i}`);
					}
				}

				const elapsed = Date.now() - start;
				console.log(elapsed);

				expect(true).toBe(true);
			});
		}
	});
}
