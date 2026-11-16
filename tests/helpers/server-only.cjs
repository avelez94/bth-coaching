/* eslint-disable @typescript-eslint/no-require-imports */
// Lets tests load server modules: Next.js supplies "server-only" at build
// time, so outside Next it resolves to an empty module.
const Module = require('node:module')
const empty = require.resolve('./empty.cjs')
const orig = Module._resolveFilename
Module._resolveFilename = function (req, ...rest) {
  return req === 'server-only' ? empty : orig.call(this, req, ...rest)
}
