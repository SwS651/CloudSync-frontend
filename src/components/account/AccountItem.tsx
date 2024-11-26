import Icon, { ApiFilled, CloseCircleFilled, CloudSyncOutlined, DeleteOutlined, DropboxOutlined, EyeInvisibleOutlined, EyeOutlined, GoogleOutlined, LockFilled, LockOutlined, MoreOutlined, SafetyCertificateFilled, SyncOutlined, UnlockFilled, UnlockOutlined } from '@ant-design/icons';
import { useUpdate } from '@refinedev/core';
import { Button, Card, Dropdown, Flex, List, Menu, message, Popconfirm, Radio, Tooltip, Typography } from 'antd';
import React, { useState } from 'react'


import { deleteAccount, getUser, toggleAccountStatus, toggleAccountVisibility } from '../../utils/apiServices';


const { Text } = Typography;
const url = 'http://localhost:3000/api'
const user = await getUser()
import {fetchAccounts}  from '../../utils/apiServices'

export const AccountItem =  ({ account,viewMode,singleTokenRefresh  }) => {

    const { mutate, isLoading } = useUpdate();
    
    async function handleMenuClick(e) {
        let provider = account.provider === 'google'?"googledrive":"dropbox"
        switch (e.key) {
            case "status":
                await toggleAccountStatus(account._id,fetchAccounts);
                break;
            case "visibility":
                await toggleAccountVisibility(account._id,fetchAccounts);
                break;
            case "refreshToken":
                singleTokenRefresh(account,provider)
                break;
            case "delete":
                await deleteAccount(account,provider,fetchAccounts);
                break;
            default:
                message.warning('Unknown action');
        }
    }


    const checkUser = (uid:string)=>{
        if(user?.uid === uid) return true
        
        return false
    }

    const menu = (
        checkUser(account.uid)?(
            <Menu onClick={handleMenuClick}>

                {/* Set Account to active or non active */}
                <Menu.Item key="status">
                    <Icon type="user" />
                    {account.isActive ? <LockOutlined style={{marginRight:'10px'}}/> :<UnlockOutlined style={{marginRight:'10px'}}/>}
                    {account.isActive ? "Set Inactive" :"Set Active"}
                </Menu.Item>
                
                {/* Set Account to visible or invisible */}
                <Menu.Item key="visibility">
                    {account.isPublic ?<EyeInvisibleOutlined style={{marginRight:'10px'}}/> : <EyeOutlined style={{marginRight:'10px'}}/>}
                    {account.isPublic ? "Set Private" : "Set Public"}
                </Menu.Item>

                {/* Refresh token */}
                <Menu.Item key="refreshToken">
                    <CloudSyncOutlined  style={{marginRight:'10px'}}/>
                    Refresh Token
                </Menu.Item>

                {/* Delete Account */}
                <Menu.Item key="delete">
                    <DeleteOutlined style={{marginRight:'10px'}}/>
                    Delete
                </Menu.Item>
            </Menu>):<></>
    );

    // Grid view
    const gridView = (
        <Card 
        
            title={[
                (account.provider === 'google' && <GoogleOutlined style={{ fontSize: '25px', marginRight:'10px' }} />),
                (account.provider === 'dropbox' && <DropboxOutlined style={{ fontSize: '25px', marginRight:'10px' }} />),
                <Text>{account.email}</Text>
            ]}
            
            actions={[
                // <Button
                //     onClick={refreshAccount}
                //     icon={<SyncOutlined />}
                //     disabled={!checkUser(account.uid)}
                // >
                //     Refresh
                // </Button>,
            ]}
        >
            <div style={{textAlign:'center'}}>
                <Tooltip title="Token">
                    <Text code>${account.token}</Text>
                </Tooltip>

                <div style={{marginTop:'20px'}}>

                    {account.isPublic ? (
                        <Tooltip title="Public">
                            <UnlockOutlined style={{ marginRight: '5px' }} />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Private">
                            <LockFilled style={{ marginRight: '5px' }} />
                        </Tooltip>
                    )}

                    {account.isActive ? (
                        <Tooltip title="Active">
                            <ApiFilled style={{ color: '#1677ff', marginRight: '5px' }} />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Inactive">
                            <ApiFilled style={{ color: 'red', marginRight: '5px' }} />
                        </Tooltip>
                    )}
                    {account.isAuthorized ? (
                        <Tooltip title="Authorised">
                            <SafetyCertificateFilled style={{ color: 'green', marginRight: '5px' }} />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Unauthorised">
                            <CloseCircleFilled style={{ color: 'red', marginRight: '5px' }} />
                        </Tooltip>
                    )}
                </div>
            </div>
        </Card>
    );

    

    const content = (


        <>
            <List.Item.Meta
                avatar={
                    account.provider==='google'?<GoogleOutlined style={{fontSize:'25px'}}/>:
                    account.provider==='dropbox'?<DropboxOutlined style={{fontSize:'25px'}}/>:null
                }
                
                title={account.email}
                description={
                    <Tooltip title="Token">
                        <Text code >${account.token}</Text>
                    </Tooltip>
                }
            />

                {account.isPublic ? 
                    <Tooltip title="Public"> <UnlockOutlined style={{marginRight:'5px'}}/> </Tooltip>
                    :
                    <Tooltip title="Private"> <LockFilled style={{marginRight:'5px'}}/> </Tooltip>
                }
                {account.isActive ? 
                    <Tooltip title="Active"><ApiFilled style={{color:'#1677ff',marginRight:'5px'}}/></Tooltip>
                    :
                    <Tooltip title="Inactive"><ApiFilled style={{color:'red',marginRight:'5px'}}/></Tooltip>
                }
                {account.isAuthorized ? 
                    <Tooltip title="Authorised"><SafetyCertificateFilled style={{color: 'green',marginRight:'5px'}} /></Tooltip>
                    :
                    <Tooltip title="Unauthorise"><CloseCircleFilled style={{color: 'red',marginRight:'5px'}} /> </Tooltip>
                }

        </>

    )

    return  (
        <Dropdown  overlay={menu} trigger={['contextMenu','click']}>
            {viewMode === 'list' ? <List.Item>{content}</List.Item> : gridView}
        </Dropdown>
    );
   
}
