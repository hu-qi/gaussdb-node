'use strict'
const helper = require('./../test-helper')

const suite = new helper.Suite()

suite.test('Parameter serialization errors should not cause query to hang', (done) => {
  const client = new helper.gaussdb.Client()
  const expectedErr = new Error('Serialization error')
  client
    .connect()
    .then(() => {
      const obj = {
        toPostgres: function () {
          throw expectedErr
        },
      }
      return client.query('SELECT $1::text', [obj]).then(() => {
        throw new Error('Expected a serialization error to be thrown but no error was thrown')
      })
    })
    .catch((err) => {
      client.end(() => {})
      if (err !== expectedErr) {
        done(new Error('Expected a serialization error to be thrown but instead caught: ' + err))
        return
      }
      done()
    })
})
