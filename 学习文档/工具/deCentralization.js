/**
 * 去中心化
 * @param {上下文} requireContext (require.context('./', true, /\.\/\w+\/\w+\.js/))
 * @param {排除文件} exinclude 
 */
export const deCentralization = (requireContext, exinclude = /index/, fn = (argv) => argv) => {
  const sourceMap = {}
  const paths = requireContext.keys().filter(p => {
    return !exinclude.test(p)
  })
  for (let p of paths) {
    const ss = fn(requireContext(p))
    for (let s in ss) {
      sourceMap[s] = ss[s]
    }
  }
  return sourceMap
}