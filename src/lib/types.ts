export interface URI {
  scheme: string;
  hostname: string;
  pathname: string;
  port: number | null;
  query: string;
  queryValues: Record<string, unknown> | null;
  template: string | null;
}

export type URIKey = keyof URI;

export interface Builder {
  /** set scheme, such as `https` or `ftp` */
  scheme: (value: string) => Builder;
  /** set hostname, e.g. domain: `example.com` */
  hostname: (value: string) => Builder;
  /**
    * provide array of paths following the `hostname`
    * cannot be used with `templatePaths`
    */
  paths: (values: ((string|number)[]) | string) => Builder;
  /**
    * provide array of template paths following the `hostname`
    * cannot be used with `pathname`
    */
  template: (value: string) => Builder;
  /** provide object which is transformed to query parameters */
  parameters: (values: Record<string, unknown>) => Builder;
  /** fills in values for `template` */
  fillIn: (values: Record<string, unknown>) => Builder
  /** provide port */
  port: (value: number) => Builder;
  /** produce URI string */
  build: () => string;
  /** alias to `build` */
  toString: () => string;
}

export interface Stringifiable {
  toString: () => string;
}

type BuildErrorCodeKeys = (
  'PATH_BUILD_ERROR_CODE'
  | 'TEMPLATE_PATH_BUILD_ERROR_CODE'
  | 'FILL_BUILD_ERROR_CODE'
  | 'FILL_NON_EXISTENT_TEMPLATE_ERROR_CODE'
)

export type LilurlBuildErrorCodes = Record<BuildErrorCodeKeys, number>
