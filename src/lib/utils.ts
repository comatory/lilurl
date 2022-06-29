import { URI, Stringifiable } from './types'
import { LilurlBuildError } from './errors'

const PATH_SEPARATOR = '/'

export const joinPaths = (
  paths: ((string|number)[] | string)
): string => {
  if (typeof paths === 'string') {
    return `${PATH_SEPARATOR}${paths}`
  }

  return paths.reduce((out: string, path: string | number) => {
    const stringifiedPath = typeof path === 'number'
      ? String(path)
      : path

    return `${out}${PATH_SEPARATOR}${stringifiedPath}`
  }, '')
}

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

const sanitizeColon = (value: string) => value.replace(':', '')

const hasColon = (value: string): boolean => /^:/.test(value)

const sanitizeSlash = (value: string) => value.replace(/PATH_SEPARATOR/g, '')

const sanitize = (value: string, ...sanitizers: ((value: string) => string)[]): string => {
  return sanitizers.reduce((out, fn) => {
    return fn(out)
  }, value)
}

const extractTemplateKeys = (template: string): string[] => {
  return template
    .split(PATH_SEPARATOR)
    .map((value) => sanitize(value, sanitizeSlash, sanitizeColon))
    .filter((value) => value.length > 0)
}

const extractPathPartsWithoutTemplate = (template: string): string[] => {
  return template
    .split(PATH_SEPARATOR)
    .filter((value) => hasColon(value))
    .map((value) => sanitize(value, sanitizeSlash, sanitizeColon))
    .filter((value) => value.length > 0)
}

export const createPathnameFromTemplate = (
  template: string,
  values: Record<string, unknown>
): string => {
  const templateKeys = new Set(extractTemplateKeys(template))
  const pathKeys = new Set(extractPathPartsWithoutTemplate(template))
  const valueKeys = new Set(Object.keys(values))

  const missingKeysInTemplate = new Set(
    [...pathKeys].filter((key) => !valueKeys.has(key))
  )

  if (missingKeysInTemplate.size > 0) {
    missingKeysInTemplate.forEach((missingKey) => {
      throw LilurlBuildError.fillValue(missingKey)
    })
  }

  const paths = Array.from(templateKeys).map((templateKey) => {
    const value = values[templateKey]

    if (value === undefined) {
      return templateKey
    }

    return isStringifiable(value)
      ? value.toString()
      : JSON.stringify(value)
  })

  return joinPaths(paths)
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
