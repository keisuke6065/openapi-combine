import {safeDump, safeLoad} from "js-yaml";
import {resolveRefs} from "json-refs";
import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";
import {IObject, resolveCustomRefs} from "../util/refs";

const options = {
  filter: ['relative', 'remote'],
  loaderOptions: {
    processContent: async function (res: any, callback: any) {
      const loadRefObject = safeLoad(res.text) as IObject;
      callback(resolveCustomRefs(loadRefObject));
    }
  }
};

export const mergeExecutor = async (
  inputFile: string,
  outputFile: string
): Promise<void> => {
  const baseDir = process.cwd()
  const inputParsedPath = path.parse(inputFile);
  const targetFilePath = path.join(baseDir, inputParsedPath.dir, inputParsedPath.base)
  process.chdir(inputParsedPath.dir);
  const root = safeLoad(fs.readFileSync(targetFilePath).toString()) as IObject;
  const newVar = resolveCustomRefs(root);
  const refs = await resolveRefs([newVar], options);
  const resolved = refs.resolved as any[]
  process.chdir(baseDir);
  const outputParsedPath = path.parse(outputFile);
  await mkdirp(outputParsedPath.dir)
  fs.writeFileSync(
    path.join(outputParsedPath.dir, outputParsedPath.base),
    safeDump(resolved[0]), {encoding: "utf8"}
  )
};

