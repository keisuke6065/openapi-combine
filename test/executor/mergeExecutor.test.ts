import {mergeExecutor} from "../../src/executor/mergeExecutor";


describe('Merge Executor test', () => {
  it("create file yaml",async () => {
     await mergeExecutor("./example/openapi.yaml", "./build/openapi.yaml", 'yaml')
  })
  it("create file json",async () => {
     await mergeExecutor("./example/openapi.yaml", "./build/openapi.json", 'json')
  })
})
