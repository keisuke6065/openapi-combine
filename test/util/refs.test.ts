import {assert} from 'chai';
import {getRefs, loadFile, resolveCustomRefs} from "../../src/util/refs";

const testFilePath1 = "./test/util/pet.yaml"
const testFilePath2 = "./test/util/pets.yaml"
const testFilePath3 = "./test/util/error.yaml"
const testFilePath4 = "./test/util/page.yaml"
const testFilePath5 = "./test/util/query.yaml"

describe('refs utils test', () => {
  it("getRefs object pattern test", async () => {
    const x = {
      "components": {"schemas": {"$refs": [testFilePath1, testFilePath2]}}
    }
    const expected = {
      "value": [testFilePath1, testFilePath2],
      "path": "components.schemas"
    }
    assert.deepEqual(getRefs(x), expected)
  });
  it("getRefs array pattern test", async () => {
    const x = {
      "components": [{"schemas": "xxx"}, {"schemas": {"$refs": [testFilePath1, testFilePath2]}}],
    }
    const expected = {
      "value": [testFilePath1, testFilePath2],
      "path": "components[1].schemas"
    }
    assert.deepEqual(getRefs(x), expected)
  });
  it("resolveCustomRefs test", async () => {
    const x = {
      "openapi": "3.0.0",
      "info": {"version": "1.0.0", "title": "Swagger Petstore", "license": {"name": "MIT"}},
      "servers": [{"url": "http://petstore.swagger.io/v1"}],
      "components": {
        "schemas": {
          "$refs": [testFilePath1, testFilePath2],
          "Error": {"$ref": testFilePath3}
        }
      }
    }
    const expected = {
      "openapi": "3.0.0",
      "info": {"version": "1.0.0", "title": "Swagger Petstore", "license": {"name": "MIT"}},
      "servers": [{"url": "http://petstore.swagger.io/v1"}],
      "components": {
        "schemas": {
          "Pet": {
            "type": "object",
            "required": ["id", "name"],
            "properties": {
              "id": {"type": "integer", "format": "int64"},
              "name": {"type": "string"},
              "tag": {"type": "string"}
            }
          },
          "Pets": {
            "type": "object",
            "required": ["id", "name"],
            "properties": {
              "id": {"type": "integer", "format": "int64"},
              "name": {"type": "string"},
              "tag": {"type": "string"}
            }
          },
          "Error": {"$ref": testFilePath3}
        }
      }
    }

    assert.deepEqual(resolveCustomRefs(x), expected)
  });
  it("resolveCustomRefs merge array test", async () => {
    const x = {
      "openapi": "3.0.0",
      "info": {"version": "1.0.0", "title": "Swagger Petstore", "license": {"name": "MIT"}},
      "servers": [{"url": "http://petstore.swagger.io/v1"}],
      "paths": {
        "/search": {
          "get": {
            "parameters": {
              "$refs": [testFilePath4, testFilePath5],
            }
          }
        }
      }
    }

    const expected = {
      "openapi": "3.0.0",
      "info": {"version": "1.0.0", "title": "Swagger Petstore", "license": {"name": "MIT"}},
      "servers": [{"url": "http://petstore.swagger.io/v1"}],
      "paths": {
        "/search": {
          "get": {
            "parameters": [
              {
                "name": "offset",
                "in": "query",
                "schema": {
                  "type": "integer",
                  "format": "int32"
                },
                "description": "limit"
              },
              {
                "name": "limit",
                "in": "query",
                "schema": {
                  "type": "integer",
                  "format": "int32"
                },
                "description": "offset"
              },
              {
                "name": "q",
                "in": "query",
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "sort",
                "in": "query",
                "schema": {
                  "type": "string"
                }
              }
            ]
          }
        }
      }
    }

    assert.deepEqual(resolveCustomRefs(x), expected)
  });
  it("load file", async () => {
    const x = [testFilePath1]

    const expected = {
      "Pet": {
        "type": "object",
        "required": ["id", "name"],
        "properties": {
          "id": {"type": "integer", "format": "int64"},
          "name": {"type": "string"},
          "tag": {"type": "string"}
        }
      }
    }
    assert.deepEqual(loadFile(x), expected)
  });
})
