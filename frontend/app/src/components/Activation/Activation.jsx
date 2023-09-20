// ActivationComplete.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ActivationComplete = () => {
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            axios
                .get(`http://localhost:8000/api/auth/activation/?id=${id}`)
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
        <div>
            <h2>Активация выполнена!</h2>
            { }
        </div>
    );
};

export default ActivationComplete;