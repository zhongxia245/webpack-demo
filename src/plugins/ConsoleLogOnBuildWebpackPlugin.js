const pluginName = 'ConsoleLogOnBuildWebpackPlugin'

/**
 * webpack 插件是一个带有 apply 属性的对象
 * apply 属性会被 webpack compiler 调用
 * compiler 放出来一些钩子函数，然后可以再钩子函数上写插件相对应的功能
 */
class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, compilation => {
      console.log('webpack 构建过程开始...')
    })
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin
