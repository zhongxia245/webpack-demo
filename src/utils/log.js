export const log = msg => {
  console.log(`%c [LOG] ${msg}`, 'color:red;')
}

// 如果这个函数没有使用，则不会被打包进来
export const notUse = () => {
  let str = '这个函数没有使用'
  console.log(str)
}
