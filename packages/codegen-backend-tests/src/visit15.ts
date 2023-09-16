/* eslint-disable */
import type { ASTKindToNode, ASTNode } from 'graphql';
import { QueryDocumentKeys, isNode } from 'graphql/language/ast';

export type ASTVisitor = Visitor<ASTKindToNode>;
export type Visitor<
  KindToNode,
  Nodes = KindToNode[keyof KindToNode],
> = EnterLeaveVisitor<KindToNode, Nodes>;

interface EnterLeave<T> {
  readonly enter?: T;
  readonly leave?: T;
}

type EnterLeaveVisitor<KindToNode, Nodes> = EnterLeave<
  VisitFn<Nodes> | { [K in keyof KindToNode]?: VisitFn<Nodes, KindToNode[K]> }
>;

/**
 * A visitor is comprised of visit functions, which are called on each node
 * during the visitor's traversal.
 */
export type VisitFn<TAnyNode, TVisitedNode = TAnyNode> = (
  /** The current node being visiting. */
  node: TVisitedNode,
  /** The index or key to this node from the parent node or Array. */
  key: string | number | undefined,
  /** The parent immediately above this node, which may be an Array. */
  parent: TAnyNode | ReadonlyArray<TAnyNode> | undefined,
  /** The key path to get to this node from the root node. */
  path: ReadonlyArray<string | number>,
  /**
   * All nodes and Arrays visited before reaching parent of this node.
   * These correspond to array indices in `path`.
   * Note: ancestors includes arrays which contain the parent of visited node.
   */
  ancestors: ReadonlyArray<TAnyNode | ReadonlyArray<TAnyNode>>,
) => any;

/**
 * A KeyMap describes each the traversable properties of each kind of node.
 *
 * @deprecated Please using ASTVisitorKeyMap instead
 */
export type VisitorKeyMap<T> = { [P in keyof T]: ReadonlyArray<keyof T[P]> };

export function visit15(
  root: ASTNode,
  visitor: Visitor<ASTKindToNode>,
  visitorKeys: VisitorKeyMap<ASTKindToNode> = QueryDocumentKeys,
): any {
  let stack: any = undefined;
  let inArray = Array.isArray(root);
  let keys: any = [root];
  let index = -1;
  let edits = [];
  let node: any = undefined;
  let key: any = undefined;
  let parent: any = undefined;
  const path: any = [];
  const ancestors = [];
  let newRoot = root;

  do {
    index++;
    const isLeaving = index === keys.length;
    const isEdited = isLeaving && edits.length !== 0;
    if (isLeaving) {
      key = ancestors.length === 0 ? undefined : path[path.length - 1];
      node = parent;
      parent = ancestors.pop();
      if (isEdited) {
        if (inArray) {
          node = node.slice();
        } else {
          const clone: any = {};
          for (const k of Object.keys(node)) {
            clone[k] = node[k];
          }
          node = clone;
        }
        let editOffset = 0;
        for (let ii = 0; ii < edits.length; ii++) {
          let editKey: any = edits[ii][0];
          const editValue = edits[ii][1];
          if (inArray) {
            editKey -= editOffset;
          }
          if (inArray && editValue === null) {
            node.splice(editKey, 1);
            editOffset++;
          } else {
            node[editKey] = editValue;
          }
        }
      }
      index = stack.index;
      keys = stack.keys;
      edits = stack.edits;
      inArray = stack.inArray;
      stack = stack.prev;
    } else {
      key = parent ? (inArray ? index : keys[index]) : undefined;
      node = parent ? parent[key] : newRoot;
      if (node === null || node === undefined) {
        continue;
      }
      if (parent) {
        path.push(key);
      }
    }

    let result;
    if (!Array.isArray(node)) {
      if (!isNode(node)) {
        throw new Error(`Invalid AST Node: ${node}.`);
      }
      const visitFn = getVisitFn(visitor, node.kind, isLeaving);
      if (visitFn) {
        result = visitFn.call(visitor, node, key, parent, path, ancestors);

        if (result === BREAK) {
          break;
        }

        if (result === false) {
          if (!isLeaving) {
            path.pop();
            continue;
          }
        } else if (result !== undefined) {
          edits.push([key, result]);
          if (!isLeaving) {
            if (isNode(result)) {
              node = result;
            } else {
              path.pop();
              continue;
            }
          }
        }
      }
    }

    if (result === undefined && isEdited) {
      edits.push([key, node]);
    }

    if (isLeaving) {
      path.pop();
    } else {
      stack = { inArray, index, keys, edits, prev: stack };
      inArray = Array.isArray(node);
      keys = inArray ? node : (visitorKeys as any)[node.kind] ?? [];
      index = -1;
      edits = [];
      if (parent) {
        ancestors.push(parent);
      }
      parent = node;
    }
  } while (stack !== undefined);

  if (edits.length !== 0) {
    newRoot = edits[edits.length - 1][1];
  }

  return newRoot;
}

/**
 * Given a visitor instance, if it is leaving or not, and a node kind, return
 * the function the visitor runtime should call.
 */
export function getVisitFn(
  visitor: Visitor<any>,
  kind: string,
  isLeaving: boolean,
): VisitFn<any> | undefined {
  const kindVisitor = (visitor as any)[kind];
  if (kindVisitor) {
    if (!isLeaving && typeof kindVisitor === 'function') {
      // { Kind() {} }
      return kindVisitor;
    }
    const kindSpecificVisitor = isLeaving
      ? kindVisitor.leave
      : kindVisitor.enter;
    if (typeof kindSpecificVisitor === 'function') {
      // { Kind: { enter() {}, leave() {} } }
      return kindSpecificVisitor;
    }
  } else {
    const specificVisitor = isLeaving ? visitor.leave : visitor.enter;
    if (specificVisitor) {
      if (typeof specificVisitor === 'function') {
        // { enter() {}, leave() {} }
        return specificVisitor;
      }
      const specificKindVisitor = specificVisitor[kind];
      if (typeof specificKindVisitor === 'function') {
        // { enter: { Kind() {} }, leave: { Kind() {} } }
        return specificKindVisitor;
      }
    }
  }
}

export const BREAK = Object.freeze({});
