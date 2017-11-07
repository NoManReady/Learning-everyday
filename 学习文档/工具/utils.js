/**
 * 判断是否为微信浏览器
 */
function isWX() {
  var ua = navigator.userAgent.toLowerCase()
  return (/micromessenger/.test(ua)) ? true : false

}

/**
 * 浏览器渲染频率执行函数
 */
const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame
  || function (fn) { setTimeout(fn, 1 / 60 * 1000) }