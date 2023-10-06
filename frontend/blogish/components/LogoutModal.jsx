'use client';

// import { useDispatch, useSelector } from 'react-redux';
// import { removeData } from '../redux/features/userSlice';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
// import fetchJson from '../session/fetchJson';
import useUser from '../session/useUser';

const LogoutModal = ({onCloseTrigger}) => {
    // const user = useSelector((state) => state.global.data.user);
    // const dispatch = useDispatch();
    const {user} = useUser();
    // const { push } = useRouter();
    const handleLogout = () => {
        axios
            .request({
                url: "/api/logout",
                method: 'GET'
            })
            .then((response) => {
            })
            .catch(function (error) {

            });

        // const _ = await fetchJson("/api/logout", {
        // 	method: "GET",
        // 	headers: { "Content-Type": "application/json" }
        // });
        // dispatch(removeData());
        // onCloseTrigger();
        // Router.push("/");
    };

    return (
        <div>
            <Link href={`/user/${user.id}-${user.slug}`} className="profile-mini-text-elements">
                <Image src="/images/user-03.svg" width={24} height={24} alt="user profile"/>
                Мой профиль
            </Link>
            <Link href={`/user/settings/${user.id}-${user.slug}`} className="profile-mini-text-elements">
                <Image src="/images/shield-02.svg" width={24} height={24} alt="settings"/>
                Настройки
            </Link>
            <Link href="#" className="profile-mini-text-elements" onClick={handleLogout}>
                <Image src="/images/log-out-01.svg" width={24} height={24} alt="logout"/>
                Выйти
            </Link>
        </div>
    );
};

export default LogoutModal;
