# get-pr-info

A GitHub Action that help you get commits, branch name, latest commit message in current pull-request

## Usage
Add .github/workflows/action.yml with the following:

```
on: [pull_request]

jobs:
  main_job:
    runs-on: ubuntu-latest
    steps:
    - name: Get PR Info
      uses: minhchienwikipedia/get-pr-info@master
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
```

### Output
We will set variable
- `env.GIT_COMMITS`: The string data of commits
- `env.GIT_LATEST_COMMIT_MESSAGE`: The latest commit message
- `env.GIT_BRANCH_NAME`: The branch create pull request 
