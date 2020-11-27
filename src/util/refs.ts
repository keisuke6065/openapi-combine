import {promises as fs} from "fs";
import path from "path";
import {safeLoad} from "js-yaml";
import {render} from 'mustache';
import _get from "lodash.get";
import _set from "lodash.set";

interface IProps {
  [key: string]: string
}

interface LinkProps {
  $ref: string
  $props: IProps
}

interface LinkResult {
  path: string | undefined
  value: LinkProps[] | undefined
}

export interface IObject {
  [key: string]: any
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
            value: (theObject[prop] as any[])
              .filter(it => !!it)
              .map(it => {
                switch(typeof(it)) {
                  case 'string':
                    return {$ref: it, $props: {}}
                  case 'object':
                    return {$ref: it['$ref'], $props: it['$props'] || {}}
                  default:
                    throw Error('not reached');
                }
              }),
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

export const walkToReplaceProps = <T extends Record<string, null> | any[]>(node: T, props: IProps): T => {
  if (Array.isArray(node)) {
    return (node as Array<any>).map(it => {
      switch(typeof(it)) {
        case 'string':
          return render(it as any, props);
        case 'object':
          return walkToReplaceProps(it, props);
        default:
          return it;
      }
    }) as T;
  } else if (typeof(node) === 'object') {
    for (const [key, value] of Object.entries<any>(node)) {
      if (Array.isArray(value)) {
        (value as any)[key] = Array(value).map((it: any) => {
          if (typeof(it) === 'string') {
            return render(it as string, props);
          } else if (typeof(it) === 'object') {
            return walkToReplaceProps(it, props);
          }
          return it;
        });
      } else if (typeof(value) === 'object') {
        walkToReplaceProps(value, props);
      } else if (typeof(value) === 'string') {
        (node as any)[key] = render(value as string, props);
      }
    }
    return node;
  }

  throw Error('not reached');
}

export const loadFile = async (refs: LinkProps[]): Promise<any> => {
  const x = {}
  const y: any[] = []
  for (const value of refs) {
    const buffer = await fs.readFile(path.join(process.cwd(), value.$ref));
    const load = safeLoad(buffer.toString());
    if (Array.isArray(load)) {
      y.push(walkToReplaceProps(load[0], value.$props))
    } else {
      Object.assign(x, walkToReplaceProps(load as any, value.$props))
    }
  }
  return y.length !== 0 ? y : x;
};

export const resolveCustomRefs = async (refs: IObject): Promise<any> => {
  let result;
  do {
    result = getRefs(refs);
    if (result.path && result.value) {
      const jsonObject = await loadFile(result.value);
      const get = _get(refs, result.path);
      delete get["$refs"]
      let resultRefsObject;
      if (jsonObject instanceof Array) {
        resultRefsObject = Object.assign([], jsonObject);
      } else {
        resultRefsObject = Object.assign({}, jsonObject, get);
      }
      _set(refs, result.path, resultRefsObject);
    } else {
      break
    }
  } while (!result.path && !result.value);
  return refs;
};
