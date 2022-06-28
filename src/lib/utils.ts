import { URI, Stringifiable } from './types'

const PATH_SEPARATOR = '/'

export const joinPaths = (paths: string[]): string => (
  paths.reduce((out, path) => {
    return `${out}${PATH_SEPARATOR}${path}`
  }, '')
)

const isStringifiable = (value: unknown): value is Stringifiable => {
  if (value === undefined || value === null) {
    return false
  }

  return Boolean((value as any)['toString'])
}

const createStringifiedParameters = (
  values: Record<string, unknown>
): Record<string, string> => (
  Object.keys(values).reduce((map, key) => {
    const value = values[key] as unknown

    return {
      ...map,
      [key]: isStringifiable(value)
        ? value.toString()
        : JSON.stringify(value),
    }
  }, {})
)

export const createParameterString = (
  values: Record<string, unknown>
): string => {
  const params = new URLSearchParams(createStringifiedParameters(values))
  return params.toString()
}

export const buildURIString = (uri: URI): string => {
  return [
    `${uri.scheme.length > 0 ? `${uri.scheme}:${PATH_SEPARATOR}${PATH_SEPARATOR}` : ''}`,
    `${uri.hostname.length > 0 ? uri.hostname : ''}`,
    `${uri.port !== null && uri.hostname.length > 0 ? `:${uri.port}` : ''}`,
    `${uri.pathname.length > 0 ? uri.pathname : ''}`,
    `${uri.query.length > 0 ? `?${uri.query}` : ''}`,
  ].join('')
}
