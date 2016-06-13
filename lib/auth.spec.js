import expect from 'expect'
import sha1 from 'sha1'
import auth from './auth'

describe('Auth lib', () => {
  it('should be true when given and expected are same', () => {
    // given
    const expectedKey = 'secr3t'
    const givenKey = expectedKey
    const input = {
      expected: expectedKey,
      given: givenKey
    }

    // then
    expect(auth(input)).toEqual(true)
  })

  it('should be false when given and expected keys are not the same', () => {
    // given
    const expectedKey = 'secr3t'
    const givenKey = 'not-so-secret'
    const input = {
      expected: expectedKey,
      given: givenKey
    }

    // then
    expect(auth(input)).toEqual(false)
  })

  describe('Salting', () => {
    it('should return true when salt passed and given same as expected', () => {
      // given
      const givenKey = 'foobar'
      const salt = 'baz'
      const expectedKey = sha1(`${salt}foobar`)
      const input = {
        expected: expectedKey,
        given: givenKey,
        salt: salt
      }

      // then
      expect(auth(input)).toBe(true)
    })

    it('should be false when salt passed and given and expected not same', () => {
    })
  })
})
