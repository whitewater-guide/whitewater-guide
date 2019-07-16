import chalk from 'chalk';

interface Version {
  hash: string;
  version: string;
}

export interface WWMeta {
  branches: {
    [key: string]: Version;
  };
  changelog: string;
}

export class Package {
  name: string;
  version: string;

  constructor(name: string, version: string) {
    this.name = name;
    this.version = version;
  }

  toString = () => {
    return this.name + '@' + this.version;
  };

  pretty = () => {
    return (
      chalk.green(this.name) + chalk.yellow('@') + chalk.green(this.version)
    );
  };
}
