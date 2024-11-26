import { AuthPage, TextField } from '@refinedev/antd'
import {  EmailAuthProvider, getAuth, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup, User } from 'firebase/auth';
import React, { useContext, useState } from 'react'
// import { auth } from '../../firebase';
import { getFirebaseAuth } from '../../firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, Layout, message, Typography } from 'antd';
import { useGetIdentity, useUpdatePassword } from '@refinedev/core';

const { Title } = Typography;
const { Content } = Layout;

function isGmailUser(email: string): boolean {
    const gmailDomain = "@gmail.com";
    return email.endsWith(gmailDomain);
}

const auth = await getFirebaseAuth()
export const UpdatePassword =  () => {
    // const { data } = useGetIdentity();
    // if(data){
    //    console.log(data.id)
    // }
    const { mutate:updatePassword } = useUpdatePassword();

    const user = auth.currentUser as User;
    // Check if the user is authenticated with Google

    
    // const onSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
    //     e.preventDefault();

    //     const values = {
    //         currentPassword:"",
    //         newPassword: e.currentTarget.newPassword.value,
    //     };
    //     updatePassword({currentPassword:"",newPassword:e.currentTarget.newPassword.value,isGoogle: false});
        
    // }

    // const { password, setPassword } = usePassword(); 
    const onHandlePasswordUpdate = async (values: { currentPassword: string, newPassword: string }) => {
        try {
            // const user = auth.currentUser as User | null;
            
            // TODO(you): prompt the user to re-provide their sign-in credentials
           

            // reauthenticateWithCredential(user).then(() => {
            //     // User re-authenticated.

            // }).catch((error) => {
            //     // An error ocurred
            //     // ...

            // });
            
            // if (user && typeof values.newPassword === "string") {
            //      // Re-authenticate user with current password before updating
            //      const credential = EmailAuthProvider.credential(user.email!, values.currentPassword);
            //      await reauthenticateWithCredential(user, credential);
 
            //      // Update the password to the new one
            //      await updatePassword(user, values.newPassword);
            //      message.success("Password updated successfully.");

            //      // Optionally, clear the password in context or handle it as needed
            //     // setPassword(''); // Clear the password after updating
            //     return {
            //         success: true,
            //         message: "Password has been changed",
            //         name:'Updated Password',
            //         redirectTo: "/", // Redirect to update password page
            //     };
            // }

            // await auth.updateUser(data.id,{
            //     password:values.newPassword
            // }).then((userRecord)=>{
            //     console.log('Successfully updated user')
            // }).catch((error)=>{
            //     console.log('Error updating user',error)
            // })
    


            return {
                success: false,
                message: "This feature is under development",
            }
            
        } catch (error: any) {
            message.error(error.message || "Failed to update password.");
        }
    };

    if (!isGmailUser(user.email)){
        return (
            
            <Layout style={{ minHeight: "100vh", justifyContent: "center", alignItems: "center" }}>
                <Content>
                    <Card
                        title={<Title level={3} style={{ margin:'auto' }}>Update Password</Title>}
                        style={{ maxWidth: 400, margin: "auto" }}
                        > 
                        {/* Display the generated password */}
                        {/* <div style={{ marginBottom: 16 }}>
                            <Typography.Text>Generated Password: </Typography.Text>
                            <Typography.Text strong>{data.id}</Typography.Text>
                        </div> */}
                        <Form
                                layout="vertical"
                                onFinish={(values)=>updatePassword({...values,isGoogle:false})}
                                // initialValues={{
                                //     currentPassword: password, // Pre-fill the generated password
                                // }}
                            >
                                <Form.Item
                                    name="currentPassword"
                                    label="Current Password"
                                    rules={[{ required: true, message: "Please input your current password!" }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item
                                    name="newPassword"
                                    label="New Password"
                                    rules={[{ required: true, message: "Please input your new password!" }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block>
                                        Update Password
                                    </Button>
                                </Form.Item>
                            </Form>
                    </Card>
                </Content>
            </Layout>
        )
    }else{
        //update password (Google)
        return (
            <AuthPage
                type="updatePassword"
                formProps={{
                    onFinish: (values)=>updatePassword({...values,isGoogle:isGmail}),
                }}
            />
           
        )
    }
}


 // <AuthPage 
        //     type="updatePassword" 
        //     // formProps={{
        //     //     onFinish: handlePasswordUpdate,
        //     // }} 

        //     formProps={{
        //         onFinish: handlePasswordUpdate,
        //         fields: [
        //             {
        //                 name: "currentPassword",
        //                 label: "Current Password",
        //                 rules: [{ required: true, message: "Please input your current password!" }],
        //                 widgetProps: {
        //                     type: "password",
        //                 },
        //             },
        //             {
        //                 name: "newPassword",
        //                 label: "New Password",
        //                 rules: [{ required: true, message: "Please input your new password!" }],
        //                 widgetProps: {
        //                     type: "password",
        //                 },
        //             },]
        //     }}
        // />

