export default function (imgSource: HTMLImageElement | string, maxLongSize = 2000) {
  return new Promise<HTMLCanvasElement>((rs, rj) => {
    setTimeout(() => rj('timeout'), 5000)
    const isImg = imgSource instanceof Image
    const img = isImg ? imgSource : new Image()

    const onload = () => {
      const { naturalWidth, naturalHeight } = img
      const canvas = document.createElement('canvas')
      const maxSideKey = naturalWidth > naturalHeight ? 'width' : 'height'
      if (naturalWidth > maxLongSize || naturalHeight > maxLongSize) {
        const isWidthMax = maxSideKey === 'width'
        canvas[maxSideKey] = maxLongSize
        canvas[isWidthMax ? 'height' : 'width'] =
          (maxLongSize / (isWidthMax ? naturalWidth : naturalHeight)) *
          (isWidthMax ? naturalHeight : naturalWidth)
      } else {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
      }

      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
      rs(canvas)
    }
    img.onload = onload
    if (isImg) return onload()
    img.src = imgSource
  })
}
