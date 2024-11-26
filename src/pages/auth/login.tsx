import { AuthPage } from '@refinedev/antd'
import { Navigate } from 'react-router-dom';
import { getFirebaseAuth } from '../../firebase';

const auth = await getFirebaseAuth()

export const Login = () => {
    if(auth?.currentUser){
      return <Navigate to="/" replace />;
    }
    
    return (
        <AuthPage type="login" providers={[
            {
                name: "google",
                label: "Sign in with Google",
            },
        ]}/>
    )
}

