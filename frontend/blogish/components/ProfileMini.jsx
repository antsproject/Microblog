import React, { useState } from 'react';
import profileMini from '../images/miniprofile.jpg';
import LogoutModal from './LogoutModal';
import Image from 'next/image';
// import { useSelector } from 'react-redux';

const ProfileMini = () => {
  // const user = useSelector((state) => state.global.data.user);
  const user = undefined;

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const toggleLogoutModal = () => {
    setIsLogoutModalOpen(isLogoutModalOpen ? false : true);
  };

  return (
    <div className="profile-mini" onClick={toggleLogoutModal}>
      <p className="profile-mini__name">{user ? user.username : ''}</p>
      <div className="profile-mini__img-container">
        <Image className="profile-mini__img" src={profileMini} alt="profile" />
        {isLogoutModalOpen && (
          <div className="logout-modal">
            <LogoutModal onCloseTrigger={toggleLogoutModal} onClick={(e) => e.stopPropagation()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMini;
