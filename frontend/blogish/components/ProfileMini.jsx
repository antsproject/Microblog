import React, { useState } from 'react';
import profileMini from '../images/miniprofile.jpg';
import LogoutModal from './LogoutModal';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import useOutsideAlerter from '../hooks/useOutsideAlerter';

const ProfileMini = () => {
    const user = useSelector((state) => state.global.data.user);
    // const user = undefined;
    console.log(user);
    const { ref, isShow, setIsShow } = useOutsideAlerter(false);

    const toggleLogoutModal = () => {
        setIsShow(!isShow);
    };

    return (
        <div className="profile-mini" onClick={toggleLogoutModal}>
            <p className="profile-mini__name">{user ? user.username : ''}</p>
            <div className="profile-mini__img-container">
                <Image
                    className="profile-mini__img"
                    src="/images/miniprofile.jpg"
                    alt="profile"
                    width={45}
                    height={45}
                />
                {isShow && (
                    <div ref={ref} className="logout-modal">
                        <LogoutModal
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
