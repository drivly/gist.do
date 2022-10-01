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
  publish: 'https://gist.do/28a6b4bfde485b704a2fcc9b6c874e79',
  publishAPI: 'https://gist.do/api/nathanclevenger/28a6b4bfde485b704a2fcc9b6c874e79',
  publishWorker: 'https://gist.do/worker/nathanclevenger/28a6b4bfde485b704a2fcc9b6c874e79',
}

const headers = {
  'user-agent': 'https://gist.do'
}

export default {
  fetch: async (req, env) => {
    const ctx = await env.CTX.fetch(req).then(res => res.json())
    const { user, hostname, pathname, subdomain, rootPath, pathSegments, query } = ctx
    
    console.log({ctx})
    
    if (rootPath && !subdomain) return json({ api, gettingStarted, examples, user })
    
    const workerId = subdomain && subdomain.length == 32 ? subdomain : undefined
    
    // TODO - invoke if worker exists
    
    // TODO - otherwise if there is a gistID from a worker but not a worker, then build & deploy
    
    if (!workerId) {
      const [ type, id ] = pathSegments
      const gistId = type.length == 32 ? type : id
      
      const workerURL = `https://${gistId}.gist.do`

      const gistURL = 'https://api.github.com/gists/' + gistId
      const gistContext = await fetch(gistURL,{headers}).then(res => res.json()).catch(({name,message,stack}) => ({name,message,stack}))

      const { files } = gistContext
      const fileNames = Object.keys(files)

      const build = await Promise.all(fileNames.map(name => fetch(files[name].raw_url.replace('https://','https://esbuild.do/')).then(res => res.text())))
      const codeLines = build.map(file => file.split('\n'))
      
      const deployment = await fetch('https://workers.do/api/deploy', {
        method: 'POST',
        body: JSON.stringify({ 
          name: gistId.slice(0,7),
//           domain: `${domain}`,
          context: gistContext,
          worker: build,
        }),
      }).then(res => res.json()).catch(({name, message, stack}) => ({ error: {name, message, stack}}))
      
      // TODO - comment on the Gist with workerURL

      return json({ api, deployment, workerURL, fileNames, files, codeLines, build, user })
    } else {
      // TODO call the dynamic service binding
      
      const workerURL = `https://${workerId}.gist.do`
      return json({ api, workerURL, workerId, user })
    }
  }
}

const json = obj => new Response(JSON.stringify(obj, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
