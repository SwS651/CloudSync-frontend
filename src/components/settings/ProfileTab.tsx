import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import axios from "axios";
import { useGetIdentity } from "@refinedev/core";
import { updateProfile } from "firebase/auth";
import { getFirebaseAuth } from "../../firebase";
import { useProfile } from "../../contexts/ProfileContext";

const url ='http://localhost:3000/api'
const auth = await getFirebaseAuth()
const ProfileTab = ( ) => {
    const { profile, updateProfile: updateProfileContext } = useProfile();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [user, setUser] = useState(null); // Local state to store Firebase user

    useEffect(() => {
        // Fetch Firebase auth user
        const fetchUser = async () => {
            const auth = await getFirebaseAuth();
            setUser(auth?.currentUser);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            // Populate the form with user data
            form.setFieldsValue({
                displayName: user.displayName || profile.displayName,
                email: user.email || profile.email,
            });
        }
    }, [user, profile, form]);



    const handleUpdate = async (values) => {
        try {
            setLoading(true);

            if (user) {
                // Update displayName
                await updateProfile(user, { displayName: values.displayName });

                // Update email if it's changed
                // if (values.email !== user.email) {
                //     await updateEmail(user, values.email);
                // }

                // Update the context with new values
                updateProfileContext({
                    displayName: values.displayName,
                    email: values.email,
                });

                message.success("Profile updated successfully");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            message.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    
    

     if (!user) {
        return <Spin spinning />;
    }
    return (
        <Spin spinning={loading}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdate}
                style={{ maxWidth: 400 }}
            >
                <Form.Item
                    label="Name"
                    name="displayName"
                    rules={[{ required: true, message: "Please enter your name" }]}
                >
                    <Input placeholder="Enter your name" />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Please enter a valid email" },
                    ]}
                >
                    <Input placeholder="Enter your email" disabled />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default ProfileTab;
