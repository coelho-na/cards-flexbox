/////////////// PATHS ////////
const sassFolder = "./src/scss/**/*.scss";
const sassSRC = "./src/scss/style.scss";
const htmlFile = "./index.html";
const cssComp = "./dist/css/style.css";
const folderDist = "./dist/css/";

/////// PLUGINS ////////////////
const { src, dest, watch, series } = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const mode = require("gulp-mode")();
const sourceMaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const cleanCss = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");

////// Watch for files Change //////////

function watchForChanges() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "./",
    },
  });

  watch(htmlFile).on("change", browserSync.reload);
  watch(sassFolder, series(Sass, minifyCSS, cssInject));
}

// Compile Sass to CSS /////

function Sass() {
  return src(sassSRC)
    .pipe(mode.development(sourceMaps.init()))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(mode.development(sourceMaps.write()))
    .pipe(dest(folderDist));
}

//// Minify Css already compiled for Sass Task //////

function minifyCSS() {
  return src(cssComp)
    .pipe(mode.development(sourceMaps.init()))
    .pipe(cleanCss())
    .pipe(concat("style.css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(mode.development(sourceMaps.write()))
    .pipe(dest(folderDist));
}

////// Inject Styles directly in "style.min.css"

function cssInject() {
  return src(folderDist + "style.min.css").pipe(browserSync.stream());
}

exports.watchForChanges = watchForChanges;
exports.Sass = Sass;
exports.minifyCSS = minifyCSS;
exports.cssInject = cssInject;
exports.default = watchForChanges;
