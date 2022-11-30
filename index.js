const core = require("@actions/core");
const github = require("@actions/github");

const validEvent = ["pull_request"];

async function main() {
  try {
    // Get commits data
    const {
      eventName,
      payload: { repository: repo, pull_request: pr },
    } = github.context;

    if (validEvent.indexOf(eventName) < 0) {
      core.error(`Invalid event: ${eventName}`);
      return;
    }

    const token = core.getInput("token");
    const filterOutPattern = core.getInput("filter_out_pattern");
    const filterOutFlags = core.getInput("filter_out_flags");
    const octokit = new github.GitHub(token);

    const commitsListed = await octokit.pulls.listCommits({
      owner: repo.owner.login,
      repo: repo.name,
      pull_number: pr.number,
    });

    let commits = commitsListed.data;

    if (filterOutPattern) {
      const regex = new RegExp(filterOutPattern, filterOutFlags);
      commits = commits.filter(({ commit }) => {
        return !regex.test(commit.message);
      });
    }

    core.exportVariable("GIT_COMMITS", JSON.stringify(commits));
    if (commits.length > 0) {
      // Get latest commit message
      core.exportVariable(
        "GIT_LATEST_COMMIT_MESSAGE",
        JSON.stringify(commits[commits.length - 1].commit.message)
      );
    }
    // Get branch name
    const isPullRequest = !!process.env.GITHUB_HEAD_REF; //GITHUB_HEAD_REF is only set for pull request events https://docs.github.com/en/actions/reference/environment-variables

    let branchName;
    if (isPullRequest && process.env.GITHUB_HEAD_REF) {
      branchName = process.env.GITHUB_HEAD_REF;
    } else {
      if (!process.env.GITHUB_REF) {
        throw new Error("GITHUB_EVENT_PATH env var not set");
      }
      branchName = process.env.GITHUB_REF.split("/")
        .slice(2)
        .join("/")
        .replace(/\//g, "-");
    }

    core.exportVariable("GIT_BRANCH_NAME", branchName);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
