export interface URI {
  scheme: string;
  hostname: string;
  pathname: string;
  port: number | null;
  query: string;
}

export type URIKey = keyof URI;

export interface Builder {
  /** set scheme, such as `https` or `ftp` */
  scheme: (value: string) => Builder;
  /** set hostname, e.g. domain: `example.com` */
  hostname: (value: string) => Builder;
  /** provide array of paths following the `hostname` */
  paths: (values: string[]) => Builder;
  /** provide object which is transformed to query parameters */
  parameters: (values: Record<string, string>) => Builder;
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
