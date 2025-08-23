import { describe, it, expect } from 'vitest';
import Queue, { LinkQueue, QueueBase } from '../src/index.js';
import * as QueueModule from '../src/index.js';

describe('Queue Module Index', () => {
	it('should export default Queue class', () => {
		expect(Queue).toBeDefined();
		expect(typeof Queue).toBe('function');
		expect(Queue.name).toBe('Queue');
	});

	it('should export named Queue class', () => {
		expect(QueueModule.Queue).toBeDefined();
		expect(typeof QueueModule.Queue).toBe('function');
		expect(QueueModule.Queue.name).toBe('Queue');
		expect(QueueModule.Queue).toBe(Queue);
	});

	it('should export LinkQueue class', () => {
		expect(LinkQueue).toBeDefined();
		expect(typeof LinkQueue).toBe('function');
		expect(LinkQueue.name).toBe('LinkQueue');
		expect(QueueModule.LinkQueue).toBe(LinkQueue);
	});

	it('should export QueueBase class', () => {
		expect(QueueBase).toBeDefined();
		expect(typeof QueueBase).toBe('function');
		expect(QueueBase.name).toBe('QueueBase');
		expect(QueueModule.QueueBase).toBe(QueueBase);
	});

	it('should create functional Queue instances', () => {
		const queue = new Queue();
		expect(queue).toBeInstanceOf(Queue);
		expect(typeof queue.enqueue).toBe('function');
		expect(typeof queue.dequeue).toBe('function');
	});

	it('should create functional LinkQueue instances', () => {
		const linkQueue = new LinkQueue();
		expect(linkQueue).toBeInstanceOf(LinkQueue);
		expect(typeof linkQueue.enqueue).toBe('function');
		expect(typeof linkQueue.dequeue).toBe('function');
	});

	it('should validate module structure', () => {
		expect(QueueModule).toBeDefined();
		expect(typeof QueueModule).toBe('object');
		expect(Object.keys(QueueModule)).toContain('Queue');
		expect(Object.keys(QueueModule)).toContain('LinkQueue');
		expect(Object.keys(QueueModule)).toContain('QueueBase');
		expect(Object.keys(QueueModule)).toContain('default');
	});

	it('should maintain inheritance relationships', () => {
		const queue = new Queue();
		const linkQueue = new LinkQueue();
		
		// Both should be instances of QueueBase
		expect(queue).toBeInstanceOf(QueueBase);
		expect(linkQueue).toBeInstanceOf(QueueBase);
		
		// Verify inheritance chain
		expect(Queue.prototype).toBeInstanceOf(QueueBase);
		expect(LinkQueue.prototype).toBeInstanceOf(QueueBase);
	});
});
