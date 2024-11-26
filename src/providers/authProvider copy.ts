// import { AuthProvider } from "@refinedev/core";
// import { signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged, User, GoogleAuthProvider, linkWithCredential, EmailAuthProvider, updatePassword, fetchSignInMethodsForEmail, createUserWithEmailAndPassword, linkWithPopup, reauthenticateWithPopup, reauthenticateWithCredential } from "firebase/auth";
// import { auth, googleProvider } from "../firebase";

// import { v4 as uuidv4 } from "uuid";
// import { message } from "antd";

// const generateRandomPassword = () => {
//     return Math.random().toString(36).slice(-8); // Generate a simple random password
// };

// import { getAuth } from "firebase/auth";
// export const authProvider: AuthProvider = {
//     login: async ({ email, password, providerName ,isSignUp = false}) => {
//         try {
//             // if (providerName === "google") {
//             //     const result = await signInWithPopup(auth, googleProvider);
//             //     const user = result.user;
//             //     if(user){

//             //         const signInMethods = await fetchSignInMethodsForEmail(auth, user.email!);
                    
//             //         if (signInMethods.length > 0 && !signInMethods.includes("google.com")) {
//             //             // If the email already exists with email/password, link the Google account
//             //             const emailCredential = EmailAuthProvider.credential(user.email!, password || "");
//             //             await linkWithCredential(user, emailCredential);
//             //         }
                    
//             //         // If this is the first time signing in with Google, generate a random password
//             //         console.log(`creationTime ${user.metadata.creationTime} === lastSignInTime ${user.metadata.lastSignInTime}`)
//             //         if (user.metadata.creationTime === user.metadata.lastSignInTime) {
//             //             const generatedPassword = uuidv4();
//             //             await updatePassword(user, generatedPassword);
//             //             // console.log("Generated password for Google user:", generatedPassword);
                       
//             //             // const { setPassword } = useContext(PasswordContext);
//             //             // setPassword(generatedPassword);
                        
//             //             return {
//             //                 success: true,
//             //                 redirectTo: "/update-password", // Redirect to update password page
                            
//             //             };

                        
//             //         }          
                

//             //         return {
//             //             success: true,
//             //             redirectTo: "/",
//             //         };
//             //     } 
               
//             // }
//             if (providerName === "google") {
//                 const gauth = getAuth()
//                 const result = await signInWithPopup(gauth, googleProvider);
//                 const user = result.user;
//                 if(user){

//                     const signInMethods = await fetchSignInMethodsForEmail(auth, user.email!);
                    
//                     if (signInMethods.length > 0 && !signInMethods.includes("google.com")) {
//                         // If the email already exists with email/password, link the Google account
//                         const emailCredential = EmailAuthProvider.credential(user.email!, password || "");
//                         await linkWithCredential(user, emailCredential);
//                     }
                    
//                     // If this is the first time signing in with Google, generate a random password
//                     console.log(`creationTime ${user.metadata.creationTime} === lastSignInTime ${user.metadata.lastSignInTime}`)
//                     if (user.metadata.creationTime === user.metadata.lastSignInTime) {
//                         const generatedPassword = uuidv4();
//                         await updatePassword(user, generatedPassword);
//                         // console.log("Generated password for Google user:", generatedPassword);
                       
//                         // const { setPassword } = useContext(PasswordContext);
//                         // setPassword(generatedPassword);
                        
//                         return {
//                             success: true,
//                             redirectTo: "/update-password", // Redirect to update password page
                            
//                         };

                        
//                     }          
                

//                     return {
//                         success: true,
//                         redirectTo: "/",
//                     };
//                 } 
               
//             }

//              if (email && password) {

//                 if (isSignUp) {
//                     // Handle email/password signup
//                     await createUserWithEmailAndPassword(auth, email, password);

//                 } else {
//                     // Handle email/password login
//                     await signInWithEmailAndPassword(auth, email, password);
//                 }
//                 return {
//                     success: true,
//                     redirectTo: "/",
//                 };
//             }

