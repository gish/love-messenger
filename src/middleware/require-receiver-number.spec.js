import expect from 'expect'
import httpMocks from 'node-mocks-http'
import sinon from 'sinon'
import requireReceiverNumber from './require-receiver-number'

// http://www.slideshare.net/morrissinger/unit-testing-express-middleware

describe('Require receiver number middleware', () => {
  const sandbox = sinon.sandbox.create()

  afterEach(() => {
    sinon.sandbox.restore()
  })

  describe('Invalid or missing number', () => {
    it('should return 400 when number is not provided', () => {
      // given
      const request = httpMocks.createRequest({
        body: {
          receiver_number: undefined
        }
      })
      const response = httpMocks.createResponse()
      const expectedStatusCode = 400

      // when
      requireReceiverNumber(request, response)

      // then
      expect(response.statusCode).toEqual(expectedStatusCode)
    })

    it('should return 400 when number is not valid', () => {
      // given
      const request = httpMocks.createRequest({
        body: {
          receiver_number: '070123'
        }
      })
      const response = httpMocks.createResponse()
      const expectedStatusCode = 400

      // when
      requireReceiverNumber(request, response)

      // then
      expect(response.statusCode).toEqual(expectedStatusCode)
    })

    it('should send message when number is not provided', () => {
      // given
      const request = httpMocks.createRequest({
        body: {
          receiver_number: undefined
        }
      })
      const response = httpMocks.createResponse()
      const expectedMessage = 'Missing parameter receiver_number'

      // when
      requireReceiverNumber(request, response)

      // then
      expect(response._getData()).toEqual(expectedMessage)
    })
    it('should send message when number is not valid', () => {
      // given
      const request = httpMocks.createRequest({
        body: {
          receiver_number: '070123'
        }
      })
      const response = httpMocks.createResponse()
      const expectedMessage = 'Invalid parameter receiver_number'

      // when
      requireReceiverNumber(request, response)

      // then
      expect(response._getData()).toEqual(expectedMessage)
    })
  })

  describe('Valid number', () => {
    it('should return 200 when valid number is provided', () => {
      // given
      const request = httpMocks.createRequest({
        body: {
          receiver_number: '+46701234567'
        }
      })
      const response = httpMocks.createResponse()
      const expectedStatusCode = 200

      // when
      requireReceiverNumber(request, response, () => {})

      // then
      expect(response.statusCode).toEqual(expectedStatusCode)
    })

    it('should proceed when number is valid', () => {
      // given
      const request = httpMocks.createRequest({
        body: {
          receiver_number: '+46701234567'
        }
      })
      const response = httpMocks.createResponse()
      const nextSpy = sandbox.spy()

      // when
      requireReceiverNumber(request, response, nextSpy)

      // then
      expect(nextSpy.called).toEqual(true)
    })
  })
})
