import {useState, useEffect, useRef} from 'react';
import Link from 'next/link';
import UserRequests from '../api/requests/Users';
import UsersStruct from '../api/struct/Users';
import SubscribesStruct from '../api/struct/Subscribes';
import NoPage from './Nopage';
import SubscribersRequests from '../api/requests/Subscribers';
import Microservices from '../api/Microservices';
import {differenceInDays, differenceInYears, format} from "date-fns";
import {useSelector, useDispatch} from 'react-redux';
import Subscribing from './Subcribing';
import ProfileLenta from './ProfileLenta';
import {setUser, setAvatar} from '../redux/slices/userSlice';
import fetchJson from '../session/fetchJson';
import Endpoints from '../api/Endpoints';
import Select from "react-select";


const Profile = (props) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const token = useSelector((state) => state.token.value);
    const {userInfo} = props;
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

    const [username, setUsername] = useState(userInfo.username);
    const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false);
    const [isUsernameEditing, setIsUsernameEditing] = useState(false);

    const joinDate = new Date(currentUserDate);
    const daysSinceJoin = differenceInDays(new Date(), joinDate);
    const yearsSinceJoin = differenceInYears(new Date(), joinDate);

    const [isRoleEditing, setIsRoleEditing] = useState(false);
    const [isRoleEditable, setIsRoleEditable] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const selectRef = useRef();

    const ROLE_OPTIONS = {
        "Модератор": () => setUserDataToServer({is_staff: true, is_active: true}),
        "Пользователь": () => setUserDataToServer({is_staff: false, is_active: true}),
        "Забанен": () => setUserDataToServer({is_staff: false, is_active: false}),
    };

    const handleAvatarChange = async (event) => {
        event.preventDefault();
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            console.log('Выбран файл:', selectedFile);
            try {
                const formData = new FormData();
                formData.append('avatar', selectedFile);
                const response = await fetchJson(Microservices.Users + Endpoints.Users.Patch + userId + '/', {
                    method: "PATCH",
                    headers: {'Authorization': 'Bearer ' + token.access},
                    body: formData
                });
                //UserRequests.patchAvatar(userId, formData, token.access, (success, response) => {
                //    if (success) {
                setIsAvatarFormVisible(false);
                console.debug('uploaded');

                const avatarURL = response.data.avatar;

                setUserPage({...userPage, avatar: avatarURL});
                dispatch(setAvatar(avatarURL));

                //    } else {
                //        console.error('Ошибка при загрузке аватара', response);
                //        //alert('Ошибка при загрузке аватара: ' + response);
                //    }
                //});
            } catch (error) {
                console.error('Ошибка при загрузке аватара', error);
                //alert('Ошибка при загрузке аватара: ' + response);
            }
        }
    };

    const AvatarUploadModal = () => {
        return (
            <div className="avatar-upload-modal" onClick={() => inputFileRef.current.click()}>
                <input ref={inputFileRef} style={{display: 'none'}} type="file" accept="image/*"
                       onChange={handleAvatarChange}/>
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

    const handleStatusBlur = async () => {
        const user_id = userPage.id;
        const formData = new FormData();
        formData.append('status', status);
        const statusResponse = await fetchJson(Microservices.Users + Endpoints.Users.Patch + user_id + '/', {
            method: "PATCH",
            headers: {'Authorization': 'Bearer ' + token.access},
            body: formData
        });
        setIsStatusEditing(false);
        const updatedStatus = statusResponse.data.status;
        setUserPage({...userPage, status: updatedStatus});
        //dispatch(setUsername(updatedUsername));
    };

    const handleStatusKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleStatusBlur();
        }
    };


    const openUsernameModal = () => {
        setUsername(userPage.username);
        setIsUsernameModalVisible(true);
        setIsUsernameEditing(true);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleUsernameBlur = async () => {
        const user_id = userPage.id;
        const formData = new FormData();
        formData.append('username', username);
        const usernameResponse = await fetchJson(Microservices.Users + Endpoints.Users.Patch + user_id + '/', {
            method: "PATCH",
            headers: {'Authorization': 'Bearer ' + token.access},
            body: formData
        });
        setIsUsernameEditing(false);
        console.log("usernameResponse ", usernameResponse)
        console.log("response.data ", usernameResponse.data)
        const updatedUsername = usernameResponse.data.username;
        console.log(updatedUsername)
        setUserPage({...userPage, username: updatedUsername});
        console.log("setUsername", setUsername)
        //dispatch(setUsername(updatedUsername));
    };


    const handleUsernameKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleUsernameBlur();
        }
    };

    const getUserStatus = (user) => {
        if (user.is_superuser) return "Админ";
        if (user.is_staff) return "Модератор";
        if (!user.is_active) return "Забанен";
        return "Пользователь";
    };

    const handleRoleChange = async (selectedOption) => {
        setSelectedRole(selectedOption);
        const selectedRole = selectedOption.value;
        if (ROLE_OPTIONS[selectedRole]) {
            await ROLE_OPTIONS[selectedRole]();
        }
        setIsRoleEditable(false);
    };

    const getAllowedRoles = (user, userPage) => {
        if (!user || !userPage || userPage.is_superuser) return [];
        if (user.is_superuser) return ["Модератор", "Забанен", "Пользователь"];
        if (user.is_staff && user.id !== userPage.id && !userPage.is_staff) return ["Пользователь", "Забанен"];
        return [];
    };

    const options = getAllowedRoles(user, userPage).map(role => ({value: role, label: role}));

    const canEditRoles = (user, userPage) => {
        if (!user || userPage.is_superuser) return false;
        if (user.is_superuser && user.id !== userPage.id) return true;
        return user.is_staff && user.id !== userPage.id && !userPage.is_staff;
    };

    const setUserDataToServer = async (data) => {
        const user_id = userPage.id;
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const response = await fetchJson(Microservices.Users + Endpoints.Users.Patch + user_id + '/', {
            method: "PATCH",
            headers: {'Authorization': 'Bearer ' + token.access},
            body: formData
        });

        setUserPage(prevUserData => ({...prevUserData, ...data}));

        setIsRoleEditing(false);
    };

    useEffect(() => {
        if (isRoleEditing) {
            setIsRoleEditable(true);
        }
    }, [isRoleEditing]);

    useEffect(() => {
        if (selectRef.current) {
            selectRef.current.focus();
        }
    }, []);

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
                            {user && userPage && user.id === userPage.id ? (
                                <div className="profile-avatar" style={{position: 'relative'}}>
                                    <img
                                        src={
                                            userPage.avatar.startsWith("http://localhost:8080")
                                                ? userPage.avatar
                                                : (Microservices.Users.slice(0, -1)) + userPage.avatar
                                        }
                                        alt="avatar"
                                    />
                                    {/* Невидимая кнопка */}
                                    <button className="invisible-avatar-button"
                                            onClick={() => inputFileRef.current?.click()}/>
                                    {/* Модальное окно */}
                                    <AvatarUploadModal
                                        visible={isAvatarFormVisible}
                                        handleFileChange={handleAvatarChange}
                                        handleUpload={uploadAvatar}
                                    />
                                    <p className="profile-rating">+890973</p>
                                    <p>Рейтинг</p>
                                </div>
                            ) : (
                                <div className="profile-avatar">
                                    <img
                                        src={
                                            userPage.avatar.startsWith("http://localhost:8080")
                                                ? userPage.avatar
                                                : (Microservices.Users.slice(0, -1)) + userPage.avatar
                                        }
                                        alt="avatar"
                                    />
                                    <p className="profile-rating">+890973</p>
                                    <p>Рейтинг</p>
                                </div>
                            )}
                            <div className="profile-info">

                                {user && userPage && user.id === userPage.id ? (
                                    isUsernameEditing ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={handleUsernameChange}
                                                onBlur={handleUsernameBlur}
                                                onKeyDown={handleUsernameKeyDown}
                                                className="input-profile-username"
                                                ref={(input) => input && input.focus()}
                                            />
                                        </div>
                                    ) : (
                                        <div className="div-profile-username" onClick={openUsernameModal}>
                                            <h1>{userPage.username}</h1>
                                        </div>
                                    )
                                ) : (
                                    <div className="div-profile-username">
                                        <h1>{userPage.username}</h1>
                                    </div>
                                )}


                                {/* <p>userId: { userId }, userSlug: { userSlug }</p> */}
                                {canEditRoles(user, userPage) && isRoleEditable ? (
                                    <div onBlur={() => {
                                        setIsRoleEditing(false);
                                        setIsRoleEditable(false);
                                    }}>
                                        <Select
                                            ref={selectRef}
                                            defaultValue={options.find(option => option.value === getUserStatus(userPage))}
                                            onChange={handleRoleChange}
                                            options={options}
                                            isSearchable={false}
                                            autoFocus
                                            menuIsOpen={true}
                                        />
                                    </div>
                                ) : (
                                    <p className="profile-group"
                                       onClick={() => canEditRoles(user, userPage) && setIsRoleEditing(true)}>
                                        {getUserStatus(userPage)}
                                    </p>
                                )}

                                {user && userPage && user.id === userPage.id ? (
                                    isStatusEditing ? (
                                        <div>
                                            <input type="text"
                                                   value={status}
                                                   onChange={handleStatusChange}
                                                   onBlur={handleStatusBlur}
                                                   onKeyDown={handleStatusKeyDown}
                                                   className="input-profile-status"
                                                   ref={(input) => input && input.focus()}/>
                                        </div>
                                    ) : (
                                        <div className="div-profile-status" onClick={openStatusModal}>
                                            <p>{userPage.status === '' ? 'Поделитесь мыслями с миром' : userPage.status}</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="div-profile-status">
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
                                с {format(joinDate, 'dd.MM.yy')} - {yearsSinceJoin} years {' '}
                                {daysSinceJoin} days
                            </p>

                        </div>
                    </div>
                    <ProfileLenta posts={props.results} categories={props.resultsCat}/>
                </>
            ) : (
                <NoPage/>
            )}
        </>
    );
};

export default Profile;
