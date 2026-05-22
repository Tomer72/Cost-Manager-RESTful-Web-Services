/*
  Unit tests for the about-service.
  Tests the GET /api/about endpoint which returns
  team member details (first_name and last_name).
  Tests run against a live service using fetch.
*/

// Base URL for the about-service
const BASE_URL = 'http://localhost:3004';

describe('About Service - GET /api/about', () => {

    // Test that the endpoint returns a successful response
    test('should return status 200', async () => {
        const response = await fetch(`${BASE_URL}/api/about`);
        expect(response.status).toBe(200);
    });

    // Test that the response body is a JSON array
    test('should return a JSON array of team members', async () => {
        const response = await fetch(`${BASE_URL}/api/about`);
        const data = await response.json();

        // Response must be an array
        expect(Array.isArray(data)).toBe(true);

        // Should have at least one team member
        expect(data.length).toBeGreaterThan(0);
    });

    // Test that each team member only has first_name and last_name
    test('each member should have only first_name and last_name', async () => {
        const response = await fetch(`${BASE_URL}/api/about`);
        const data = await response.json();

        // Check each team member object
        data.forEach((member) => {
            expect(member).toHaveProperty('first_name');
            expect(member).toHaveProperty('last_name');

            // Verify values are non-empty strings
            expect(typeof member.first_name).toBe('string');
            expect(typeof member.last_name).toBe('string');
            expect(member.first_name.length).toBeGreaterThan(0);
            expect(member.last_name.length).toBeGreaterThan(0);
        });
    });
});
