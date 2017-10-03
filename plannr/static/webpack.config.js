const path = require('path');

module.exports = {
    entry: {
        "./index": "./src/index",
        "./login": "./src/login",
	    "./logout": "./src/logout",
        "./profil": "./src/profil",
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react']
                }
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    }
}
