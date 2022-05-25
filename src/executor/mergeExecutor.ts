import {dump, load} from "js-yaml";
import {resolveRefs} from "json-refs";
import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";
import {IObject, resolveCustomRefs} from "../util/refs";
import {OutputType} from '../commands/merge'

const options = {
  filter: ['relative', 'remote'],
  loaderOptions: {
    processContent: async function (res: any, callback: any) {
      const loadRefObject = load(res.text) as IObject;
      callback(resolveCustomRefs(loadRefObject));
    }
  }
};

export const mergeExecutor = async (
  inputFile: string,
  outputFile: string,
  type: OutputType
): Promise<void> => {
  const baseDir = process.cwd()
  const inputParsedPath = path.parse(inputFile);
  const targetFilePath = path.join(baseDir, inputParsedPath.dir, inputParsedPath.base)
  process.chdir(inputParsedPath.dir);
  const root = load(fs.readFileSync(targetFilePath).toString()) as IObject;
  const newVar = resolveCustomRefs(root);
  const refs = await resolveRefs([newVar], options);
  const resolved = refs.resolved as any[]
  process.chdir(baseDir);
  const outputParsedPath = path.parse(outputFile);
  await mkdirp(outputParsedPath.dir)
  console.log(resolved[0] as string)
  if (type == 'json') {
    fs.writeFileSync(
      path.join(outputParsedPath.dir, outputParsedPath.base),
      JSON.stringify(resolved[0]), {encoding: "utf8"}
    )
  } else if (type == 'yaml') {
    fs.writeFileSync(
      path.join(outputParsedPath.dir, outputParsedPath.base),
      dump(resolved[0]), {encoding: "utf8"}
    )
  }
};

