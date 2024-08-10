module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
    moduleFileExtensions: ['js', 'json', 'node'],
    testMatch: ['**/__tests__/**/*.test.js'],
    moduleDirectories: ['node_modules', '<rootDir>/'],
    coverageDirectory: '<rootDir>/tests/coverage',
    collectCoverage: true,
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1'
    },
};