# pre-push-valid

Checks the upstream refs during a pre-push githook.

I've seen that many tools exist already which look at the branch name from the current working directory. This is a good first step, but it's not sufficient. The first issue is that you can push a local branch to a different remote branch by being explicit about this. A second issue is that this branch-based approach does not consider tags.

The [githooks docs](https://git-scm.com/docs/githooks#_pre_push) for _pre-push_ mention that `git` provides the hook with the actual upstream refs being pushed, and this includes both branches as well as tags.

This script parses this data in order to enforce [gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

# Install
With [npm](https://npmjs.org) do:

```
npm install pre-push-valid
```

The easiest way to get started with githooks is via [husky](https://github.com/typicode/husky):

```
npm install husky@next --save-dev
```

Once it's installed, edit your `package.json` like so:

```
// package.json
{
    "husky": {
        "hooks": {
            "pre-commit": "echo \"$HUSKY_GIT_STDIN\" | pre-push-valid"
        }
    }
}
```

# Roadmap

Right now this is a proof-of-concept, with all configuration settings hardcoded to fit my needs. This includes a few subtleties, such as disallowing `v`-prefixed tags.

Ideally, all of this configuration should be externalized following the current conventions. Namely:

* A specialized section in the `package.json` file.
* A dot-rc-file in json format.
* A js file module exporting the configuration.

Also, some CLI parameters could be added for debugging, coloring, accepting input from the command-line rather than stdin, to avoid the ugly `echo`, etc.

If you think this is interesting please do not hesitate to contribute!

# License

MIT
