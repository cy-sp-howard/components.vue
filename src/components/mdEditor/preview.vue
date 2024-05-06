<script lang="ts">
import _ from 'lodash'
import { h, computed, type VNode } from 'vue'
import { marked, type Tokens, type Token } from 'marked'
export default {
  props: {
    value: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const valueRender = computed(() => {
      const list = marked.lexer(props.value)
      return _.map(list, getVnode)
    })

    const typeHandlers = {
      code(token: Tokens.Code) {
        return h(
          'pre',
          { class: token.lang && `language-${(token.lang || '').match(/^\S*/)?.[0] || ''}` },
          h('code', token.escaped ? token.text : token.text),
        )
      },
      blockquote(token: Tokens.Blockquote) {
        return h('blockquote', getChildren(token))
      },
      html(token: Tokens.HTML) {
        return token.raw
      },
      heading(token: Tokens.Heading) {
        // ignore IDs
        return h(`h${token.depth}`, getChildren(token))
      },
      hr() {
        return h('hr')
      },
      list(token: Tokens.List): VNode {
        return h(token.ordered ? 'ol' : 'ul', { start: token.start }, _.map(token.items, getVnode))
      },
      listitem(token: Tokens.ListItem): VNode {
        if (token.task) return h('li', [typeHandlers.checkbox(token), ...getChildren(token)])
        return h('li', getChildren(token))
      },
      checkbox(token: Tokens.ListItem) {
        return h('input', { checked: token.checked, disabled: true, type: 'checkbox' })
      },
      paragraph(token: Tokens.Paragraph) {
        return h('p', { key: Date.now() }, getChildren(token))
      },
      table(token: Tokens.Table) {
        return h('table', [
          h(
            'thead',
            h(
              'tr',
              _.map(token.header, (cell, index) => {
                return typeHandlers.tablecell(
                  _.assign({ header: true, align: token.align[index] }, cell),
                )
              }),
            ),
          ),
          h(
            'tbody',
            _.map(token.rows, r =>
              h(
                'tr',
                _.map(r, (cell, index) => {
                  return typeHandlers.tablecell(
                    _.assign({ header: false, align: token.align[index] }, cell),
                  )
                }),
              ),
            ),
          ),
        ])
      },
      tablecell(token: { header?: boolean; align?: string | null; text: string; tokens: Token[] }) {
        return h(token.header ? 'th' : 'td', { align: token.align }, getChildren(token as Token))
      },
      /**
       * span level renderer
       */
      strong(token: Tokens.Strong) {
        return h('strong', getChildren(token))
      },
      em(token: Tokens.Em) {
        return h('em', getChildren(token))
      },
      codespan(token: Tokens.Codespan) {
        return h('code', token.text)
      },
      br() {
        return h('br')
      },
      del(token: Tokens.Del) {
        return h('del', getChildren(token))
      },
      link(token: Tokens.Link) {
        const cleanHref = cleanUrl(token.href)
        if (cleanHref === null) {
          return token.text
        }
        return h('a', { href: cleanHref, title: token.title }, getChildren(token))
      },
      image(token: Tokens.Image) {
        const cleanHref = cleanUrl(token.href)
        if (cleanHref === null) {
          return token.text
        }
        return h('img', { src: cleanHref, alt: token.text, title: token.title })
      },
      text(token: Tokens.Text) {
        return token.text
      },
    }
    function getChildren(token: Token): (VNode | string)[] {
      if ('tokens' in token) {
        return _.map(token.tokens, getVnode)
      }
      return []
    }
    function getVnode(token: Token) {
      switch (token.type) {
        case 'code':
          return typeHandlers.code(token as Tokens.Code)

        case 'blockquote':
          return typeHandlers.blockquote(token as Tokens.Blockquote)

        case 'html':
          return typeHandlers.html(token as Tokens.HTML)

        case 'heading':
          return typeHandlers.heading(token as Tokens.Heading)

        case 'hr':
          return typeHandlers.hr()

        case 'list':
          return typeHandlers.list(token as Tokens.List)

        case 'list_item':
          return typeHandlers.listitem(token as Tokens.ListItem)

        case 'checkbox':
          return typeHandlers.checkbox(token as Tokens.ListItem)

        case 'paragraph':
          return typeHandlers.paragraph(token as Tokens.Paragraph)

        case 'table':
          return typeHandlers.table(token as Tokens.Table)

        case 'strong':
          return typeHandlers.strong(token as Tokens.Strong)

        case 'em':
          return typeHandlers.em(token as Tokens.Em)

        case 'codespan':
          return typeHandlers.codespan(token as Tokens.Codespan)

        case 'br':
          return typeHandlers.br()

        case 'del':
          return typeHandlers.del(token as Tokens.Del)

        case 'link':
          return typeHandlers.link(token as Tokens.Link)

        case 'image':
          return typeHandlers.image(token as Tokens.Image)

        default:
          return typeHandlers.text(token as Tokens.Text)
      }
    }
    function cleanUrl(href: string) {
      try {
        href = encodeURI(href).replace(/%25/g, '%')
      } catch (e) {
        return null
      }
      return href
    }

    return () => {
      return h('section', { class: 'preview' }, valueRender.value)
    }
  },
}
</script>
<style lang="sass" scoped>
section.preview
  white-space: pre-wrap
  color: black
  *
    all: revert
    font-family: inherit
    white-space: pre-wrap
    word-break: break-all
  p
    margin: 0
    padding: 10px 0
  blockquote
    border-left: 5px solid #35b378
    background: #ececec
    padding: 0 15px
    margin: 15px 0
    > p
      margin: 0
      padding: 15px 0
  ul:has(input)
    list-style-type: none
    padding: 0
    input
      margin-right: 10px
  code
    color: #3594f7
    background: rgba(59, 170, 250, .1)
    padding: 0 4px
  pre
    background: #282c34
    padding: 20px
    border-radius: 5px
    > code
      color: #a9b7c6
      background: none
      padding: 0
  img
    max-width: 100%
    max-height: 500px
  table
    border-spacing: 0
    margin: 20px 0
    width: 100%
    thead
      background: linear-gradient(to bottom, #D9455F, #AE1D30)
    th,td
      padding: 0
      height: 40px
      padding: 0 10px
      &[align='left']
        text-align: left
      &[align='right']
        text-align: right
      &[align='center']
        text-align: center
    th
      color: white
      font-weight: normal
    tr:nth-of-type(even)
      background: #F6F6F6
</style>
