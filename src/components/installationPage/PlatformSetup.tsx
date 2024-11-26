import React, { useState } from 'react'
import { CredentialCards } from '../settings/CredentialCards'
import { Button, Card, CollapseProps, Form, Input, message } from 'antd';
import { Collapse } from 'antd';

export const PlatformSetup = () => {
    

    const [permission, setPermission] = useState<boolean>(false);
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: ('Cloud Drive Credential'),
            children: (
                <>
                    <CredentialCards permission={permission} setPermission={setPermission}/>
                </>
            ),
        }
    ];
    return (
        <>
            <Collapse items={items} defaultActiveKey={['1']} style={{margin:"45px 0"}}/>;
        </>
    )
}


