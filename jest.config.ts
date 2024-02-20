import type { Config } from 'jest'

const config: Config = {
  verbose: true,
  testEnvironment: "node",
  preset: 'ts-jest/presets/default-esm',
  transformIgnorePatterns: [],
  transform: {
    "^.+\\.(ts|tsx|mjs)$": [
      'ts-jest',
      {
        tsconfig: "tsconfig.json",
        useESM: true,
      }
    ]
  },
  setupFilesAfterEnv: ['esm'],
}

export default config