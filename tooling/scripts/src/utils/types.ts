import chalk from 'chalk';

interface Version {
  hash: string;
  version: string;
}

interface WWMetaBranch {
  published?: Version;
  deployed?: Version;
}

export interface WWMeta {
  branches: {
    [key: string]: WWMetaBranch;
  };
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
