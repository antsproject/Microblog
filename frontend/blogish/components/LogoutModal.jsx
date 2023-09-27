// import React from "react";
// import User from '../images/user-03.svg';
// import Shield from '../images/shield-02.svg';
// import Logout from '../images/log-out-01.svg';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import Storage from '../api/storage/Storage';
import { setToken, setUser } from '../redux/features/userSlice';

const LogoutModal = ({ onCloseTrigger }) => {
  const dispatch = useDispatch();
  const user = Storage.getUser();

  const handleLogout = () => {
    Storage.logout();
    dispatch(setToken(''));
    dispatch(setUser({}));
    onCloseTrigger();
  };

  return (
    <div>
      <Link href={`/user/${user.id}-${user.slug}`} className="profile-mini-text-elements">
        <Image src="/images/user-03.svg" width={24} height={24} alt="user profile" />
        Мой профиль
      </Link>
      <Link href="/settings" className="profile-mini-text-elements">
        <Image src="/images/shield-02.svg" width={24} height={24} alt="settings" />
        Настройки
      </Link>
      <Link href="#" className="profile-mini-text-elements" onClick={handleLogout}>
        <Image src="/images/log-out-01.svg" width={24} height={24} alt="logout" />
        Выйти
      </Link>
    </div>
  );
};

export default LogoutModal;
