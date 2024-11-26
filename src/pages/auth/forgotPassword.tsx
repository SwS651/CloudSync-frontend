import { AuthPage } from '@refinedev/antd'
import React from 'react'
import { getFirebaseAuth } from '../../firebase';
import { Navigate } from 'react-router-dom';
import { AuthProvider, useForgotPassword } from "@refinedev/core";
const auth = await getFirebaseAuth()

export const ForgotPassword = () => {
    const {mutate:forgotPassword } = useForgotPassword()
    if(auth?.currentUser){
        return <Navigate to="/update-password" replace />;
    }

    return (
        <AuthPage type="forgotPassword" 
            formProps={{
                onFinish: (values) => {
                    console.log("Form Values:", values); // Debug here
                    forgotPassword({ email: values.email });
                },
            }}
            
        />
    )
}

