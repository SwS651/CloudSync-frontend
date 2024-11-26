import React, { useEffect, useState } from 'react'
import { Layout,Typography, Row, Col, Card, List, Progress, Tabs,Tag, Space, Button, Carousel, Drawer, Table, message, Breadcrumb, Spin, Modal, Popover, Upload, FloatButton, Flex, Empty } from "antd";
import LogoutButton from '../components/LogoutButton';
import { DriveStatus } from '../components';
import { ArrowLeftOutlined, CommentOutlined, CustomerServiceOutlined, DeleteOutlined, DownloadOutlined, FileExcelOutlined, FilePdfOutlined, FileWordOutlined, FolderOutlined, HomeOutlined, LeftCircleFilled, LeftOutlined, PlusOutlined, RightCircleFilled, RightOutlined, ShoppingCartOutlined, UploadOutlined } from '@ant-design/icons';
import { getFirebaseAuth } from '../firebase';
import {fetchDrive,fetchFilesData} from '../utils/fakeData'
// import { FileTable } from '../components/dashboard/FileTable';
import { FileMetaDrawer, useDrawer } from '../components/dashboard/FileMetaDrawer';
import { SearchModal } from '../components/dashboard/SearchModal';
import { FilesTab } from '../components/dashboard/FilesTab';
import { CartList } from '../components/dashboard/CartList';
import { useDriveData } from '../utils/driveDataHook';



const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Content } = Layout;

// const auth = await getFirebaseAuth()
// const user = auth?.currentUser;
// const url = 'http://localhost:3000/api'





export const Dashboard = () => {

    const { visible, selectedFile, showDrawer, closeDrawer } = useDrawer(); // Utility for Drawer
    const { 
        driveData, filesData, setFilesData, 
        loading, error, 
        fetchFilesInFolder, 
        currentPath, navigateBack,
        handleDownload,handleDelete,
        searchFilesLocally
    } = useDriveData(); 
    const { activeTab, handleCardClick } = useTabs();
    

    //Upload function: Cart list
    const [cartItems, setCartItems] = useState([]); // Cart items
    const [uploadedFile, setUploadedFile] = useState(null); // Uploaded file/zip
    const [cartVisible, setCartVisible] = useState(false);


    // Function to switch to the tab of a specific account based on aid
    const switchToTabByAid = (aid: any) => {
        const targetIndex = driveData.findIndex((drive) => drive.id === aid);
        if (targetIndex !== -1) {
            handleCardClick(String(targetIndex));
        }
    };
    if (loading) {
        return <Spin size="large" tip="Loading..." />;
    }


    const handleAddToCart = (folder,aid) => {
        if (!uploadedFile) {
            message.warning("Please upload a file/zip before adding to the cart.");
            return;
        }

        const alreadyInCart = cartItems.some((item) => item.folder.id === folder.id);
        if (alreadyInCart) {
            message.warning("This folder is already in the cart.");
            return;
        }

        setCartItems([...cartItems, {folder,aid}]);
        message.success("Folder added to the cart!");
    };
   

    


   

    return (
        <>
            

            <Layout>
                <Content style={{ padding: '24px' }}>
                <Flex justify='space-between' style={{marginBottom:20}}>

                    <SearchModal
                        // filesData={filesData}
                        // driveData={driveData}
                        // onNavigateToFolder={fetchFilesInFolder}
                        // switchToTabByAid={switchToTabByAid }
                        driveData={driveData}
                        handleDownload={handleDownload}
                        searchFilesLocally={searchFilesLocally}
                        handleAddToCart={handleAddToCart}
                        uploadedFile={uploadedFile}
                        />

                    {/* Cart Popover */}
                    <Popover
                        content={(
                            <CartList 
                                cartItems={cartItems} 
                                setCartItems={setCartItems} 
                                setUploadedFile={setUploadedFile}
                                uploadedFile={uploadedFile}
                                />
                            )}
                            title="Cart"
                            trigger="click"
                            visible={cartVisible}
                            onVisibleChange={setCartVisible}
                            >
                        <Button type='primary' icon={<UploadOutlined/>}> Upload</Button>
                    </Popover>
                </Flex>
                    {/* Drive Status Carousel */}
                    <Row justify="center" gutter={[16, 16]}>
                        <Col span={24}>
                            {driveData.length>0 ? (

                                <DriveStatus 
                                driveData={driveData} 
                                // activeTab={activeTab}
                                handleCardClick={handleCardClick}
                                fetchFilesInFolder={fetchFilesInFolder}
                                reloadFolder={navigateBack}
                                />
                            ):(
                                <Empty/>
                            )}
                        </Col>
                    </Row>
                    
                    

                    <Row style={{ marginTop: '24px' }}>
                        <Col xs={24} md={24} lg={24}>
                            <FilesTab 
                                driveData={driveData} 
                                filesData={filesData} 
                                activeTab={activeTab}
                                handleCardClick={handleCardClick}
                                showDrawer={showDrawer} 
                                fetchFilesInFolder={fetchFilesInFolder}
                                navigateBack={navigateBack} 
                                currentPath={currentPath}
                                handleDownload={handleDownload}
                                handleDelete={handleDelete}
                                uploadedFile={uploadedFile} //boolean
                                cartItems={cartItems}
                                setCartItems={setCartItems}
                                handleAddToCart={handleAddToCart}
                                // activeTab={activeTab}
                                // handleCardClick={handleCardClick}
                            />
                        </Col>
                    </Row>
            
                    {/* Drawer for File Meta */}
                    <FileMetaDrawer 
                        visible={visible} 
                        selectedFile={selectedFile} 
                        closeDrawer={closeDrawer}
                    />
                </Content>
            </Layout>


            
            
            <FloatButton.BackTop />
        </>
    )
}




