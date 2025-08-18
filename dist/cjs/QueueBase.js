"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const collection_base_1 = require("@tsdotnet/collection-base");
const exceptions_1 = require("@tsdotnet/exceptions");
class QueueBase extends collection_base_1.IterableCollectionBase {
    get count() {
        return this.getCount();
    }
    get isEmpty() {
        return this.getCount() === 0;
    }
    enqueue(value) {
        this._enqueueInternal(value);
        this.incrementVersion();
        return this;
    }
    enqueueMultiple(values) {
        if (!values)
            return this;
        let hasValues = false;
        for (const v of values) {
            hasValues = true;
            this._enqueueInternal(v);
        }
        if (hasValues)
            this.incrementVersion();
        return this;
    }
    enqueueThese(...values) {
        return this.enqueueMultiple(values);
    }
    consumer() {
        const _ = this;
        return {
            *[Symbol.iterator]() {
                while (_.getCount()) {
                    yield _.dequeue(true);
                }
            }
        };
    }
    dequeue(throwIfEmpty = false) {
        if (throwIfEmpty && this.isEmpty)
            throw new exceptions_1.InvalidOperationException('Cannot dequeue an empty queue.');
        const item = this._dequeueInternal();
        this.incrementVersion();
        return item;
    }
    tryDequeue(out) {
        if (!out)
            throw new exceptions_1.ArgumentNullException('out');
        if (this.isEmpty)
            return false;
        const item = this._dequeueInternal();
        this.incrementVersion();
        out(item);
        return true;
    }
    peek(throwIfEmpty = false) {
        if (throwIfEmpty && this.isEmpty)
            throw new exceptions_1.InvalidOperationException('Cannot call peek on an empty queue.');
        return this._peekInternal();
    }
    dispose() {
        this.clear();
    }
    recycle() {
        this.clear();
    }
}
exports.default = QueueBase;
//# sourceMappingURL=QueueBase.js.map