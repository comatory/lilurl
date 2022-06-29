import { lilurl } from './builder'
import { LilurlBuildError } from './errors'

describe('builder', () => {
  it('should produce URI object with scheme', () => {
    expect(lilurl())
      .toHaveProperty('scheme')
  })

  it('should produce URI object with hostname', () => {
    expect(lilurl())
      .toHaveProperty('hostname')
  })

  it('should produce URI object with paths', () => {
    expect(lilurl())
      .toHaveProperty('paths')
  })

  it('should produce URI object with parameters', () => {
    expect(lilurl())
      .toHaveProperty('parameters')
  })

  it('should produce URI object with port', () => {
    expect(lilurl())
      .toHaveProperty('port')
  })

  it('should produce URI object with build', () => {
    expect(lilurl())
      .toHaveProperty('build')
  })

  it('should produce URI object with toString', () => {
    expect(lilurl())
      .toHaveProperty('toString')
  })

  describe('build string', () => {
    it('should build string with scheme', () => {
      expect(lilurl().scheme('https').build())
        .toEqual('https://')
    })

    it('should build string with hostname', () => {
      expect(lilurl().hostname('here.web').build())
        .toEqual('here.web')
    })

    it('should build string with scheme and hostname', () => {
      expect(
        lilurl()
          .scheme('http')
          .hostname('here.web')
          .build()
      ).toEqual('http://here.web')
    })

    it('should build string with path', () => {
      expect(lilurl().paths('page').build())
        .toEqual('/page')
    })

    it('should build string with paths', () => {
      expect(lilurl().paths([ 'page', 10, 'detail' ]).build())
        .toEqual('/page/10/detail')
    })

    it('should build string with scheme, hostname and path', () => {
      expect(
        lilurl()
          .scheme('http')
          .hostname('here.web')
          .paths([ 'page', 10, 'detail' ])
          .build()
      ).toEqual('http://here.web/page/10/detail')
    })

    it('should build string with parameters', () => {
      expect(lilurl().parameters({ a: 1, b: 'x' }).build())
        .toEqual('?a=1&b=x')
    })

    it('should build string with port', () => {
      expect(
        lilurl()
          .port(600)
          .hostname('foo.bar')
          .build())
        .toEqual('foo.bar:600')
    })

    it('should NOT build string with port and without hostname', () => {
      expect(
        lilurl()
          .port(600)
          .build())
        .toEqual('')
    })

    it('should build string with scheme, hostname, path ' +
       'and port', () => {
      expect(
        lilurl()
          .scheme('http')
          .hostname('here.web')
          .port(600)
          .paths([ 'page', 10, 'detail' ])
          .build()
      ).toEqual('http://here.web:600/page/10/detail')
    })
  })

  describe('with template', () => {
    it('should build string with filled template values', () => {
      expect(
        lilurl()
          .scheme('https')
          .hostname('foo.bar')
          .template('/pages/:id/details/:section')
          .fillIn({ id: 100, section: 'comments' })
          .build()
      ).toEqual('https://foo.bar/pages/100/details/comments')
    })

    it('should throw error when values for template were not provided', () => {
      expect(
        () => lilurl()
          .scheme('https')
          .hostname('foo.bar')
          .paths([ 'pages', 100, 'details', 'comments' ])
          .template('/pages/:id/details/:section')
          .fillIn({ id: 100, section: 'comments' })
          .build()
      ).toThrowError(LilurlBuildError)
    })

    it('should gradually apply template values with `fill`', () => {
      expect(
        lilurl()
          .scheme('https')
          .hostname('foo.bar')
          .template('/pages/:id/details/:section/:section_id')
          .fill('id', 100)
          .fill('section', 'comments')
          .fill('section_id', 'highlights')
          .build()
      ).toEqual('https://foo.bar/pages/100/details/comments/highlights')
    })

    it('should throw error when gradually applying template and ' +
       'values for template were not provided', () => {
      expect(
        () => lilurl()
          .scheme('https')
          .hostname('foo.bar')
          .template('/pages/:id/details/:section/:section_id')
          .fill('id', 100)
          .fill('section', 'comments')
          .build()
      ).toThrowError(LilurlBuildError)
    })
  })

  describe('with base configuration', () => {
    it('should build string with configured scheme', () => {
      expect(lilurl({ scheme: 'ftp' }).build())
        .toEqual('ftp://')
    })

    it('should build string with overriden scheme', () => {
      expect(lilurl({ scheme: 'ftp' }).scheme('sftp').build())
        .toEqual('sftp://')
    })

    it('should build string with configured hostname', () => {
      expect(lilurl({ hostname: 'example.com' }).build())
        .toEqual('example.com')
    })

    it('should build string with overriden hostname', () => {
      expect(lilurl({ hostname: 'example.com' }).hostname('foo.bar').build())
        .toEqual('foo.bar')
    })

    it('should build string with configured port', () => {
      expect(lilurl({ hostname: 'example.com', port: 443 }).build())
        .toEqual('example.com:443')
    })

    it('should build string with overriden port', () => {
      expect(lilurl({ hostname: 'example.com', port: 443 }).port(8081).build())
        .toEqual('example.com:8081')
    })

    it('should build string with configured query', () => {
      expect(lilurl({ query: 'a=1&b=2' }).build())
        .toEqual('?a=1&b=2')
    })

    it('should build string with configured template', () => {
      expect(lilurl({
        template: '/pages/:id',
      }, {
        id: 10,
      }).build())
        .toEqual('/pages/10')
    })

    it('should build string with overriden template', () => {
      expect(
        lilurl({
          template: '/pages/:id',
        }, {
          id: 10,
        })
        .template('/comments/:id')
        .build()
      ).toEqual('/comments/10')
    })

    it('should build string with overriden template and filled value', () => {
      expect(
        lilurl({
          template: '/pages/:id',
        }, {
          id: 10,
        })
        .template('/comments/:id')
        .fillIn({ id: 300 })
        .build()
      ).toEqual('/comments/300')
    })

    it.skip('should build string with overriden template and ' +
       'gradually filled value', () => {
      expect(
        lilurl({
          template: '/pages/:id',
        }, {
          id: 10,
        })
        .template('/comments/:id/section/:name')
        .fill('id', 300)
        .fill('name', 'comments')
        .build()
      ).toEqual('/comments/300/section/comments')
    })
  })

  describe('integration', () => {
    it.skip('should build string for API roots', () => {
      const apiRoot = lilurl({
        scheme: 'https',
        hostname: 'api.company.com',
      })

      const resourceRoot = apiRoot.template('/books/:id')

      expect(
        resourceRoot.fill('id', 100).build()
      ).toEqual('https://api.company.com/books/100')

      expect(
        resourceRoot
          .fill('id', 999)
          .parameters({ s: 'moby dick' })
          .build()
      ).toEqual('https://api.company.com/books/999?s=moby+dick')
    })
  })
})
