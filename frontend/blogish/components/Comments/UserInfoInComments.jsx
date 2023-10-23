import React from 'react';
import Image from 'next/image';
import Microservices from '../../api/Microservices';

const UserInfoInComments = ({ username, avatar }) => {
    return (
        <div className="comment-item__user">
            {avatar ? (
                <Image
                    src={Microservices.Users.slice(0, -1) + avatar}
                    className="profile-mini__img"
                    width={45}
                    height={45}
                    alt="avatar author"
                />
            ) : (
                <Image
                    className="profile-mini__img"
                    src="/images/miniprofile.jpg"
                    alt="profile"
                    width={45}
                    height={45}
                />
            )}

            <p className="comment-item__username">{username}</p>
        </div>
    );
};

export default UserInfoInComments;
