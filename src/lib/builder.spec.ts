import { urinator } from './builder'

describe('builder', () => {
  it('should produce URI object with scheme', () => {
    expect(urinator())
      .toHaveProperty('scheme')
  })

  it('should produce URI object with hostname', () => {
    expect(urinator())
      .toHaveProperty('hostname')
  })

  it('should produce URI object with paths', () => {
    expect(urinator())
      .toHaveProperty('paths')
  })

  it('should produce URI object with parameters', () => {
    expect(urinator())
      .toHaveProperty('parameters')
  })

  it('should produce URI object with port', () => {
    expect(urinator())
      .toHaveProperty('port')
  })

  it('should produce URI object with build', () => {
    expect(urinator())
      .toHaveProperty('build')
  })

  it('should produce URI object with toString', () => {
    expect(urinator())
      .toHaveProperty('toString')
  })

  describe('build string', () => {
    it('should build string with scheme', () => {
      expect(urinator().scheme('https').build())
        .toEqual('https://')
    })

    it('should build string with hostname', () => {
      expect(urinator().hostname('here.web').build())
        .toEqual('here.web')
    })

    it('should build string with scheme and hostname', () => {
      expect(
        urinator()
          .scheme('http')
          .hostname('here.web')
          .build()
      ).toEqual('http://here.web')
    })

    it('should build string with path', () => {
      expect(urinator().paths('page').build())
        .toEqual('/page')
    })

    it('should build string with paths', () => {
      expect(urinator().paths([ 'page', 10, 'detail' ]).build())
        .toEqual('/page/10/detail')
    })

    it('should build string with scheme, hostname and path', () => {
      expect(
        urinator()
          .scheme('http')
          .hostname('here.web')
          .paths([ 'page', 10, 'detail' ])
          .build()
      ).toEqual('http://here.web/page/10/detail')
    })

    it('should build string with parameters', () => {
      expect(urinator().parameters({ a: 1, b: 'x' }).build())
        .toEqual('?a=1&b=x')
    })

    it('should build string with port', () => {
      expect(
        urinator()
          .port(600)
          .hostname('foo.bar')
          .build())
        .toEqual('foo.bar:600')
    })

    it('should NOT build string with port and without hostname', () => {
      expect(
        urinator()
          .port(600)
          .build())
        .toEqual('')
    })

    it('should build string with scheme, hostname, path ' +
       'and port', () => {
      expect(
        urinator()
          .scheme('http')
          .hostname('here.web')
          .port(600)
          .paths([ 'page', 10, 'detail' ])
          .build()
      ).toEqual('http://here.web:600/page/10/detail')
    })
  })

  describe('with base configuration', () => {
    it('should build string with configured scheme', () => {
      expect(urinator({ scheme: 'ftp' }).build())
        .toEqual('ftp://')
    })

    it('should build string with overriden scheme', () => {
      expect(urinator({ scheme: 'ftp' }).scheme('sftp').build())
        .toEqual('sftp://')
    })

    it('should build string with configured hostname', () => {
      expect(urinator({ hostname: 'example.com' }).build())
        .toEqual('example.com')
    })

    it('should build string with overriden hostname', () => {
      expect(urinator({ hostname: 'example.com' }).hostname('foo.bar').build())
        .toEqual('foo.bar')
    })

    it('should build string with configured port', () => {
      expect(urinator({ hostname: 'example.com', port: 443 }).build())
        .toEqual('example.com:443')
    })

    it('should build string with overriden port', () => {
      expect(urinator({ hostname: 'example.com', port: 443 }).port(8081).build())
        .toEqual('example.com:8081')
    })

    it('should build string with configured query', () => {
      expect(urinator({ query: 'a=1&b=2' }).build())
        .toEqual('?a=1&b=2')
    })
  })
})
