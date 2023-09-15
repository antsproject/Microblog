import { useState } from 'react';
import Header from '../../components/Header/Header';
import Wrapper from '../../components/Wrapper/Wrapper';

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
