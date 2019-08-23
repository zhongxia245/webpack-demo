const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ConsoleLogOnBuildWebpackPlugin = require('./src/plugins/ConsoleLogOnBuildWebpackPlugin')
const TerserPlugin = require('terser-webpack-plugin')

const autoAddDllRes = () => {
  const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
  return new AddAssetHtmlPlugin([
    {
      // 往html中注入dll js
      publicPath: 'dll', // 注入到html中的路径
      outputPath: 'dll', // 最终输出的目录
      filepath: path.resolve('src/lib/*.js'),
      includeSourcemap: false,
      typeOfAsset: 'js' // options js、css; default js
    }
  ])
}

module.exports = {
  entry: {
    main: './src/index.js',
    demo1: './src/demo1.js',
    demo: './src/demo.js',
    'loader-test': './src/loader-test.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader', 'html-minify-loader'] // 处理顺序 html-minify-loader => html-loader => webpack
      },
      // 解析jsx 代码，并需要配置 .babelrc 加上 preset-env , preset-react
      {
        test: /\.jsx?$/,
        use: 'babel-loader?cacheDirectory',
        include: [path.resolve(__dirname, 'src')]
      },
      {
        test: /\.css$/,
        // style-loader 自带了 HMR 功能，因此只需要 webpack-dev-server 配置了 hot，可以进行热更新
        use: ['style-loader', 'css-loader']
        // use: [MiniCssExtractPlugin.loader, 'css-loader']
        // 因为加载了 antd 的样式文件，因此这里不能限制路径
        // include: [path.resolve(__dirname, 'src')]
      },
      {
        test: /\.less$/,
        // style-loader 自带了 HMR 功能，因此只需要 webpack-dev-server 配置了 hot，可以进行热更新
        // style-loader 功能是把 css 变成 js 代码，注入到 style 标签中
        // 不能和 MiniCssExtractPlugin 一起使用
        use: ['style-loader', 'css-loader', 'less-loader'],
        // use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  },
  resolve: {
    // [优化构建速度]现在 webpack 文件搜索范围
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    // [优化构建速度]自动添加文件后缀，最常用的放前面，后缀限制在3个内
    extensions: ['.js', '.jsx']
  },
  resolveLoader: {
    // 因为 html-loader 是开源 npm 包，所以这里要添加 'node_modules' 目录
    modules: [path.join(__dirname, './src/loaders'), 'node_modules']
  },
  // 这个抽离公共代码，需要研究下如何配置
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          // 抽离自己写的公共代码
          chunks: 'initial',
          name: 'common', // 打包后的文件名，任意命名
          minChunks: 2, //最小引用2次
          minSize: 0 // 只要超出0字节就生成一个新包
        },
        vendor: {
          // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          name: 'vendor', // 打包后的文件名，任意命名
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10
        }
      }
    }
  },
  plugins: [
    new ConsoleLogOnBuildWebpackPlugin(),
    new CleanWebpackPlugin(),
    // HtmlWebpackPlugin 会默认注入所有的生成的文件
    // 注入的顺序按照 entry 入口的顺序
    new HtmlWebpackPlugin({ filename: 'index.html', template: './src/index.html' }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new webpack.DllReferencePlugin({
      manifest: require('./react.dll.manifest.json')
    }),
    autoAddDllRes()
  ]
}
