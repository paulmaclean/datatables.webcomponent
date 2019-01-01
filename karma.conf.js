const webpack = require("webpack");

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'sinon'],
    files: [ { pattern: '**/*.test.ts', watched: false }],
    mime: { 'text/x-typescript': ['ts','tsx'] },
    preprocessors: {
      '**/*.test.ts': ['webpack', 'sourcemap'],
    },
    webpack: {
      resolve: {
        extensions: ['.js', '.ts', '.tsx']
      },
      module: {
        rules: [
          {test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/}
        ]
      },
      stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true
      },
      plugins: [
        new webpack.SourceMapDevToolPlugin({
          filename: null, // if no value is provided the sourcemap is inlined
          test: /\.(ts|js)($|\?)/i, // process .js and .ts files only
          exclude: [ /node_modules/ ]
        })
      ]
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity
  })
};