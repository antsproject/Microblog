import { React, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import User from './pages/User/User.jsx';
import Layout from './pages/Layout/Layout.jsx';
import Home from './pages/Home/Home.jsx';
import Nopage from './pages/Nopage.jsx';
// import { paths } from './paths/paths.js';
import Storage from './api/storage/Storage';
import Activation from './components/Activation/Activation';
// import { setToken } from './features/tokenSlice.js';
import './App.css';
import CreatePost from './components/CreatePost/CreatePost.jsx';
import { setToken, setUser } from './features/userSlice.js';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (Storage.getToken()) {
      dispatch(setToken(Storage.getToken()));
      dispatch(setUser(Storage.getUser()));
    }
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<Home />} />
          <Route path="*" element={<Nopage />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/user/:userInfo" element={<User />} />
          <Route path="/activation" element={<Activation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
