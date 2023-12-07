# Welcome to Anti Recurso contributing guide <!-- omit in toc -->

Thank you for investing your time in contributing to our project! Any contribution you make will be reflected on [AntiRecurso](http://antirecurso.nei-isep.org) website :sparkles:.

Read our [Code of Conduct](./CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

In this guide you will get an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging the PR.

## New contributor guide

To get an overview of the project, read the [README](README.md). Here are some resources to help you get started with open source contributions:

- [Finding ways to contribute to open source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
- [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)

## Getting started

### Issues

#### Create a new issue

If you spot a problem with the docs, [search if an issue already exists](https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-issues-and-pull-requests#search-by-the-title-body-or-comments). If a related issue doesn't exist, you can open a new issue using a relevant [issue form](https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso/issues/new/choose).

#### Solve an issue

Scan through our [existing issues](https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso/issues) to find one that interests you. You can narrow down the search using `labels` as filters. As a general rule, we don’t assign issues to anyone. If you find an issue to work on, you are welcome to open a PR with a fix.

### Make Changes

#### Make changes locally

Want to contribute? That's great!

Start off by selecting an issue from our [issues' page](https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso/issues) or creating one yourself.

After selecting what you want to do, follow these steps to contribute to the project:

1. **Fork the Repository**: Click on the "Fork" button at the top right corner of the repository page. This will create a copy of the repository under your GitHub account.

2. **Clone the Repository**: Clone your forked repository to your local machine. Open your terminal and use the following command:

```
git clone https://github.com/your-username/antirecurso.git
```

Replace `your-username` with your actual GitHub username.

3. **Create a New Branch**: Move into the project directory using the `cd antirecurso` command. Then create a new branch to work on your feature or fix:

```
git checkout -b branch-name
```

Replace `branch-name` with a descriptive name for your branch.

4. **Make Changes**: Now you're ready to add your amazing feature or fix. Make the necessary changes in the codebase.

5. **Commit Changes**: Once you're done, commit your changes with a clear and concise commit message:

```
git commit -m "Add your commit message here"
```

6. **Push Changes**: Push your branch to your forked repository on GitHub:

```
git push origin branch-name
```

7. **Create a Pull Request**: Go to your forked repository on GitHub and switch to the branch you just pushed. Click on the "New Pull Request" button next to the branch selection dropdown. Provide a descriptive title and detailed description for your pull request, and submit it for review.

> Note: We recommend that the branch name looks something like "feat/comments".

### Pull Request

When you're finished with the changes, create a pull request, also known as a PR.

- Fill the "Ready for review" template so that we can review your PR. This template helps reviewers understand your changes as well as the purpose of your pull request.
- Don't forget to [link PR to issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) if you are solving one.
- Enable the checkbox to [allow maintainer edits](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/allowing-changes-to-a-pull-request-branch-created-from-a-fork) so the branch can be updated for a merge.
  Once you submit your PR, a Docs team member will review your proposal. We may ask questions or request additional information.
- We may ask for changes to be made before a PR can be merged, either using [suggested changes](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/incorporating-feedback-in-your-pull-request) or pull request comments. You can apply suggested changes directly through the UI. You can make any other changes in your fork, then commit them to your branch.
- As you update your PR and apply changes, mark each conversation as [resolved](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/commenting-on-a-pull-request#resolving-conversations).
- If you run into any merge issues, checkout this [git tutorial](https://github.com/skills/resolve-merge-conflicts) to help you resolve merge conflicts and other issues.

### Your PR is merged!

Congratulations :tada::tada: The AntiRecurso Development Team thanks you :sparkles:.

Once your PR is merged, your contributions will be publicly visible on the [AntiRecurso](http://antirecurso.nei-isep.org) website.
