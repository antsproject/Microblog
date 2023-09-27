import React from 'react';

const RegistrationConfirm = ({ email }) => {
  return (
    <div className="registration-confirm">
      <div className="registration-confirm__content">
        <h2 className="registration-confirm__title">Письмо отправлено</h2>
        <p className="registration-confirm__text">
          Мы отправили письмо для подтверждения почтового адреса на {email}
        </p>
      </div>
    </div>
  );
};

export default RegistrationConfirm;
