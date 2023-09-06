import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import User from './pages/user';
import Layout from './pages/Layout/Layout';

import Home from './pages/home';
import Nopage from './pages/nopage';
import './App.css';
import { paths } from './paths/paths';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.home} element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={paths.user} element={<User />} />
          <Route path="*" element={<Nopage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
// class App extends React.Component {
//   render() {
//     return (
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Layout />}>
//             <Route index element={<Home />} />
//             <Route path="/user" element={<User />} />
//             <Route path="*" element={<Nopage />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     );
//   }
// }
// export default App;
