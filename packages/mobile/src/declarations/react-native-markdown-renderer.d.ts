// tslint:disable:max-classes-per-file
declare module 'react-native-markdown-renderer' {
  import { Token } from 'markdown-it';
  import { Component } from 'react';
  import { View } from 'react-native';

  class Markdown extends Component<object, object> {}

  export function getUniqueID(): string;
  export function openUrl(url: string): void;

  export function hasParents(parents: any[], type: string): boolean;

  type RenderFunction = (
    node: any,
    children: Component[],
    parent: Component,
    styles: any,
  ) => Component;

  interface RenderRules {
    [name: string]: RenderFunction;
  }

  interface IMarkdownParser {
    parse: (value: string, options: any) => Token[];
  }

  interface ASTNode {
    type: string;
    sourceType: string; // original source token name
    key: string;
    content: string;
    tokenIndex: number;
    index: number;
    attributes: Record<string, any>;
    children: ASTNode[];
  }

  export class AstRenderer {
    constructor(renderRules: RenderRules, style: any);
    getRenderFunction(type: string): RenderFunction;
    renderNode(node: any, parentNodes: ReadonlyArray<any>): Component;
    render(nodes: ReadonlyArray<any>): View;
  }

  export function parser(
    source: string,
    renderer: (node: ASTNode) => View,
    parser: IMarkdownParser,
  ): any;

  export function stringToTokens(
    source: string,
    markdownIt: IMarkdownParser,
  ): Token[];

  export function tokensToAST(tokens: ReadonlyArray<Token>): ASTNode[];

  interface PluginContainerResult<A> {
    [index: number]: any;
    0: A;
  }

  export class PluginContainer<A> {
    constructor(plugin: A, ...options: any[]);
    toArray(): [A, any];
  }

  export function blockPlugin(md: any, name: string, options: object): any;

  export const styles: any;

  // export {
  //   getUniqueID,
  //   openUrl,
  //   hasParents,
  //   renderRules,
  //   AstRenderer,
  //   parser,
  //   stringToTokens,
  //   tokensToAST,
  //   MarkdownIt,
  //   PluginContainer,
  //   blockPlugin,
  //   styles
  // };

  export default Markdown;

}
