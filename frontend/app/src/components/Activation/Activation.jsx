// ActivationComplete.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Activation.css';
import axios from 'axios';

const ActivationComplete = () => {
    const { id } = useParams();
    const [activationMessage, setActivationMessage] = useState(null);

    useEffect(() => {
        if (id) {
            axios
                .get(`http://localhost:8080/api/auth/activation/?id=${id}`)
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
    }, [id]);

    return (
        <div className="form-container">
            <h2 className="registration-confirm__title">{activationMessage}</h2>
        </div>
    );
};

export default ActivationComplete;