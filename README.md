# get-pr-info

A GitHub Action that get commits in current pull-request

## Usage
Add .github/workflows/action.yml with the following:

```
name: Get PR Info
on: [pull_request]

jobs:
  commits_check_job:
    runs-on: ubuntu-latest
    name: Commits Check
    steps:
    - name: Get PR Info
      uses: minhchienwikipedia/get-pr-info@master
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
```

### Output
We will set variable
- `GIT_COMMITS`: The string data of commits
- `GIT_LATEST_COMMIT_MESSAGE`: The latest commit message
- `GIT_BRANCH_NAME`: The branch create pull request 
