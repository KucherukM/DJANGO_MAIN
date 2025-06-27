import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {APP_ENV} from "../env";

// Function to check if token is expired
const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true; // Assume expired if we can't decode
    }
};

export const createBaseQuery = (endpoint: string) => {
    const baseUrl = `${APP_ENV.API_BASE_URL}/api/${endpoint}`;
    
    return fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            // Get the token from localStorage
            const token = localStorage.getItem('access');
            
            // If we have a token, check if it's expired
            if (token) {
                if (isTokenExpired(token)) {
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    window.location.href = '/login';
                    return headers;
                }
                
                headers.set('Authorization', `Bearer ${token}`);
            }
            
            return headers;
        },
    });
}