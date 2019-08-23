const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    // 把 vue 相关模块的放到一个单独的动态链接库
    react: ['react', 'react-dom']
  },
  output: {
    filename: '[name]-[hash:8].dll.js', // 生成vue.dll.js
    path: path.join(__dirname, 'src/lib'),
    library: '_dll_[name]'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      name: '_dll_[name]',
      // manifest.json 描述动态链接库包含了哪些内容
      path: path.join(__dirname, './', '[name].dll.manifest.json')
    })
  ]
}
