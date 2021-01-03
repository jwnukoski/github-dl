const fs = require('fs');
const axios = require('axios');
const readline = require('readline');
const shell = require('shelljs');

function getPublicRepos(username) {
  axios.get(`http://api.github.com/users/${username}/repos`).then(res => {
  return repos = res.data.map(row => {
      return {url: row.html_url, name: row.name};
    });
  }).then(repos => {
    if (repos.length <= 0)
      throw `No repos found for ${username}`;

    if (!fs.existsSync(`./users/${username}`))
        fs.mkdirSync(`./users/${username}`);

    repos.forEach(val => {
      shell.exec(`git clone ${val.url} ./users/${username}/${val.name}`)
    });

    return 'Done';
  }).then((res) => {
    console.log(`${res}`);
  }).catch(err => {
    console.log(`Error: ${err}`)
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Input Github username: ', (user) => {
  getPublicRepos(user);
});