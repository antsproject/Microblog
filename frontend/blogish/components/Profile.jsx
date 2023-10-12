import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import UserRequests from '../api/requests/Users';
import UsersStruct from '../api/struct/Users';
import SubscribesStruct from '../api/struct/Subscribes';
import NoPage from './Nopage';
import SubscribersRequests from '../api/requests/Subscribers';
import Microservices from '../api/Microservices';
import { differenceInDays, differenceInYears, format } from "date-fns";
import { useSelector } from 'react-redux';
import Subscribing from './Subcribing';
import ProfileLenta from './ProfileLenta';

const Profile = (props) => {
    const user = useSelector((state) => state.user.value);
    const token = useSelector((state) => state.token.value);
    const { userInfo } = props;
    const userId = userInfo.userId;
    const userSlug = userInfo.userSlug;

    const [userPage, setUserPage] = useState(null);
    const [currentUserDate, setCurrentUserDate] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [isAvatarFormVisible, setIsAvatarFormVisible] = useState(false);
    const inputFileRef = useRef(null);

    const [status, setStatus] = useState(userInfo.status);
    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const [isStatusEditing, setIsStatusEditing] = useState(false);

    const [username, setUsername] = useState(userInfo.status);
    const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false);
    const [isUsernameEditing, setIsUsernameEditing] = useState(false);

    const joinDate = new Date(currentUserDate);
    const daysSinceJoin = differenceInDays(new Date(), joinDate);
    const yearsSinceJoin = differenceInYears(new Date(), joinDate);

    const handleAvatarChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            console.log('Выбран файл:', selectedFile);
            try {
                const formData = new FormData();
                formData.append('avatar', selectedFile);
                await UserRequests.patchAvatar(userId, formData, token.access, (success, response) => {
                    if (success) {
                        setIsAvatarFormVisible(false);
                        console.debug('uploaded');

                        const avatarURL = URL.createObjectURL(selectedFile);
                        setUserPage(prevState => {
                            return { ...prevState, avatar: avatarURL }
                        })
                    } else {
                        console.error('Ошибка при загрузке аватара', response);
                        alert('Ошибка при загрузке аватара: ' + response);
                    }
                });
            } catch (error) {
                console.error('Ошибка при загрузке аватара', error);
                alert('Ошибка при загрузке аватара: ' + response);
            }
        }
    };

    const AvatarUploadModal = () => {
        return (
            <div className="avatar-upload-modal" onClick={() => inputFileRef.current.click()}>
                <input ref={inputFileRef} style={{ display: 'none' }} type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
        );
    };

    const uploadAvatar = async (file) => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await UserRequests.patchAvatar(userId, formData, token.access, (success, response) => {
                if (success) {
                    console.debug('uploaded');
                } else {
                    console.error('Ошибка при загрузке аватара', response);
                }
            });
            setIsAvatarFormVisible(false);
        } catch (error) {
            console.error('Ошибка при загрузке аватара', error);
        }
    };


    const openStatusModal = () => {
        setStatus(userPage.status);
        setIsStatusModalVisible(true);
        setIsStatusEditing(true);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const handleStatusSubmit = () => {
        const user_id = userPage.id;
        UserRequests.patchStatus(user_id, status, token.access, (success, response) => {
            if (success) {
                console.debug('Status successfully updated');
                setIsStatusEditing(false);
                setUserPage(prevState => {
                    return { ...prevState, status: status }
                })
            } else {
                console.error('Error when updating status', response);
                alert('Error when updating status: ' + response);
            }
        });
    };


    const openUsernameModal = () => {
        setUsername(userPage.username);
        setIsUsernameModalVisible(true);
        setIsUsernameEditing(true);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleUsernameSubmit = () => {
        const user_id = userPage.id;
        UserRequests.patchUsername(user_id, username, token.access, (success, response) => {
            if (success) {
                console.debug('Username successfully updated');
                setIsUsernameEditing(false);
                setIsUsernameModalVisible(false);
                setUserPage(prevState => {
                    return { ...prevState, username: username }
                })
            } else {
                console.error('Error when updating username', response);
                alert('Error when updating username: ' + response);
            }
        });
    };


    useEffect(() => {
        let query = UsersStruct.get;
        query.userId = userId;
        query.userSlug = userSlug;
        UserRequests.get(query, function (success, response) {
            console.debug("UserRequests");
            if (success === true) {
                setUserPage(response.data);
                console.debug("Current User Data ", user);
                console.debug("Profile User Data ", userPage);
                console.debug("setCurrentUserDate()", response.data.date_joined);
                setCurrentUserDate(response.data.date_joined);
                query = SubscribesStruct.subscribing;
                query.subscriber = user.id;
                query.subscribed_to = userId
                SubscribersRequests.getStatusSubscribe(query, function (success, response) {
                    if (success === true) {
                        console.debug("getStatusSubscribe()");
                        setSubscribersInfo({
                            ...subscribersInfo,
                            is_subscribed: response.data.is_subscribed,
                            total_subscriptions: response.data.total_subscriptions,
                        });
                    }
                })
            }
        })
    }, []);

    return (
        <>
            {userPage ? (
                <>
                    <div className="whitebox profile-main">
                        <div className="profile-columns">
                            <div className="profile-avatar" style={{ position: 'relative' }}>
                                <img
                                    src={(userPage.avatar.startsWith('blob') ? '' : Microservices.Users.slice(0, -1)) + userPage.avatar}
                                    alt="avatar"
                                />

                                {/* Невидимая кнопка */}
                                <button className="invisible-avatar-button" onClick={() => inputFileRef.current?.click()} />

                                {/* Модальное окно */}
                                <AvatarUploadModal
                                    visible={isAvatarFormVisible}
                                    handleFileChange={handleAvatarChange}
                                    handleUpload={uploadAvatar}
                                />
                                <p className="profile-rating">+890973</p>
                                <p>Рейтинг</p>
                            </div>
                            <div className="profile-info">
                                {isUsernameEditing ? (
                                    <div>
                                        <input type="text" value={username} onChange={handleUsernameChange} />
                                        <button onClick={handleUsernameSubmit}>Submit</button>
                                    </div>
                                ) : (
                                    <div className="div-profile-username" onClick={openUsernameModal}>
                                        <h1>{userPage.username}</h1>
                                    </div>
                                )}


                                {/* <p>userId: { userId }, userSlug: { userSlug }</p> */}
                                <p className="profile-group">Редактор</p>
                                {isStatusEditing ? (
                                    <div>
                                        <input type="text" value={status} onChange={handleStatusChange} />
                                        <button onClick={handleStatusSubmit}>Submit</button>
                                    </div>
                                ) : (
                                    <div className="div-profile-status" onClick={openStatusModal}>
                                        <p>{userPage.status === '' ? 'Поделитесь мыслями с миром' : userPage.status}</p>
                                    </div>
                                )}
                            </div>
                            <div className="profile-subscribe">
                                {/* deactivate */}
                                <Subscribing
                                    user={user}
                                    toUserId={userPage.id}
                                    token={token}
                                    post={false}
                                />
                            </div>
                        </div>
                        <div className="profile-controls">
                            <div>
                                <Link href="#">Статьи</Link>
                                <Link href="#">Комментарии</Link>
                            </div>
                            <p>
                                На проекте
                                с {format(joinDate, 'dd.MM.yyyy')} - {yearsSinceJoin} years{' '}
                                {daysSinceJoin} days
                            </p>
                        </div>
                    </div>
                    <ProfileLenta posts={props.results} />
                </>
            ) : (
                <NoPage />
            )}
        </>
    );
};

export default Profile;
