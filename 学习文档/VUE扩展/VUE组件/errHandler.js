/**
 * vue边界捕获（ErrorBoundary）
 */
export default (Vue, opts) => {
  Vue.component('ErrorBoundary', {
    data() {
      return { error: null }
    },
    errorCaptured(err, vm, info) {
      this.error = `${err.stack}\n\nfound in ${info} of component`
      return false
    },
    render(h) {
      if (this.error) {
        return h('pre', { style: { color: 'red' } }, this.error)
      } else {
        return this.$slots.default ? this.$slots.default[0] : null
      }
    }
  })
}