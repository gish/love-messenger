import expect from 'expect'
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
})
