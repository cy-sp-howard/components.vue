import { parseFragment, serialize, parse, defaultTreeAdapter } from 'parse5'
import type { Plugin } from 'vite'
import path from 'node:path'
import fs from 'node:fs'

export default function (): Plugin {
  const svgFolder = path.resolve('src/assets/images/svg')
  const svgNodes = fs.readdirSync(svgFolder).map(fileName => {
    const filePath = path.resolve(svgFolder, fileName)
    const svgStr = fs.readFileSync(filePath).toString()
    const doc = parseFragment(svgStr)
    const svgNode = doc.childNodes.find(i => i.nodeName === 'svg')
    if (!svgNode || !('attrs' in svgNode)) return null
    defaultTreeAdapter.getAttrList(svgNode)
    svgNode.attrs = svgNode.attrs
      .filter(i => !i.name.match(/^id$/i))
      .concat({ name: 'id', value: `icon-${fileName.replace(/.svg$/i, '')}` })
    svgNode.nodeName = 'symbol'
    svgNode.tagName = 'symbol'
    return svgNode
  })

  return {
    name: 'svg-inject',
    transformIndexHtml(html) {
      if (!svgNodes.length) return
      const doc = parse(html)
      const htmlNode = doc.childNodes.find(i => i.nodeName === 'html')
      if (!htmlNode || !('childNodes' in htmlNode)) return
      const bodyNode = htmlNode.childNodes.find(i => i.nodeName === 'body')
      if (!bodyNode || !('childNodes' in bodyNode)) return
      const _svgNodes = svgNodes
        .filter(i => i)
        .map(i => {
          return Object.assign({}, i, { parentNode: null })
        }) as Exclude<(typeof svgNodes)[number], null>[]

      const svgRoot = defaultTreeAdapter.createElement('svg', _svgNodes[0].namespaceURI, [
        { name: 'id', value: '__svg-icons' },{
          name: 'xmlns',
          value: 'http://www.w3.org/2000/svg',
          namespace: 'http://www.w3.org/2000/xmlns/'
        },
        {
          name: 'xlink',
          value: 'http://www.w3.org/1999/xlink',
          prefix: 'xmlns',
          namespace: 'http://www.w3.org/2000/xmlns/',
        },
        { name: 'style', value: 'display: none;' },
      ])
      svgRoot.parentNode = bodyNode
      svgRoot.childNodes = _svgNodes
      bodyNode.childNodes = bodyNode.childNodes.concat(svgRoot)

      return serialize(doc)
    },
  }
}
