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

const headers = {
  'user-agent': 'https://gist.do'
}

export default {
  fetch: async (req, env) => {
    const { user, hostname, pathname, rootPath, pathSegments, query } = await env.CTX.fetch(req).then(res => res.json())
    if (rootPath) return json({ api, gettingStarted, examples, user })
    
    const gistId = pathSegments[0] == 32 ? pathSegments[0] : pathSegments[1]
    
    
    const gistURL = 'https://api.github.com/gists/' + gistId
    const data = await fetch(gistURL,{headers}).then(res => res.text()).catch(({name,message,stack}) => ({name,message,stack}))
    
    const files = Object.keys(data)
    
    
    
    
    return json({ api,  gistURL, data, files, user })
  }
}

const json = obj => new Response(JSON.stringify(obj, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
