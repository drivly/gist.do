export const api = {
  icon: '🛠',
  name: 'gist.do',
  description: 'Transform Gists into Content, APIs, Scripts, and more',
  url: 'https://gist.do/api',
  type: 'https://apis.do/code',
  endpoints: {
    publish: 'https://gist.do/:gist',
    publishAPI: 'https://gist.do/api/:gist',
    publishWorker: 'https://gist.do/worker/:gist',
  },
  site: 'https://gist.do',
  login: 'https://gist.do/login',
  signup: 'https://gist.do/signup',
  subscribe: 'https://gist.do/subscribe',
  repo: 'https://github.com/drivly/gist.do',
}

export const gettingStarted = [
  `If you don't already have a JSON Viewer Browser Extension, get that first:`,
  `https://extensions.do`,
]

export const examples = {
  publish: 'https://gist.do/1c0d258d6acbcfa7ed27ea12ea277626',
  publishAPI: 'https://gist.do/api/nathanclevenger/1c0d258d6acbcfa7ed27ea12ea277626',
  publishWorker: 'https://gist.do/worker/nathanclevenger/1c0d258d6acbcfa7ed27ea12ea277626',
}

export default {
  fetch: async (req, env) => {
    const { user, hostname, pathname, rootPath, pathSegments, query } = await env.CTX.fetch(req).then(res => res.json())
    if (rootPath) return json({ api, gettingStarted, examples, user })
    
    // TODO: Implement this
    const [ id ] = pathSegments
    
    const data = await fetch('https://api.github.com/gists/' + id).then(res => res.json())
    
//     const resourceLength = resource.length()
    const idLength = id?.length()
    
//     const data = { id, hello: user.city }
    
    return json({ api, idLength, data,  user })
  }
}

const json = obj => new Response(JSON.stringify(obj, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
