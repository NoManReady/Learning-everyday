/**
 * 基于localStaroge(不支持同页面的通信)和Broadcastchannel的同源页面通信
 * type:订阅类型
 * fn:订阅回调
 * listenning:暂时关闭事件订阅回调
 */

const STORAGE_KEY = 'STORAGE_KEY'
class ListenerBase {
  constructor(type, fn) {
    this.type = type
    this.fn = fn
    this.listenning = true
    this.onMessage = this.onMessage.bind(this)
  }
  onMessage(e) {
    this.fn(e)
  }
  stopListen() {
    this.listenning = false
  }
  resumeListen() {
    this.listenning = true
  }
  removeListen() {

  }
}
class ListenerLS extends ListenerBase {
  static postMessage = (type, payload) => {
    let key = Math.random().toString(16).slice(2)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ type, payload, key }))
  }
  constructor(type, fn) {
    super(type, fn)
    window.addEventListener('storage', this.onMessage, false)
  }
  onMessage(e) {
    if (e.key !== STORAGE_KEY) {
      return
    }
    let { type, payload } = JSON.parse(e.newValue)
    if (this.listenning && type === this.type) {
      this.fn(payload)
    }
  }
  removeListen() {
    super.removeListen()
    window.removeEventListener('storage', this.onMessage)
  }
}
class ListenerBC extends ListenerBase {
  static postMessage = (type, payload) => {
    let bc = new BroadcastChannel(type)
    bc.postMessage(payload)
    bc.close()
  }
  constructor(type, fn) {
    super(type, fn)
    this.bc = new BroadcastChannel(this.type)
    this.bc.onmessage = this.onMessage
  }
  onMessage(e) {
    if (this.listenning) {
      this.fn(e.data)
    }
  }
  removeListen() {
    super.removeListen()
    this.bc.close()
  }
}
let ListenerInstance = (() => {
  if (window.BroadcastChannel) {
    return ListenerBC
  } else {
    return ListenerLS
  }
})()

export default {
  //  订阅
  subscribe(type, fn) {
    let _listener = new ListenerInstance(type, fn)
    return _listener
  },
  // 发布
  publish(type, payload) {
    ListenerInstance.postMessage(type, payload)
  },
  // 取消订阅
  remove(listener) {
    if (listener instanceof ListenerBase) {
      listener.removeListen()
    }
  }
}
