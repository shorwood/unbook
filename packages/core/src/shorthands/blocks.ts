/* eslint-disable sonarjs/todo-tag */
import type { BlockContent, BlockInput, FileInput, IconInput, RichText } from '@/types'
import type { MaybeFileInput, MaybeIconInput, MaybeRichText } from '@/utils'
import { toFileInput, toIconInput, toRichText } from '@/utils'

/** Converts all RichText fields in a block content type to optional MaybeRichText. */
type ToShorthand<T extends object> =
  {
    [K in Exclude<keyof T, 'rich_text'>]:
    RichText[] extends T[K] ? MaybeRichText
      : IconInput extends T[K] ? MaybeIconInput
        : T[K]
  }

/**
 * Creates a paragraph block.
 *
 * @param text The text content as a string or rich text array.
 * @param options Optional settings for color.
 * @param children Optional child blocks.
 * @returns A paragraph block input object.
 * @example paragraph('Hello world')
 * @example paragraph('Important text', 'red')
 */
export function paragraph(
  text: MaybeRichText,
  options?: ToShorthand<BlockContent.Paragraph>,
  children?: BlockInput[],
): BlockInput.Paragraph {
  return {
    type: 'paragraph',
    paragraph: {
      ...options,
      rich_text: toRichText(text),
      children,
    },
  }
}

/**
 * Creates a heading 1 block.
 *
 * @param text The heading text as a string or rich text array.
 * @param options Optional settings for color and toggleable state.
 * @param children Optional child blocks.
 * @returns A heading_1 block input object.
 * @example heading1('Main Title')
 * @example heading1('Collapsible Section', { is_toggleable: true })
 */
export function heading1(
  text: MaybeRichText,
  options?: ToShorthand<BlockContent.Heading>,
  children?: BlockInput[],
): BlockInput.Heading1 {
  return {
    type: 'heading_1',
    heading_1: {
      ...options,
      rich_text: toRichText(text),
      children,
    },
  }
}

/**
 * Creates a heading 2 block.
 *
 * @param text The heading text as a string or rich text array.
 * @param options Optional settings for color and toggleable state.
 * @param children Optional child blocks.
 * @returns A heading_2 block input object.
 * @example heading2('Section Title')
 * @example heading2('Collapsible Subsection', { is_toggleable: true })
 */
export function heading2(
  text: MaybeRichText,
  options?: ToShorthand<BlockContent.Heading>,
  children?: BlockInput[],
): BlockInput.Heading2 {
  return {
    type: 'heading_2',
    heading_2: {
      ...options,
      rich_text: toRichText(text),
      children,
    },
  }
}

/**
 * Creates a heading 3 block.
 *
 * @param text The heading text as a string or rich text array.
 * @param options Optional settings for color and toggleable state.
 * @param children Optional child blocks.
 * @returns A heading_3 block input object.
 * @example heading3('Subsection Title')
 * @example heading3('Collapsible Sub-subsection', { is_toggleable: true })
 */
export function heading3(
  text: MaybeRichText,
  options?: ToShorthand<BlockContent.Heading>,
  children?: BlockInput[],
): BlockInput.Heading3 {
  return {
    type: 'heading_3',
    heading_3: {
      ...options,
      rich_text: toRichText(text),
      children,
    },
  }
}

/**
 * Creates a quote block.
 *
 * @param text The quote text as a string or rich text array.
 * @param options Optional settings for color.
 * @param children Optional child blocks.
 * @returns A quote block input object.
 * @example quote('To be, or not to be, that is the question.')
 * @example quote('Inspirational quote', 'blue', [childBlock1, childBlock2])
 */
export function quote(
  text: MaybeRichText,
  options?: ToShorthand<BlockContent.Quote>,
  children?: BlockInput[],
): BlockInput.Quote {
  return {
    type: 'quote',
    quote: {
      ...options,
      rich_text: toRichText(text),
      children,
    },
  }
}

/**
 * Creates a callout block.
 *
 * @param text The callout text as a string or rich text array.
 * @param options Optional settings for color and icon.
 * @param children Optional child blocks.
 * @returns A callout block input object.
 * @example callout('This is important!', { color: 'red' })
 * @example callout('Note with icon', { icon: { type: 'emoji', emoji: '💡' } }, [childBlock])
 */
