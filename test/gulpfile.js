const { src, dest } = require('gulp');
const plugin = require('./../dist/index');

function test() {
   return src('src/index.html')
      .pipe(plugin())
      .pipe(dest('dist'));
}

exports.default = test;