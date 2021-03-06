const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry:
        {
            "../examples/dist/index": "./examples/index.ts",
            "../examples/app/dist/index": "./examples/app/index.ts",
            "../examples/renderable/dist/index": "./examples/renderable/index.ts",
            "../examples/styling/overrides/dist/index": "./examples/styling/overrides/index.ts",
            "../examples/styling/variables/dist/index": "./examples/styling/variables/index.ts",
            "../examples/styling/theme/dist/index": "./examples/styling/theme/index.ts",
            "../examples/light-dom/dist/index": "./examples/light-dom/index.ts",
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
            {
                test: /\.tsx?$/, loader: "ts-loader", options: {
                    transpileOnly: true
                }
            },
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
        //     new BundleAnalyzerPlugin({
        //     analyzerMode: 'server',
        //     generateStatsFile: true,
        //     statsOptions: { source: false }
        // }
        // ),
    ],
    watchOptions: {
        ignored: ['*/dist/**', 'dist/**', '**/lib/**', 'node_modules']
    }
};