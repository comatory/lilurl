import {
  joinPaths,
  createParameterString,
  createPathnameFromTemplate,
  buildTemplateValues,
  buildURIString,
  buildTemplatedURIString,
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

const DEFAULT_URI: URI = Object.freeze({
  scheme: '',
  hostname: '',
  pathname: '',
  port: null,
  query: '',
  template: null,
  templateValues: null,
})

/** builder function */
export const lilurl = (
  base: Partial<URI> = {},
): Builder => {
  let uri: URI = {
    ...DEFAULT_URI,
    ...base,
  }

  let usedPaths = false
  let usedTemplate = false

  if (uri.templateValues && uri.template !== null) {
    usedTemplate = true
    uri = produceNextURI(uri, 'pathname', createPathnameFromTemplate(
      uri.template,
      uri.templateValues,
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

      if (uri.template !== null && uri.templateValues) {
        uri = produceNextURI(uri, 'pathname', createPathnameFromTemplate(
          uri.template,
          uri.templateValues,
        ))
      }

      return builder
    },
    fill: (key: string, value: unknown) => {
      if (!uri.template) {
        throw LilurlBuildError.fill()
      }

      uri = produceNextURI(
        uri,
        'templateValues',
        buildTemplateValues(
          uri.templateValues ?? [],
          [ { key, value } ]
        )
      )

      return builder
    },
    fillIn: (values: Record<string, unknown>) => {
      if (!uri.template) {
        throw LilurlBuildError.fill()
      }

      const templateValues = Object.keys(values).map((key) => ({ key, value: values[key] }))
      uri = produceNextURI(
        uri,
        'templateValues',
        buildTemplateValues(
          uri.templateValues ?? [],
          templateValues
        )
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
    build: () => uri.template === null
      ? buildURIString(uri)
      : buildTemplatedURIString(uri),
    toString: () => uri.template === null
      ? buildURIString(uri)
      : buildTemplatedURIString(uri),
  }

  return builder
}
