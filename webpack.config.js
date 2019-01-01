const TerserPlugin = require('terser-webpack-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const DtsBundleWebpack = require('dts-bundle-webpack');

module.exports = {
    entry: "./src/standalone.ts",
    output: {
        filename: './datatables.webcomponent.js',
        library: 'datatables.webcomponent',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    mode: 'production',
    resolve: {
        extensions: [".js", ".ts"]
    },
    mode: 'production',
    devtool: 'source-map',

    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                sourceMap: true,
                terserOptions: {
                    ecma: 6,
                },
            }),
        ],
    },

    module: {
        rules: [
            {test: /\.tsx?$/, loader: "ts-loader"},
            {
                test: /\.css$/,
                use: [
                    {loader: "to-string-loader"},
                    {loader: "css-loader"}
                ]
            },
        ]
    },
    plugins: [
        new DtsBundleWebpack(
            {
                name: '@p_mac/datatables.webcomponent',
                main: 'lib/src/index.d.ts',
                out: '~/lib/index.d.ts',
            }
        )
        // new BundleAnalyzerPlugin({
        //         analyzerMode: 'server',
        //         generateStatsFile: true,
        //         statsOptions: {source: false}
        //     }
        // ),
    ],
    watchOptions: {}
};