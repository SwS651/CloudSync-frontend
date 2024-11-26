import { notification } from 'antd'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import React, { useState } from 'react'
// import { auth } from '../../firebase'
import { getFirebaseAuth } from '../../firebase'
import { AuthPage } from '@refinedev/antd'
import { useLogin, useRegister, } from '@refinedev/core'
import { authProvider } from '../../providers/authProvider'
import { Navigate,useNavigate } from 'react-router-dom'
import { useMutation } from "@tanstack/react-query";

const auth = await getFirebaseAuth()

export const SignUp =  () => {
    const [loading, setLoading] = useState(false)
    // const { mutate: signup } = useLogin();
  
    if(auth?.currentUser){
        return <Navigate to="/" replace />;
    }
   
    // const handleSignUp = async (email:string,password:string) =>{
    //     setLoading(true)
    //     try {
    //         //Implementation
    //         const userCredential = await createUserWithEmailAndPassword(auth,email,password)
    //         const user = userCredential.user

    //         //Update profile
    //         await updateProfile(user,{
    //             displayName:user.email,
    //         })

    //         notification.success({
    //             message:'Sign Up Successful',
    //             description:"You have successfully registered. Please log in"
    //         });

    //         window.location.href='/login'

    //     } catch (error:any) {
    //         notification.error({
    //             message:'Sign Up Error',
    //             description:error.message,
    //         })
    //     }finally{
    //         setLoading(false)
    //     }
    // }


    //...//
    // const { mutate: signup, isLoading } = useSignup();
    const { mutate: register,isLoading } = useRegister();
    return (
        // <AuthPage
        //     type="register"
        //     formProps={{
        //         onFinish: (values) => handleSignUp(values.email, values.password),
        //         submitButtonProps: { loading },
        //     }}
        // />

        ////////////................../////////////////
        // <AuthPage
        //     type="register"
        //     formProps={{
        //         onFinish: (values) => signup({ ...values, isSignUp: true }),
        //     }}
        //     // providers={[
        //     //     {
        //     //         name: "google",
        //     //         label: "Sign up with Google",
        //     //         onClick: () => signup({ providerName: "google", isSignUp: true }),
        //     //     },
        //     // ]}
        // />
        <AuthPage
            type="register"
            formProps={{
                onFinish: (values) => {
                  register(values); // Call the custom hook
                },
              }}
            submitProps={{
                loading: isLoading, // Show loading state
            }}
        />
    )
}



export const useSignup = () => {
    const navigate = useNavigate();
  
    return useMutation(
      async (params: { email: string; password: string; name?: string }) => {
        if (!authProvider.signup) {
          throw new Error("Signup method is not implemented in authProvider.");
        }
        const response = await authProvider.signup(params);
        if (!response.success) {
          throw new Error(response.error?.message || "Signup failed");
        }
        return response;
      },
      {
        onSuccess: (data: { redirectTo: any }) => {
          notification.success({
            message: "Sign-up Successful",
            description: "Your account has been created successfully.",
          });
          navigate(data.redirectTo || "/login");
        },
        onError: (error: any) => {
          notification.error({
            message: "Sign-up Error",
            description: error.message || "An error occurred during sign-up.",
          });
        },
      }
    );
  };

