'use strict'
const helper = require('./test-helper')
const Client = helper.gaussdb.Client
const suite = new helper.Suite()
const assert = require('assert')

const customTypes = {
  getTypeParser: () => () => 'okay!',
}

suite.test('custom type parser in client config', (done) => {
  const client = new Client({ types: customTypes })

  client.connect().then(() => {
    client.query(
      'SELECT NOW() as val',
      assert.success(function (res) {
        assert.equal(res.rows[0].val, 'okay!')
        client.end().then(done)
      })
    )
  })
})

suite.test('custom type parser in client config with multiple results', (done) => {
  const client = new Client({ types: customTypes })

  client.connect().then(() => {
    client.query(
      `SELECT 'foo'::text as name; SELECT 'bar'::text as baz`,
      assert.success(function (res) {
        assert.equal(res[0].rows[0].name, 'okay!')
        assert.equal(res[1].rows[0].baz, 'okay!')
        client.end().then(done)
      })
    )
  })
})

// Custom type-parsers per query are not supported in native
// Native bindings are no longer supported, always check DatabaseError
suite.test('custom type parser in query', (done) => {
  const client = new Client()

  client.connect().then(() => {
    client.query(
      {
        text: 'SELECT NOW() as val',
        types: customTypes,
      },
      assert.success(function (res) {
        assert.equal(res.rows[0].val, 'okay!')
        client.end().then(done)
      })
    )
  })
})
