var gulp         = require('gulp');
var compass      = require('gulp-compass');
var util         = require('gulp-util');
var connect      = require('gulp-connect');
var watch        = require('gulp-watch');
var livereload   = require('gulp-livereload');
var imagemin     = require('gulp-imagemin');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var minifyCSS    = require('gulp-minify-css');
var clean        = require('gulp-clean');
var pngcrush     = require('imagemin-pngcrush');
var jade         = require('gulp-jade');
var autoprefixer = require('gulp-autoprefixer');


var files = ['src/**/*.*', 'gulpfile.js'];

gulp.task('connect', function() {
  connect.server({
    root: __dirname + '/build/',
    port: 9001,
    livereload: true,
    hostname: '0.0.0.0'
  });
});

/* Rodando o servidor para teste */
gulp.task('connect-teste', function() {
  connect.server({
    root: __dirname + '/dist/',
    port: 9002,
    livereload: false,
    hostname: '0.0.0.0'
  });
});

/* Começa CSS */
  gulp.task('compass', function() {
    gulp.src('src/style/main.sass')
    .pipe(compass({
      /* Precisa de $ gem install sass-globbing (https://github.com/chriseppstein/sass-globbing) para importar diretorios @import diretorio/* */
      config_file: 'config.rb',
      css: 'build/css',
      sass: 'src/style/',
      image: 'build/images'
    }))
    .pipe(autoprefixer({
        browsers: ['> 0.01%'],
        cascade: false
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(connect.reload());
  });
/* Termina CSS */

/* Começa Jade */
gulp.task('jade', function() {
//  var YOUR_LOCALS = {};
  gulp.src('src/*.jade')
    .pipe(jade({
//      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('build/'))
    .pipe(connect.reload());
});
/* Termina Jade */

gulp.task('build', function() {
  gulp.start('jade', 'compass');
});

/* Minificando */
gulp.task('min-dist', function() {
  gulp.start('min-css', 'min-js', 'min-img');
});
  gulp.task('min-css', function() {
    gulp.src('build/css/main.css')
      .pipe(minifyCSS({keepBreaks:false}))
      .pipe(gulp.dest('dist/css/'))
  });
  gulp.task('min-js', function() {
    gulp.src('build/js/main.js')
      .pipe(uglify())
      .pipe(gulp.dest('dist/js/'))
  });
  gulp.task('min-img', function() {
    gulp.src('build/images/**/**.*')
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngcrush()]
      }))
      .pipe(gulp.dest('dist/images'));
  });

/* Limpa */
gulp.task('clean-dist', function() {
  gulp.src('dist')
  .pipe(clean({force: false}));
});

/* Copia */
gulp.task('copia-build', function() {
  gulp.src('build/**/**.*')
  .pipe(gulp.dest('dist/'));
});

gulp.task('html', function() {
  gulp.src('src/*.html')
  .pipe(gulp.dest('build/'))
  .pipe(connect.reload());
});

gulp.task('img', function() {
  gulp.src('src/images/**/*.*')
  .pipe(gulp.dest('build/images/'))
  .pipe(connect.reload());
});

/* Começa Js */
gulp.task('bootstrapjs', function() {
  gulp.src([
    //'./src/js/bootstrap/affix.js',
    //'./src/js/bootstrap/alert.js',
    //'./ require bootstrap/button.js',
//    './src/js/bootstrap/carousel.js',
//    './src/js/bootstrap/collapse.js',
    //'./src/js/bootstrap/dropdown.js',
//    './src/js/bootstrap/tab.js',
//    './src/js/bootstrap/transition.js',
    //'./src/js/bootstrap/scrollspy.js',
    //'./src/js/bootstrap/modal.js',
    //'./src/js/bootstrap/tooltip.js',
    //'./src/js/bootstrap/popover.js'
  ])
    .pipe(concat('bootstrap.js'))
    .pipe(gulp.dest('src/js/'))
});  
gulp.task('js', function() {
  gulp.src(['src/js/*.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/js/'))
});
/* Termina Js */

gulp.task('watch', function() {
  gulp.watch(files, function(event) {
    gulp.start('build');
    util.log('File '+event.path+' was '+event.type+', running tasks...');
  })
});

gulp.task('dist', ['copia-build']);
gulp.task('build', ['jade', 'compass', 'img', 'js']);
gulp.task('teste', ['connect-teste']);
gulp.task('default', ['build', 'connect', 'watch']);