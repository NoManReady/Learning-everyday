/**
 * 变量缓存函数式
 * @param {*} f 
 */
const memorize = f => {
  let _cache = {}
  return function () {
    let _cache_str = JSON.stringify(arguments)
    _cache[_cache_str] = _cache[_cache_str] || f.apply(f, arguments)
    return _cache[_cache_str]
  }
}