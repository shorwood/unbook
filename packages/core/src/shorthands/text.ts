/* eslint-disable unicorn/no-null */
import type {
  Color,
  DateObject,
  RichText,
  UserObject,
  UserReference,
} from '@/types'

/** Default annotations with all styles disabled and default color. */
const DEFAULT_ANNOTATIONS: RichText.Annotations = {
  bold: false,
  italic: false,
  strikethrough: false,
  underline: false,
  code: false,
  color: 'default',
}

/** Options for creating a plain text rich text object. */
type TextOptions = Partial<RichText.Annotations> & { link?: string }

/**
 * Creates a plain text rich text object.
 *
 * @param content The text content.
 * @param options Options for text annotations and link.
 * @returns A RichText.Text object.
 * @example text('Hello world')
 * @example text('Click here', 'https://example.com')
 */
export function text(content: string, options: TextOptions = {}): RichText.Text {
  const { link, ...annotations } = options
  return {
    type: 'text',
    annotations: { ...DEFAULT_ANNOTATIONS, ...annotations },
    plain_text: content,
    href: link ?? null,
    text: {
      content,
      link: link ? { url: link } : null,
    },
  }
}

/**
 * Creates a bold text rich text object.
 *
 * @param content The text content.
 * @param link Optional URL link for the text.
 * @returns A RichText.Text object with bold annotation.
 * @example bold('Important text')
 */
export function bold(content: string, link?: string): RichText.Text {
  return {
    type: 'text',
    annotations: { ...DEFAULT_ANNOTATIONS, bold: true },
    plain_text: content,
    href: link ?? null,
    text: {
      content,
      link: link ? { url: link } : null,
    },
  }
}

/**
 * Creates an italic text rich text object.
 *
 * @param content The text content.
 * @param link Optional URL link for the text.
 * @returns A RichText.Text object with italic annotation.
 * @example italic('Emphasized text')
 */
export function italic(content: string, link?: string): RichText.Text {
  return {
    type: 'text',
    annotations: { ...DEFAULT_ANNOTATIONS, italic: true },
    plain_text: content,
    href: link ?? null,
    text: {
      content,
      link: link ? { url: link } : null,
    },
  }
}

/**
 * Creates a strikethrough text rich text object.
 *
 * @param content The text content.
 * @param link Optional URL link for the text.
 * @returns A RichText.Text object with strikethrough annotation.
 * @example strikethrough('Deleted text')
 */
export function strikethrough(content: string, link?: string): RichText.Text {
  return {
    type: 'text',
    annotations: { ...DEFAULT_ANNOTATIONS, strikethrough: true },
    plain_text: content,
    href: link ?? null,
    text: {
      content,
      link: link ? { url: link } : null,
    },
  }
}

/**
 * Creates an underline text rich text object.
 *
 * @param content The text content.
 * @param link Optional URL link for the text.
 * @returns A RichText.Text object with underline annotation.
 * @example underline('Underlined text')
 */
export function underline(content: string, link?: string): RichText.Text {
  return {
    type: 'text',
    annotations: { ...DEFAULT_ANNOTATIONS, underline: true },
    plain_text: content,
    href: link ?? null,
    text: {
      content,
      link: link ? { url: link } : null,
    },
  }
}

/**
 * Creates a code (monospace) text rich text object.
 *
 * @param content The text content.
 * @param link Optional URL link for the text.
 * @returns A RichText.Text object with code annotation.
 * @example code('const x = 1')
 */
export function code(content: string, link?: string): RichText.Text {
  return {
    type: 'text',
    annotations: { ...DEFAULT_ANNOTATIONS, code: true },
    plain_text: content,
    href: link ?? null,
    text: {
      content,
      link: link ? { url: link } : null,
    },
  }
}

/**
 * Creates a colored text rich text object.
 *
 * @param content The text content.
 * @param color The color to apply to the text.
 * @param link Optional URL link for the text.
 * @returns A RichText.Text object with the specified color.
 * @example color('Red text', 'red')
 * @example color('Highlighted', 'yellow_background')
 */
export function color(content: string, color: Color, link?: string): RichText.Text {
  return {
    type: 'text',
    annotations: { ...DEFAULT_ANNOTATIONS, color },
    plain_text: content,
    href: link ?? null,
    text: {
      content,
      link: link ? { url: link } : null,
    },
  }
}

// --- Equation Shorthand ---

