import { DeleteOutlined, DropboxOutlined, GoogleOutlined, UploadOutlined } from '@ant-design/icons'
import { List, Button, message, Upload, UploadProps, Flex, Tooltip } from 'antd'
import axios from 'axios';
import React from 'react'
const { Dragger } = Upload;
const url = 'http://localhost:3000/api'
export const CartList = ({cartItems,setCartItems,uploadedFile,setUploadedFile}) => {

    const handleRemoveFromCart = (folderId: any) => {
        setCartItems(cartItems.filter((item:any) => item.folder.id !== folderId));
        message.info("Folder removed from the cart.");
    };

    
    const handleFileUpload = (file:any) => {
        if (file.status === "error") {
            message.error(`${file.name} upload failed.`);
        }
        
        setUploadedFile(file);
        console.log(`${file.name} uploaded successfully.`);
        message.success(`${file.name} uploaded successfully.`);

        return false;
    };


    const processUpload= async()=>{
        if (!uploadedFile || !cartItems) {
            message.warning('Please upload  a file and select at least one folder.');
            return;
        }
        //...
     
    
        try {
            const uploadPromises = cartItems.map((item:any) => {
                const formData = new FormData();
                formData.append('file', uploadedFile);
                formData.append('aid', item.aid);
                console.log(item.folder.name)
                console.log(item.folder.path)
                formData.append('folderId', item.folder.id); // For Google Drive
                formData.append('path', encodeURIComponent(item.folder.path)); // For Dropbox
                console.log(item.folder)
                const endpoint = item.folder.source === 'google' ? `${url}/cloud/upload/google` : `${url}/cloud/upload/dropbox`;
                return axios.post(endpoint, formData);
            })
         
            const results = await Promise.all(uploadPromises);
            const successCount = results.filter((result) => result.data.success).length;

            results.map((result,index)=>{
                if(result.data.success){
                    message.success(`${successCount} file(s) uploaded successfully!`);
                    handleRemoveFromCart(cartItems[index].folder.id)
                }
            })
            setUploadedFile(null)
            // const response = await axios.post(`${url}/cloud/uplaod/google`, formData, {
            //     headers: { 'Content-Type': 'multipart/form-data' },
            // });
    
            // if (response.data.success) {
            //     message.success('Upload processed successfully!');
            //     setCartItems([]); // Clear cart
            //     setUploadedFile(null); // Clear uploaded file
            // } else {
            //     message.error('Failed to process upload.');
            // }
        } catch (error) {
            console.error('Upload error:', error);
            message.error('Error occurred during upload.');
        }
    }



    return (
        <Flex vertical>
            
            <Dragger
                onRemove={ () => {setUploadedFile(null)}}
                beforeUpload={(file) => handleFileUpload(file)}
                multiple={false}  
                // disabled={cartItems}
                maxCount={1}
            >
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Supports only a single file.</p>
            </Dragger>
            <hr />
            <List
                  size="small"
                  bordered
                  dataSource={cartItems}
                  renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    type="link"
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleRemoveFromCart(item.folder.id)}
                                />,
                            ]}
                            
                        >
                        <List.Item.Meta
                            avatar={
                                <>
                                {(item.folder.source==='google'?<GoogleOutlined style={{fontSize:'25px'}}/>:'')}
                                {(item.folder.source==='dropbox'?<DropboxOutlined style={{fontSize:'25px'}}/>:'')}
                                </>
                            }
                            
                            title={
                                
                                <Tooltip title={(item.folder.source==='google'?item.folder.path:item.folder.path)}>
                                   {item.folder.name}
                                </Tooltip>
                            }
            
                        />
                          
                      </List.Item>
                  )}
              />
            <Button 
                type='primary' 
                style={{alignSelf:'center', margin:10}}
                disabled={(!uploadedFile )}
                onClick={processUpload}
            >Process Upload</Button>
        </Flex>
    )
}


