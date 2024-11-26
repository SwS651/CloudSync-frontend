import { BaseKey, useCreate, useDelete, useList, useOne, useUpdate } from '@refinedev/core'
import { Button, Card, Col, Form, Input, List, Modal, notification, Popconfirm, Row, Typography } from 'antd';
import React, { useState } from 'react'
interface ICredential {
    id: BaseKey;
    name: string;
    type: string;
    credentials: Record<string, any>;
}
interface ICredentials {
    id: BaseKey;
    name: string;
    type: string;
}
const { Text } = Typography;
const ShowCloudCredentials = () => {
    // const { data, isLoading, error } = useOne<ICredential>({ 
    //     resource: "credentials", 
    //     id: "66d1e13c5baf58d02a2ca45d",
    //     dataProviderName: "credentials",
    // });

    const { data, isLoading, error, refetch  } = useList<ICredentials>({
        resource: "credentials",
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCredential, setCurrentCredential] = useState(null);
    const [form] = Form.useForm();
    
    const { mutate: create } = useCreate();
    const { mutate: update } = useUpdate();
    const { mutate: deleteCredential } = useDelete();
    const showModal = (credential = null) => {
        setIsModalVisible(true);
        setIsEditMode(!!credential);
        setCurrentCredential(credential);
        if (credential) {
            form.setFieldsValue(credential);
        } else {
            form.resetFields();
        }
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentCredential(null);
    };

    const handleSave = async (values) => {
        if (isEditMode) {
            update({
                resource: "credentials",
                id: currentCredential.id,
                values,
                onSuccess: () => {
                    notification.success({ message: "Credential updated successfully" });
                    refetch();
                    handleCancel();
                },
            });
        } else {
            if (typeof values.credentials === "string") {
                try {
                    values.credentials = JSON.parse(values.credentials);
                } catch (error) {
                    notification.error({ message: "Invalid JSON format in credentials" });
                    return;
                }
            }
            create({
                resource: "credentials",
                values,
                onSuccess: () => {
                    notification.success({ message: "Credential created successfully" });
                    refetch();
                    handleCancel();
                },
            });
        }
    };

    const handleDelete = (id) => {
        deleteCredential({
            resource: "credentials",
            id,
            onSuccess: () => {
                notification.success({ message: "Credential deleted successfully" });
                refetch();
            },
        });
    };

    if (isLoading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <p>Error loading data: ${error.message}</p>
            </div>
        );
    }

    return (
        
        <>
            {/* <div>
                <p>Credentials: {data?.data?.name}</p>
                <p>Type: {data?.data?.type}</p>
                <pre>Credentials: {JSON.stringify(data?.data?.credentials, null, 2)}</pre>
                <pre>Keys: {JSON.stringify(data?.data?.credentials.key, null, 2)}</pre>
            </div> */}

            <div>
                <Row justify="space-between" align="middle" style={{ marginBottom: 8,paddingRight:15,paddingLeft:15 }}>
                    <Col>
                        {/* <h2>Credentials</h2> */}
                        <p> Showing {data?.total} records in total. </p>
                    </Col>
                    <Col>
                        <Button type="primary" onClick={() => showModal()}>Create Credential</Button>
                    </Col>
                </Row>

                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={data?.data}
                    renderItem={(credential) => (
                        <List.Item>
                            <Card title={credential.name} extra={
                                <Row justify="end" gutter={8}>
                                    <Col>
                                        <Button onClick={() => showModal(credential)}>Edit</Button>
                                    </Col>
                                    <Col>
                                        <Popconfirm
                                            title="Are you sure delete this credential?"
                                            onConfirm={() => handleDelete(credential.id)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button danger>Delete</Button>
                                        </Popconfirm>
                                    </Col>
                                </Row>
                            }>
                                <Row>
                                    <Col span={24}>
                                        <Text>Type: {credential.type}</Text>
                                    </Col>
                                </Row>
                            </Card>
                        </List.Item>
                    )}
                />
                <Modal
                    title={isEditMode ? "Edit Credential" : "Create Credential"}
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onOk={() => form.submit()}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSave}
                    >
                        <Form.Item
                            name="name"
                            label="Credential Name"
                            rules={[{ required: true, message: 'Please input the name!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="type"
                            label="Credential Type"
                            rules={[{ required: true, message: 'Please input the type!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="credentials"
                            label="Credential"
                            rules={[{ required: true, message: 'Please input the credential!' }]}
                        >
                            <Input />
                        </Form.Item>
                        {/* Add more form fields as needed */}
                    </Form>
                </Modal>
            </div>
        </>
    );
}

export default ShowCloudCredentials
