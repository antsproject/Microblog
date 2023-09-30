import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header.jsx';
import Link from "next/link";
import Image from "next/image";
import { setUserAndToken } from '../redux/features/userSlice.js';

export default function Layout({ children, user, token }) {
    // const userState = useSelector((state) => state.global.data.user);
    // const userToken = useSelector((state) => state.global.data.token);
    const [active, setActive] = useState(false);
    const dispatch = useDispatch();

    const handleClosePopup = () => {
        setActive(!active);
    };

    useEffect(() => {
        // console.debug("Layout useEffect() ", user, token, userState, userToken);
        dispatch(setUserAndToken({ 'user': user, 'token': token }));
        user = null;
        token = null;
        // dispatch(setUser(user));
        // dispatch(setToken(token));
    });

    return (
        <>
            <Header active={active} handleClosePopup={handleClosePopup} />
            <div className="wrapper">
                <div className="container-wrapper">
                    <div className="wrapper-left">
                        <Link href="/popular" className="wrapper-left__link hovered">
                            <Image src="/images/rocket-02.svg" width={24} height={24} alt='' /> Популярное
                        </Link>
                        <Link href="/new" className="wrapper-left__link">
                            <Image src="/images/clock.svg" width={24} height={24} alt='' /> Свежее
                        </Link>
                        <Link href="/subscriptions" className="wrapper-left__link">
                            <Image src="/images/zap-fast.svg" width={24} height={24} alt='' /> Подписки
                        </Link>
                        <Link href="/favorite" className="wrapper-left__link">
                            <Image src="/images/bookmark-check.svg" width={24} height={24} alt='' /> Избранное
                        </Link>
                        <div className="wrapper-left__bottom">
                            <Link href="#">Заказать рекламу</Link>
                            <Link href="#">О проекте</Link>
                            <Link href="#">Вакансии</Link>
                        </div>
                    </div>
                    <div className="wrapper-center">
                        {children}
                    </div>
                    <div className="wrapper-right">
                        <Image src="/images/adv.svg" width={210} height={800} alt='adv' />
                    </div>
                </div>
            </div>
        </>
    );
};
