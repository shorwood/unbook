/** The raw error response from the Notion API. */
export namespace NotionError {
  export interface Data {
    object: 'error'
    status: number
    code: string
    message: string
    request_id: string
  }
}

/**
 * Represents an error response from the Notion API. This class can be used to
 * encapsulate error details returned by the API and provide meaningful
 * information for debugging and error handling.
 */
export class NotionError extends Error {
  status: number
  code: string
  requestId: string
  requestUrl: string

  /**
   * Populates the NotionError instance from a Response object.
   *
   * @param response The Response object from a failed fetch request.
   * @returns A Promise that resolves to the populated NotionError instance.
   */
  async fromResponse(response: Response): Promise<NotionError> {
    return await response.json()
      // @ts-expect-error: ignored
      .then((body: NotionError.Data) => {
        this.message = body.message
        this.status = body.status
        this.code = body.code
        this.requestId = body.request_id
        this.requestUrl = response.url
        return this
      })
      .catch(() => {
        this.message = response.statusText
        this.status = response.status
        this.code = 'unknown'
        this.requestId = ''
        this.requestUrl = response.url
        return this
      })
  }
}
