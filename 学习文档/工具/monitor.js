/**
 * 前端监控
 */
const performanceUtils = {
  // 获取性能信息
  getPerformance: () => {
    if (!window.performance) return
    const timing = window.performance.timing
    const performance = {
      // 重定向耗时
      redirect: timing.redirectEnd - timing.redirectStart,
      // 白屏时间
      whiteScreen: timing.responseStart - timing.navigationStart,
      // DOM 渲染耗时
      dom: timing.domComplete - timing.domLoading,
      // 页面加载耗时
      load: timing.loadEventEnd - timing.navigationStart,
      // 页面卸载耗时
      unload: timing.unloadEventEnd - timing.unloadEventStart,
      // 请求耗时
      request: timing.responseEnd - timing.requestStart,
      // 获取性能信息时当前时间
      time: new Date().getTime(),
    }
    return performance
  },
  // 获取资源信息
  getResources: () => {
    if (!window.performance) return
    const data = window.performance.getEntriesByType('resource')
    const resource = {
      xmlhttprequest: [],
      css: [],
      other: [],
      script: [],
      img: [],
      link: [],
      fetch: [],
      // 获取资源信息时当前时间
      time: new Date().getTime(),
    }
    data.forEach(item => {
      const arry = resource[item.initiatorType]
      arry && arry.push({
        // 资源的名称
        name: item.name,
        // 资源加载耗时
        duration: item.duration.toFixed(2),
        // 资源大小
        size: item.transferSize,
        // 资源所用协议
        protocol: item.nextHopProtocol,
      })
    })
    return resource
  }
}

class Monitor {
  constructor(url = '') {
    this.reportUrl = url
    this.reportServer = () => ({})
    this.monitorData = {
      // 数据上传地址
      url: '',
      // 性能信息
      performance: {},
      // 资源信息
      resources: {},
      // 错误信息
      errors: [],
      // 用户信息
      user: {
        // 屏幕宽度
        screen: screen.width,
        // 屏幕高度
        height: screen.height,
        // 浏览器平台
        platform: navigator.platform,
        // 浏览器的用户代理信息
        userAgent: navigator.userAgent,
        // 浏览器用户界面的语言
        language: navigator.language,
      }
    }
    this.reset()
    this._init()
  }
  // 初始化记录数据(监听事件)
  _init() {
    window.addEventListener('load', this._onload.bind(this), false)
    window.addEventListener('error', this._onErrorCapure.bind(this), true)
    window.addEventListener('error', this._onErrorBubble.bind(this), false)
    window.addEventListener('unhandledrejection', this._onErrorUnhandled.bind(this), false)
  }
  // 文档加载完成回调
  _onload(evt) {
    window.requestIdleCallback = requestIdleCallback || ((fn) => setTimeout(fn, 0))
    window.requestIdleCallback(() => {
      this.monitorData.performance = performanceUtils.getPerformance()
      this.monitorData.resources = performanceUtils.getResources()
      console.log('页面性能信息')
      console.log(this.monitorData.performance)
      console.log('页面资源信息')
      console.log(this.monitorData.resources)
    })
  }
  // 捕获阶段，资源加载失败(js,css,img...)
  _onErrorCapure(evt) {
    const target = evt.target
    if (target != window) {
      this.monitorData.errors.push({
        type: target.localName,
        url: target.src || target.href,
        msg: (target.src || target.href) + ' is load error',
        // 错误发生的时间
        time: new Date().getTime(),
      })

      console.log('所有的错误信息--捕获阶段')
      console.log(this.monitorData.errors)
    }
  }
  // 冒泡阶段，脚本发生错误
  _onErrorBubble(evt) {
    this.monitorData.errors.push({
      type: 'javascript', // 错误类型
      row: evt.lineno, // 发生错误时的代码行数
      col: evt.colno, // 发生错误时的代码列数
      msg: evt.message, // 错误信息
      url: evt.filename, // 错误文件
      time: new Date().getTime(), // 错误发生的时间
    })

    console.log('所有的错误信息--冒泡阶段')
    console.log(this.monitorData.errors)
  }
  // 未知错误，捕获promise等错误
  _onErrorUnhandled(evt) {
    this.monitorData.errors.push({
      type: 'promise',
      msg: (evt.reason && evt.reason.msg) || evt.reason || '',
      // 错误发生的时间
      time: new Date().getTime(),
    })
    console.log('所有的错误信息')
    console.log(this.monitorData.errors)
  }
  // 手动添加错误
  addError({ type, msw, url, row, col }) {
    const obj = { type, msw, url, row, col }
    obj.time = new Date().getTime()
    this.monitorData.errors.push(obj)
  }
  // 重置 monitorData 对象
  reset() {
    window.performance && window.performance.clearResourceTimings()
    this.monitorData.performance = performanceUtils.getPerformance()
    this.monitorData.resources = performanceUtils.getResources()
    this.monitorData.errors = []
  }
  // 监控上报(可自定义上报方法)
  report(fn = this.reportServer) {
    fn({ ...this.monitorData })
  }
}