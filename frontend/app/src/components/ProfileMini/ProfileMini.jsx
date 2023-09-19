import React, { useState } from 'react';
import profileMini from '../../images/miniprofile.jpg';
import './ProfileMini.css';
import LogoutModal from './LogoutModal'; // Импортируйте компонент модального окна

const ProfileMini = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleBodyClick = () => {
    closeLogoutModal();
  };

  return (
    <>
      <p className="profile-mini__name">Владимир Желнов</p>
      <div className="profile-mini__img-container">
        <img
          className="profile-mini__img"
          src={profileMini}
          alt="profile"
          onClick={openLogoutModal} // Добавьте обработчик клика
        />
        {isLogoutModalOpen && (
          <div
            className="logout-modal"
            // Предотвращаем закрытие при клике внутри модального окна
          >
            <LogoutModal onClose={closeLogoutModal} onClick={(e) => e.stopPropagation()} />
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileMini;