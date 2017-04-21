/* global hexo */

const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const streamToBuffer = require('stream-to-buffer')
const minimatch = require('minimatch')

const DEFAULT_OPTIONS = {
  'cmd': 'magick',
  'items': [],
  'match': '**/*.{jpg,gif,png}',
  'match_options': {},
  'priority': 5
}
const PUBLIC_DIR = path.join(process.cwd(), hexo.config.public_dir)

function createCommandArgs (config, extension) {
  const args = ['-'].concat(
    config.args.replace(/\$([a-zA-z\d_]+)/g, (a, b) => {
      return config[b] || null
    }).split(' ')
  )
  args.push(`${extension.replace(/^\./, '')}:-`)
  return args
}

const options = Object.assign({}, DEFAULT_OPTIONS, hexo.config.variant_images)

hexo.extend.filter.register('after_generate', () => {
  const router = hexo.route
  const routes = router.list().filter(route => {
    if (options.exclude && minimatch(route, options.exclude, options.match_options)) {
      return false
    }
    return minimatch(route, options.match, options.match_options)
  })

  return Promise.all(routes.map(route => {
    return Promise.all(options.items.map(config => {
      const pathInfo = path.parse(route)
      const extension = config.extension ? `.${config.extension}` : pathInfo.ext
      const imgPath = path.join(pathInfo.dir, `${pathInfo.name}${config.suffix}${extension}`)
      const cmdArgs = createCommandArgs(config, extension)

      const promise = new Promise((resolve, reject) => {
        const buffers = []
        const routePath = path.join(PUBLIC_DIR, imgPath)

        fs.readFile(routePath, (err, data) => {
          // return data if file is exists
          if (!err) {
            return resolve(data)
          }

          streamToBuffer(router.get(route), (err, data) => {
            if (err) {
              return reject()
            }

            const ps = spawn(
              options.cmd,
              cmdArgs,
              {
                stdio: ['pipe', 'pipe', process.stderr]
              }
            )

            ps.stdout.on('data', data => {
              buffers.push(new Buffer(data, 'binary'))
            })
            ps.on('close', code => {
              if (code !== 0) {
                return reject()
              }
              return resolve(Buffer.concat(buffers))
            })

            ps.stdin.end(data)
          })
        })
      })

      return promise.then(data => {
        router.set(imgPath, data)
      })
    }))
  }))
}, options.priority)
