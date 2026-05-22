/*
  Unit tests for the admin-logs-service.
  Tests the GET /api/logs endpoint which returns
  all log records saved to MongoDB by the services.
  Tests run against a live service using fetch.
*/

// Base URL for the admin-logs-service
const BASE_URL = 'http://localhost:3001';

// Base URL for the about-service (used to generate a log entry)
const ABOUT_URL = 'http://localhost:3004';

describe('Admin Logs Service - GET /api/logs', () => {

    // Test that the endpoint returns a successful response
    test('should return status 200', async () => {
        const response = await fetch(`${BASE_URL}/api/logs`);
        expect(response.status).toBe(200);
    });

    // Test that the response body is a JSON array
    test('should return a JSON array', async () => {
        const response = await fetch(`${BASE_URL}/api/logs`);
        const data = await response.json();

        // Response must be an array
        expect(Array.isArray(data)).toBe(true);
    });

    // Test that log entries contain the expected fields
    test('each log should have method, url, status, service, and timestamp', async () => {
        const response = await fetch(`${BASE_URL}/api/logs`);
        const data = await response.json();

        // Only check if there are logs in the DB
        if (data.length > 0) {
            const log = data[0];
            expect(log).toHaveProperty('method');
            expect(log).toHaveProperty('url');
            expect(log).toHaveProperty('status');
            expect(log).toHaveProperty('service');
            expect(log).toHaveProperty('timestamp');
        }
    });

    // Test that calling an endpoint creates a new log record
    test('making a request should create a new log record', async () => {
        // Get the current log count
        const beforeResponse = await fetch(`${BASE_URL}/api/logs`);
        const beforeData = await beforeResponse.json();
        const beforeCount = beforeData.length;

        // Make a request to the about-service to generate a log
        await fetch(`${ABOUT_URL}/api/about`);

        // Wait briefly for the log to be written to MongoDB
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get the log count again
        const afterResponse = await fetch(`${BASE_URL}/api/logs`);
        const afterData = await afterResponse.json();
        const afterCount = afterData.length;

        // There should be more logs now
        expect(afterCount).toBeGreaterThan(beforeCount);
    });
});
