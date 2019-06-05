const Router = require('./router')

/**
 * Example of how router can be used in an application
 *  */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

function handler(request) {
  const init = {
    headers: { 'content-type': 'application/json' },
  }
  // ,null,1) - is used for pretty-print, see https://stackoverflow.com/a/7220510
  const body = JSON.stringify(
	  { some: 'json',
		  d: new Date().toString(),
		  url: request.url,
		  method: request.method,
		  request_keys: Object.keys(request)
	  }, null, 1)
  return new Response(body, init)
}

async function handleRequest(request) {
  const r = new Router()
  // Replace with the approriate paths and handlers
  r.get('/test', req => handler(req))
  r.get('.*/bar', () => new Response('responding for /bar'))
  r.get('.*/foo', req => handler(req))
  r.post('.*/foo.*', req => handler(req))
  r.get('/demos/router/foo', req => fetch(req)) // return the response from the origin

  const resp = await r.route(request)
  return resp
}
