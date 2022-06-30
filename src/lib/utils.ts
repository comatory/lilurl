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

const splitBySeparator = (value: string): string[] => (
  value.split(PATH_SEPARATOR)
)

const extractTemplateKeys = (parts: string[]): string[] => (
  parts
    .filter(hasColon)
    .map((value) => sanitize(value, sanitizeSlash, sanitizeColon))
    .filter((value) => value.length > 0)
)

const getTemplateKeyFromPart = (
  part: string,
  templateKeys: Set<string>
) : string | null => (
  templateKeys.has(sanitizeColon(part))
    ? sanitizeColon(part)
    : null
)

export const createPathnameFromTemplate = (
  template: string,
  values: Record<string, unknown>
): string => {
  const parts = splitBySeparator(template)
  const templateKeys = new Set(extractTemplateKeys(parts))

  const paths = parts.map((part) => {
    const templateKey = getTemplateKeyFromPart(
      part,
      templateKeys
    )
    const value = templateKey ? values[templateKey] : part

    if (value === undefined) {
      return ''
    }

    return isStringifiable(value)
      ? value.toString()
      : JSON.stringify(value)
  })

  return joinPaths(paths.filter((path) => path.length > 0))
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

const createPartialPathnameFromTemplate = (
  template: string,
  key: string,
  value: unknown
): string => {
  return template.replace(`:${key}`, isStringifiable(value) ? value.toString() : JSON.stringify(value))
}

export const buildTemplatedURIString = (uri: URI): string => {
  const { template, templateValues } = uri

  if (template === null || templateValues === null) {
    return buildURIString(uri)
  }

  const pathKeys = new Set(extractTemplateKeys(splitBySeparator(template)))
  const valueKeys = new Set(templateValues.map(({ key }) => key))

  const missingKeysInTemplate = new Set(
    [...pathKeys].filter((key) => !valueKeys.has(key))
  )

  if (missingKeysInTemplate.size > 0) {
    missingKeysInTemplate.forEach((missingKey) => {
      throw LilurlBuildError.fillValue(missingKey)
    })
  }

  const uriWithFilledInValues = splitBySeparator(template).reduce((nextUri, path) => {
    const pathKey = Array.from(pathKeys).find((key) => `:${key}` === path)
    const templateValue = templateValues.find(({ key }) => key === pathKey)

    const pathname = templateValue && pathKey
      ? createPartialPathnameFromTemplate(
        nextUri.pathname.length > 0
          ? nextUri.pathname
          : template,
        pathKey,
        templateValue.value
      )
      : nextUri.pathname
      console.log(pathname)

    return {
      ...nextUri,
      pathname,
    }
  }, uri)

  return buildURIString(uriWithFilledInValues)
}
