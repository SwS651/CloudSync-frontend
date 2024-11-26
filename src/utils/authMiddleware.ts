// utils/encryption.js
import axios from 'axios';
import CryptoJS from 'crypto-js';


//################### Useless ########################/
// Load encryption keys from environment variables

const getKey = () =>{
    const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "REFIN3_ENC@YPT_KeY_123";
    const DECRYPTION_KEY = process.env.DECRYPTION_KEY || "BACKEND_DEC@YPT_KeY_456";
    return {ENCRYPTION_KEY, DECRYPTION_KEY}
}



/**
 * Encrypts a JSON object.
 * @param {Object} data - The JSON object to be encrypted.
 * @returns {string} - The encrypted string.
 */
// Encryption data
export const encryptData = (data:any) => {
    const {ENCRYPTION_KEY} = getKey()
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};


/**
 * Decrypts an encrypted string.
 * @param {string} encryptedData - The encrypted string.
 * @returns {Object} - The decrypted JSON object.
 */
// Decryption data
export const decryptData= (encryptedData:any) => {
    const {ENCRYPTION_KEY,DECRYPTION_KEY} = getKey()
    const bytes = CryptoJS.AES.decrypt(encryptedData, DECRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};



// -------------Example usage of sending data to the backend------------- \\

// const sendDataToBackend = async (data) => {
//     const encryptedData = encryptDataFrontend(data);
    
//     try {
//         const response = await axios.post('https://your-backend-api.com/data', { data: encryptedData });
//         const decryptedResponse = decryptDataFrontend(response.data.data);
//         console.log('Decrypted Response:', decryptedResponse);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };

// sendDataToBackend({ username: 'johnDoe', password: 'superSecret123' });



/**
 * Set the JWT token from the backend.
 * No return - Store JWT token.
 */
export const setToken = (token:any) => {
    localStorage.setItem('jwtToken',token);
};
/**
 * Get the JWT token from local storage.
 * @returns {string} - The stored JWT token.
 */
export const getToken = () => {
    return localStorage.getItem('jwtToken');
};

/**
 * Securely send data with JWT authentication.
 * @param {string} url - The backend API URL.
 * @param {Object} data - The data to send.
 */
export const sendDataWithAuth = async (url, data) => {
    const token = getToken();
    const encryptedData = encryptData(data); // Use the previously defined encrypt function
    try {
      const response = await axios.post(url, { data: encryptedData }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
};