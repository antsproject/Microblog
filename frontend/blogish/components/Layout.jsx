import { useState } from 'react';
import Header from './Header.jsx';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import advert from '../images/advert.jpg'

export default function Layout({ centerHeader, children }) {
    const [active, setActive] = useState(false);
    const router = useRouter();

    const handleClosePopup = () => {
        setActive(!active);
    };

    return (
        <>
            <Header active={active} handleClosePopup={handleClosePopup} />
            <div className="wrapper">
                <div className="container-wrapper">
                    <div className="wrapper-left">
                        <div className="wrapper-sticky">
                            <Link
                                href="/popular"
                                className={`wrapper-left__link ${router.pathname === '/popular' ? 'hovered' : ''
                                    }`}
                            >
                                <Image src="/images/rocket-02.svg" width={24} height={24} alt="" />{' '}
                                Популярное
                            </Link>
                            <Link
                                href="/new"
                                className={`wrapper-left__link ${router.pathname === '/new' ? 'hovered' : ''
                                    }`}
                            >
                                <Image src="/images/clock.svg" width={24} height={24} alt="" />{' '}
                                Свежее
                            </Link>
                            <Link
                                href="/subscriptions"
                                className={`wrapper-left__link ${router.pathname === '/subscriptions' ? 'hovered' : ''
                                    }`}
                            >
                                <Image src="/images/zap-fast.svg" width={24} height={24} alt="" />{' '}
                                Подписки
                            </Link>
                            <Link
                                href="/favorite"
                                className={`wrapper-left__link ${router.pathname === '/favorite' ? 'hovered' : ''
                                    }`}
                            >
                                <Image
                                    src="/images/bookmark-check.svg"
                                    width={24}
                                    height={24}
                                    alt=""
                                />{' '}
                                Избранное
                            </Link>
                            <div className="wrapper-left__bottom">
                                <Link href="#">Заказать рекламу</Link>
                                <Link href="#">О проекте</Link>
                                <Link href="#">Вакансии</Link>
                            </div>
                        </div>
                    </div>
                    <div className="wrapper-center">
                        {centerHeader}
                        {children}
                    </div>
                    <div className="wrapper-right">
                        <div className="wrapper-sticky">
                            <Image src={advert} width={210} height={835} alt="advert" priority />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
