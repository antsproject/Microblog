// ActivationComplete.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Activation.css';
import axios from 'axios';
import bear from '../../images/bear.png';

const ActivationComplete = () => {
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            axios
                .get(`http://localhost:8080/api/auth/activation/?id=${id}`)
                .then((response) => {
                    if (response.status === 200) {
                        console.log('Активация выполнена!');
                    } else {
                        console.error('Ошибка активации');
                    }
                })
                .catch((error) => {
                    console.error('Ошибка активации', error);
                });
        }
    }, [id]);

    return (
        <div className="form-container">
            <div className="bear">
                <img src={bear} alt="Bear" />
            </div>
            <h2 className="registration-confirm__title">Письмо отправлено</h2>
        </div>
    );
};

export default ActivationComplete;