//             return {
//                 success: false,
//                 error: {
//                     message: "Login Error",
//                     name: "Invalid email or password",
//                 },
//             };
//         } catch (error: any) {
//             if (error.code === 'auth/account-exists-with-different-credential') {
//                 // Handle case where the user tries to sign in with a different provider
//                 return {
//                     success: false,
//                     error: {
//                         message: "Account exists with a different provider. Please use the correct sign-in method.",
//                         name: "Account Exists",
//                     },
//                 };
//             }

//             return {
//                 success: false,
//                 error: {
//                     message: error.message,
//                     name: "Login Error",
//                 },
//             };
//         }
//     },
    
    
//     logout: async () => {
//         try {
//             await signOut(auth);
//             return {
//                 success: true,
//                 redirectTo: "/login",
//             };
//         } catch (error: any) {
//             return {
//                 success: false,
//                 error: {
//                     message: error.message,
//                     name: "Logout Error",
//                 },
//             };
//         }
//     },

//     onError: async (error) => {
//         console.error(error);
//         return { error };
//     },

//     check: async () => {
//         return new Promise((resolve) => {
//             onAuthStateChanged(auth, (user) => {
//                 if (user) {
//                     resolve({
//                         authenticated: true,
//                     });
//                 } else {
//                     resolve({
//                         authenticated: false,
//                         redirectTo: "/login",
//                         error: {
//                             message: "Authentication required",
//                             name: "Unauthorized",
//                         },
//                     });
//                 }
//             });
//         });
//     },
//     getIdentity: async () => {
//         const user = auth.currentUser;

//         if (user) {
//             const { uid, displayName, email, photoURL } = user;
//             return {
//                 id: uid,
//                 name: displayName || email,
//                 email: email,
//                 avatar: photoURL,
//             };
//         }

//         return null;
//     },

//     getPermissions: async () => {
//         // You can implement role-based permissions here
//         return null;
//     },

//     updatePassword: async ({password,confirmPassword,currentPassword="",newPassword="",isGoogle=false})=>{
//         try {
//             const user = auth.currentUser as User;
//             if (isGoogle){
 
//                 if (user) {
//                     // Re-authenticate user with current password before updating
//                     // const credential = EmailAuthProvider.credential(user.email!, values.currentPassword);
//                     // await reauthenticateWithCredential(user, credential).then(()=>{
//                         const provider = new GoogleAuthProvider();
            
//                         // Re-authenticate the user with Google
//                         await reauthenticateWithPopup(user, provider);
//                         await updatePassword(user, confirmPassword)
//                     // });
                    
//                     return {
//                         success: true,
//                         message: "Password has been changed",
//                         name:'Updated Password',
//                         redirectTo: "/", // Redirect to update password page
//                     };
//                 }
//             }else{
//                 const credential = EmailAuthProvider.credential(user.email!, currentPassword);
//                 await reauthenticateWithCredential(user, credential);
//                 await updatePassword(user,newPassword)
//                 return {
//                     success: true,
//                     message: "Password has been changed",
//                     name:'Updated Password',
//                     redirectTo: "/", // Redirect to update password page
//                 };
//             }
//             return {
//                 success: false,
//                 error: {
//                     name: "Update Password Error",
//                     message: "Unable to update password",
//                   },
//             };

//         } catch (error:any) {
//             message.error(error.message || "Failed to update password.");
//             return {
//                 success: false,
//                 error: {
//                     name: "Update Password Error",
//                     message: error.message
//                   },
//             };
//         }
        
//     }
//     ,

//     forgotPassword: async ({ email }) => {
//         // You can handle the reset password process according to your needs.
    
//         // If the process is successful.
//         return {
//           success: true,
//         };
    
//         return {
//           success: false,
//           error: {
//             name: "Register Error",
//             message: "Invalid email",
//           },
//         };
//       },
//   };
  
