import { DeleteFilled, DeleteOutlined, DownloadOutlined, FileWordOutlined, FolderAddOutlined, FolderOpenOutlined, FolderOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space, Table, Typography } from 'antd';
import React, { useMemo, useState } from 'react'
const {Text} = Typography


const url = 'http://localhost:3000/api'

export const ListTable = ({
    files,fetchFilesInFolder,
    showDrawer,
    aid,
    handleDownload, handleDelete,
    uploadedFile, 
   
    handleAddToCart
}) => {
    const [selectedFiles, setSelectedFiles] = useState([]);

     // Function to clean the mimeType by removing unwanted parts
     const cleanFileType = (type) => {
        return type.replace("application/vnd.google-apps.", "").replace("application/", "");
    };
    
    const columns = [
        {
            title: "File Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text, record) => (
                <Space style={{ cursor: "pointer" }} >
                    <Text onClick={() => showDrawer(record)}>
                        {record.type?.includes("folder") ? <FolderOutlined /> : null} {text}
                    </Text>
                </Space>
            )
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            onFilter: (value, record) => cleanFileType(record.type) === value,
            render: (text) => cleanFileType(text),  // Use the clean-up function here
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    {record.type?.includes("folder") ? (
                        <>
                        <Button 
                            type="primary" 
                             
                            onClick={() => {
                                    console.log(record.id)
                                    let path = record.source==="google"?record.id:record.path
                                    let source = record.source==="google"?"googledrive":"dropbox"
                                    fetchFilesInFolder(aid, path, record.name,source)
                            }}
                            icon={<FolderOpenOutlined />}
                        ></Button>
                         <Button
                                type="primary"
                                disabled={!uploadedFile && record.type !== 'folder'}
                                // onClick={() => handleAddToCart(record)}
                                onClick={() =>handleAddToCart(record,aid)}
                                icon={<FolderAddOutlined />}
                            >
                            
                            </Button>
                        </>
                        
                    ) : (
                        <>
                            <Button type='default' icon={<DownloadOutlined />} onClick={() => handleDownload([record],aid)}>
                                
                            </Button>
                            <Button danger variant="filled" icon={<DeleteOutlined/>} onClick={() => handleDelete([record],aid)}>
                            </Button>
                           
                        </>
                    )}
                </Space>
            ),
        },
    ];
    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            setSelectedFiles(selectedRows);
        },
        getCheckboxProps: (record:any) => ({
            id: record.id,
        }),
    };



    
    return (
        <>
            <Space style={{ marginBottom: 16 }}>
               
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(selectedFiles,aid)}
                    disabled={selectedFiles.length === 0}
                >
                    Download Selected
                </Button>
                <Button
                    // type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(selectedFiles,aid)}
                    disabled={selectedFiles.length === 0}
                >
                    Delete Selected
                </Button>
            </Space>
            <Table
                dataSource={files}
                columns={columns}
                pagination={{ pageSize: 10 }}
                rowKey="id"
                rowSelection={rowSelection} 
            />
        </>
    )
}



