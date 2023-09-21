// ActivationComplete.js
import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import './Activation.css';
import axios from 'axios';

const ActivationComplete = () => {
    const [searchParams] = useSearchParams();
    const [activationMessage, setActivationMessage] = useState(null);

    const actualToken = searchParams.get("token");

    useEffect(() => {
        if (actualToken) {
            axios
                .get(`http://localhost:8080/api/auth/activation/?token=${actualToken}`)
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
    }, [actualToken]);

    return (
        <div className="form-container">
            <h2 className="registration-confirm__title">{activationMessage}</h2>
        </div>
    );
};

export default ActivationComplete;