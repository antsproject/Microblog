import React from 'react';
import './RegistrationConfirm.css';
const RegistrationConfirm = () => {
  return (
    <div className="registration-confirm">
      <div className="registration-confirm__content">
        <h2 className="registration-confirm__title">Письмо отправлено</h2>
        <p className="registration-confirm__text">
          Мы отправили письмо для подтверждения почтового адреса на
        </p>
      </div>
    </div>
  );
};

export default RegistrationConfirm;