const useTabs = () => {
    const [activeTab, setActiveTab] = useState("0");

    const handleCardClick = (index) => {
        setActiveTab(String(index));
    };

    return { activeTab, setActiveTab, handleCardClick };
};




// Custom hook to fetch data
// const useDriveData = () => {
//     const [driveData, setDriveData] = useState([]);
//     const [filesData, setFilesData] = useState([]);
//     const [currentPath, setCurrentPath] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

    
//     const fetchDriveData = async () => {
//         try {
//             const driveRequest = await fetch(`${url}/cloud/`,
//                 {
//                     method: 'POST',
//                     body:JSON.stringify({uid:user?.uid}),
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 }
//             ); // API call for drive data
//             const driveResponse = await driveRequest.json();
//             if (driveResponse.success) {
//                  // Destructure to get 'drive' and 'files' directly
//                 const drives = driveResponse.data.map(data => data.drive);
//                 console.log(drives)
//                 const files = driveResponse.data.map(data => data.files|| []);

//                 // Set the drive data and file data
//                 setDriveData(drives);
//                 setFilesData(files);
//             } else {
//                 message.error("Failed to fetch drive data");
//                 // throw new Error("Failed to fetch drive data");
//             }
            
//             setLoading(false);
//         } catch (error:any) {
//             setError(error.message);
//             setLoading(false);
//         }
//     };

//     // Function to fetch files in a folder and update the state
//     const fetchFilesInFolder  = async (
//         accountId: string, 
//         folderId: string,
//         folderName:string,
//         resource:string
//     ) => {
//         const hideLoading = message.loading('loading...', 0); // 0 means the message won't auto-close
//         console.log("Resource: ",resource)
//         try {
//             const endpoint = `${url}/cloud/${resource}/files`;
//              // Make the request to fetch files from Google Drive or Dropbox
//             const folderRequest = await fetch(endpoint, {
//                 method: 'POST',
//                 body: JSON.stringify({ fid: folderId, aid: accountId }),
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });

//             const folderResponse  = await folderRequest.json();

//             if (folderResponse.success) {
//                 const updatedFilesData = filesData.map((accountFiles, index) => {
//                     if (driveData[index].id === accountId) {
//                         // Replace files only for the selected account
//                         // return folderResponse.data;
//                         return folderResponse.data;
//                     }
//                     return accountFiles;
//                 });
//                 // Update the files data state
//                 setFilesData(updatedFilesData);

//                 // Update the path stack for navigation
//                 setCurrentPath(prevPath => [...prevPath, { accountId, folderId,folderName, resource }]);

//             } else {
//                 message.error('Failed to load files');
//             }
            
//             hideLoading()
//         } catch (error:any) {
//             hideLoading()
//             console.error(`Error fetching folder files:, error: ${error.message}`);
//             message.error('Failed to load files');
//         }
//     }


//     const navigateBack = async () => {
//         if (currentPath.length > 1) {
//             const prevFolder = currentPath[currentPath.length - 2];
//             await fetchFilesInFolder(prevFolder.accountId, prevFolder.folderId,prevFolder.folderName, prevFolder.resource);
//             setCurrentPath(currentPath.slice(0, -1));
//         } else {
//             fetchDriveData(); // Go back to root
//             setCurrentPath([]); // Clear path
//         }
//     };


