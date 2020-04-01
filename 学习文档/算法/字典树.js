/**
 * 字典树实现大数据的模糊查找，不支持对象嵌套（可递归处理查询）
 * 算法链接https://juejin.im/post/5cd1ab3df265da03587c142a
 */

class Leaf {
  constructor(id = "", value = "") {
    this.ids = id ? [id] : [];
    this.value = value;
    this.children = {};
  }
  share(id) {
    this.ids.push(id);
  }
}

function mapTree(source) {
  const root = new Leaf()
  const identifyKey = 'id'
  const walkObject = (obj) => {
    const identifyValue = obj[identifyKey]
    Object.values(obj).forEach(itemValue => {
      const stringifiedValue = String(itemValue)
      let tempRoot = root
      const strToArray = Array.from(stringifiedValue)
      strToArray.forEach((character, characterIndex) => {
        const reachEnd =
          characterIndex === strToArray.length - 1
        if (!tempRoot.children[character]) {
          tempRoot.children[character] = new Leaf(
            reachEnd ? identifyValue : '',
            character
          )
        } else {
          if (reachEnd) {
            tempRoot.children[character].share(identifyValue)
          }
        }
        tempRoot = tempRoot.children[character]
      })
    })
  }
  source.forEach(item => {
    walkObject(item)
  })
  return root
}
