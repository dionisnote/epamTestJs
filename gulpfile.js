var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var ugly = require("gulp-uglify");

var jsFiles = [
		'./sources/js/data.js', 
		'./sources/js/productItem.js', 
		'./sources/js/productListView.js', 
		'./sources/js/productList.js', 
		'./sources/js/app.js', 
		];

gulp.task('js', function() {
	gulp.src(jsFiles)
		.pipe( concat('list.min.js') )
		// .pipe( ugly() )
		.pipe( gulp.dest('./public/js') )
});
gulp.task('sass', function() {
	gulp.src("./sources/sass/*.scss")
		.pipe( sass({outputStyle:"compressed"}).on('error', sass.logError) )
		.pipe( gulp.dest('./public/css') )
});

gulp.task('default', ['sass','js']);  

gulp.task('watch', function(){
	gulp.watch(jsFiles, ['js']);
	gulp.watch([ "./sources/sass/*.scss" ], ['sass']);
});  