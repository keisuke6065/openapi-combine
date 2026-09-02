openapi-combine
===============


![test CI](https://github.com/keisuke6065/openapi-combine/workflows/test%20CI/badge.svg?branch=master)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/openapi-combine.svg)](https://npmjs.org/package/openapi-combine)
[![Downloads/week](https://img.shields.io/npm/dw/openapi-combine.svg)](https://npmjs.org/package/openapi-combine)
[![License](https://img.shields.io/npm/l/openapi-combine.svg)](https://github.com/keisuke6065/openapi-combine/blob/master/package.json)
[![Docker Hub package](https://dockeri.co/image/keisuke6065/openapi-combine)](https://hub.docker.com/r/keisuke6065/openapi-combine)

<!-- toc -->
* [Features](#features)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Features
Supports `$ref` Syntax and `$refs` Extended syntax  
`$ref` supports based on [rfc3986](https://tools.ietf.org/html/rfc3986)    
The extended syntax of `$refs` is a syntax that can have `$ref` as an array  

## Extended syntax usage examples
Define multiple `$ref` references using `$refs` as shown below
(Currently only Local Reference support)

```yaml
openapi: "3.0.0"
info:
  version: 1.0.0
  title: examples
servers:
  - url: http://petstore.swagger.io/v1
paths:
  /pets/{petId}:
    $ref: ./paths/pets/id/index.yaml
components:
  schemas:
    $refs:
      - ./components/schemas/pet.yaml
      - ./components/schemas/pets.yaml
    Error:
      $ref: ./components/schemas/error.yaml
```
see convert example [example/openapi.yaml](example/openapi.yaml) -> [example/openapi.yaml](example/result.yaml)


# Usage
<!-- usage -->
```sh-session
$ npm install -g openapi-combine
$ openapi-combine COMMAND
running command...
$ openapi-combine (--version)
openapi-combine/0.3.1 linux-x64 node-v24.20.0
$ openapi-combine --help [COMMAND]
USAGE
  $ openapi-combine COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`openapi-combine help [COMMAND]`](#openapi-combine-help-command)
* [`openapi-combine merge`](#openapi-combine-merge)

## `openapi-combine help [COMMAND]`

Display help for openapi-combine.

```
USAGE
  $ openapi-combine help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for openapi-combine.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/7.0.0/src/commands/help.ts)_

## `openapi-combine merge`

describe the command here

```
USAGE
  $ openapi-combine merge -i <value> [-o <value>] [-t yaml|json]

FLAGS
  -i, --input=<value>   (required) input target yaml file
  -o, --output=<value>  [default: ./output/openapi.yaml] output target yaml file
  -t, --type=<option>   [default: yaml] output format yaml or json
                        <options: yaml|json>

DESCRIPTION
  describe the command here

EXAMPLES
  $ openapi-combine merge -i ./example/openapi.yaml -o ./build/openapi.yaml
```

_See code: [src/commands/merge.ts](https://github.com/keisuke6065/openapi-combine/blob/v0.3.1/src/commands/merge.ts)_
<!-- commandsstop -->
