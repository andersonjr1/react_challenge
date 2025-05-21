/**
 * Validates the name of an asset.
 * - Must be a string.
 * - Must not be empty after trimming whitespace.
 * - Must not exceed 255 characters.
 * @param name - The asset name to validate.
 * @returns True if the name is valid, false otherwise.
 */
function validateAssetName(name: any): boolean {
    if (typeof name !== 'string') {
        return false;
    }
    if (name.trim() === '') {
        return false; // NOT NULL constraint
    }
    if (name.length > 255) {
        return false; // VARCHAR(255) constraint
    }
    return true;
}

/**
 * Validates the description of an asset.
 * - Can be null or undefined (optional).
 * - If provided, must be a string.
 * @param description - The asset description to validate.
 * @returns True if the description is valid, false otherwise.
 */
function validateAssetDescription(description: any): boolean {
    if (description === null || description === undefined) {
        return true; // Description is optional (TEXT, can be NULL)
    }
    if (typeof description !== 'string') {
        return false;
    }
    // No specific length validation for TEXT unless business rules require it.
    return true;
}

export { validateAssetName, validateAssetDescription };