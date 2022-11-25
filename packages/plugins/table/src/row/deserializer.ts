import {
  Editable,
  HTMLDeserializerOptions,
  HTMLDeserializerWithTransform,
  isDOMHTMLElement,
} from '@editablejs/editor'
import { TABLE_ROW_KEY } from '../constants'
import { getOptions } from '../options'
import { TableCell, TableRow } from '../types'

export interface TableRowHTMLDeserializerOptions extends HTMLDeserializerOptions {
  editor: Editable
}

export const withTableRowDescendantTransform: HTMLDeserializerWithTransform<
  TableRowHTMLDeserializerOptions
> = (next, serializer, { editor }) => {
  return (node, options = {}) => {
    const { text } = options
    if (isDOMHTMLElement(node) && ['TR', 'TH'].includes(node.tagName)) {
      const options = getOptions(editor)
      const h = (node as HTMLElement).style.height
      const height = parseInt(h === '' ? '0' : h, 10)

      const children: TableCell[] = []
      for (const child of node.childNodes) {
        children.push(...(serializer.transform(child, { text, matchNewline: true }) as any))
      }

      const row: TableRow = {
        type: TABLE_ROW_KEY,
        height: Math.max(height, options.minRowHeight),
        children,
      }
      return [row]
    }
    return next(node, options)
  }
}
