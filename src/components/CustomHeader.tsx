import React, { useEffect, useState } from "react";
import { Layout, Button, Dropdown, Menu, Avatar, message } from "antd";
import Icon, { UploadOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { getFirebaseAuth } from "../firebase";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { useProfile } from "../contexts/ProfileContext";


const { Header } = Layout;

export const CustomHeader = ({ }) => {
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const {mutate:logout} = useLogout()
    const {data:user} = useGetIdentity();
    const { profile } = useProfile();
    // const [user, setUser] = useState(null);
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         const identity = await authProvider.getIdentity();
    //         setUser(identity);
    //     };

    //     fetchUser();
    // }, []);


    const userMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                {profile?.displayName || user?.displayName}
            </Menu.Item>
            {/* <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}> */}
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={()=>logout()}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#001529", // Dark theme
                padding: "0 16px",
                color: "#fff",
            }}
        >
            {/* Left Section: Title or Logo */}
            <div style={{ fontSize: "18px", color: "#fff", fontWeight: "bold" }}>
                Cloud Sync
            </div>

            {/* Right Section: Upload and User Profile */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {/* Upload Button */}
                
                {profile && <span>Welcome, {profile.displayName}</span>}

                {/* User Profile Dropdown */}
                <Dropdown overlay={userMenu} placement="bottomRight">
                    <Avatar  
                        size="large"
                        src={profile?.avatar || user?.avatar}
                        icon={profile?.avatar ? <UserOutlined /> : undefined}
                        style={{ cursor: "pointer" }}
                        />
                    
                </Dropdown>
            </div>

            {/* Upload Modal */}
            {uploadModalVisible && (
                <></>
            )}
        </Header>
    );
};


