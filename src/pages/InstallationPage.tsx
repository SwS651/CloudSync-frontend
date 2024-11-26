import { ExclamationCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { AuthPage } from '@refinedev/core';
import { Steps, Button, notification, Input, Form, Divider, message, Upload, Flex, Card, Modal, Space } from 'antd'
import steps from 'antd/es/steps'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { SignUp } from './auth';
import { FirebaseSetup } from '../components/installationPage/FirebaseSetup';
import { UserSetup } from '../components/installationPage/UserSetup';
import { CredentialCards } from '../components/settings/CredentialCards';
import { PlatformSetup } from '../components/installationPage/PlatformSetup';
import { redirect, useNavigate } from 'react-router-dom';
const { Step } = Steps;

const url = "http://localhost:3000/api"
export const InstallationPage = () => {
    
    const [currentStep, setCurrentStep] = useState(0);
    const next = () => setCurrentStep(currentStep + 1);
    const prev = () => setCurrentStep(currentStep - 1);
    
    const navigate = useNavigate()

    
    useEffect(()=>{
        const checkConfig=async()=>{
            await axios.get(`${url}/credentials/check`)
        }
        checkConfig()
    },[])

    // const handleCredentialRead = (file:any, serviceName:any) => {
    //         setFileToUpload(file);
    //         setServiceName(serviceName);

    //         // Read and parse JSON file before submitting
    //         const reader = new FileReader();
    //         reader.onload = (e:any) => {
    //             try {
    //                 const json = JSON.parse(e.target.result);
    //                 setParsedFirebase(json);
    //                 console.log("Parsed JSON:", json);
    //                 message.success("JSON file parsed successfully. Ready to upload.");
                   
    //             } catch (error) {
    //                 message.error("Invalid JSON file. Please check the file content.");
    //             }
    //         };
    //         reader.readAsText(file);
    //         // Prevent default upload behavior
    //         return false; 
    // };

    
    

    const steps = [
        {
            title: 'Firebase Setup',
            content: (
                <FirebaseSetup 
                    next={next} 
                    currentStep={currentStep} 

                />
            )
        },
        {
            title: 'User Setup',
            content: (<UserSetup next={next}/>),
        },
        {
            title: 'Platform Setup',
            content: (<PlatformSetup/>),
        },
    ];

    const proceedDone = async()=>{
        try {
            const response = await axios.get(`${url}/credentials/check/config`);
            if (response.data.status) {
                
                message.success('Processing complete!');
                navigate('/'); // Perform the redirection
            } else {
                message.error('Installation setup not completed!');
            }
          } catch (error) {
            message.error('An error occurred while checking the configuration.');
            console.error(error);
          }
    }
    
    return (
        <>
            <div style={{ padding: '24px' }}>
                <h1 style={{textAlign:"center",marginBottom:36}}>Installation</h1>

                <Steps current={currentStep}>
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>

                <div className="steps-content">{steps[currentStep].content}</div>

                <div className="steps-action" style={{ marginTop: 24 }}>
                    {currentStep > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                            Previous
                        </Button>
                    )}
                    {currentStep < steps.length - 1  && (
                        <Button type="primary" onClick={() => next()}>
                            Next
                        </Button>
                    )}
                    {currentStep < steps.length - 1 && currentStep!==0 && (
                        <Button type="primary" onClick={() => next()}>
                            Next
                        </Button>
                    )}
                    {currentStep === steps.length - 1 && (
                        <Button type="primary" onClick={proceedDone}>
                            Done
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
}

