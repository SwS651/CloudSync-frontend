import { Breadcrumb, Button, Col, Flex, Radio, RadioChangeEvent, Row, Table, Tabs } from 'antd';
import React, { useState } from 'react'
import { ListTable } from './ListTable';
import { ArrowLeftOutlined, InsertRowAboveOutlined, InsertRowLeftOutlined } from '@ant-design/icons';

type TabPosition = 'left' | 'right' | 'top' | 'bottom';
const {TabPane} = Tabs


export const FilesTab = ({
    driveData,filesData,
    showDrawer,
    handleCardClick,activeTab,
    fetchFilesInFolder,
    navigateBack,currentPath,
    handleDownload, handleDelete,
    uploadedFile, //boolean
    cartItems,
    setCartItems,
    handleAddToCart
}

) => {

    
    const [mode,setMode] = useState<TabPosition>('top')

    const handleModeChange = (e:RadioChangeEvent) =>{
        setMode(e.target.value)
    }

    // const [activeTab, setActiveTab ] = useState(0);

    return (
        <>

            <Radio.Group onChange={handleModeChange} value={mode} style={{ marginBottom: 8 }}>
                <Radio.Button value="top"><InsertRowAboveOutlined /></Radio.Button>
                <Radio.Button value="left"><InsertRowLeftOutlined /></Radio.Button>
            </Radio.Group>

            <Tabs
                activeKey={activeTab}
                tabPosition={mode}
                // style={{height:"auto"}}
                onChange={(key) => handleCardClick(key)}

                items={driveData.map((drive, index) => {

                    return {
                        label: `${drive.email}`,
                        key: drive.id,
                        // disabled: i === 28,
                        children: (
                            <>
                                {currentPath.length > 0 && (
                                    //GO back button
                                    <Button type='primary' onClick={navigateBack} style={{ marginBottom: 16 ,marginRight:12}}>
                                        <ArrowLeftOutlined />
                                    </Button>
                                )}
                            
                                {filesData[index] && filesData[index].length > 0 ? (
                                    <ListTable
                                        files={filesData[index]} // Only pass if filesData exists
                                        showDrawer={showDrawer}
                                        aid={drive.id}
                                        fetchFilesInFolder={fetchFilesInFolder}
                                        handleDownload={handleDownload}
                                        handleDelete={handleDelete}
                                        uploadedFile={uploadedFile}
                                        cartItems={cartItems}
                                        setCartItems={setCartItems}
                                        handleAddToCart={handleAddToCart}
                                    />
                                ) : (
                                    <Flex align='center' justify='center'>
                                        No files available for this drive.
                                    </Flex>
                                )}
                            </>
                        ),
                    };
                })}
            />
        </>
    )
}



