import { joinPaths, createParameterString, buildURIString } from './utils'
import type { URI, URIKey, Builder } from './types'

const produceNextURI = (
  prev: URI,
  key: URIKey,
  value: URI[URIKey]
): URI => {
  return {
    ...prev,
    [key]: value,
  }
}

/** builder function */
export const urinator = (base: Partial<URI> = {}): Builder => {
  let uri: URI = {
    scheme: '',
    hostname: '',
    pathname: '',
    port: null,
    query: '',
    ...base,
  }

  const builder: Builder = {
    scheme: (value: string) => {
      uri = produceNextURI(uri, 'scheme', value)
      return builder
    },
    hostname: (value: string) => {
      uri = produceNextURI(uri, 'hostname', value)
      return builder
    },
    paths: (values: string[]) => {
      uri = produceNextURI(uri, 'pathname', joinPaths(values))
      return builder
    },
    parameters: (values: Record<string, string>) => {
      uri = produceNextURI(uri, 'query', createParameterString(values))
      return builder
    },
    port: (value: number) => {
      uri = produceNextURI(uri, 'port', value)
      return builder
    },
    build: () => buildURIString(uri),
  }

  return builder
}

/** alias to `urinator` for NSFW usage */
export const urntr = urinator
