import type { Config } from 'jest'

const config: Config = {
  verbose: true,
  testEnvironment: "node",
  transformIgnorePatterns: [],
  transform: {
    '^.+\\.(ts|tsx|mjs)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['esm'],
}

export default config