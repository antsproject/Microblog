import React from 'react';
import Image from 'next/image';

const UserInfoInComments = ({ username }) => {
    return (
        <div className="comment-item__user">
            <Image
                className="profile-mini__img"
                src="/images/miniprofile.jpg"
                alt="profile"
                width={45}
                height={45}
            />
            <p className="comment-item__username">{username}</p>
        </div>
    );
};

export default UserInfoInComments;