export function callout(
  text: MaybeRichText,
  options?: ToShorthand<BlockContent.Callout>,
  children?: BlockInput[],
): BlockInput.Callout {
  return {
    type: 'callout',
    callout: {
      ...options,
      icon: toIconInput(options?.icon),
      rich_text: toRichText(text),
      children,
    },
  }
}

/**
 * Creates a bulleted list item block.
 *
 * @param text The list item text as a string or rich text array.
 * @param options Optional settings for color.
 * @param children Optional child blocks.
 * @returns A bulleted_list_item block input object.
 * @example bulletedListItem('First item')
 * @example bulletedListItem('Important item', { color: 'yellow' }, [childBlock])
 */
export function bulletedListItem(
  text: MaybeRichText,
  options?: ToShorthand<BlockContent.BulletedListItem>,
  children?: BlockInput[],
): BlockInput.BulletedListItem {
  return {
    type: 'bulleted_list_item',
    bulleted_list_item: {
      ...options,
      rich_text: toRichText(text),
      children,
    },
  }
}

/**
 * Creates a numbered list item block.
 *
 * @param text The list item text as a string or rich text array.
 * @param options Optional settings for color, list start index, and list format.
 * @param children Optional child blocks.
 * @returns A numbered_list_item block input object.
 * @example numberedListItem('First item')
 * @example numberedListItem('Second item', { color: 'green', list_start_index: 5 }, [childBlock])
 */
export function numberedListItem(
  text: MaybeRichText,
  options?: ToShorthand<BlockContent.NumberedListItem>,
  children?: BlockInput[],
): BlockInput.NumberedListItem {
  return {
    type: 'numbered_list_item',
    numbered_list_item: {
      ...options,
      rich_text: toRichText(text),
      children,
    },
  }
}

/**
 * Creates a to-do block.
 *
 * @param text The to-do text as a string or rich text array.
 * @param options Optional settings for color and checked state.
 * @param children Optional child blocks.
 * @returns A to_do block input object.
 * @example todo('Buy groceries')
 * @example todo('Walk the dog', { checked: true, color: 'blue' }, [childBlock])
 */
export function todo(
  text: MaybeRichText,
  options?: ToShorthand<BlockContent.ToDo>,
  children?: BlockInput[],
): BlockInput.ToDo {
  return {
    type: 'to_do',
    to_do: {
      ...options,
      rich_text: toRichText(text),
      children,
    },
  }
}

/**
 * Creates a toggle block.
 *
 * @param text The toggle text as a string or rich text array.
 * @param options Optional settings for color.
 * @param children Optional child blocks.
 * @returns A toggle block input object.
 * @example toggle('More details')
 * @example toggle('See more', { color: 'purple' }, [childBlock1, childBlock2])
 */
export function toggle(
  text: MaybeRichText,
  options?: ToShorthand<BlockContent.Toggle>,
  children?: BlockInput[],
): BlockInput.Toggle {
  return {
    type: 'toggle',
    toggle: {
      ...options,
      rich_text: toRichText(text),
      children,
    },
  }
}

/**
 * Creates a code block.
 *
 * @param text The code text as a string or rich text array.
 * @param options Optional settings for language and caption.
 * @returns A code block input object.
 * @example code('console.log("Hello, world!");', { language: 'javascript' })
 * @example code('def hello_world():\n    print("Hello, world!")', { language: 'python', caption: 'Example Code' })
 */
export function code(
  text: MaybeRichText,
  options?: ToShorthand<BlockContent.Code>,
): BlockInput.Code {
  return {
    type: 'code',
    code: {
      ...options,
      caption: toRichText(options?.caption),
      rich_text: toRichText(text),
    },
  }
}

/**
 * Creates a template block.
 *
 * Template blocks allow you to create reusable content templates.
 * When a user duplicates a template block, the children are copied.
 *
 * @param text The template button text as a string or rich text array.
 * @param children Optional child blocks that will be duplicated when using the template.
 * @returns A template block input object.
 * @example template('Add new item', [paragraph('Item content')])
 * @example template('Meeting notes template', [heading1('Meeting Notes'), todo('Agenda'), todo('Action items')])
 */
