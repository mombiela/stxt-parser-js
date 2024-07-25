const path = require('path');

module.exports = {
  entry: './WebContent/js/index.js', // El punto de entrada principal
  output: {
    filename: 'stxt-parser.js', // El nombre del archivo de salida
    path: path.resolve(__dirname, 'dist'), // La carpeta de salida
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
};
