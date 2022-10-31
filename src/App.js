import { useState, useRef, useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Admin } from "./pages/Admin";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Register } from "./pages/Register";
import { UserPage } from "./pages/UserPage";
import { NotFound } from "./NotFound";
import { Layout } from "./Layout";
import './style/global.css'
import './style/reset.css'
import LoginProvider from "./context/LoginProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient()

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <LoginProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/:login" element={<UserPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </LoginProvider>
            {/* <ReactQueryDevtools/> */}
        </QueryClientProvider>
    )
}


export default App;
