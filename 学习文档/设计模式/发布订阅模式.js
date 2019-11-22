
/**
 * 又称为观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生
 * 改变的时，所有依赖于它的对象都将得到通知。一为时间上解耦，二为对象之间的解
 * 耦
 */
const pubsub = (function () {
  const pools = [],
    pub,
    sub,
    del
  sub = (key, fn) => {
    if (!pools[key]) {
      pools[key] = []
    }
    pools[key].push(fn)
  }
  pub = () => {
    let _key = Array.prototype.shift.call(arguments)
    let _fns = pools[_key]
    if (!_fns || _fns.length === 0) {
      return false
    }
    for (let _fnl = _fns.length - 1; _fnl >= 0; _fnl--) {
      _fns[_fnl].apply(this, Array.prototype.slice.call(arguments, 1))
    }
  }
  del = (key, fn) => {
    let _fns = pools[key]
    if (!_fns || _fns.length === 0) {
      return false
    }
    if (!fn || typeof (fn) !== 'function') {
      _fns.length = 0
    }
    for (let _fnl = _fns.length - 1; _fnl >= 0; _fnl--) {
      if (_fns[_fnl] === fn) {
        _fns.splice(_fnl, 1)
      }
    }
  }
  return {
    pub,
    sub,
    del
  }
})()

export default pubsub