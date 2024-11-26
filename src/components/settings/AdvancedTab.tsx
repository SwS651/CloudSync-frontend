import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Spin, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getUser, resetPlatform } from '../../utils/apiServices';
import { useNavigate } from 'react-router-dom';
const url ='http://localhost:3000/api'
const AdvancedTab = ({permission}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [email, setEmail] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    
     // Open Modal
     const showModal = () => {
        setIsModalVisible(true);
    };

    // Close Modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setEmail("");
        setConfirmation("");
    };


 
    const navigate = useNavigate();
    const handleReset = async () => {
        const user = await getUser()
        if (confirmation !== "Reset") {
            message.error("Confirmation text must be 'Reset'.");
            return;
        }

        if(email!== user.email){
            message.error("Error email");
            return;
        }

        await resetPlatform(email,navigate)
        handleCancel(); // Close the modal on success
        
    };


    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/auth/users`);;
            setUsers(response.data.users);
            message.success("Fetch users successfully");
        } catch (error) {
            console.error("Error fetching users:", error);
            message.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
 
    const deleteUser = async (uid) => {
        try {
            setLoading(true);
            await axios.delete(`${url}/auth/users/${uid}`); // DELETE request to delete user
            message.success("User deleted successfully");
            // Refresh user list after deletion
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            message.error("Failed to delete user");
        } finally {
            setLoading(false);
        }
    };
    

    //List of user
    const columns = [
        {
            title: "Name",
            dataIndex: "displayName",
            key: "displayName",
            render: (text) => text || "No Name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button
                    type="primary"
                    danger
                    onClick={() => deleteUser(record.uid)}
                    icon={<DeleteOutlined/>}
                ></Button>
            ),
        },
    ];

    if (!permission) {
        return <p>You do not have permission to access these settings.</p>;
    }
    return (
        <>
            <Button type='primary'  onClick={async()=>fetchUsers()} style={{ marginBottom: "16px" }} icon={<ReloadOutlined/>}>
                Accounts
            </Button>
           
            <Spin spinning={loading}>
                <Table
                    dataSource={users.map((user) => ({ ...user, key: user.uid }))}
                    columns={columns}
                    pagination={{ pageSize: 10 }}
                />
            </Spin>
            <Button type="primary" danger onClick={showModal}>
                Reset Project Data
            </Button>


            <Modal
                title="Reset Project Data"
                visible={isModalVisible}
                onOk={handleReset}
                onCancel={handleCancel}
                okText="Reset"
                okButtonProps={{ danger: true, disabled: loading }}
                confirmLoading={loading}
            >
                <Form layout="vertical">
                    <Form.Item label="Email" required>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Confirmation Text" required>
                        <Input
                            placeholder="Type 'Reset' to confirm"
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default AdvancedTab
