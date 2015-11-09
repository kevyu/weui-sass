var yargs = require('yargs').argv;
var gulp = require('gulp');
var chokidar = require('chokidar');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');

var path = require('path');

var express = require('express');

// 构建后的目标地址
var dist = path.join(__dirname, 'dist');

// release 整个项目
gulp.task('release', function(){

    var option = {base: 'src'};

    // 复制非scss文件到dist
    gulp.src('src/example/**/*.!(scss)', option)
        .pipe(gulp.dest(dist));

    gulp.src('src/example/**/*.scss', option)
    .pipe(sass())
    .pipe(gulp.dest(dist));

    gulp.src('src/style/weui.scss', option)
        .pipe(sass().on('error', function (e){
            console.error(e.message);
            this.emit('end');
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest(dist))
        .pipe(minify())
        .pipe(rename(function (path){
            path.basename += '.min';
        }))
        .pipe(gulp.dest(dist));
});

// 如果文件发生变动则直接release
gulp.task('watch', function () {
    chokidar.watch('src/**/*.*').on('all', function () {
        gulp.run('release');
    });
});

// 启动server
gulp.task('server', function () {
    var app = express();
    var port = yargs.p || yargs.port || 8080;
    app.use(express.static(dist));
    app.listen(port, function () {
        port = port === 80 ? '' : ':' + port;
        var url = 'http://127.0.0.1' + port;
        console.log(url);
    });
});


// 参数说明
//  -w: 实时监听
//  -s: 启动服务器
//  -p: 服务器启动端口，默认8080
gulp.task('default', function () {
    if (yargs.w){
        gulp.start('release');
        gulp.start('watch');
    }else{
        gulp.start('release');
    }
    if (yargs.s){
        gulp.start('server');
    }
});