//     const handleDownload = async (filesToDownload: any[],accountId:string) => {
//         const hideLoading = message.loading("Downloading file...", 0);
    
//         try {
//             for (const file of filesToDownload) {
//                 let endpoint,filePath
//                 // Determine endpoint based on the file source
//                 if(file.source==="google"){

//                     endpoint = `${url}/cloud/googledrive/download`
//                     filePath= file.id
//                 }
//                 else if(file.source==="dropbox") {
//                     endpoint = `${url}/cloud/dropbox/download`;
//                     filePath= file.path;
//                 }
    
//                 // Make POST request to backend download endpoint
//                 const response = await fetch(endpoint, {
//                     method: "POST",
//                     body: JSON.stringify({ fid: filePath, aid:accountId }),
//                     headers: { "Content-Type": "application/json" },
//                 });
    
//                 if (!response.ok) {
//                     throw new Error(`Failed to download ${file.name}`);
//                 }
    
//                 // Convert response to blob
//                 const blob = await response.blob();
//                 const downloadUrl = window.URL.createObjectURL(blob);
//                 const a = document.createElement("a");
//                 a.href = downloadUrl;
    
//                 // Default filename
//                 let fileName = file.name || "downloaded_file";
    
//                 // Check if filename is provided in Content-Disposition header
//                 const contentDisposition = response.headers.get("content-disposition");
//                 if (contentDisposition) {
//                     const matches = contentDisposition.match(/filename="(.+)"/);
//                     if (matches && matches.length === 2) {
//                         fileName = matches[1];
//                     }
//                 }
    
//                 // Initiate download
//                 a.download = fileName;
//                 document.body.appendChild(a); // Required for Firefox
//                 a.click();
//                 document.body.removeChild(a);
    
//                 // Clean up URL object to release memory
//                 window.URL.revokeObjectURL(downloadUrl);
//             }
    
//             hideLoading();
//             message.success("File downloaded successfully!");
//         } catch (error) {
//             console.error("Download error:", error);
//             hideLoading();
//             message.error("Some problem occurred. Failed to download file.");
//         }
//     };


//     const handleDelete = async (filesToDelete: any[],accountId: string) => {
//         Modal.confirm({
//             title: "Are you sure you want to delete these files?",
//             content: `Files: ${filesToDelete.map((file: { name: any; }) => file.name).join(", ")}`,
//             okText: "Delete",
//             okType: "danger",
//             cancelText: "Cancel",
//             onOk: async () => {
//                 const hideLoading = message.loading("Deleting file...", 0);

//                 try {
                    
//                     for (const file of filesToDelete) {
                       
//                         const endpoint =
//                             file.source === "google"
//                                 ? `${url}/cloud/googledrive/delete`
//                                 : `${url}/cloud/dropbox/delete`;

//                         //Dec
//                         let filePath = file.source==="google"? file.id : file.path

//                         const body = JSON.stringify({ filePath: filePath,aid:accountId})

//                         const response = await fetch(endpoint, {
//                             method: "DELETE",
//                             body,
//                             headers: { "Content-Type": "application/json" },
//                         });

//                         const result = await response.json();
//                         if (!result.success) throw new Error(`Failed to delete ${file.name}`);
                        
                        
//                     }
//                     navigateBack()
//                     message.success('Files deleted successfully');

//                 } catch (error) {
//                     console.error('Error deleting files:', error);
//                     message.error('Failed to delete one or more files.');
//                 } finally {
//                     hideLoading();
//                 }
//             },
//         });
//     };


//     // To handle frontend-only search
//     const searchFilesLocally = (query) => {
//         // return filesData
//         //     .flat()
//         //     .filter((file) => file.name?.toLowerCase().includes(query.toLowerCase()));
//         return filesData.flatMap((files, index) => 
//             files
//                 .filter((file) => file.name?.toLowerCase().includes(query.toLowerCase()))
//                 .map((file) => ({
//                     ...file,
//                     driveId: driveData[index]?.id, // Add drive ID based on the corresponding index
//                 }))
//         );
//     };


//     useEffect(() => {
//         fetchDriveData();
//     }, []);

//     return { 
//         driveData, filesData, setFilesData, 
//         loading, error,  
//         fetchFilesInFolder, 
//         currentPath, navigateBack,
//         handleDownload, handleDelete,
//         searchFilesLocally 

//     };
// };



