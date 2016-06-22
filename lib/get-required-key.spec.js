import expect from 'expect'
import getRequiredKey from './get-required-key'

describe('Get required key', () => {
  it('should fail when key is not defined', () => {
    // given
    const obj = {}
    const key = 'token'

    // then
    expect(getRequiredKey(obj, key)).toEqual(false)
  })

  it('should be token value when key is defined', () => {
    // given
    const obj = {}
    const key = 'token'
    const value = 'bar'
    obj[key] = value

    // then
    expect(getRequiredKey(obj, key)).toEqual(value)
  })

  it('should be token value when key is defined and token value is false', () => {
    // given
    const obj = {}
    const key = 'token'
    const value = false
    obj[key] = value

    // then
    expect(getRequiredKey(obj, key)).toEqual(value)
  })
})
