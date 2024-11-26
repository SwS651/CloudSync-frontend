import { EditOutlined, EllipsisOutlined, ExclamationCircleOutlined, FileTextOutlined, InboxOutlined, SettingOutlined, UploadOutlined, WarningTwoTone } from '@ant-design/icons';
import { Button, Card, Flex, Form, Input, message, Modal, Space, Tag, Upload } from 'antd';
import React, { useEffect, useState } from 'react'
import { getToken, sendDataWithAuth } from '../../utils/authMiddleware';
import axios from 'axios';
import { getFirebaseAuth } from '../../firebase';
const { Dragger } = Upload;

const url ='http://localhost:3000/api'
const putCredential = async(jsonData:any)=>{
    try {
        const data = jsonData
        const headers = {
            Authorization: `Bearer `,
        }
        const response = await axios.put(`${url}/credential`, data, {headers});
    } catch (error) {
        console.error('Error sending data:', error);
    }
}

const validateGoogleDriveCredentials = (config:any) => {
    try {
        console.log(config)
        const json = config
        const requiredKeys = [
            "client_id",
            "project_id",
            "auth_uri",
            "token_uri",
            "auth_provider_x509_cert_url",
            "client_secret",
            "redirect_uris",
            "javascript_origins"
        ];

        // Check for "web" key and ensure all required keys are present
        if (!json.web) {
            message.error("Invalid structure: Missing 'web' key.");
            return false;
        }

        const isValid = requiredKeys.every((key) => json.web.hasOwnProperty(key));
        if (!isValid) {
            message.error("Invalid Google Drive API Credentials. Ensure all required fields are present.");
            return false;
        }
        message.success("Google Drive API Credentials are valid.");
        return json; // Return parsed JSON if valid
    } catch (error) {
        message.error("Invalid JSON format. Please ensure the file is correctly structured.");
        return false;
    }
};


