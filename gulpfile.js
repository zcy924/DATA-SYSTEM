const { src, dest } = require('gulp');
const ts = require('gulp-typescript');
const array = [
  'src/data_visual/component.packages/custom',
  'src/data_visual/component.packages/standard',
  'src/data_visual/data.source.packages/mock',
  'src/data_visual/runtime',
  'src/data_visual/shared',
], filePattern = [
  '/**/*.less',
  '/**/*.d.ts',
  '/**/*.svg',
  '/**/*.png',
  '/**/*.js',
  '/**/*.js.map',
  '/package.json',
  '/README.md',
];


function copy(srcArray, b) {
  return src(srcArray)
    .pipe(dest('output/' + b + '/'));
}

exports.default = async () => {
  // array.forEach((value, index, array) => {
  //   const qq = value.split('/');
  //   copy(aa.map(value1 => value + value1), qq[qq.length - 1]);
  // });
};
