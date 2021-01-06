# github-dl
Unofficial app to download all your repos locally.

# Current Features
- Clone publicly respositories with no token
- Clone privately owned repositories with a token

# Planned Features
- Cloning organization repos

# Running
- npm install
- npm run start
- Repos will be cloned into ./users/[username]
- If you are cloning private repos create a private token (https://github.com/settings/tokens) with private repo access, and store it in ./users/[username]/token.txt

# Known issues
- Token is stored in a file in plain-text (BAD). Prompt added to delete file after.
- You must respond as 'no' to the first prompt, if you want to be asked to clone private repos later
- Question chain needs changed to promise chain or async await
- Some public repos aren't being clone in the private prompt, which are in the public prompt