import { DashboardOutlined, ProjectOutlined, SettingOutlined, ShopOutlined } from "@ant-design/icons";
import { IResourceItem } from "@refinedev/core";

export const resources:IResourceItem[] = [
    /**
     * A resource in Refine performs these actions
     * list -> get all records [Read]
     * show -> get a single record (Read)
     * create -> create a record (create)
     * edit -> update a record (Update)
     * delete -> delete a record (Delete)
     * or Clone
     */
    {
        name:'dashboard',
        list:'/',
        meta:{
            label:'Dashboard',
            icon:<DashboardOutlined/>
        }
        
    },
    {
        name:'accounts',
        list:'/accounts',
        show:'/accounts/:id',
        create:'/accounts/new',
        edit:'/accounts/edit/:id',
        meta:{
            label:'Accounts',
            icon:<ShopOutlined/>
        }
    },
    {
        name:'settings',
        list:'/settings',
        // show:'/settings/:id',
        // create:'/settings/new',
        // edit:'/settings/edit/:id',
        meta:{
            label:'Settings',
            icon:<SettingOutlined/>
        }
    }
]