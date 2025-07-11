'use strict'
const helper = require('../test-helper')
const copyFrom = require('pg-copy-streams').from

// Native bindings are no longer supported, test always runs now

const pool = new helper.gaussdb.Pool()
pool.connect(function (err, client, done) {
  if (err) throw err

  const c = 'CREATE TEMP TABLE employee (id integer, fname varchar(400), lname varchar(400))'

  client.query(c, function (err) {
    if (err) throw err

    const stream = client.query(copyFrom('COPY employee FROM STDIN'))
    stream.on('end', function () {
      done()
      setTimeout(() => {
        pool.end()
      }, 50)
    })

    for (let i = 1; i <= 5; i++) {
      const line = ['1\ttest', i, '\tuser', i, '\n']
      stream.write(line.join(''))
    }
    stream.end()
  })
})
