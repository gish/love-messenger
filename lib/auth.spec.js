import expect from 'expect'

describe('Auth lib', () => {
  it('should be true when given and expected are same', () => {
    // given
    const expected = 'secr3t'
    const given = expected
    const input = {
      expected: expected,
      given: given,
    }

    // then
    expect(auth(input)).to.be(true)
  })
})
