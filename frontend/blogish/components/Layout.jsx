import { useState } from 'react';
import Header from './Header.jsx';
import Wrapper from './Wrapper.jsx';

const Layout = () => {
  const [active, setActive] = useState(false);

  const handleClosePopup = () => {
    setActive(!active);
  };

  return (
    <>
      <Header active={active} handleClosePopup={handleClosePopup} />
      <Wrapper />
    </>
  );
};

export default Layout;
