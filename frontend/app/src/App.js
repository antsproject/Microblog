import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/layout";
import User from "./pages/user";
import Home from "./pages/home";
import Nopage from "./pages/nopage";
import "./App.css"

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="user" element={<User />} />
                        <Route path="*" element={<Nopage />} />
                    </Route>
                </Routes>
            </BrowserRouter>)
    }
}
export default App;