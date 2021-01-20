(function () {
  const fs = require('fs')
  const axios = require('axios')
  const readline = require('readline')
  const shell = require('shelljs')

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  function makeDirIfDoesntExist (path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
  }

  function promptYesNo (question, callback) {
    rl.question(`${question} [y/n]: `, (input) => {
      input = input.toLowerCase()

      let status = true

      if (input !== 'y') { status = false }

      callback(status)
    })
  }

  function getPubliclyOwnedRepos (username) {
    return axios.get(`http://api.github.com/users/${username}/repos`).then(res => {
      return res.data.map(row => {
        return { url: row.html_url, name: row.name }
      })
    }).then(repos => {
      if (repos.length <= 0) { throw new Error(`No repos found for ${username}`) }

      makeDirIfDoesntExist(`./users/${username}`)

      repos.forEach(val => {
        shell.exec(`git clone ${val.url} ./users/${username}/${val.name}`)
      })

      return 'Done cloning public repos.'
    }).then((res) => {
      console.log(`${res}`)
    }).catch(err => {
      console.error(`Error: ${err}`)
    })
  }

  function getPrivatelyAndPubliclyOwnedRepos (username) {
    makeDirIfDoesntExist(`./users/${username}`)
    console.log(`\nIn order to access private repositories, you will need to provide a personal access token with private repo access.\nYou can create one here: https://github.com/settings/tokens\nStore it in ./users/${username}/token.txt\nDelete this when you're done!!!\n`)

    promptYesNo('Continue? ', choice => {
      if (!choice) { return }

      fs.readFile(`./users/${username}/token.txt`, 'utf8', (err, token) => {
        if (err) {
          console.error(`Error reading ./users/${username}/token.txt:\nerr`)
          return
        }

        return axios.get(`https://api.github.com/search/repositories?q=user:${username}`, {
          headers: {
            Authorization: `token ${token}`
          }
        }).then(res => {
          return res.data.items.map(row => {
            return { url: row.html_url, name: row.name }
          })
        }).then(repos => {
          return repos.forEach(val => {
            shell.exec(`git clone https://${username}:${token}@github.com/${username}/${val.name}.git ./users/${username}/${val.name}`)
          })
        }).then(() => {
          promptYesNo(`Done cloning public and private repos for ${username}\nDo you want to delete the token file?`, choice => {
            if (choice) {
              fs.unlink(`./users/${username}/token.txt`, () => {
                console.log('Token removed!')
              })
            }
            console.log('Done cloning privately owned repos.')
          })
        }).catch(err => {
          console.error(`Error getting private repository: ${err}`)
        })
      })
    })
  }

  makeDirIfDoesntExist('./users')

  rl.question('Input Github username: ', (username) => {
    // TODO: Needs redone with proper promise chains or awaits
    promptYesNo('Do you want to clone public repos?', choice => {
      if (choice) {
        getPubliclyOwnedRepos(username)
      } else {
        promptYesNo('Do you want to get private repos?', choice => {
          if (choice) { getPrivatelyAndPubliclyOwnedRepos(username) }
        })
      }
    })
  })
})()
