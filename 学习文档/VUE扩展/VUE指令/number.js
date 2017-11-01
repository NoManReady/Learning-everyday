/**
 * 数字变化缓动效果
 */
let _TIME = 1000// 滚动时长
let _FREQUENCY = 30//滚动频率
export default (el, binding) => {
  let _timer = null
  let _nowValue = parseInt(binding.value) || 0
  let _oldValue = parseInt(binding.oldValue) || 0
  let _diff = _nowValue - _oldValue
  let _type = _diff > 0 ? 1 : _diff < 0 ? -1 : 0
  if (_type === 0) {
    el.innerHTML = _oldValue
    return
  }
  if (_timer) {
    clearInterval(_timer)
  }
  // (_TIME/_FREQUENCY=总次数)
  // (_diff/总次数=每次滚动值)
  let _val = Math.round(_diff * _FREQUENCY / _TIME)//每次滚动数值  
  _timer = setInterval(() => {
    if (_nowValue != _oldValue) {
      let _nowDiff = _nowValue - _oldValue
      // _left小于1（即parseInt为0）说明_nowDiff<_val,不够下一轮
      let _left = parseInt(_nowDiff / _val) || 0
      if (_left === 0) {
        _oldValue = _nowValue
        // 取消定时器
        clearInterval(_timer)
      } else {
        _oldValue += _val
      }
      el.innerHTML = _oldValue
    }
  }, _FREQUENCY)
}