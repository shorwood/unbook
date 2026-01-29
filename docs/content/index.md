---
seo:
  title: Unbook ,  The TypeScript ORM for Notion
  description: Stop wrestling with Notion's API. Unbook gives you type-safe entities, declarative schemas, and ORM-like operations that just work.
---

::u-page-hero
#title
The Notion API, [reimagined]{.text-primary}.

#description
Stop wrestling with raw API responses. Unbook gives you type-safe entities, :br
declarative schemas, and intuitive methods that make Notion feel like a database.

#links
  :::u-button
  ---
  color: primary
  size: xl
  to: /getting-started/quick-start
  trailing-icon: i-lucide-arrow-right
  ---
  Get started in 5 minutes
  :::

  :::u-button
  ---
  color: neutral
  icon: i-lucide-github
  size: xl
  to: https://github.com/shorwood/unbook
  target: _blank
  variant: ghost
  ---
  View on GitHub
  :::
::

::u-page-section
#title
Everything you need, [nothing you don't]{.text-primary}

#description
A minimal, focused API that respects your time and your types.

  :::u-page-grid
    ::::u-page-card
    ---
    spotlight: true
    spotlightColor: primary
    highlight: true
    highlightColor: primary
    class: col-span-3
    to: /concepts/entities
    ---
      :::::div{.bg-elevated.rounded-lg.p-4.overflow-x-auto}
      ```ts
      // Before: Raw API chaos
      const response = await notion.pages.retrieve({ page_id: 'abc123' })
      const title = response.properties.Name.title[0]?.plain_text ?? ''

      // After: Clean, typed entities
      const page = await workspace.getPage('abc123')
      const title = page.title // ✨ Just works
      ```
      :::::

    #title
    From [API chaos]{.line-through.text-muted} to [clarity]{.text-primary}

    #description
    No more defensive coding against nullable nested properties. Unbook wraps Notion's verbose responses into clean, predictable entity classes.
    ::::

    ::::u-page-card
    ---
    spotlight: true
    spotlightColor: secondary
    variant: subtle
    class: col-span-2
    to: /getting-started/quick-start
    ---
      :::::div{.bg-elevated.rounded-lg.p-4.overflow-x-auto}
      ```ts
      await page.append([
        blocks.heading1('Project Overview'),
        blocks.paragraph('Built with Unbook'),
        blocks.callout('Pro tip: schemas are idempotent!', {
          icon: '💡',
          color: 'blue'
        }),
        blocks.divider(),
        blocks.code('npm i @unbook/core', 'bash')
      ])
      ```
      :::::

    #title
    [Fluent builders]{.text-primary} for rich content

    #description
    Compose complex documents with chainable, readable methods. Headings, callouts, code blocks, tables ,  all with full IntelliSense.
    ::::

    ::::u-page-card
    ---
    spotlight: true
    spotlightColor: success
    variant: soft
    class: col-span-1
    to: /getting-started/installation
    ---
      :::::div{.flex.flex-col.items-center.justify-center.h-full.py-12.gap-4}
        ::::::div{.text-6xl}
        ⚡
        ::::::
        ::::::div{.text-center}
          :::::::div{.font-mono.text-sm.bg-elevated.rounded-md.px-3.py-2}
          pnpm add @unbook/core @unbook/notion
          :::::::
        ::::::
        ::::::div{.text-xs.text-muted.mt-2}
        ~15KB gzipped · Zero dependencies
        ::::::
      :::::

    #title
    [Lightweight]{.text-primary} & fast

    #description
    Two packages. No bloat. Ships ESM and CJS with full tree-shaking support.
    ::::

    ::::u-page-card
    ---
    spotlight: true
    spotlightColor: info
    variant: soft
    class: col-span-1
    to: /concepts/adapters
    ---
      :::::div{.flex.flex-col.items-center.justify-center.h-full.py-12.gap-3}
        ::::::div{.flex.gap-4.items-center}
          :::::::div{.text-center}
            ::::::::div{.text-4xl.mb-1}
            📝
            ::::::::
            ::::::::div{.text-xs.font-semibold}
            Notion
            ::::::::
            ::::::::div{.text-[10px].text-primary}
            Ready
            ::::::::
          :::::::
          :::::::div{.text-center.opacity-50}
            ::::::::div{.text-4xl.mb-1}
            🍃
            ::::::::
            ::::::::div{.text-xs.font-semibold}
            AppFlowy
            ::::::::
            ::::::::div{.text-[10px].text-muted}
            Coming soon
            ::::::::
          :::::::
        ::::::
      :::::

    #title
    [Adapter]{.text-primary} architecture

    #description
    Write once, deploy anywhere. Switch platforms without rewriting your business logic.
    ::::

    ::::u-page-card
    ---
    spotlight: true
    spotlightColor: warning
    highlight: true
    highlightColor: warning
    variant: subtle
    class: col-span-2
    to: /concepts/schema
    ---
      :::::div{.bg-elevated.rounded-lg.p-4.overflow-x-auto}
      ```ts
      const tasks = await workspace.ensureDatabase('Tasks', {
        schema: {
          name: { type: 'title' },
          status: { type: 'select', options: ['Todo', 'Done'] },
          assignee: { type: 'people' },
          dueDate: { type: 'date' }
        },
        conflictStrategy: 'merge' // Safe migrations
      })
      ```
      :::::

    #title
    [Declarative]{.text-primary} schema management

    #description
    Define your database structure in code. Unbook handles creation, diffing, and migrations automatically. Deploy with zero fear.
    ::::

    ::::u-page-card
    ---
    spotlight: true
    spotlightColor: success
    highlight: true
    highlightColor: success
    class: col-span-3
    ---
      :::::div{.bg-elevated.rounded-lg.p-4.overflow-x-auto}
      ```ts
      // Full TypeScript inference ,  no codegen required
      const tasks = await workspace.getDatabase<{
        name: string
        status: 'Todo' | 'In Progress' | 'Done'
        assignee: User[]
        dueDate: Date | null
      }>('tasks-db-id')

      for await (const task of tasks.find({ status: 'Todo' })) {
        console.log(task.name)      // string ✓
        console.log(task.status)    // 'Todo' | 'In Progress' | 'Done' ✓
        console.log(task.assignee)  // User[] ✓
      }
      ```
      :::::

    #title
    [End-to-end]{.text-primary} type safety

    #description
    Your IDE knows your schema. Autocomplete property names, catch type errors at compile time, and refactor with confidence. No code generation step, no manual type definitions ,  just TypeScript doing what it does best.
    ::::
  :::
::

::u-page-section
---
class: bg-gradient-to-b from-transparent to-elevated/50
---
#title
Built for [developers]{.text-primary} who ship

#description
Whether you're building internal tools, automating workflows, or syncing data ,  Unbook gets out of your way.

  :::u-page-grid
    ::::u-page-card
    ---
    icon: i-lucide-repeat
    variant: soft
    spotlight: true
    spotlightColor: primary
    class: col-span-1
    ---
    #title
    Async Iterators

    #description
    Paginate through thousands of records with memory-efficient `for await` loops. No manual cursor management.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-search
    variant: soft
    spotlight: true
    spotlightColor: secondary
    class: col-span-1
    ---
    #title
    Smart Queries

    #description
    Filter, sort, and search with a fluent API that compiles to optimal Notion queries under the hood.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-shield-check
    variant: soft
    spotlight: true
    spotlightColor: success
    class: col-span-1
    ---
    #title
    Error Handling

    #description
    Typed errors with context. Know exactly what went wrong and where ,  no more cryptic API responses.
    ::::
  :::
::

::u-page-section
  :::div{.text-center.py-12}
    ::::div{.text-3xl.font-bold.mb-4}
    Ready to simplify your Notion integrations?
    ::::
    ::::div{.text-lg.text-muted.mb-8}
    Join developers who chose sanity over complexity.
    ::::
    ::::div{.flex.justify-center.gap-4}
      :::::u-button
      ---
      color: primary
      size: xl
      to: /getting-started/quick-start
      trailing-icon: i-lucide-arrow-right
      ---
      Start building
      :::::

      :::::u-button
      ---
      color: neutral
      size: xl
      to: /concepts/entities
      variant: outline
      ---
      Explore the docs
      :::::
    ::::
  :::
::
