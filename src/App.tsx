//React
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes  } from "react-router-dom";

//Refine
import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";
import routerBindings, {CatchAllNavigate,DocumentTitleHandler, UnsavedChangesNotifier} from "@refinedev/react-router-v6";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

//Ant Design
import { App as AntdApp, ConfigProvider,type ThemeConfig, Spin, theme, Layout} from "antd";
import { AuthPage, RefineThemes, ThemedLayoutV2, ThemedTitleV2, useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

//Resource
import {authProvider} from "./providers/authProvider";
import { dataProvider } from "./providers/data-provider";
import { resources } from "./config/resources";

//Pages
import { Login,ForgotPassword,SignUp, UpdatePassword } from "./pages";
import { Dashboard, AccountPage, OAuthSuccess, SettingsPage, InstallationPage } from "./pages";

//Components
import { CustomHeader } from "./components/CustomHeader";
import ThemeSettings from "./components/theme-settings";
import { ProfileProvider } from "./contexts/ProfileContext";
import { getURL } from "./utils/apiServices";

const baseURL = await getURL()
function App() {
    const [customTheme, setCustomTheme] = useState<ThemeConfig>({
        token: RefineThemes.Blue.token,
        algorithm:  theme.defaultAlgorithm|| theme.darkAlgorithm,
    });

    const [isConfigValid, setIsConfigValid] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);


 
    const checkConfiguration = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/api/credentials/check/config");
            console.log(response.data.status, response.data.remark);

            if (response.data.status) {
                setIsConfigValid(true);
            } else {
                setIsConfigValid(false);
            }
        } catch (error) {
            console.error("Error checking configuration:", error.message);
            setIsConfigValid(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initializeApp = async () => {
            console.log("Checking backend configuration...");
            await checkConfiguration();
        };
        initializeApp();
    }, []);



    if (loading) {
    // Display a loading state until the configuration check is complete
        return <Spin size="large" />;
    }



    return (
        <BrowserRouter>
            <ConfigProvider theme={customTheme}>
                <ThemeSettings
                    currentTheme={customTheme}
                    onThemeClick={(theme) => {
                        setCustomTheme(theme)
                        console.log("New Theme: ", theme); // Log to check if theme is passed correctly
                    }}
                />
                <RefineKbarProvider>
                    <ProfileProvider>
                    <AntdApp>  
                        <Refine
                            dataProvider={{
                                default: dataProvider(baseURL),
                                credentials:dataProvider(baseURL)
                            }}
                            notificationProvider={useNotificationProvider}
                            routerProvider={routerBindings}
                            authProvider={authProvider}
                            resources={resources}

                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                                useNewQueryKeys: true,
                                projectId: "1c0XY2-zqBYvi-KIvvni",
                            }}
                        >
                                
                            <Routes>
                            
                                {/* Redirect to Installation Page if config is not valid */}
                                {isConfigValid === true ? (
                                <>
                                    
                                    <Route path="/install" element={<Navigate to="/" />} />

                                    {/* <Route path="/install" element={<InstallationPage />} /> */}

                                    {/* Protecting Route */}
                                    <Route element={
                                        <Authenticated key="authenticated-layout" fallback={<Login />} redirectOnFail="/login">
                                            <ThemedLayoutV2  
                                                Title={(props) => (
                                                    <ThemedTitleV2 {...props} text="Cloud Sync" />
                                                )}

                                                Header={() => (
                                                    <CustomHeader/>
                                                )}

                                                Footer={() => (
                                                    <Layout.Footer
                                                        style={{
                                                        textAlign: "center",
                                                        // color: "#fff",
                                                        // backgroundColor: "#7dbcea",
                                                        }}
                                                    >
                                                        @2025 CloudSync Developed by XXX
                                                    </Layout.Footer>
                                                )}
                                            >
                                                <Outlet />
                                            </ThemedLayoutV2>
                                        </Authenticated>    
                                    }>
                                        
                                        <Route path="/" index element={<Dashboard />} />  
                                        <Route path="/accounts" element={<AccountPage /> } />
                                        <Route path="/update-password" element={<UpdatePassword />} />
                                        <Route path="/oauth-success" element={<OAuthSuccess />} />
                                        <Route path="/settings" element={<SettingsPage/>}/>
                                    </Route>

                                    <Route path="/forgot-password" element={<ForgotPassword/>} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<SignUp />} />
                                </>
                                
                             ):(
                                <>
                                    <Route path="/install" element={<InstallationPage />} />
                                    <Route path="/" element={<Navigate to="/install" />} />
                                </>
                            )} 

                                 {/* <Route
                                    element={
                                        <Authenticated key="catch-all">
                                        <ThemedLayoutV2>
                                            <Outlet />
                                        </ThemedLayoutV2>
                                        </Authenticated>
                                    }
                                    >
                                    <Route path="*" element={<ErrorComponent />} />
                                </Route>  */}

                                {/* Fallback Route */}
                                <Route
                                    element={
                                    <Authenticated
                                        key="fallback-authenticated"
                                        v3LegacyAuthProviderCompatible={true} // Add this if using a legacy auth provider
                                    >
                                        <ThemedLayoutV2>
                                        <Outlet />
                                        </ThemedLayoutV2>
                                    </Authenticated>
                                    }
                                >
                                    <Route path="*" element={<ErrorComponent />} />
                                </Route>

                            </Routes>
                            

                            <RefineKbar />
                            <UnsavedChangesNotifier />
                            <DocumentTitleHandler />
                        </Refine>
                    </AntdApp>
                    </ProfileProvider>
                </RefineKbarProvider>
            </ConfigProvider>
        </BrowserRouter>
    );
}

export default App;
