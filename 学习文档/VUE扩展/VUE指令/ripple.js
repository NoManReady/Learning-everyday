/**
 * 波浪按钮
 */
// 自定义对象key值
const rippleContext = '@@ripplerEffect'
export default {
  bind(el, binding, vnode, oldvnode) {
    // ripple事件执行
    const ripplerHandler = (e) => {
      e.stopPropagation()
      // 鼠标左键事件
      if (e.button !== 0) {
        return
      }
      // 波浪圆半径
      let ripplerSize = Math.sqrt(el.offsetWidth * el.offsetWidth + el.offsetHeight * el.offsetHeight),
        minSize = Math.min(el.offsetWidth, el.offsetHeight),
        maxSize = Math.max(el.offsetWidth, el.offsetHeight)
      // 获取ripple定位值
      let left = e.offsetX - ripplerSize,
        top = e.offsetY - ripplerSize
      // 添加动画效果
      const effectDiv = document.createElement('div')
      effectDiv.style.width = `${ripplerSize * 2}px`
      effectDiv.style.height = `${ripplerSize * 2}px`
      effectDiv.style.left = `${left}px`
      effectDiv.style.top = `${top}px`
      effectDiv.style.transform = `scale(${minSize / (maxSize + minSize)})`
      // 设置颜色值
      effectDiv.style.color = el[rippleContext].rippleColor || 'currentColor'
      effectDiv.classList.add('rippler--effect')
      el.appendChild(effectDiv)
      // 延迟设置属性可触发transition动画
      setTimeout(() => {
        effectDiv.style.opacity = 0
        effectDiv.style.transform = 'scale(2.5)'
      }, 0)
      effectDiv.addEventListener('transitionend', ripplerEnd)
    }
    // ripple动画结束事件
    const ripplerEnd = (e) => {
      if (e.target.parentNode === el) {
        e.target.removeEventListener('transitionend', ripplerEnd)
        el.removeChild(e.target)
      }
    }
    // 目标元素处理
    el.classList.add('rippler')
    el.addEventListener('mousedown', ripplerHandler)
    // 自定义缓存对象
    const rippleColor = binding.value
    el[rippleContext] = {
      ripplerHandler,
      rippleColor,
      expression: binding.expression,
      binding: binding
    }
  },
  inserted() { },
  update(el, binding, vnode) {
    // 更新回调
    el[rippleContext].expression = binding.expression
    el[rippleContext].rippleColor = vnode.context[binding.expression]
  },
  componentUpdated() { },
  unbind(el) {
    // 解除事件
    el.removeEventListener('mousedown', el[rippleContext].ripplerHandler)
  }
}
