import { useState } from 'react';
import Header from '../../components/Header/Header';

const Layout = () => {
  const [active, setActive] = useState(false);
  const handleClosePopup = () => {
    setActive(!active);
  };
  return (
    <>
      <Header active={active} handleClosePopup={handleClosePopup} />
    </>
  );
};

export default Layout;
