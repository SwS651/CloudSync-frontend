import React, { useState, useEffect, Children } from 'react';
import { List, Button, Modal, Radio, Space, Popconfirm, message, Spin, Card, Flex ,Typography, Collapse, Menu, Dropdown} from 'antd';
import { SyncOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, AppstoreOutlined, UnorderedListOutlined, GooglePlusCircleFilled, DropboxCircleFilled, SettingFilled, GoogleCircleFilled, GoogleOutlined, DropboxOutlined, DownOutlined, MoneyCollectFilled, KeyOutlined } from '@ant-design/icons';
import { BaseKey, useDataProvider, useList } from '@refinedev/core';
import { dataProvider } from "../../providers/data-provider";
import { AccountItem } from '../../components/account/AccountItem';
import { getFirebaseAuth } from '../../firebase';
import axios from 'axios';
import { fetchAccounts, generateAuthLink, refreshToken, refreshTokens } from '../../utils/apiServices';

// const {Text} = Typography
// const auth = await getFirebaseAuth()
// const url ='http://localhost:3000/api'

        

export const AccountPage = () => {

  
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // default is list view
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const handlefetchAccounts = async() =>{
        setLoading(true);
        try {
            const response = await fetchAccounts()
            setAccounts(response);
        } catch (error) {
            console.error("Failed to fetch accounts:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        handlefetchAccounts()
    },[])
   
    // Function to switch between list and grid view
    const toggleView = () => {
        setViewMode(viewMode === 'list' ? 'grid' : 'list');
    };

    // // Handle authorization
    // const handleAuthorize =  async (provider: string) => {
    //     try {
    //         let fullURL = ''
    //         if(provider==='googledrive')
    //             fullURL= `${url}/auth/googledrive/authorise`
    //         else if(provider==='dropbox')
    //             fullURL= `${url}/auth/dropbox/authorise`

    //         let response = await axios.post(
    //             fullURL,
    //             { userId: auth?.currentUser?.uid },
    //             { headers: { 'Content-Type': 'application/json' } }
    //         );
    
    //         let authUrl = response.data.authUrl.toString();
    //         console.log(authUrl)
    //         const width = 500;
    //         const height = 600;
    //         const left = window.screen.width / 2 - width / 2;
    //         const top = window.screen.height / 2 - height / 2;
    
    //         const authWindow = window.open(
    //             authUrl,
    //             `${provider} OAuth`,
    //             `width=${width},height=${height},top=${top},left=${left}`
    //         );
    
    //         const messageHandler = (event: MessageEvent) => {
    //             if (event.origin !== window.location.origin) return;
    //             const { status, message } = event.data;
    //             if (status === 'success') {
    //                 console.log('Authorization successful:', message);
    //                 handlefetchAccounts();
    //                 setIsModalVisible(false);
    //             } else {
    //                 console.error('Authorization failed:', message);
    //             }
    //         };
    
    //         window.addEventListener('message', messageHandler);
    
    //         const pollTimer = window.setInterval(() => {
    //             if (authWindow && authWindow.closed) {
    //                 window.clearInterval(pollTimer);
    //                 window.removeEventListener('message', messageHandler);
    //                 console.log('Popup closed');
    //                 setIsModalVisible(false);
    //             }
    //         }, 1000);
    //     } catch (error) {
    //         console.error('Error during authorization:', error);
    //     }
    // };



    
    const handleTokensRefresh = async (provider) => {
        setLoading(true);
        await refreshTokens(accounts,provider,handlefetchAccounts);
        handlefetchAccounts()
        setLoading(false);
    };


    const handleSingleTokenRefresh = async(account,provider) => {
        setLoading(true);

        const result = await refreshToken(account._id,provider);
        if (result?.status) {
            message.success(`Token refreshed for account: ${account.email}`);
        } else {
            message.error(`Failed to refresh token for account: ${account.email}`);
        }
        
        handlefetchAccounts()
        setLoading(false);
    };




    //New Connection
    const handleAddAccount = async (provider) => {
        try {
          
            // Fetch the authorization link from the backend
            const authUrl = await generateAuthLink(provider);
             // Open the OAuth flow in a popup
            const popup = window.open(authUrl, "_blank", "width=500,height=600");


            // Add an event listener for the message from the popup
            const messageHandler = (event: MessageEvent) => {
                if (event.origin !== window.location.origin) return;
                const { status, message } = event.data;
                if (status === 'success') {
                    console.log('Authorization successful:', message);
                    message.success('Authorization successful:', message);
                    handlefetchAccounts();
                    setIsModalVisible(false);
                } else {
                    console.error('Authorization failed:', message);
                    message.error(`Authorization failed:, ${message}`);
                }
            };
            window.addEventListener("message", messageHandler);

            // Handle timeout if popup doesn't respond in time
            const timeout = window.setInterval(() => {
                if (popup && popup.closed){
                    window.clearInterval(timeout);
                    window.removeEventListener("message", messageHandler);
                   
                }
                
            }, 5000); // Timeout after 5 seconds

        } catch (error) {
            console.error("Error adding account:", error);
        }
    };



    // If data is still loading, show loading spinner
    if (loading) {
        return <><p>Loading accounts...</p><Spin /></>;
    }


    async function handleMenuClick(e) {
  
        switch (e.key) {
            case "refreshGoogleToken":
                await handleTokensRefresh('googledrive')
                break;
            case "refreshDropboxToken":
                await handleTokensRefresh('dropbox')
                break;
            case "addGoogle":
                await  handleAddAccount("google")
                break;
            case "addDropbox":
                await  handleAddAccount('dropbox')
                break;
            default:
                message.warning('Unknown action');
        }
    }
    
    const refreshMenu = (
        
        <Menu onClick={handleMenuClick}>
            {/* Refresh token */}
            <Menu.Item key="refreshGoogleToken">
                <GoogleOutlined  style={{marginRight:'10px'}}/>
                Google Accounts
            </Menu.Item>
    
            <Menu.Item key="refreshDropboxToken">
                <DropboxOutlined style={{marginRight:'10px'}}/>
                Dropbox Accounts
            </Menu.Item>
        </Menu>
    );
    const AddAccountMenu = (
            
        <Menu onClick={handleMenuClick}>
            {/* Refresh token */}
            <Menu.Item key="addGoogle">
                <GoogleOutlined  style={{marginRight:'10px'}}/>
                Google Account
            </Menu.Item>
    
            <Menu.Item key="addDropbox">
                <DropboxOutlined style={{marginRight:'10px'}}/>
                Dropbox Account
            </Menu.Item>
        </Menu>
    );

    return (
        <div>
            
            <h2>Accounts</h2>
            
         
            <Flex align='center' justify='space-between'>

                <Space style={{ marginBottom: 16 }}>

                    <Dropdown overlay={AddAccountMenu} trigger={['contextMenu','click']}>
                        <Button type='primary' ghost><PlusOutlined/> Connection</Button>
                    </Dropdown>
                    <Dropdown  overlay={refreshMenu} trigger={['contextMenu','click']}>
                        <Button type='primary' ghost><KeyOutlined />Refresh Token  <DownOutlined /></Button>
                    </Dropdown>
                    <Button onClick={()=>{handlefetchAccounts()}}><ReloadOutlined/></Button>
                </Space>
                <Space style={{ marginBottom: 16 }} direction='horizontal'>
                    
                    <Button 
                        icon={viewMode === 'list' ?  <AppstoreOutlined /> : <UnorderedListOutlined />}
                        onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                        style={{textAlign:'right'}}
                        
                    >
                        View
                    </Button>
                </Space>
            </Flex>
           
           

           
            {/* Accounts List */}
            {loading ? <Spin /> : (
                <List
                    grid={viewMode === 'grid' ? {  xs: 1, sm: 1, md: 3, lg: 4 } : undefined}
                    itemLayout="horizontal"
                    dataSource={accounts || []}
                    renderItem={
                        (account:any) => (
                            <AccountItem 
                                key={account._id}
                                account={account}
                                viewMode={viewMode}                            
                                singleTokenRefresh = {handleSingleTokenRefresh} 
                            />
                        )
                    }
                />
            )}
        
        </div>
    )
}



