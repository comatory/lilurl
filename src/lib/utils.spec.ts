import { joinPaths, createParameterString, buildURIString } from './utils'

describe('utils', () => {
  describe('joining paths', () => {
    it('should join paths into single string with separator', () => {
      expect(
        joinPaths([ 'a', 'b', 'c' ])
      ).toEqual('/a/b/c')
    })

    it('should join single path into single string', () => {
      expect(
        joinPaths([ 'a' ])
      ).toEqual('/a')
    })

    it('should create empty string when no paths are present', () => {
      expect(
        joinPaths([])
      ).toEqual('')
    })
  })

  describe('parameters', () => {
    it('should create query string from object', () => {
      expect(
        createParameterString({
          a: '1',
          b: 'c',
        })
      ).toEqual('a=1&b=c')
    })

    it('should stringify values for query string', () => {
      expect(
        createParameterString({
          a: 10,
          b: Date.UTC(2022, 0, 0, 0, 0, 0, 0),
        })
      ).toEqual('a=10&b=1640908800000')
    })

    it('should stringify encoded values for query string', () => {
      expect(
        createParameterString({
          a: [ 'x', 'y', 'z' ],
        })
      ).toEqual('a=x%2Cy%2Cz')
    })

    it('should stringify custom values for query string', () => {
      const customObject = {
        toString: () => `0101`,
      }

      expect(
        createParameterString({
          a: customObject,
        })
      ).toEqual('a=0101')
    })
  })

  describe('building URI string', () => {
    it('should build standard URI string', () => {
      const uri = {
        scheme: 'https',
        hostname: 'google.com',
        pathname: '/pages/1',
        query: 'a=10&b=20',
        port: null,
      }

      expect(buildURIString(uri))
        .toEqual('https://google.com/pages/1?a=10&b=20')
    })

    it('should build URI string with port', () => {
      const uri = {
        scheme: 'https',
        hostname: 'google.com',
        pathname: '/pages/1',
        query: 'a=10&b=20',
        port: 8080,
      }

      expect(buildURIString(uri))
        .toEqual('https://google.com:8080/pages/1?a=10&b=20')
    })

    it('should build URI string without scheme if empty', () => {
      const uri = {
        scheme: '',
        hostname: 'google.com',
        pathname: '/pages/1',
        query: 'a=10&b=20',
        port: null,
      }

      expect(buildURIString(uri))
        .toEqual('google.com/pages/1?a=10&b=20')
    })

    it('should build URI string without hostname if empty', () => {
      const uri = {
        scheme: 'https',
        hostname: '',
        pathname: '/pages/1',
        query: 'a=10&b=20',
        port: null,
      }

      expect(buildURIString(uri))
        .toEqual('https:///pages/1?a=10&b=20')
    })

    it('should build URI string without port if ' +
       'hostname is empty', () => {
      const uri = {
        scheme: 'https',
        hostname: '',
        pathname: '/pages/1',
        query: 'a=10&b=20',
        port: 8080,
      }

      expect(buildURIString(uri))
        .toEqual('https:///pages/1?a=10&b=20')
    })

    it('should build URI string without pathname if empty', () => {
      const uri = {
        scheme: 'https',
        hostname: 'google.com',
        pathname: '',
        query: 'a=10&b=20',
        port: null,
      }

      expect(buildURIString(uri))
        .toEqual('https://google.com?a=10&b=20')
    })

    it('should build URI string without query if empty', () => {
      const uri = {
        scheme: 'https',
        hostname: 'google.com',
        pathname: '/pages/1',
        query: '',
        port: null,
      }

      expect(buildURIString(uri))
        .toEqual('https://google.com/pages/1')
    })

    it('should build FTP URI', () => {
      const uri = {
        scheme: 'ftp',
        hostname: 'mydomain.com',
        pathname: '/site',
        query: '',
        port: 20,
      }

      expect(buildURIString(uri))
        .toEqual('ftp://mydomain.com:20/site')
    })
  })
})
