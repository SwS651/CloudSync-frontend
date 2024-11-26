import Icon, { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Form, Input, Space, Switch } from 'antd'
import React, { FC, useContext, useEffect, useState } from 'react'


export const Configuration = () => {
    const [form] = Form.useForm();
    const handleSave = (values) => {
        console.log("Configuration saved:", values);
        // Perform save operation here (e.g., make API request)
    };

    return (
        <>
            <Form form={form} layout="vertical" onFinish={handleSave}>
                <Form.Item
                    label="Platform Name"
                    name="platformName"
                    rules={[{ required: true, message: "Please enter the platform name" }]}
                >
                    <Input placeholder="Enter platform name" />
                </Form.Item>

                {/* Add any additional features or configurations here */}

                <Form.Item>
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>
            </Form>


        </>
    )
}
