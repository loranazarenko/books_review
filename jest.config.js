module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/test'],
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: 'coverage',
    testTimeout: 30000,
    setupFiles: ['<rootDir>/test/jest.setup.ts'],
    setupFilesAfterEnv: [],
};
