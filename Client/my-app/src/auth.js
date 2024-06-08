// auth.js

export const isAuthenticated = () => {
    // Get token from local storage
    const token = localStorage.getItem('token');

    // Check if token exists and is not expired
    if (token) {
        // Decode token to get expiration date
        const decodedToken = decodeToken(token);
        const expirationDate = new Date(decodedToken.exp * 1000); // Convert to milliseconds

        // Check if token is expired
        if (expirationDate < new Date()) {
        // Token expired, remove it from local storage
        localStorage.removeItem('token');
        return false;
        }

        // Token is valid and not expired
        return true;
    }

    // No token found in local storage
    return false;
    };

    const decodeToken = (token) => {
    try {
        // Decode token using built-in atob function
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
            .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
    };
