import React from 'react';
import profileMini from '../../images/miniprofile.jpg';
import './ProfileMini.css';
const ProfileMini = () => {
  return (
    <>
      {/* <div className="profile-mini"> */}
      <p className="profile-mini__name">Владимир Желнов</p>
      <img className="profile-mini__img" src={profileMini} alt="profile" />
      {/* </div> */}
    </>
  );
};

export default ProfileMini;
