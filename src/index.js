import './index.less'
import { hot } from 'react-hot-loader/root'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Button, Alert } from 'antd'

const App = () => {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h2>Hello Webpack!</h2>
      <h3>{count}</h3>
      <Button
        onClick={() => {
          setCount(count + 1)
        }}
      >
        Click Me
      </Button>
      <Alert type="success" message="你好"></Alert>
    </div>
  )
}

// JS 的 HRM 有几个问题？
// 1. 有代码侵入，如果不是单页应用，需要在每个页面加入，就不值得
// 2. HRM 更新模块后，组件状态不见了
const HotApp = hot(App)

ReactDOM.render(<HotApp />, document.getElementById('app'))
