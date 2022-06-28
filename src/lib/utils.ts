import { URI } from './types'

const PATH_SEPARATOR = '/'

export const joinPaths = (paths: string[]): string => (
  paths.reduce((out, path) => {
    return `${out}${PATH_SEPARATOR}${path}`
  }, '')
)

export const createParameterString = (
  values: Record<string, string>
): string => {
  const params = new URLSearchParams(values)
  return params.toString()
}

export const buildURIString = (uri: URI): string => {
  return [
    `${uri.scheme.length > 0 ? `${uri.scheme}:${PATH_SEPARATOR}${PATH_SEPARATOR}` : ''}`,
    `${uri.port !== null ? uri.port : ''}`,
    `${uri.hostname.length > 0 ? `${uri.hostname}${PATH_SEPARATOR}` : ''}`,
    `${uri.pathname.length > 0 ? uri.pathname : ''}`,
    `${uri.query.length > 0 ? `?${uri.query}` : ''}`,
  ].join('')
}
