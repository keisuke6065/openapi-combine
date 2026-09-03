import {expect} from "chai";
import path from "path";
import {mergeExecutor} from "../../src/executor/mergeExecutor";


describe('Merge Executor test', () => {
  it("create file yaml",async () => {
     await mergeExecutor("./example/openapi.yaml", "./build/openapi.yaml", 'yaml')
  })
  it("create file json",async () => {
     await mergeExecutor("./example/openapi.yaml", "./build/openapi.json", 'json')
  })
  it("input file without directory", async () => {
    const baseDir = process.cwd()
    try {
      process.chdir(path.join(baseDir, 'example'))
      await mergeExecutor("openapi.yaml", "../build/openapi.yaml", 'yaml')
    } finally {
      process.chdir(baseDir)
    }
  })
  it("input file not found", async () => {
    let message: string | undefined
    try {
      await mergeExecutor("./example/notfound.yaml", "./build/openapi.yaml", 'yaml')
    } catch (error) {
      message = (error as Error).message
    }
    expect(message).to.equal("input file not found: ./example/notfound.yaml")
  })
})