export function template(
  text: MaybeRichText,
  children?: BlockInput[],
): BlockInput.Template {
  return {
    type: 'template',
    template: {
      rich_text: toRichText(text),
      children,
    },
  }
}

/**
 * Creates an image block.
 *
 * @param source The image source as an external URL or file upload reference.
 * @returns An image block input object.
 * @example image('https://example.com/image.png')
 * @example image({ type: 'external', external: { url: 'https://example.com/image.png' } })
 * @example image({ type: 'file_upload', file_upload: { id: 'file-id' } })
 */
export function image(source: MaybeFileInput): BlockInput.Image {
  return {
    type: 'image',
    image: toFileInput(source),
  }
}

/**
 * Creates a video block.
 *
 * @param source The video source as an external URL or file upload reference.
 * @returns A video block input object.
 * @example video({ type: 'external', external: { url: 'https://example.com/video.mp4' } })
 * @example video({ type: 'file_upload', file_upload: { id: 'file-id' } })
 */
export function video(source: MaybeFileInput): BlockInput.Video {
  return {
    type: 'video',
    video: toFileInput(source),
  }
}

/**
 * Creates an audio block.
 *
 * @param source The audio source as an external URL or file upload reference.
 * @returns An audio block input object.
 * @example audio({ type: 'external', external: { url: 'https://example.com/audio.mp3' } })
 * @example audio({ type: 'file_upload', file_upload: { id: 'file-id' } })
 */
export function audio(source: MaybeFileInput): BlockInput.Audio {
  return {
    type: 'audio',
    audio: toFileInput(source),
  }
}

/**
 * Creates a PDF block.
 *
 * @param source The PDF source as an external URL or file upload reference.
 * @returns A PDF block input object.
 * @example pdf({ type: 'external', external: { url: 'https://example.com/document.pdf' } })
 * @example pdf({ type: 'file_upload', file_upload: { id: 'file-id' } })
 */
export function pdf(source: MaybeFileInput): BlockInput.Pdf {
  return {
    type: 'pdf',
    pdf: toFileInput(source),
  }
}

/**
 * Creates a file block.
 *
 * @param source The file source as an external URL or file upload reference.
 * @param options Optional settings for file name and caption.
 * @param options.name Optional display name for the file.
 * @param options.caption Optional caption as a string or rich text array.
 * @returns A file block input object.
 * @example file('https://example.com/file.zip')
 * @example file('https://example.com/file.zip', { name: 'archive.zip' })
 */
export function file(
  source: MaybeFileInput,
  options?: Pick<FileInput, 'caption' | 'name'>,
): BlockInput.FileBlock {
  return {
    type: 'file',
    file: {
      ...toFileInput(source),
      name: options?.name,
      caption: toRichText(options?.caption),
    },
  }
}

/**
 * Creates a bookmark block.
 *
 * @param url The URL to bookmark.
 * @param caption Optional caption as a string or rich text array.
 * @returns A bookmark block input object.
 * @example bookmark('https://example.com')
 * @example bookmark('https://example.com', 'Example website')
 */
export function bookmark(url: string, caption?: MaybeRichText): BlockInput.Bookmark {
  return {
    type: 'bookmark',
    bookmark: {
      url,
      caption: toRichText(caption),
    },
  }
}

/**
 * Creates an embed block.
 *
 * @param url The URL to embed.
 * @param caption Optional caption as a string or rich text array.
 * @returns An embed block input object.
 * @example embed('https://example.com/embed')
 * @example embed('https://twitter.com/user/status/123', 'Tweet embed')
 */
export function embed(url: string, caption?: MaybeRichText): BlockInput.Embed {
  return {
    type: 'embed',
    embed: {
      url,
      caption: toRichText(caption),
    },
  }
}

/**
 * Creates an equation block.
 *
 * @param expression The LaTeX expression to render.
 * @returns An equation block input object.
 * @example equation('E = mc^2')
 * @example equation('\\frac{1}{2}mv^2')
 */
export function equation(expression: string): BlockInput.Equation {
  return {
    type: 'equation',
    equation: { expression },
  }
}

/**
 * Creates a divider block.
 *
 * @returns A divider block input object.
 * @example divider()
 */
export function divider(): BlockInput.Divider {
  return {
    type: 'divider',
    divider: {},
  }
}

