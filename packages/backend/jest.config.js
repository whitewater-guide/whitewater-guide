module.exports = {
  // Uncomment this to set breakpoints
  // "globals": {
  //   "ts-jest": {
  //     "skipBabel": true
  //   }
  // },
  "transform": {
    ".(ts|tsx)": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  "testEnvironment": "node",
  "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx)$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "json"
  ],
  "moduleNameMapper": {
    "^@apollo$": "<rootDir>/src/apollo",
    "^@auth$": "<rootDir>/src/auth",
    "^@db(.*)$": "<rootDir>/src/db$1",
    "^@features/(.*)$": "<rootDir>/src/features/$1",
    "^@log$": "<rootDir>/src/log",
    "^@minio$": "<rootDir>/src/minio",
    "^@redis$": "<rootDir>/src/redis",
    "^@seeds/(.*)$": "<rootDir>/src/seeds/test/$1",
    "^@test$": "<rootDir>/src/test",
    "^@utils$": "<rootDir>/src/utils",
    "^@ww-commons$": "<rootDir>/src/ww-commons"
  },
  "snapshotSerializers": [
    "jest-serializer-sql"
  ]
};
