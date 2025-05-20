function validateName(name: string): boolean {
    return /^[A-Za-z\s]+$/.test(name) && name.length >= 4;
}

function validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validatePassword(password: string): boolean {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}

export{validateName, validateEmail, validatePassword}