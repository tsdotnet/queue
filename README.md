![@tsdotnet/queue: First in, first out. A plain queue with typed entries.](https://cdn.jsdelivr.net/gh/tsdotnet/queue@master/assets/banner.svg)

[![npm version](https://img.shields.io/npm/v/@tsdotnet/queue.svg?style=flat-square)](https://www.npmjs.com/package/@tsdotnet/queue)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/tsdotnet/queue/blob/master/LICENSE)

A first-in, first-out `Queue<T>` backed by an array, plus a linked-list `LinkQueue<T>`.

## Install

```sh
npm install @tsdotnet/queue
```

## Usage

```ts
import { Queue } from '@tsdotnet/queue';

const q = new Queue<number>([1, 2, 3]);
q.enqueue(4);
q.dequeue(); // 1
q.peek();    // 2
q.count;     // 3
```

`LinkQueue` has the same interface, backed by a linked list instead of an array.

## Use it from

ESM (`import { Queue, LinkQueue } from '@tsdotnet/queue';`) or CommonJS (`const { Queue, LinkQueue } = require('@tsdotnet/queue');`).

<details><summary>In a browser, without a bundler</summary>

```html
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/type@1/dist/umd/type.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/compare@1/dist/umd/compare.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/exceptions@1/dist/umd/exceptions.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/collection-base@2/dist/umd/collection-base.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/queue@1/dist/umd/queue.min.js"></script>
<script>
  const { Queue, LinkQueue } = tsdotnet.queue;
</script>
```

</details>

## Docs

[tsdotnet.github.io/queue](https://tsdotnet.github.io/queue/)
