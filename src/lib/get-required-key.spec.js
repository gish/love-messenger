import expect from 'expect'
import sinon from 'sinon'
import getRequiredKey from './get-required-key'

describe('Get required key', () => {
  const sandbox = sinon.sandbox.create()

  beforeEach(() => {
    sandbox.stub(console, 'error')
    sandbox.stub(process, 'exit')
  })

  afterEach(() => {
    sandbox.restore()
  })


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

  describe('Logging', () => {
    it('Should output error when key not defined', () => {
      // given
      const obj = {}
      const key = 'bar'

      // when
      getRequiredKey(obj, key)

      // then
      expect(console.error.called).toEqual(true)
    })
  })

  describe('Exiting', () => {
    it('Should not kill the process when key defined', () => {
      // given
      const obj = {}
      const key = 'bar'
      const value = 'baz'
      obj[key] = value

      // when
      getRequiredKey(obj, key)

      // then
      expect(process.exit.calledWith(1)).toEqual(false)
    })
    it('Should kill the process when key not defined', () => {
      // given
      const obj = {}
      const key = 'bar'

      // when
      getRequiredKey(obj, key)

      // then
      expect(process.exit.calledWith(1)).toEqual(true)
    })
  })
})
