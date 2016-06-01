'use strict';

var yargs = require('yargs').argv;

import gulp from 'gulp';
import chokidar from 'chokidar';
import sass from 'gulp-sass';
import minify from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import header from 'gulp-header';
import pkg from './package.json';
import path from 'path';
import express from 'express';

// 构建后的目标地址
const dist = path.join(__dirname, 'dist');

// release 整个项目
gulp.task('release', () => {

    const option = {base: 'src'};
    const banner = [
        '/*!',
        ' * WeUI-sass v<%= pkg.version %> (<%= pkg.homepage %>)',
        ' * Author： <%= pkg.author %>.',
        ' * Time： <%= new Date().getFullYear() %>/<%= new Date().getMonth() %>/<%= new Date().getDate() %>.',
        ' */',
        ''].join('\n');

    // 复制非scss文件到dist
    gulp.src('src/example/**/*.!(scss)', option)
        .pipe(gulp.dest(dist));

    gulp.src('src/example/**/*.scss', option)
        .pipe(sass())
        .pipe(gulp.dest(dist));

    gulp.src('src/style/weui.scss', option)
        .pipe(sass().on('error', (e) => {
            console.error(e.message);
            this.emit('end');
        }))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(autoprefixer())
        .pipe(gulp.dest(dist))
        .pipe(minify())
        .pipe(rename( (path) => {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(dist));
});

// 如果文件发生变动则直接release
gulp.task('watch', () => {
    chokidar.watch('src/**/*.*').on('all', () => {
        gulp.run('release');
    });
});

// 启动server
gulp.task('server', () => {
    const app = express();
    const port = yargs.p || yargs.port || 8080;
    app.use(express.static(dist));
    app.listen(port, () => {
        port = port === 80 ? '' : ':' + port;
        const url = 'http://127.0.0.1' + port;
        console.log(url);
    });
});


// 参数说明
//  -w: 实时监听
//  -s: 启动服务器
//  -p: 服务器启动端口，默认8080
gulp.task('default', () => {
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