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
export const urinator = (): Builder => {
  let base: URI = {
    scheme: '',
    hostname: '',
    pathname: '',
    port: null,
    query: '',
  }

  const builder: Builder = {
    scheme: (value: string) => {
      base = produceNextURI(base, 'scheme', value)
      return builder
    },
    hostname: (value: string) => {
      base = produceNextURI(base, 'hostname', value)
      return builder
    },
    paths: (values: string[]) => {
      base = produceNextURI(base, 'pathname', joinPaths(values))
      return builder
    },
    parameters: (values: Record<string, string>) => {
      base = produceNextURI(base, 'query', createParameterString(values))
      return builder
    },
    port: (value: number) => {
      base = produceNextURI(base, 'port', value)
      return builder
    },
    build: () => buildURIString(base),
  }

  return builder
}

/** alias to `urinator` for NSFW usage */
export const urntr = urinator
