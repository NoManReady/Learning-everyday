/**
 * 定义一系列的算法，把它们一个个的封装起来，并且使它们可以相互替换。目的就是算法的使用和算法的实现分离出来
 */
const strategy = {
  A(value) {
    return value.toString(8)
  },
  B(value) {
    return value.toString(10)
  }
}

export default strategy