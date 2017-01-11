'use strict';
// 全局配置gulp

// 1、导入需要的任务插件
// gulp gulp-less gulp-concat gulp-minify-css gulp-livereload gulp-rename gulp-watch gulp-notify gulp-plumber gulp-autoprefixer
var gulp = require('gulp'),// 导入gulp
	less = require('gulp-less'),// 导入less插件
	concat = require('gulp-concat'),// 合并文件插件
	minifycss = require('gulp-minify-css'),//压缩CSS插件
	livereload = require('gulp-livereload'),// 刷新插件
	rename = require('gulp-rename'),// 重命名插件
	watch = require('gulp-watch'),// 监听插件
	notify = require('gulp-notify'),// 消息插件
	plumber = require('gulp-plumber'),// 错误处理插件
	autoprefixer = require('gulp-autoprefixer'),// 自动添加前缀
	minifyhtml = require('gulp-html-minifier'),// 压缩html
	minJs = require('gulp-minify'),
	connect = require('gulp-connect'),
	clean = require('gulp-clean'),
	del = require('del'),
	runSequence = require('run-sequence'),
	uglify = require('gulp-uglify');// 合并压缩
//////////////////////////////// 开始 less任务 //////////////////////////////////////
var port = 3088;
// gulp.task('less',function() {
// 	livereload.listen();// 启动监听服务器
// 	// 一旦有less 文件发生变化，name就会对LESS进行编译，然后自动刷新界面
// 	gulp.watch("less/*.less",['compileLess']).on('change',livereload.changed);
// });
var proxy = require('http-proxy-middleware');
 
gulp.task('server' ,function(){
	connect.server({
		root:[__dirname],
		port:port, 
		livereload:true,
		middleware:function(connect, opt){
			return [
				proxy('/api', { //https://github.com/chimurai/http-proxy-middleware#context-matching
					target: 'http://120.24.74.199:9001/report/',
					// target: 'http://alongch.imwork.net:8099/client/',
            				changeOrigin:true //  http://192.168.10.109:8082/cl/ http://120.24.74.199:8071/client/
				})
			];
		}  
	});
});
 
// 合并文件
// var  concatFiles = ['dist/lib/jquery/jquery.mobile-events.min.js','dist/js/bootstrap/dropdown.js','dist/js/bootstrap/tableHeadFixer.js','dist/js/bootstrap/jquery.simplePagination.js','dist/js/pathHandle.noamd.js'];
var concatFiles = ['dist/js/report/report.config.js','dist/js/report/report-staff.js'];
gulp.task('concat',function(){
	gulp.src(concatFiles)
	.pipe(concat('scripts.js')) //js
	// .pipe(minifycss())// css
	.pipe(gulp.dest('dist/js/'));
});


// 3 编译LESS文件
var lessfile = 'less/style.less';
gulp.task('compileLess',function(){ 
	gulp.src(lessfile)
	.pipe(plumber({errorHandler:notify.onError('Error:<%= error.message %>')}))// less错误处理
	.pipe(notify({message:"开始编译LESS"}))// 编译less
	.pipe(less())
	.pipe(notify({message:"完成编译"}))
	.pipe(minifycss())//压缩CSS
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))//自动添加前缀
	.pipe(rename({suffix:".min"}))// 重名CSS文件
	.pipe(gulp.dest("dist/css/"))
	.pipe(notify({message:"CSS导出完成"}));
});
//////////////////////////////// 结束less任务 //////////////////////////////////////
gulp.task('less',['server'],function(){
	livereload.listen();// 启动监听服务器
	// 一旦有less 文件发生变化，name就会对LESS进行编译，然后自动刷新界面
	gulp.watch(lessfile,['compileLess']).on('change',livereload.changed);
});



// 合并CSS
gulp.task('combinecss',function(){
	gulp.src('dist/css/modules/*.css')
	.pipe(minifycss())
	.pipe(concat('modal.min.css'))// 合并后文件名
	// .pipe(md5postfix())// 文件名后面加MD5后缀
	.pipe(gulp.dest('dist/css'));
});

 
 

///////////////////////// 结束初始化  /////////////////////
///
var build ={
	dest:'release',
	js:['dist/js/report/report.config.js','dist/js/report/report-staff.js'],
	html:'./report.html',
	dir:'./dist/js/report/',
	cleanJs:'./dist/js/report/report.min.js'
}
// 压缩js
gulp.task('minjs',function(){
	gulp.src(build.js)
	.pipe(concat('report.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest(build.dir));
});
gulp.task('minhtml',function(){
	gulp.src(build.html)
	.pipe(minifyhtml({
		collapseWhitespace:true,
		minifyCSS:true,
		processScripts:[/text\/template/],
		preserveLineBreaks:true
	}))
	.pipe(rename({suffix:".min"}))
	.pipe(gulp.dest(build.dest));
});
gulp.task('clean',function(){
	return del(build.cleanJs);
});
gulp.task('build',['clean'],function(bb){
	runSequence(['minjs'], function(){

	});
});

gulp.task('default',['server'],function(){
	gulp.watch(build.js,['minjs']);
	gulp.watch('less/style.less',['compileLess']);
	gulp.watch('./dist/**/*').on('change', function (file) {
        gulp.src('./dist/**/*')
            .pipe(connect.reload());
    });
});