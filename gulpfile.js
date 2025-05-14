const gulp = require('gulp')
const ts = require('gulp-typescript')

let tsproject = ts.createProject('tsconfig.json')
function compileTs(){
   return tsproject.src().pipe(tsproject()).js.pipe(gulp.dest('dist'))
}

function watchTs(){
    gulp.watch('src/**/*',compileTs)
}
exports.default = gulp.series(watchTs,compileTs)