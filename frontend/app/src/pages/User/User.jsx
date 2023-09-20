import './User.css'
import { ReactComponent as Avatar } from './images/avatar.svg'
import { ReactComponent as PlusButton } from './images/plus.svg'
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const User = () => {

    let user_id = null
    if(localStorage.getItem('accessToken')) {
       user_id = localStorage.getItem('userId')
    }

    const [users, setUser] = useState([])
    const [subscribers, setSub] = useState('')

    useEffect(() => {
    if (user_id) {
        axios.get(`http://localhost:8080/api/users/${user_id}`)
        .then(response => {
            setUser(response.data)
            })
            .catch(err =>{
            console.log(err, 'error')
            });

        axios.get(`http://localhost:8080/api/subscriptions/from/${user_id}`)
        .then(response => {
            setSub(response.data.count)
            })
            .catch(err =>{
            console.log(err, 'error')
            });
            }
        }, [user_id]);


    return <>
    <div className="whitebox profile-main">
        <div className="profile-columns">
            <div className="profile-avatar">
                <img src={`http://localhost:8080/${users.avatar}`}/>
                <p className="profile-rating">+890973</p>
                <p>Рейтинг</p>
            </div>
            <div className="profile-info">
                <h1>{users.username}</h1>
                <p className="profile-group">Редактор</p>
                <p className="profile-status">{users.status}</p>
            </div>
            <div className="profile-subscribe">
            {/* deactivate */}
                <a className="btn-red" href="#"><PlusButton /> Подписаться</a>
                <div className="profile-subscribe__stats">
                    <span>{subscribers}</span> подписчиков
                </div>
            </div>
        </div>
        <div className="profile-controls">
            <div className="profile-filters">
                <a href="#">Статьи</a>
                <a href="#">Комментарии</a>
            </div>
            <p>На проекте с {users.date_joined}</p>
        </div>
    </div>
    <div className="profile-posts__controls">
        <a href="#">Популярное</a>
        <a href="#" className="active">Свежее</a>
    </div>
    </>;
};

export default User;