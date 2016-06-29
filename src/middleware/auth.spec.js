import expect from 'expect'
import sinon from 'sinon'
import authMiddleware from './middleware.auth'

describe('Auth middleware', () => {
  const sandbox = sinon.sandbox.create()
  var stubs = {}

  beforeEach(() => {
    stubs = {
      res: sandbox.stub({
        status: () => {},
        send: () => {}
      }),
      next: sandbox.spy()
    }
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('Failing auth', () => {
    it('Should send 401 when wrong key sent', () => {
      // given
      const expectedKey = 'bar'
      const expectedCode = 401
      const config = {
        apiKey: expectedKey
      }
      const req = {
        query: {
          key: 'foo'
        }
      }

      // when
      authMiddleware(config)(req, stubs.res, stubs.next)

      // then
      expect(stubs.res.status.calledWith(expectedCode)).toEqual(true)
    })

    it('Should send error message when wrong key send', () => {
      // given
      const expectedKey = 'bar'
      const expectedMessage = 'Invalid API key'
      const config = {
        apiKey: expectedKey
      }
      const req = {
        query: {
          key: 'foo'
        }
      }

      // when
      authMiddleware(config)(req, stubs.res, stubs.next)

      // then
      expect(stubs.res.send.calledWith(expectedMessage)).toEqual(true)
    })
  })

  describe('Passing auth', () => {
    it('Should call next() when auth ok', () => {
      // given
      const expectedKey = 'bar'
      const config = {
        apiKey: expectedKey
      }
      const req = {
        query: {
          key: expectedKey
        }
      }
      // when
      authMiddleware(config)(req, stubs.res, stubs.next)

      // then
      expect(stubs.next.called).toEqual(true)
    })
  })
})
