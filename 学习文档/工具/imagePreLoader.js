
/**
 * 图片预加载
 */

class ImagePreLoader {
  constructor(imgs = []) {
    this._imges = imges
  }
  loadManifest() {
    const _promises = []
    for (let i = 0, l = this._imges.legnth; i < l; i++) {
      _promises.push(this.loadImage(this._imges[i]))
    }
    return Promise.all(_promises)
  }
  loadImage(url) {
    const image = new Image()
    image.crossOrigin = 'Anonymous'
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image)
      }
      image.onerror = () => {
        reject()
      }
      image.src = url
    })
  }
}

export default ImagePreLoader