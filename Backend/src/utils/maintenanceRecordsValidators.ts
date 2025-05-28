/**
 * Validates the service name for a maintenance record.
 * - Must be a string.
 * - Must not be empty after trimming whitespace.
 * - Must not exceed 255 characters.
 * @param service - The service name to validate.
 * @returns True if the service name is valid, false otherwise.
 */
function validateMaintenanceService(service: any): boolean {
    if (typeof service !== 'string') {
        return false;
    }
    if (service.trim() === '') {
        return false; // NOT NULL constraint
    }
    if (service.length > 255) {
        return false; // VARCHAR(255) constraint
    }
    return true;
}

/**
 * Validates a date string for maintenance records (expected_at, performed_at).
 * - Can be null or undefined (optional).
 * - If provided, must be a string that can be parsed into a valid Date.
 *   A simple check for non-empty string is done here; more robust validation (e.g., YYYY-MM-DD format) can be added.
 * @param dateStr - The date string to validate.
 * @returns True if the date string is valid or optional, false otherwise.
 */
function validateMaintenanceDate(dateStr: any): boolean {
    if (dateStr === null || dateStr === undefined) {
        return true; // Date is optional
    }
    if (typeof dateStr !== 'string' || dateStr.trim() === '') {
        return false;
    }
    // Check if it can be parsed into a valid date
    // Note: `new Date(string)` is quite lenient. For strict format (e.g., YYYY-MM-DD), use regex or a library.
    return !isNaN(new Date(dateStr).getTime());
}

/**
 * Validates the description for a maintenance record.
 * - Can be null or undefined (optional).
 * - If provided, must be a string.
 * @param description - The description to validate.
 * @returns True if the description is valid or optional, false otherwise.
 */
function validateMaintenanceDescription(description: any): boolean {
    if (description === null || description === undefined) {
        return true; // Optional
    }
    return typeof description === 'string';
}

/**
 * Validates the condition for the next maintenance.
 * - Can be null or undefined (optional).
 * - If provided, must be a string.
 * - Must not exceed 255 characters.
 * @param condition - The condition string to validate.
 * @returns True if the condition is valid or optional, false otherwise.
 */
function validateMaintenanceCondition(condition: any): boolean {
    if (condition === null || condition === undefined) {
        return true; // Optional
    }
    return typeof condition === 'string' && condition.length <= 255;
}


export { validateMaintenanceService, validateMaintenanceDate, validateMaintenanceDescription, validateMaintenanceCondition };