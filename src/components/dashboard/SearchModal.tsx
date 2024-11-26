import React, { useState } from "react";
import { Modal, Input, Radio, Button, List, Table, Space, message, Spin } from "antd";
import { DeleteOutlined, DownloadOutlined, FolderAddOutlined, FolderOutlined, SearchOutlined } from "@ant-design/icons";


const url='http://localhost:3000/api'
export const SearchModal = ({
    // filesData,
    driveData,
    handleDownload,
    searchFilesLocally,
    handleAddToCart,
    uploadedFile
    // onNavigateToFolder,
    // switchToTabByAid
    
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const toggleModalVisibility = (visible: boolean) => setModalVisible(visible);
    // const { filesData, driveData, handleDownload, searchFilesLocally } = useDriveData();



    const handleSearch = async () => {
        // setIsLoading(true);
        // try {

        //     // Perform local search
        //     const flattenedFiles = filesData.flat();
        //     const results = flattenedFiles // Adjust in case `filesData` contains nested arrays of files
        //                         .filter((file) => {
        //                             const fileName = file.name ? file.name.toLowerCase() : "";
        //                             return fileName.includes(searchQuery.toLowerCase());
        //                         }).map((file, index) => {
        //                             // Add aid to the file from driveData
        //                             const aid = driveData[index]?.id;
        //                             return { ...file, aid };
        //                         });
            
        //     setSearchResults(results);
           
        // } catch (error) {
        //     message.error("An error occurred during the search.");
        // } finally {
        //     setIsLoading(false);
        // }

        setIsLoading(true);
        try {
            // const results = searchFilesLocally(searchQuery).map((file, index) => ({
            //     ...file,
            //     aid: driveData[index]?.id
            // }));
            const results = searchFilesLocally(searchQuery)
            setSearchResults(results);
            console.log(results)
            
        } catch (error) {
            message.error("An error occurred during the search.");
        } finally {
            setIsLoading(false);
        }

        console.log(searchResults)
    };

    const handleFileDownload = (file) => handleDownload([file], file.aid);


    // const handleNavigate = (accountId: any,fileId:any,fileName:any) => {
   
    //     onNavigateToFolder(accountId, fileId, fileName);
    //     switchToTabByAid(accountId)
    //     setSearchQuery("")
    //     setSearchResults([])
    //     setModalVisible(false)
        
    // };



    // const columns = [
    //     {
    //         title: "File Name",
    //         dataIndex: "name",
    //         key: "name",
    //         render: (text: string, record: any) => (
    //             <Space>
    //                 {record.mimeType.includes("folder") && <FolderOutlined />}
    //                 {text}
    //             </Space>
    //         )
    //     },
    //     {
    //         title: "Type",
    //         dataIndex: "mimeType",
    //         key: "mimeType",
    //         render: (text: string) => (text.includes("folder") ? "Folder" : "File")
    //     },
    //     {
    //         title: "Action",
    //         key: "action",
    //         render: (_: any, record: any) => (
    //             <Space>
    //                 {record.mimeType.includes("folder") ? (
    //                 <Button type="primary" onClick={() => handleNavigate(record.aid,record.id,record.name)}>Select</Button>
    //                 ) : (
    //                 <Button icon={<DownloadOutlined />}  onClick={() => handleDownload(record.id,record.aid)}>Download</Button>
    //                 )}
                    
    //             </Space>
    //         )
    //     }
    // ];


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
                <Space style={{ cursor: "pointer" }}>
                
                    {record.type?.includes("folder") ? <FolderOutlined /> : null} {text}
                </Space>
            )
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            // filters: [
            //     { text: "Folder", value: "folder" },
            //     { text: "Document", value: "document" },
            //     { text: "Other", value: "other" },
            // ],
            onFilter: (value, record) => cleanFileType(record.type) === value,
            render: (text) => cleanFileType(text),  // Use the clean-up function here
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    
                        <>
                            <Button  icon={<DownloadOutlined />} onClick={() => handleDownload([record],record.driveId)}>              
                            </Button>
                            <Button
                                type="primary"
                                disabled={!uploadedFile && record.type !== 'folder'}
                                // onClick={() => handleAddToCart(record)}
                                onClick={() =>handleAddToCart(record,record.aid)}
                                icon={<FolderAddOutlined />}
                            >
                            
                            </Button>
                        </>
                    
                </Space>
            ),
        },
    ];

    return (
        <>
        
        <Button type="primary" onClick={()=>toggleModalVisibility(true)} icon={<SearchOutlined/> }>Search</Button>
        <Modal
            title="Search Files"
            visible={modalVisible}
            onCancel={()=>toggleModalVisibility(false)}
            footer={null}
            width={800}
        >
            <Input.Search
                placeholder="Search for files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={handleSearch}
                enterButton
            />
            <Spin spinning={isLoading}>
                <Table
                    columns={columns}
                    dataSource={searchResults}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    style={{ marginTop: 16 }}
                />
            </Spin>
        </Modal>
        </>
    );
};

