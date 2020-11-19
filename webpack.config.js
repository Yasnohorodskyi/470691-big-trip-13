const path = require("path");

console.log("__dirname", __dirname);

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    watchContentBase: true,
  },
};
