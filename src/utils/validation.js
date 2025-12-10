export const validateEmail = (email) => {
    if (!email) {
        return { isValid: false, error: 'Email is required' }
    }

    // Strict email regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Please enter a valid email address' }
    }

    // Common typo detection
    const domain = email.split('@')[1].toLowerCase()
    const typos = {
        'gmai.com': 'gmail.com',
        'gmil.com': 'gmail.com',
        'gmal.com': 'gmail.com',
        'gmial.com': 'gmail.com',
        'yaho.com': 'yahoo.com',
        'yahooo.com': 'yahoo.com',
        'hotmai.com': 'hotmail.com',
        'hotmil.com': 'hotmail.com'
    }

    if (typos[domain]) {
        return {
            isValid: false,
            error: `Did you mean ${typos[domain]}?`
        }
    }

    return { isValid: true, error: null }
}
