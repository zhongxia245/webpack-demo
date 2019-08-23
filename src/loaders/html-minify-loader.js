/**
 * html 压缩 loader
 * 1. loader 就是一个node 函数，webpack 在解析文件的时候，会去调用这个函数，并且传入文件的值
 * 2. 对传入的值处理完成后，再把处理的值传到下个 loader 或者返回给 js模块
 * 
 * 几个注意点：
 */

let loaderUtils = require('loader-utils')
let Minimize = require('minimize')

module.exports = function(source) {
  // 使用异步的方式，为了阻塞构建
  var callback = this.async()
  if (this.cacheable) {
    this.cacheable()
  }
  var opts = loaderUtils.getOptions(this) || {}
  var minimize = new Minimize(opts)
  minimize.parse(source, (err, result) => {
    callback(err, result)
  })

  // 当然也可以不用回调的方式，可以直接返回
  // return minimize.parse(source)

  // 如果loader 是最后一个执行的，需要对返回结构做一下处理, 这样才可以让 js 代码里面可以直接引入
  // return 'module.exports = ' + JSON.stringify(source);
}
