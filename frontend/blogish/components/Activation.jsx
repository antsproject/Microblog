// ActivationComplete.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivationComplete = ({ token }) => {
    const [activationMessage, setActivationMessage] = useState(null);

    useEffect(() => {
        if (token) {
            axios
                .get(`http://localhost:8080/api/auth/activation/?token=${token}`)
                .then((response) => {
                    if (response.status === 200) {
                        setActivationMessage('Активация выполнена!');
                    } else {
                        setActivationMessage('Ошибка активации, попробуйте позднее');
                    }
                })
                .catch((error) => {
                    setActivationMessage('Ошибка активации, попробуйте позднее');
                    console.error('Ошибка активации', error);
                });
        }
    }, [token]);

    return (
        <div className="form-container">
            <h2 className="registration-confirm__title">{activationMessage}</h2>
        </div>
    );
};

export default ActivationComplete;