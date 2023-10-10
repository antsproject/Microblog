'use client';

import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';
import { useDispatch } from 'react-redux';

const LogoutModal = ({ onCloseTrigger }) => {
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();

    const handleLogout = () => {
        axios.request({
            url: "/api/logout",
            method: 'GET'
        })
            .then((response) => {
                dispatch(setUser(null));
            })
            .catch(function (error) {
            });
    };

    return (
        <div>
            <Link href={`/user/${user ? user.id : ''}-${user ? user.slug : ''}`} className="profile-mini-text-elements">
                <Image src="/images/user-03.svg" width={24} height={24} alt="user profile" />
                Мой профиль
            </Link>
            <Link href={`/user/settings/${user ? user.id : ''}-${user ? user.slug : ''}`} className="profile-mini-text-elements">
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
