const path = require('path');

module.exports = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: ["es2015", "react"]
                }
            },
            {
                test: /\.css$/,
                use: ['css-loader','style-loader']

            },
            {
                test: /\.scss$/,
                use:['style-loader','css-loader','sass-loader']
            },
            {
                test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader: 'file'
            }
        ]
    }
};