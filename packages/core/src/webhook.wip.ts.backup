// THIS IS WIP AND SUBJECT TO CHANGE. DONT INCLUDE IN STABLE RELEASES YET.
export namespace Webhook {
  export type Event = Event.BlockCreated | Event.BlockDeleted | Event.BlockUpdated | Event.DatabaseCreated | Event.DatabaseUpdated | Event.PageCreated | Event.PageDeleted | Event.PageUpdated
  export namespace Event {
    interface Base { id: string; timestamp: string; workspace_id: string }
    export interface PageCreated extends Base { type: 'page.created'; page: Page }
    export interface PageUpdated extends Base { type: 'page.updated'; page: Page }
    export interface PageDeleted extends Base { type: 'page.deleted'; page_id: string }
    export interface DatabaseCreated extends Base { type: 'database.created'; database: Database }
    export interface DatabaseUpdated extends Base { type: 'database.updated'; database: Database }
    export interface BlockCreated extends Base { type: 'block.created'; block: Block }
    export interface BlockUpdated extends Base { type: 'block.updated'; block: Block }
    export interface BlockDeleted extends Base { type: 'block.deleted'; block_id: string }
  }
  export type EventType = Event['type']
  export interface Definition { events: EventType[]; path: string; description?: string; filter?: { database_id?: string; page_id?: string } }
  export interface Config { namespace: string; baseUrl: string; secret: string; hooks: Record<string, Definition> }
  export interface HandlerOptions { secret: string; maxAge?: number; onError?: (error: Error) => void }
  export interface Request { body: ArrayBuffer | string; headers: { get(name: string): null | string } }
  export type Handlers = { [K in EventType]?: (event: Extract<Event, { type: K }>) => Promise<void> | void }
  export interface IdempotencyStore { has(eventId: string): Promise<boolean>; add(eventId: string, ttl?: number): Promise<void> }
}

export function webhook(events: Webhook.EventType | Webhook.EventType[], options: Omit<Webhook.Definition, 'events'>): Webhook.Definition {
  return { events: Array.isArray(events) ? events : [events], ...options }
}

export const defineWebhooks = (config: Webhook.Config): Webhook.Config => config

export async function verifySignature(payload: ArrayBuffer | string, signature: string, secret: string, timestamp?: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
  const data = timestamp ? `${timestamp}.${payload}` : payload
  const sigBuf = new Uint8Array((signature.replace('sha256=', '').match(/.{2}/g) ?? []).map(b => Number.parseInt(b, 16))).buffer
  return crypto.subtle.verify('HMAC', key, sigBuf, encoder.encode(typeof data === 'string' ? data : ''))
}

export function createWebhookHandler(options: Webhook.HandlerOptions, handlers: Webhook.Handlers) {
  return async(request: Webhook.Request): Promise<{ status: number; body?: string }> => {
    try {
      const sig = request.headers.get('x-webhook-signature') ?? request.headers.get('x-notion-signature') ?? ''
      const ts = request.headers.get('x-webhook-timestamp') ?? ''
      const body = typeof request.body === 'string' ? request.body : new TextDecoder().decode(request.body)
      if (options.maxAge !== 0 && ts && Math.abs(Date.now() - new Date(ts).getTime()) / 1000 > (options.maxAge ?? 300)) return { status: 401, body: 'Expired' }
      if (!await verifySignature(body, sig, options.secret, ts)) return { status: 401, body: 'Invalid signature' }
      const event = JSON.parse(body) as Webhook.Event
      const h = handlers[event.type] as ((e: Webhook.Event) => Promise<void> | void) | undefined
      if (h) await h(event)
      return { status: 200 }
    }
    catch (error) { options.onError?.(error as Error); return { status: 500 } }
  }
}

export class MemoryIdempotencyStore implements Webhook.IdempotencyStore {
  private seen = new Map<string, number>()
  async has(id: string) { const exp = this.seen.get(id); if (!exp) return false; if (Date.now() > exp) { this.seen.delete(id); return false }; return true }
  async add(id: string, ttl = 86400000) { this.seen.set(id, Date.now() + ttl) }
}

export function withIdempotency(store: Webhook.IdempotencyStore, handler: (e: Webhook.Event) => Promise<void> | void) {
  return async(event: Webhook.Event) => { if (await store.has(event.id)) return; await handler(event); await store.add(event.id) }
}
