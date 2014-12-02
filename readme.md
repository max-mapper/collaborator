# collaborator

easily add new collaborators to your github repos from the CLI

[![NPM](https://nodei.co/npm/collaborator.png)](https://nodei.co/npm/collaborator/)

## usage

```
npm install -g collaborator

# print out existing collaborators
collaborator

# add maxogden as a collaborator to the current repo
collaborator maxogden
```

You can also specify the `--npm` flag to automatically add them as an owner
on npm. Be aware that it uses the module [find-npm-by-github](https://www.npmjs.org/package/find-npm-by-github)
to guess the npm name of the github user.

So you should check the message `Added <npmuser> to module <yourmodule>`  on
stderr in case the npm user name was wrongly determined.


## example

```
collaborator maxogden > collaborators.md
```

see [collaborators.md](collaborators.md) for the output
