
/**
 * 保证一个类仅有一个实例，并提供一个访问它的全局访问点
 * @param {*} fn 
 */
const getSingleton = function (fn) {
  const result
  return function () {
    return result || (result = fn.apply(this, arguments))
  }
}

export default getSingleton