import {
  joinPaths,
  createParameterString,
  createPathnameFromTemplate,
  buildURIString,
} from './utils'
import { LilurlBuildError } from './errors'
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
export const lilurl = (
  base: Partial<URI> = {},
  templateValues?: Record<string, unknown>
): Builder => {
  let uri: URI = {
    scheme: '',
    hostname: '',
    pathname: '',
    port: null,
    query: '',
    template: null,
    ...base,
  }

  let usedPaths = false
  let usedTemplate = false

  if (templateValues && uri.template !== null) {
    usedTemplate = true
    uri = produceNextURI(uri, 'pathname', createPathnameFromTemplate(
      uri.template,
      templateValues,
    ))
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
    paths: (values: ((string|number)[]) | string) => {
      if (usedTemplate) {
        throw LilurlBuildError.path()
      }

      uri = produceNextURI(uri, 'pathname', joinPaths(values))
      usedPaths = true
      return builder
    },
    template: (value: string) => {
      if (usedPaths) {
        throw LilurlBuildError.templatePath()
      }

      uri = produceNextURI(uri, 'template', value)
      usedTemplate = true

      if (uri.template !== null && templateValues) {
        uri = produceNextURI(uri, 'pathname', createPathnameFromTemplate(
          uri.template,
          templateValues,
        ))
      }

      return builder
    },
    fillIn: (values: Record<string, unknown>) => {
      if (!uri.template) {
        throw LilurlBuildError.fill()
      }

      uri = produceNextURI(
        uri,
        'pathname',
        createPathnameFromTemplate(uri.template, values)
      )

      return builder
    },
    parameters: (values: Record<string, unknown>) => {
      uri = produceNextURI(uri, 'query', createParameterString(values))
      return builder
    },
    port: (value: number) => {
      uri = produceNextURI(uri, 'port', value)
      return builder
    },
    build: () => buildURIString(uri),
    toString: () => buildURIString(uri),
  }

  return builder
}
