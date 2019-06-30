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