/**
 * Creates an equation rich text object.
 *
 * @param expression The LaTeX expression for the equation.
 * @returns A RichText.Equation object.
 * @example equation('E = mc^2')
 * @example equation('\\sum_{i=1}^{n} x_i')
 */
export function equation(expression: string): RichText.Equation {
  return {
    type: 'equation',
    annotations: { ...DEFAULT_ANNOTATIONS },
    plain_text: expression,
    href: null,
    equation: { expression },
  }
}

// --- Mention Shorthands ---

/**
 * Creates a database mention rich text object.
 *
 * @param databaseId The ID of the database to mention.
 * @returns A RichText.Mention object referencing a database.
 * @example mentionDatabase('12345678-1234-1234-1234-123456789012')
 */
export function mentionDatabase(databaseId: string): RichText.Mention {
  return {
    type: 'mention',
    annotations: { ...DEFAULT_ANNOTATIONS },
    plain_text: '',
    href: null,
    mention: {
      type: 'database',
      database: { id: databaseId },
    },
  }
}

/**
 * Creates a date mention rich text object.
 *
 * @param date The date object with start and optional end date.
 * @returns A RichText.Mention object referencing a date.
 * @example mentionDate({ start: '2024-01-01' })
 * @example mentionDate({ start: '2024-01-01', end: '2024-01-31' })
 */
export function mentionDate(date: DateObject): RichText.Mention {
  return {
    type: 'mention',
    annotations: { ...DEFAULT_ANNOTATIONS },
    plain_text: date.start,
    href: null,
    mention: {
      type: 'date',
      date,
    },
  }
}

/**
 * Creates a link preview mention rich text object.
 *
 * @param url The URL for the link preview.
 * @returns A RichText.Mention object with a link preview.
 * @example mentionLinkPreview('https://example.com/article')
 */
export function mentionLinkPreview(url: string): RichText.Mention {
  return {
    type: 'mention',
    annotations: { ...DEFAULT_ANNOTATIONS },
    plain_text: url,
    href: url,
    mention: {
      type: 'link_preview',
      link_preview: { url },
    },
  }
}

/**
 * Creates a page mention rich text object.
 *
 * @param pageId The ID of the page to mention.
 * @returns A RichText.Mention object referencing a page.
 * @example mentionPage('12345678-1234-1234-1234-123456789012')
 */
export function mentionPage(pageId: string): RichText.Mention {
  return {
    type: 'mention',
    annotations: { ...DEFAULT_ANNOTATIONS },
    plain_text: '',
    href: null,
    mention: {
      type: 'page',
      page: { id: pageId },
    },
  }
}

/**
 * Creates a user mention rich text object.
 *
 * @param user The user object or user reference to mention.
 * @returns A RichText.Mention object referencing a user.
 * @example mentionUser({ object: 'user', id: '12345678-1234-1234-1234-123456789012' })
 */
export function mentionUser(user: UserObject | UserReference): RichText.Mention {
  return {
    type: 'mention',
    annotations: { ...DEFAULT_ANNOTATIONS },
    plain_text: '',
    href: null,
    mention: {
      type: 'user',
      user,
    },
  }
}

/**
 * Creates a template mention date rich text object for dynamic dates.
 *
 * @param templateDate The template date value: 'now' or 'today'.
 * @returns A RichText.Mention object with a template mention date.
 * @example mentionTemplateDateNow() // Uses 'now'
 * @example mentionTemplateDateToday() // Uses 'today'
 */
export function mentionTemplateDate(templateDate: 'now' | 'today'): RichText.Mention {
  return {
    type: 'mention',
    annotations: { ...DEFAULT_ANNOTATIONS },
    plain_text: templateDate,
    href: null,
    mention: {
      type: 'template_mention',
      template_mention: {
        type: 'template_mention_date',
        template_mention_date: templateDate,
      },
    },
  }
}

/**
 * Creates a template mention user rich text object for the current user.
 *
 * @returns A RichText.Mention object with a template mention for 'me'.
 * @example mentionTemplateUser() // References the current user
 */
export function mentionTemplateUser(): RichText.Mention {
  return {
    type: 'mention',
    annotations: { ...DEFAULT_ANNOTATIONS },
    plain_text: 'me',
    href: null,
    mention: {
      type: 'template_mention',
      template_mention: {
        type: 'template_mention_user',
        template_mention_user: 'me',
      },
    },
  }
}
