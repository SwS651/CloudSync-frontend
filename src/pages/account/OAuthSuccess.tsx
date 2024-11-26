import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const OAuthSuccess: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const message = urlParams.get('message');

        // Send message to the parent window to close the popup and refresh accounts
        if (window.opener) {
            window.opener.postMessage(
                { status, message },
                window.location.origin
            );
            window.close();
        } else {
            if (status === 'success') {
                navigate('/'); 
            } else {
                console.error('OAuth failed:', message);
            }
        }
    }, [navigate]);

    return <div>Processing OAuth response...</div>;
};
