import LogoutModal from './LogoutModal';
import Image from 'next/image';
import useOutsideAlerter from '../hooks/useOutsideAlerter';
import { useSelector } from 'react-redux';
import Microservices from '../api/Microservices';
import { useState } from 'react';
import { useEffect } from 'react';

const ProfileMini = () => {
    const user = useSelector((state) => state.user.value);

    const [userAvatar, setUserAvatar] = useState(user.avatar);
    const [userName, setUsername] = useState(user.username);

    const { ref, isShow, setIsShow } = useOutsideAlerter(false);

    const toggleLogoutModal = () => {
        setIsShow(!isShow);
    };

    useEffect(() => {
        setUserAvatar(user.avatar);
        setUsername(user.username);
    }, [user.avatar, user.username]);

    return (
        <div className="profile-mini" onClick={toggleLogoutModal}>
            {/*<p className="profile-mini__name">{user ? user.username : ''}</p>*/}
            <p className="profile-mini__name">{userName}</p>
            <div className="profile-mini__img-container">
                <Image
                    className="profile-mini__img"
                    src={
                        userAvatar.startsWith("http://localhost:8080")
                            ? userAvatar
                            : (Microservices.Users.slice(0, -1)) + userAvatar
                    }
                    alt="profile"
                    width={45}
                    height={45}
                    unoptimized
                />
                {isShow && (
                    <div ref={ref} className="logout-modal">
                        <LogoutModal
                            user={user}
                            onCloseTrigger={toggleLogoutModal}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};


export default ProfileMini;