/**
 * Creates a table of contents block.
 *
 * @param options Optional settings for color.
 * @returns A table of contents block input object.
 * @example tableOfContents()
 * @example tableOfContents({ color: 'gray' })
 */
export function tableOfContents(options?: BlockContent.TableOfContents): BlockInput.TableOfContents {
  return {
    type: 'table_of_contents',
    table_of_contents: options,
  }
}

/**
 * Creates a breadcrumb block.
 *
 * @returns A breadcrumb block input object.
 * @example breadcrumb()
 */
export function breadcrumb(): BlockInput.Breadcrumb {
  return {
    type: 'breadcrumb',
    breadcrumb: {},
  }
}

/**
 * Creates a column block.
 *
 * @param children The child blocks within the column.
 * @returns A column block input object.
 * @example column([paragraph('Column content')])
 */
export function column(children: BlockInput[]): BlockInput.Column {
  return {
    type: 'column',
    column: {
      children,
    },
  }
}

/**
 * Creates a column list block with two or more columns.
 *
 * @param columns The column blocks (minimum 2).
 * @returns A column list block input object.
 * @example columnList([column([paragraph('Left')]), column([paragraph('Right')])])
 */
export function columnList(columns: [BlockInput.Column, BlockInput.Column, ...BlockInput.Column[]]): BlockInput.ColumnList {
  return {
    type: 'column_list',
    column_list: {
      children: columns,
    },
  }
}

/**
 * Creates a link to page block.
 *
 * @param id The ID of the page to link to.
 * @returns A link to page block input object.
 * @example linkToPage({ type: 'page_id', page_id: 'page-uuid' })
 * @example linkToPage({ type: 'database_id', database_id: 'database-uuid' })
 */
export function linkToPage(id: string): BlockInput.LinkToPage {
  return {
    type: 'link_to_page',
    link_to_page: { type: 'page_id', page_id: id },
  }
}

/**
 * Creates a link to database block.
 *
 * @param id The ID of the database to link to.
 * @returns A link to database block input object.
 * @example linkToDatabase({ type: 'database_id', database_id: 'database-uuid' })
 */
export function linkToDatabase(id: string): BlockInput.LinkToPage {
  return {
    type: 'link_to_page',
    link_to_page: { type: 'database_id', database_id: id },
  }
}

/**
 * Creates a synced block.
 *
 * @param syncedFrom The source block to sync from, or null for original synced block.
 * @param children Optional child blocks (only for original synced blocks).
 * @returns A synced block input object.
 * @example syncedBlock(null, [paragraph('Original content')])
 * @example syncedBlock({ type: 'block_id', block_id: 'block-uuid' })
 */
export function syncedBlock(
  syncedFrom: BlockContent.SyncedBlock['synced_from'],
  children?: BlockInput[],
): BlockInput.SyncedBlock {
  return {
    type: 'synced_block',
    synced_block: {
      synced_from: syncedFrom,
      children,
    },
  }
}

/**
 * Creates a table row block.
 *
 * @param cells The cells of the row, each as a string or rich text array.
 * @returns A table row block input object.
 * @example tableRow(['Cell 1', 'Cell 2', 'Cell 3'])
 * @example tableRow([richTextArray1, richTextArray2])
 */
export function tableRow(cells: MaybeRichText[]): BlockInput.TableRow {
  return {
    type: 'table_row',
    table_row: {
      cells: cells.map(cell => toRichText(cell) ?? []),
    },
  }
}

/**
 * Creates a table block.
 *
 * @param rows The table rows.
 * @param options Optional settings for table width and headers.
 * @returns A table block input object.
 * @example table([tableRow(['A', 'B']), tableRow(['1', '2'])])
 * @example table([tableRow(['Header 1', 'Header 2']), tableRow(['Value 1', 'Value 2'])], { has_column_header: true })
 */
export function table(
  rows: BlockInput.TableRow[],
  options?: Omit<BlockContent.Table, 'table_width'>,
): BlockInput.Table {
  const tableWidth = rows.length > 0 ? rows[0].table_row.cells.length : 0
  return {
    type: 'table',
    table: {
      table_width: tableWidth,
      ...options,
      children: rows,
    },
  }
}
