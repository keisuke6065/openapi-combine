import fs from "fs";
import path from "path";
import {load} from "js-yaml";
import _get from "lodash.get";
import _set from "lodash.set";

interface LinkResult {
  path: string | undefined
  value: string[] | undefined
}

export interface IObject {
  [key: string]: any;
}

export const getRefs = (theObject: IObject, p = ""): LinkResult => {
  let result: LinkResult = {
    value: undefined,
    path: undefined
  };
  if (theObject instanceof Array) {
    for (let i = 0; i < theObject.length; i++) {
      result = getRefs(theObject[i], p ? p + '['+ i +']' : p);
      if (result.value) {
        break;
      }
    }
  } else {
    for (const prop in theObject) {
      if (Object.prototype.hasOwnProperty.call(theObject, prop)) {
        if (prop === '$refs') {
          return {
            path: p,
            value: theObject[prop] as string[]
          };
        }
        if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
          result = getRefs(theObject[prop], p ? p + '.' + prop : prop);
          if (result.value) {
            break;
          }
        }
      }
    }
  }
  return {
    value: result.value,
    path: result.path
  };
};

export const loadFile = (refs: string[]): any => {
  const x = {}
  const y: any[] = []
  refs.forEach(value => {
    const buffer = fs.readFileSync(path.join(process.cwd(), value));
    const loadData = load(buffer.toString());
    if (loadData instanceof Array) {
      y.push(loadData[0])
    } else {
      Object.assign(x, loadData)
    }

  })
  return y.length !== 0 ? y : x;
};

export const resolveCustomRefs = (refs: IObject): any => {
  let result;
  do {
    result = getRefs(refs);
    if (result.path && result.value) {
      const jsonObject = loadFile(result.value);
      const get = _get(refs, result.path);
      delete get["$refs"]
      let resultRefsObject;
      if (jsonObject instanceof Array) {
        resultRefsObject = Object.assign([], jsonObject);
      } else {
        resultRefsObject = Object.assign({}, jsonObject, get)
      }
      _set(refs, result.path, resultRefsObject)
    } else {
      break
    }
  } while (!result.path && !result.value)
  return refs
};

