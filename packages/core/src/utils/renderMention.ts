import type { DatabaseObject, PageObject, RichText, UserObject } from '@/types'
import { renderPageTitle } from './renderPageTitle'
import { renderRichText } from './renderRichText'

export interface RenderOptions {
  resolveUser: (id: string) => Promise<undefined | UserObject>
  resolvePage: (id: string) => Promise<PageObject | undefined>
  resolveDatabase?: (id: string) => Promise<DatabaseObject | undefined>
}

/**
 * Renders a mention object into markdown text.
 *
 * @param mention The mention object to render.
 * @param options Options for resolving mentions.
 * @returns A markdown string representing the mention.
 */
export async function renderMention(
  mention: RichText.Mention,
  options: RenderOptions,
): Promise<string> {
  const {
    resolveUser,
    resolvePage,
    resolveDatabase,
  } = options

  // --- If the mention is a user, render the user's name.
  if (mention.mention.type === 'user') {
    const user = await resolveUser(mention.mention.user.id)
    const name = user?.name ?? mention.plain_text
    return `@${name}`
  }

  // --- If the mention is a page, render the page title.
  else if (mention.mention.type === 'page') {
    const page = await resolvePage(mention.mention.page.id)
    const title = await renderPageTitle(page, options) ?? mention.plain_text
    return `[${title}](/${mention.mention.page.id})`
  }

  // --- If the mention is a database, render the database title.
  else if (mention.mention.type === 'database') {
    const database = await resolveDatabase?.(mention.mention.database.id)
    const title = await renderRichText(database?.title, options) ?? mention.plain_text
    return `[${title}](/${mention.mention.database.id})`
  }

  // --- If the mention is a date, render the date range.
  else if (mention.mention.type === 'date') {
    const { start, end } = mention.mention.date
    return end ? `${start} → ${end}` : start
  }

  // --- If the mention is a link preview, render the URL.
  else if (mention.mention.type === 'link_preview') {
    return `[${mention.plain_text}](${mention.mention.link_preview.url})`
  }

  // --- If the mention is a template mention, render the placeholder.
  else if (mention.mention.type === 'template_mention') {
    const { template_mention } = mention.mention
    if (template_mention.type === 'template_mention_date')
      return template_mention.template_mention_date === 'today' ? '@Today' : '@Now'
    return '@Me'
  }

  // --- Unknown mention type, fallback to plain text.
  return mention.plain_text
}
