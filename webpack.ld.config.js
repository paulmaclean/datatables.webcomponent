const merge = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
    entry: "./src/standalone-ld.ts",
    output: {
        filename: './datatables.webcomponent-ld.js',
        library: 'datatables.webcomponent-ld',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
});