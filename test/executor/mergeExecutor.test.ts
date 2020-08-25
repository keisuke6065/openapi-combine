import {mergeExecutor} from "../../src/executor/mergeExecutor";


describe('Merge Executor test', () => {
  it("create file",async () => {
     await mergeExecutor("./example/openapi.yaml", "./build/openapi.yaml")
  })
})
