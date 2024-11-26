import { FileOutlined, FolderOpenFilled } from '@ant-design/icons';
import { Col, Drawer, Flex, Row, Space } from 'antd'
import React, { useState } from 'react'

export const useDrawer = () => {
    const [visible, setVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const showDrawer = (file) => {
        setSelectedFile(file);
        setVisible(true);
    };

    const closeDrawer = () => {
        setVisible(false);
    };

    return { visible, selectedFile, showDrawer, closeDrawer };
};

export const FileMetaDrawer = ({visible ,closeDrawer, selectedFile }) => {

    return (
        <Drawer
            title={`${selectedFile?.name}`}
            placement="right"
            onClose={closeDrawer}
            visible={visible}
            width={300}
        >
            {selectedFile && (
                <>
                      <Row gutter={6} style={{marginBottom:"24px"}}>
                          <Col  className="gutter-row" >
                              <Flex justify='center' align='center'>

                                  {selectedFile.type.includes('folder')?
                                  <FolderOpenFilled style={{fontSize:"3.5em",textAlign:"center"}}/>
                                  :<FileOutlined/>}
                              </Flex>
                          </Col>
                        
                      </Row>
                      <Row gutter={6} style={{marginBottom:"24px"}}>
                          <Col  className="gutter-row"><b>File Name:</b></Col>
                          <Col className="gutter-row">{selectedFile.name}</Col>
                      </Row>
                      <Row gutter={12} style={{marginBottom:"24px"}}>
                          <Col className="gutter-row"><b>Created Time:</b></Col>
                          <Col className="gutter-row">{selectedFile.createdTime}</Col>
                      </Row>
                      <Row gutter={12} style={{marginBottom:"24px"}}>
                          <Col className="gutter-row"><b>Created Time:</b></Col>
                          <Col className="gutter-row">{selectedFile.modifiedTime}</Col>
                      </Row>
                      <Row gutter={6} style={{marginBottom:"24px"}}>
                          <Col  className="gutter-row"><b>Type:</b></Col>
                          <Col className="gutter-row">{selectedFile.type}</Col>
                      </Row>
                      <Row gutter={6} style={{marginBottom:"24px"}}>
                          <Col  className="gutter-row"><b>Source:</b></Col>
                          <Col className="gutter-row">{selectedFile.source}</Col>
                      </Row>

                
                </>
            )}
        </Drawer>
    )
}

