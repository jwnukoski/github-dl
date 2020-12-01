(() => {
  const uname = 'your_username';
  const axios = require('axios');

  axios.get(`https://api.github.com/users/${uname}/repos`)
  .then(function (res) {
    // Get repo URLs
    const data = res.data;
    const repoUrls = [];

    for (const repo of data) {
      if (repo.url) {
        repoUrls.push(repo.html_url);
      }
    }

    if (repoUrls.length <= 0)
      throw 'No repos found';

    return repoUrls;
  })
  .then((repoUrls) => {
    // Clone repos
    const shell = require('shelljs');
    const path = require('path');
    const dest = './repos';

    shell.cd(dest);

    for (const repoUrl in repoUrls) {
      const url = repoUrls[repoUrl];
      shell.exec(`git clone ${url}`);
    }

  }).catch((error) => {
    console.log(error);
  });
})();