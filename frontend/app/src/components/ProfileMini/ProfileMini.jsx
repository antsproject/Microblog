import React, { useState } from 'react';
import profileMini from '../../images/miniprofile.jpg';
import LogoutModal from './LogoutModal';
import './ProfileMini.css';

const ProfileMini = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const toggleLogoutModal = () => {
    setIsLogoutModalOpen(isLogoutModalOpen ? false : true);
  };

  return (
    <div className='profile-mini' onClick={toggleLogoutModal}>
      <p className="profile-mini__name">Владимир Желнов</p>
      <div className="profile-mini__img-container">
        <img
          className="profile-mini__img"
          src={profileMini}
          alt="profile"
        />
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