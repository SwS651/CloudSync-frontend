import { Button, Card, message } from 'antd'
import axios from 'axios';
import React from 'react'
import { signInWithPopup } from 'firebase/auth';
import { getFirebaseAuth, googleProvider, } from '../../firebase';



const url ='http://localhost:3000/api'
export const UserSetup = ({next}) => {

        // Google Login Handler
    const handleGoogleLogin = async () => {
        const auth = await getFirebaseAuth()
        try {
            const result = await signInWithPopup(auth,googleProvider);
            const user = result.user;

            // Send user ID to the backend
            console.log("user: ",user?.uid)
            await axios.put(`${url}/credentials/platformConfig/admin`, { admin: user.uid });

            message.success("Google login successful!");
            next(); // Proceed to the next step after successful login
        } catch (error) {
            console.error(error);
            message.error("Google login failed. Please try again.");
        }
    };
    return (
        <Card title="Login with Google" style={{ width: 300, margin: "0 auto", textAlign: "center" }}>
            <Button type="primary" onClick={handleGoogleLogin}>
                Login with Google
            </Button>
        </Card>
    )
}

