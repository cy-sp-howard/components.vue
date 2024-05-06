import _ from 'lodash'

const type = 'data:text/csv,%EF%BB%BF'

export default function download(opt: { data: unknown[][]; name: string }) {
  const a = document.createElement('a')
  a.href = getUrl(opt.data)
  a.download = `${opt.name}.csv`
  a.click()
}
function getUrl(data: unknown[][]) {
  const text = _.chain(data)
    .map(row =>
      textWrapper(
        _.chain(row)
          .map(i => String(i).toString().replace('"', '""'))
          .join('","')
          .value(),
      ),
    )
    .join('\n')
    .value()
  return type + encodeURIComponent(text)
}
function textWrapper(text: string) {
  return `"${text}"`
}
