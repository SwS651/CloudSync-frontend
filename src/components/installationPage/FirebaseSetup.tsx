import { ExclamationCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Input, message, Modal, Upload } from 'antd';
import axios from 'axios';
// import { url } from 'inspector';
import React, { useState } from 'react'
import { loadFirebaseConfig } from '../../firebase';
const { Dragger } = Upload;
const { TextArea } = Input;
export const FirebaseSetup = ({next,currentStep}) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [firebaseConfig, setFirebaseConfig] = useState("");
    const [serviceAccount, setServiceAccount] = useState(null);
    const url = "http://localhost:3000/api"
    
    const autoCorrectJson = (input:any) => {
        // Attempt to add double quotes around property names using regex
        return input.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:\s*)/g, '$1"$2"$3');
    };

    // Validate the Firebase Config JSON string
    const validateFirebaseConfig = (config:any) => {
        // Auto-correct the config
        const correctedConfig = autoCorrectJson(config);
        // Attempt to parse the corrected config
        const json = JSON.parse(correctedConfig);
  
        try {
            
            const requiredKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];
            const isValid =requiredKeys.every( (key) => json.hasOwnProperty(key) && typeof json[key] === "string" && json[key].trim() !== "");
            if (!isValid) {
                message.error("Invalid Firebase Config. Please ensure all required fields are present.");
                return false;
            }
            setFirebaseConfig(config);
            message.success("Firebase Config is valid.");
            return true;
        } catch (error:any) {
            message.error(`Invalid JSON format for Firebase Config.${error.message}`);
            return false;
        }
    };

     // Validate the Service Account JSON file
     const validateServiceAccount = (file:any) => {
        const reader = new FileReader();
        reader.onload = (e:any) => {
            try {
                const json = JSON.parse(e.target.result);
                const requiredKeys = [
                    "type",
                    "project_id",
                    "private_key_id",
                    "private_key",
                    "client_email",
                    "client_id",
                    "auth_uri",
                    "token_uri",
                    "auth_provider_x509_cert_url",
                    "client_x509_cert_url",
                ];
                const isValid = requiredKeys.every((key) => json.hasOwnProperty(key) && json.type === "service_account");

                if (!isValid) {
                    message.error("Invalid Service Account JSON. Please check the file structure.");
                    return;
                }
                setServiceAccount(json);
                message.success("Service Account JSON is valid.");
            } catch (error) {
                message.error("Invalid JSON format for Service Account.");
            }
        };
        reader.readAsText(file);
    };

    const handleFirebaseConfigChange = (e:any) => {
        console.log(e.target.value)
        setFirebaseConfig(e.target.value);
    };

    const handleServiceAccountUpload = (file:any) => {
        validateServiceAccount(file);
        return false; // Prevent automatic upload
    };

    const showModal = () => {
        // Validate both credentials before showing the modal
        const isConfigValid = validateFirebaseConfig(firebaseConfig);
        const isServiceAccountValid = serviceAccount !== null;

        if (isConfigValid && isServiceAccountValid) {
            setIsModalVisible(true);
        } else {
            message.error("Please ensure both Firebase Config and Service Account are valid.");
        }
    };

    const confirmUpload = async() => {
        const credential = {
            firebaseSDK: JSON.parse(autoCorrectJson(firebaseConfig)),
            serviceAccount:serviceAccount
        }
        console.log(credential)
        const request = await axios.post(`${url}/credentials/update`,{
            provider:"firebase",
            type:"auth",
            credential:JSON.stringify(credential)
        },{
            headers: {
            'Content-Type': 'application/json'
            }
        })
        message.success("Credentials have been successfully processed.");
        setIsModalVisible(false);
        next()
    };

    const cancelUpload = () => {
        setIsModalVisible(false);
    };

    const confirmModal = () => {
        return(

            <Modal
                title="Confirm Credential Upload"
                visible={isModalVisible}
                onOk={confirmUpload}
                onCancel={cancelUpload}
                okText="Upload"
                cancelText="Cancel"
                
            >
                <p>Uploading these credentials will overwrite existing settings. Are you sure?</p>
            </Modal>
        )}
        const loadFirebase = async ()=>{
            const data = await loadFirebaseConfig()
            console.log(data)
        }
    return (
        <>
        
            <h1 style={{marginTop:60,textAlign:"center"}}>Upload Firebase Credential</h1>
            <Flex justify='center' align='start' wrap>
                <Card title="Firebase Config" style={{ marginBottom: 16 ,width:300,margin:"0 30px"}}>
                    <TextArea
                        rows={8}
                        placeholder='Paste your Firebase Config JSON here. Example: {"apiKey": "...", "authDomain": "..."}'
                        value={firebaseConfig}
                        onChange={handleFirebaseConfigChange}
                    />
                </Card>

                <Card title="Firebase Service Account" style={{ marginBottom: 16 ,width:300,margin:"0 30px"}}>
                    <Dragger
                        onRemove={ () => {
                            setServiceAccount(null)
                        }}
                        listType="picture"
                        // beforeUpload={(file) => handleCredentialRead(file, serviceName)}
                        beforeUpload={handleServiceAccountUpload}
                        multiple={false}
                        accept=".json"
                    >
                        <p className="ant-upload-drag-icon"><InboxOutlined /> </p>
                        <p className="ant-upload-text">Click or drag JSON file to this area to upload</p>
                        <p className="ant-upload-hint">Supports only a single JSON file.</p>
                    </Dragger>
                </Card>    
            </Flex>
            
                <Button type="primary" onClick={showModal} disabled={(firebaseConfig === "") || (serviceAccount===null)}>
                    Confirm and Upload
                </Button>
            
            {confirmModal()}
        </>
    )
}

