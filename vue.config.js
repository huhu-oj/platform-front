const { defineConfig } = require('@vue/cli-service')
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack : {
    plugins: [
      new MonacoEditorPlugin({

        languages: ['javascript','typescript','java'] //'css', 'html', 'typescript',
      })
    ]
  },
  chainWebpack: (config) => {
    config.module.rules.values().push([
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.worker\.js$/,
            use: {
              loader: 'worker-loader',
              options: { inline: true }
            }
          }
    ])
  }
})
