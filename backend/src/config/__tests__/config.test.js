const path = require('path');
const config = require('../index');

describe('Configuration System', () => {
    beforeEach(() => {
        // Reset environment variables before each test
        process.env = {};
    });

    it('should load development configuration by default', () => {
        const devConfig = config;
        expect(devConfig.env).toBe('development');
        expect(devConfig.port).toBe(3000);
        expect(devConfig.cors.origin).toBe('http://localhost:3001');
    });

    it('should load test configuration when NODE_ENV is test', () => {
        process.env.NODE_ENV = 'test';
        const testConfig = require('../index');
        expect(testConfig.env).toBe('test');
        expect(testConfig.port).toBe(3001);
    });

    it('should load production configuration when NODE_ENV is production', () => {
        process.env.NODE_ENV = 'production';
        const prodConfig = require('../index');
        expect(prodConfig.env).toBe('production');
        expect(prodConfig.logging.level).toBe('info');
    });

    it('should validate required configuration values', () => {
        // This should throw an error because required values are missing
        expect(() => {
            process.env.DB_HOST = '';
            require('../index');
        }).toThrow();
    });
}); 