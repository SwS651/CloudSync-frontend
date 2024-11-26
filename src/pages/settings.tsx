import { EditOutlined, EllipsisOutlined, FileTextOutlined, GoogleCircleFilled, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Flex, Row, Switch, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { Configuration } from '../components/settings/Configuration';
import {CredentialCards} from '../components/settings/CredentialCards';
import AdvancedTab from '../components/settings/AdvancedTab';
import { getFirebaseAuth } from '../firebase';
import axios from 'axios';
import ProfileTab from '../components/settings/ProfileTab';
const {TabPane} = Tabs
export const SettingsPage = () => {
    // const [loading, setLoading] = useState<boolean>(true);
    const [permission, setPermission] = useState<boolean>(false);
    // // const [loading, setLoading] = useState<boolean>(true);
    // const [permission, setPermission] = useState<boolean>(false);
    const userHasAdminRights = async ()=>{
        const auth = await getFirebaseAuth()
        const user = auth.currentUser;
        console.log(user?.uid)
        const response = await axios.post('http://localhost:3000/api/credentials/platformConfig',{uid:user?.uid})
        if(response.data.status)
            setPermission(true)
        else
            setPermission(false)
    };
    useEffect( ()=>{
        userHasAdminRights()
    },[])
   
    return (
        <>
        <h1>
            Settings page
        </h1>
        
        <Tabs defaultActiveKey="1">
            <TabPane tab="Profile" key="1">
                <ProfileTab />
            </TabPane>
            <TabPane tab="Credentials" key="2">
                <CredentialCards permission={permission} setPermission={setPermission} />
            </TabPane>
            <TabPane tab="Advanced" key="3">
                <AdvancedTab  permission={permission}/>
            </TabPane>
        </Tabs>
        </>
    )
}


// const actions: React.ReactNode[] = [
//     <EditOutlined key="edit" />,
//     <SettingOutlined key="setting" />,
//     <EllipsisOutlined key="ellipsis" />,
// ];
