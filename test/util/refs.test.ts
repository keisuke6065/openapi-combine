import {assert} from 'chai';
import {getRefs, loadFile, resolveCustomRefs} from "../../src/util/refs";

const testFilePath1 = "./test/util/pet.yaml"
const testFilePath2 = "./test/util/pets.yaml"
const testFilePath3 = "./test/util/error.yaml"

describe('refs utils test', () => {
  it("getRefs object pattern test", async () => {
    const x = {
      "components": {"schemas": {"$refs": [testFilePath1, testFilePath2]}}
    }
    const expected = {
      "value": [{$ref: testFilePath1, $props: {}}, {$ref: testFilePath2, $props: {}}],
      "path": "components.schemas"
    }
    assert.deepEqual(getRefs(x), expected)
  });
  it("getRefs array pattern test", async () => {
    const x = {
      "components": [{"schemas": "xxx"}, {"schemas": {"$refs": [testFilePath1, testFilePath2]}}],
    }
    const expected = {
      "value": [{$ref: testFilePath1, $props: {}}, {$ref: testFilePath2, $props: {}}],
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

    assert.deepEqual(await resolveCustomRefs(x), expected)
  });
  it("load file", async () => {
    const x = [{$ref: testFilePath1, $props: {}}]

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
    assert.deepEqual(await loadFile(x), expected)
  });
})
