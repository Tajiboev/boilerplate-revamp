const gulp = require('gulp'),
    browserSync = require('browser-sync'),
    $ = require('gulp-load-plugins')();



gulp.task('images', (done) => {
    gulp.src('src/images/*.jpg')
        .pipe($.responsive({
            // Resize all JPG images to 800, 1280 and 1920 pixels in .jpg & .webp formats 
            '*.jpg': [{
                width: 800,
                rename: {
                    suffix: '-800px',
                    extname: '.jpg'
                },
            }, {
                width: 1280,
                rename: {
                    suffix: '-1280px',
                    extname: '.jpg'
                },
            }, {
                width: 1920,
                rename: {
                    suffix: '',
                    extname: '.jpg'
                },
                withoutEnlargement: true
            }, {
                // Convert images to the webp format
                width: 800,
                rename: {
                    suffix: '-800px',
                    extname: '.webp',
                }
            }, {
                // Convert images to the webp format
                width: 1280,
                rename: {
                    suffix: '-1280px',
                    extname: '.webp',
                }
            }, {
                // Convert images to the webp format
                width: 1920,
                rename: {
                    suffix: '',
                    extname: '.webp',
                },
                withoutEnlargement: true
            }],
        }, {
            // Global configuration for all images
            // The output quality for JPEG, WebP and TIFF output formats
            quality: 80,
            // Use progressive (interlace) scan for JPEG and PNG output
            progressive: true,
            // Strip all metadata
            withMetadata: false,
        }))
        .pipe($.size({
            title: 'images'
        }))
        .pipe(gulp.dest('public/images'));
    done();
});

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
    const AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];

    return gulp.src([
            'src/sass/*.sass',
        ])
        .pipe($.sass({
            precision: 10
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe($.cleanCss())
        .pipe($.size({
            title: 'styles'
        }))
        .pipe(gulp.dest('src/styles'))
        .pipe(gulp.dest('public/styles'))
        .pipe(browserSync.stream())
});

gulp.task('scripts', () =>
    gulp.src(
        // Note: you need to explicitly list your scripts here in the right order to be correctly concatenated
        'src/scripts/main.js'
        // Other scripts
    )
    .pipe($.babel({
        presets: ["@babel/env"]
    }))
    .pipe($.concat('main.js'))
    .pipe($.uglify())
    // Output files
    .pipe($.size({
        title: 'scripts'
    }))
    .pipe(gulp.dest('public/scripts'))
    .pipe(browserSync.reload({
        stream: true
    }))
);


gulp.task('html', () => {
    return gulp.src('src/index.html')
        .pipe($.htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeOptionalTags: true
        }))
        // Output files
        .pipe($.size({
            title: 'html'
        }))
        .pipe(gulp.dest('public/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


gulp.task('serve:src', function () {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    })
});

gulp.task('watch', function () {
    gulp.watch('src/sass/**/*.sass', gulp.parallel('styles'));
    gulp.watch('src/scripts/main.js', gulp.parallel('scripts'));
    gulp.watch('src/*.html', gulp.parallel('html'));
});

gulp.task('default', gulp.parallel('styles', 'serve:src', 'watch'));
gulp.task('build', gulp.parallel('html', 'styles', 'images', 'scripts'));