import {safeDump, safeLoad} from "js-yaml";
import {resolveRefs} from "json-refs";
import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function mergeExecutor(
  inputFile: string,
  outputFile: string
) {
  const options = {
    filter: ['relative', 'remote'],
    loaderOptions: {
      processContent: function (res: any, callback: any) {
        callback(safeLoad(res.text));
      }
    }
  };
  const baseDir = process.cwd()
  const inputParsedPath = path.parse(inputFile);

  const x = path.join(baseDir, inputParsedPath.dir, inputParsedPath.base)
  process.chdir(inputParsedPath.dir);

  const root = safeLoad(fs.readFileSync(x).toString());
  const refs = await resolveRefs([root], options);
  // eslint-disable-next-line @typescript-eslint/ban-types
  const resolved = refs.resolved as object[]
  process.chdir(baseDir);
  const outputParsedPath = path.parse(outputFile);
  await mkdirp(outputParsedPath.dir)
  fs.writeFileSync(
    path.join(outputParsedPath.dir, outputParsedPath.base),
    safeDump(resolved[0]), {encoding: "utf8"}
  )
}
