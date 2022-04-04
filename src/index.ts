import through2, { TransformCallback } from 'through2';

function test(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
   callback(null, chunk);
}

module.exports = function () {
   return through2.obj(test);
};
