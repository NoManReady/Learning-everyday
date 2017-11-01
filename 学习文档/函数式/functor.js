
/**
 * Container模式，最终可以通过io.__value()得到值
 */
import compose from './compose'
const IO = function (f) {
  this.__value = f
}
IO.of = function (x) {
  return new IO(() => x)
}
IO.prototype.map = function (f) {
  return new IO(compose(f, this.__value))
}
export default IO