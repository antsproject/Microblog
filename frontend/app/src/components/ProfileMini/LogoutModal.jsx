import React from "react";
import User from '../../images/user-03.svg';
import Shield from '../../images/shield-02.svg';
import Logout from '../../images/log-out-01.svg';

const LogoutModal = ({ onClose }) => {
  const handleLogout = () => {
    // Добавьте здесь логику для выхода пользователя
    // Например, вызов функции для разлогинивания пользователя
    // Или перенаправление на страницу выхода

    // Закройте модальное окно после выполнения операции
    onClose();
  };

  return (
    <div>
      <a href="#" className="profile-mini-text-elements" onClick={handleLogout}>
      <img src={User}/>Мой Профиль</a >
      <a href="#" className="profile-mini-text-elements" onClick={handleLogout}>
      <img src={Shield}/>Настройки</a >
      <a href="#" className="profile-mini-text-elements" onClick={handleLogout}>
      <img src={Logout}/>Выйти</a >
      <a href="#" className="profile-mini-text-elements" onClick={onClose}>X</a >
    </div>
  );
};

export default LogoutModal;