import React, { useState } from 'react';
import LogoutModal from './LogoutModal';
import Image from 'next/image';

import useOutsideAlerter from '../hooks/useOutsideAlerter';

const ProfileMini = () => {

import useUser from '../session/useUser';
import useEvents from '../session/useEvents';

const ProfileMini = ({ }) => {
    // const user = useSelector((state) => state.global.data.user);
    const { user } = useUser({});
    const { events } = useEvents(user);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
    const { ref, isShow, setIsShow } = useOutsideAlerter(false);
  

    const toggleLogoutModal = () => {
                setIsShow(!isShow);

    };

    return (
        <div className="profile-mini" onClick={toggleLogoutModal}>
            <p className="profile-mini__name">{ user.username }</p>
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
