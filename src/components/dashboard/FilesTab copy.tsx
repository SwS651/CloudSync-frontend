// import { Breadcrumb, Button, Col, Radio, RadioChangeEvent, Row, Table, Tabs } from 'antd';
// import React, { useState } from 'react'
// import { ListTable } from './ListTable';

// type TabPosition = 'left' | 'right' | 'top' | 'bottom';
// const {TabPane} = Tabs


// export const FilesTab = ({driveData,filesData,showDrawer,fetchfolder,folderStack}) => {

    
//     const [mode,setMode] = useState<TabPosition>('top')

//     const handleModeChange = (e:RadioChangeEvent) =>{
//         setMode(e.target.value)
//     }

//     const [activeTab, setActiveTab ] = useState("0");

//     return (
//         <>

//             <Radio.Group onChange={handleModeChange} value={mode} style={{ marginBottom: 8 }}>
//                 <Radio.Button value="top">Horizontal</Radio.Button>
//                 <Radio.Button value="left">Vertical</Radio.Button>
//             </Radio.Group>

//             <Tabs
//                 // activeKey={activeTab}
//                 tabPosition={mode}
//                 // style={{height:"auto"}}
//                 onChange={(key) => setActiveTab(key)}

//                 items={driveData.map((drive, index) => {

//                     return {
//                         label: `${drive.email}`,
//                         key: drive.id,
//                         // disabled: i === 28,
//                         children: (
//                             <>
//                              <Row justify="space-between" style={{ marginBottom: 16 }}>
//                                 <Col>
//                                 <Breadcrumb>
//                                     <Breadcrumb.Item>
//                                         <Button
//                                             type="link"
//                                             onClick={() => fetchfolder(driveData[index].id, '', '', true)}
//                                             disabled={!(folderStack[driveData[index].id]?.length > 0)}
//                                         >
//                                             Back
//                                         </Button>
//                                     </Breadcrumb.Item>
//                                     <Breadcrumb.Item>
                                        
//                                             Root
                                        
//                                     </Breadcrumb.Item>
//                                     {/* Display the full path from the stack */}
//                                     {folderStack[driveData[index].id]?.map((folder, idx) => (
//                                         <Breadcrumb.Item key={idx}>
                                            
//                                                 {folder.name}
                                            
//                                         </Breadcrumb.Item>
//                                     ))}
//                                 </Breadcrumb>
//                                 </Col>
//                             </Row>
//                                 <ListTable files={filesData[index]} showDrawer={showDrawer} aid={drive.id} fetchFolder= {fetchfolder}/>
//                             </>
//                         ),
//                     };
//                 })}
//             />



//         </>
//     )
// }



// const useDrawer = () => {
//     const [visible, setVisible] = useState(false);
//     const [selectedFile, setSelectedFile] = useState(null);

//     const showDrawer = (file) => {
//         setSelectedFile(file);
//         setVisible(true);
//     };

//     const closeDrawer = () => {
//         setVisible(false);
//     };

//     return { visible, selectedFile, showDrawer, closeDrawer };
// };

