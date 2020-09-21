openapi-combine
===============


![test CI](https://github.com/keisuke6065/openapi-combine/workflows/test%20CI/badge.svg?branch=master)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/openapi-combine.svg)](https://npmjs.org/package/openapi-combine)
[![Downloads/week](https://img.shields.io/npm/dw/openapi-combine.svg)](https://npmjs.org/package/openapi-combine)
[![License](https://img.shields.io/npm/l/openapi-combine.svg)](https://github.com/keisuke6065/openapi-combine/blob/master/package.json)

<!-- toc -->
* [Features](#Features)
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
$ openapi-combine (-v|--version|version)
openapi-combine/0.0.0 darwin-x64 node-v12.18.3
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

display help for openapi-combine

```
USAGE
  $ openapi-combine help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `openapi-combine merge`

describe the command here

```
USAGE
  $ openapi-combine merge

OPTIONS
  -i, --input=input    (required) input target yaml file
  -o, --output=output  [default: ./output/openapi.yaml] output target yaml file

EXAMPLE
  $ openapi-combine merge -i ./example/openapi.yaml -o ./build/openapi.yaml
```

_See code: [lib/commands/merge.js](https://github.com/keisuke6065/openapi-combine/blob/v0.0.0/lib/commands/merge.js)_
<!-- commandsstop -->
