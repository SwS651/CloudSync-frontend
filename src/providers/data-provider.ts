import { DataProvider, useGetIdentity } from "@refinedev/core"
import {authProvider} from "./authProvider";
import { getAuth } from "firebase/auth";
// import { auth } from "../firebase";
import { getFirebaseAuth } from "../firebase";
// const auth = getAuth()
const API_URL = "http://localhost:3000/api"



//#################### These codes are not being used ####################//
export const dataProvider= (url:string):DataProvider =>({
    getOne: async ({ resource, id, meta }) => {
        const response = await fetch(`${API_URL}/${resource}/${id}`);
        if (response.status < 200 || response.status > 299) throw response;
        const data = await response.json();

        return { data };
    },

    update:async ({ resource, id, variables }) => {
        try{
            let url = `${API_URL}/${resource}/${id}/${variables}`;
            console.log("refine: ",url)
            //Specific handling for account status updates
            if (resource === "accounts") {
                url = `${API_URL}/${resource}/${id}/${variables}`;
            }else if(resource ==="googledrive"){
                url = `${API_URL}/auth/${resource}/${id}/${variables}`
            }
            const response = await fetch(url, {
                method: "PUT",
                // body: JSON.stringify(variables),
                headers: {
                "Content-Type": "application/json",
                },
            });

            if (response.status < 200 || response.status > 299) throw response;
            const data = await response.json();

            return { success:data?.success,message:data?.message };
        } catch (error:any) {
            console.error(`Failed to update ${resource} with ID: ${id}`, error.message);
            throw new Error(`Failed to update ${resource}`);
        }
    },

    getList: async ({ resource,pagination,filters }) => {
        const auth = await getFirebaseAuth()
        const user = auth.currentUser;
        
        // const url = `${API_URL}/v1/${resource}?uid=${user?.uid}`;
        const url = `${API_URL}/${resource}`;
        
        try {
            const response = await fetch(url,{
                method: "POST",
                body:JSON.stringify({
                    userID:user?.uid,
                    pagination,
                    filters,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            return {
                data:data,
                total: data.total
            };

        } catch (error) {
            console.error(`Error fetching ${resource}: ${error}`);
            return {
                data: [],
                total: 0,
            };
        }
    },

    create:async({ resource, variables }) => {
        // throw new Error("Not implemented")
        const response = await fetch(`${API_URL}/${resource}`, {
            method: "POST",
            body: JSON.stringify(variables),
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (response.status < 200 || response.status > 299) throw response;
      
          const data = await response.json();
      
          return { data };
    },

    deleteOne:() => {
        throw new Error("Not implemented")
    },

    getApiUrl: () => API_URL

    // Optional methods:
    // getMany: () => { /* ... */ },
    // createMany: () => { /* ... */ },
    // deleteMany: () => { /* ... */ },
    // updateMany: () => { /* ... */ },
    // custom: () => { /* ... */ },

})