// src/api/apiServices.js
import { message } from 'antd';
import axios from 'axios';
import { getFirebaseAuth } from '../firebase';
import { Navigate, useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:3000/api';

export const getUser = async() =>{
    const auth = await getFirebaseAuth()
    return auth?.currentUser
}   
export const getURL= () =>{
    return BASE_URL
}   


export const fetchAccounts = async() =>{
    const user = await getUser()
    const response = await axios.post(`${BASE_URL}/accounts/`,
        {uid:user.uid},
        { headers: {  "Content-Type": "application/json"},}
    );
    return response.data.data
}


//Pages/account
export const refreshToken = async (accountId,provider) => {
  try {
    
      const response = await fetch(`${BASE_URL}/cloud/${provider}/refresh-token`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ accountId }), // Pass the accountId to refresh
      });

      const result = await response.json();

      if (result.status) {
          console.log("Token refreshed successfully:", result);
          message.success("Token refreshed successfully.");
      } else {
          console.error("Token refresh failed:", result.message);
          message.error("Token refresh failed. See console for details.");
      }

      return result;
  } catch (error) {
      console.error("Error refreshing token:", error);
      message.error("Error refreshing token. See console for details.");
  }
};

export const refreshTokens = async (accounts,provider,refreshList) => {
    try {
        const user = await getUser()

        let accountsToRefresh = accounts.filter((acc) => acc.provider === "google");
        if (accountsToRefresh?.length === 0) {
            message.warning(`No ${provider} accounts found to refresh.`);
            return;
        }
        const response = await fetch(`${BASE_URL}/cloud/${provider}/refresh-tokens`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId:user.uid }), // Pass specific account IDs or omit for all accounts
            // body: JSON.stringify({ accountIds }), // Pass specific account IDs or omit for all accounts
        });

        const result = await response.json();
        if (result?.errors?.length) {
            message.warning(`${result.errors.length} accounts failed to refresh.`);
        }
        if (result.status) {
            console.log("Token refresh results:", result);
            message.success(`Token refreshed for account: ${result.message}`);
        } else {
            console.error("Token refresh failed:", result.message);
            message.error("Token refresh failed. See console for details.");
        }
        refreshList()
        return result;
    } catch (error) {
        console.error("Error in refreshGoogleTokens:", error);
        message.error("Error refreshing tokens. See console for details.");
    }
};

export const generateAuthLink = async (provider) => {
    const user = await getUser()
    const response = await axios.post(
        `${BASE_URL}/auth/link?provider=${provider}`, 
        { uid:user.uid },
        { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data.authUrl;
};


export const deleteAccount = async (account,provider,refreshList) => {
    try {
        const response = await fetch(`${BASE_URL}/cloud/${provider}/revoke`, {
            method: 'DELETE', 
            body: JSON.stringify({ accountId: account._id }), 
            headers: { "Content-Type" : "application/json" },
        });

        const result = await response.json(); 
        if (!response.ok) throw new Error(result.message || "Failed to revoke account.");
        message.success(`Account ${account.email} has been deleted.`);
        
        refreshList(); 
        
    } catch (error:any) {
        console.log(`Failed to delete account: ${error.message}`);
        message.error(`Failed to delete account: ${error.message}`);
        
        refreshList();
    }
};

//Set Account status and visibility
export const toggleAccountStatus = async (accountId: any, refreshList: any) => {
    try {
        const user = await getUser()
        const response = await axios.put(`${BASE_URL}/accounts/set-status`,{uid:user.uid,id:accountId});
        if(response.data.status)
            message.success(response.data.message)
        else
            message.error(response.data.message)

        refreshList()
    } catch (error:any) {
        message.error(`Failed to change account status: ${error.message}`);
    }
};

export const toggleAccountVisibility = async (accountId: any, refreshList: any) => {
    try {
        const user = await getUser()
        const response = await axios.put(`${BASE_URL}/accounts/set-visibility`,{uid:user.uid,id:accountId});
        if(response.data.status)
            message.success(response.data.message)
        else
            message.error(response.data.message)

        refreshList()
    } catch (error:any) {
        message.error(`Failed to change account visibility: ${error.message}`);
    }
};



export const resetPlatform =async(email,navigate)=>{
   
    try {
        const user = await getUser()
        const response = await axios.post(`${BASE_URL}/cloud/reset`, { email,uid:user.uid});
        message.success(response.data.message || "Project data reset successfully.");
        navigate('/')
    } catch (error:any) {
        message.info(error.message);
    }
}