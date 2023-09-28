import {useState} from 'react';
import Header from './Header.jsx';
import Link from "next/link";
import Image from "next/image";


export default function Layout({children}) {
    const [active, setActive] = useState(false);

    const handleClosePopup = () => {
        setActive(!active);
    };

    return (
        <>
            <Header active={active} handleClosePopup={handleClosePopup}/>
            <div className="wrapper">
                <div className="container-wrapper">
                    <div className="wrapper-left">
                        <Link href="/popular" className="wrapper-left__link hovered">
                            <Image src="/images/rocket-02.svg" width={24} height={24} alt=''/> Популярное
                        </Link>
                        <Link href="/new" className="wrapper-left__link">
                            <Image src="/images/clock.svg" width={24} height={24} alt=''/> Свежее
                        </Link>
                        <Link href="/subscriptions" className="wrapper-left__link">
                            <Image src="/images/zap-fast.svg" width={24} height={24} alt=''/> Подписки
                        </Link>
                        <Link href="/favorite" className="wrapper-left__link">
                            <Image src="/images/bookmark-check.svg" width={24} height={24} alt=''/> Избранное
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
                        <Image src="/images/adv.svg" width={210} height={800} alt='adv'/>
                    </div>
                </div>
            </div>
        </>
    );
};