export const CredentialCards = ({permission,setPermission}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    //Google Credential
    const [fileToUpload, setFileToUpload] = useState(null);
    const [credentials, setCredentials] = useState([]);
    const [serviceName, setServiceName] = useState("");

    //Dropbox Credential
    const [dropboxClientId, setDropboxClientId] = useState<string>("");
    const [dropboxClientSecret, setDropboxClientSecret] = useState<string>("");

    const googleCredential = credentials.find(credential => credential?.provider === "google");
    const dropboxCredential = credentials.find(credential => credential?.provider === "dropbox");
    

    //fetch data
    const userHasAdminRights = async ()=>{
        const auth = await getFirebaseAuth()
        const user = auth.currentUser;
        const response = await axios.post(`${url}/credentials/platformConfig`,{uid:user?.uid})
        setPermission(response.data.status)
    };

    const fetchCredentials = async () => {
        try {
            const response = await axios.get(`${url}/credentials/cloudConfig`);
            setCredentials(response.data.credentials); // Set credentials data from API
            setLoading(false);
        } catch (error) {
            message.error("Failed to load credentials");
            setLoading(false);
        }
    };
    useEffect(() => {
        
        fetchCredentials();
        userHasAdminRights()
    }, []);


    //Google Credential
    //Step 1
    const handleUpload = (file:any, serviceName:any) => {
        setFileToUpload(file);
        setServiceName(serviceName);
        handleFileRead(file,serviceName); // Read and parse JSON file before showing modal
        return false; // Prevent default upload behavior
    };

    //Step 2
    const handleFileRead = (file:any,serviceName:string) => {
        setServiceName(serviceName);
        const reader = new FileReader();
        let credential:any
        reader.onload = (e:any) => {
            try {
                const json = JSON.parse(e.target.result);
                console.log(json)
                if(serviceName==="google")
                    credential = validateGoogleDriveCredentials(json)
                if(credential)
                {
                    console.log(credential)
                    setFileToUpload(credential)
                    setIsModalVisible(true); // Show confirmation modal after successful parsing
                    message.success("JSON file parsed successfully. Ready to upload.");
                }else
                    message.error(`${serviceName} Credential is not valid. Please try again.`);
            } catch (error) {
                message.error("Invalid JSON file. Please check the file content.");
            }
        };
        reader.readAsText(file);
    };

    //Step 3
    const confirmUpload = async () => {
        try {
            if (fileToUpload && serviceName) {
                const request = await axios.post(`${url}/cloud/googledrive/upload`, {
                    provider: "google",
                    type: "cloudAPI",
                    credential: fileToUpload,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                console.log(`Uploading for ${serviceName}:`, fileToUpload);
                message.success(`${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} credential uploaded successfully.`);
                fetchCredentials(); // Refresh credentials after upload
            }
        } catch (error) {
            console.error("Upload failed:", error);
            message.error("Failed to upload credentials. Please try again.");
        } finally {
            // Reset states after the operation
            setIsModalVisible(false);
            setFileToUpload(null);
            setServiceName("");
            fetchCredentials();
        }
    };

    const cancelUpload = () => {
        setIsModalVisible(false);
        setFileToUpload(null);
        setServiceName("");
    };



 
   //Dropbox Credential
   
    const handleClientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDropboxClientId(e.target.value);
    };

    const handleClientSecretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDropboxClientSecret(e.target.value);
    };

    const handleSubmit = async () => {
        // Logic to validate and send these values to the backend
        console.log("Dropbox Client ID:", dropboxClientId);
        console.log("Dropbox Client Secret:", dropboxClientSecret);
        let credential = {
            clientId:dropboxClientId,
            clientSecret:dropboxClientSecret
        }
        // Add code to submit these credentials to the backend for verification
        const response = await axios.post(`${url}/credentials/update`,
            {
                provider:'dropbox',
                type:'cloudAPI',
                credential:credential
            },{headers: {
                'Content-Type': 'application/json'
                }}
        )
        if(response.status)
            message.success("uploaded dropbox credential")
        else
            message.error("Failed to upload dropbox credential")

        fetchCredentials();
    };



    
    return (
        <>
        <Flex gap={10} align="start"  wrap >

            {googleCredential && (
                <>
                    <Card 
                        loading={loading} 
                        title={googleCredential.provider.charAt(0).toUpperCase() + googleCredential.provider.slice(1) + " Credential"}
                        actions={[
                            <>
                                {googleCredential.status? (<Tag color="blue">{googleCredential.remark}</Tag>):(<Tag color="red">{googleCredential.remark}</Tag>)}
                            </>
                        ]} 
                        style={{ minWidth: 200,maxWidth:300 }}
                    >
                        <Card.Meta
                            description={
                                <Dragger
                                    onRemove={ () => {
                                        setFileToUpload(null)
                                        setServiceName("")
                                    }}
                                    beforeUpload={(file) => handleUpload(file, googleCredential.provider)}
                                    multiple={false}
                                    accept=".json" 
                                    disabled={permission? false:true}
                                    >
                                    {googleCredential.status?
                                        (<p className="ant-upload-drag-icon"><EditOutlined /></p>):
                                        (<p className="ant-upload-drag-icon"><InboxOutlined /></p>)
                                    }
                                    <p className="ant-upload-text">Click or drag {googleCredential.provider.charAt(0).toUpperCase() + googleCredential.provider.slice(1)} drive JSON file to this area to upload</p>
                                    <p className="ant-upload-hint">Supports only a single JSON file.</p>
                                </Dragger>

                        }  
                        />
                    </Card>
                </>
            )}
            

            {dropboxCredential && (
                <Card 
                    title={dropboxCredential.provider.charAt(0).toUpperCase() + dropboxCredential.provider.slice(1) + " Credential"} 
                    style={{  minWidth:200, width:300,maxWidth: 300 }}
                    actions={[
                        <>
                            {dropboxCredential.status? (<Tag color="blue">{dropboxCredential.remark}</Tag>):(<Tag color="red">{dropboxCredential.remark}</Tag>)}
                        </>
                    ]}
                >
                    <Form layout="vertical" disabled={permission? false:true}>
                        <Form.Item label="Dropbox Client ID">
                            <Input
                                placeholder="Dropbox Client ID"
                                value={dropboxClientId}
                                onChange={handleClientIdChange}
                            />
                        </Form.Item>
                        <Form.Item label="Dropbox Client Secret">
                            <Input.Password
                                placeholder="Dropbox Client Secret"
                                value={dropboxClientSecret}
                                onChange={handleClientSecretChange}
                            />
                        </Form.Item>
                        <Button type="primary" onClick={handleSubmit} icon={<UploadOutlined/>}>
                            Save
                        </Button>
                    </Form>
                </Card>
            )}
        </Flex>

         {/* Confirmation Modal */}
        <Modal
            title="Confirm Credential Change"
            visible={isModalVisible}
            onOk={confirmUpload}
            onCancel={cancelUpload}
            okText="Proceed"
            cancelText="Cancel"
        >   <Space>
                <WarningTwoTone style={{fontSize:"3em"}}/>
                <p> 
                    Changing the credentials will delete all accounts related to this service.
                    <br />Are you sure you want to proceed?
                </p>
            </Space>
        </Modal>
        </>
    )
}


