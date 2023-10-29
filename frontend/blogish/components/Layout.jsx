import {useState} from 'react';
import Header from './Header.jsx';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/router';
import advert from '../images/advert.jpg'
import {useDispatch, useSelector} from 'react-redux';
import {setCategories} from "../redux/slices/categorySlice";

export default function Layout({centerHeader, children}) {
    const [active, setActive] = useState(false);
    const [isCatVisible, setCatVisible] = useState(false);
    const router = useRouter();
    const categories = useSelector((state) => state.category.value)
    const [selectedCategory, setSelectedCategory] = useState(null);
    const dispatch = useDispatch();

    let user = useSelector((state) => state.user.value);

    if (user === null) {
        user = {is_superuser: false}
    }
    const handleClosePopup = () => {
        setActive(!active);
    };

    const toggleCategories = () => {
        setCatVisible(!isCatVisible);
    };

    const handleCategoryClick = (categoryName) => {
        dispatch(setCategories(categoryName));
    };

    return (
        <>
            <Header active={active} handleClosePopup={handleClosePopup}/>
            <div className="wrapper">
                <div className="container-wrapper">
                    <div className="wrapper-left">
                        <div className="wrapper-sticky">
                            <Link
                                href="/popular"
                                className={`wrapper-left__link ${router.pathname === '/popular' ? 'hovered' : ''
                                }`}
                            >
                                <Image src="/images/rocket-02.svg" width={24} height={24} alt=""/>{' '}
                                Популярное
                            </Link>
                            <Link
                                href="/new"
                                className={`wrapper-left__link ${router.pathname === '/new' ? 'hovered' : ''
                                }`}
                            >
                                <Image src="/images/clock.svg" width={24} height={24} alt=""/>{' '}
                                Свежее
                            </Link>
                            <Link
                                href="/subscriptions"
                                className={`wrapper-left__link ${router.pathname === '/subscriptions' ? 'hovered' : ''
                                }`}
                            >
                                <Image src="/images/zap-fast.svg" width={24} height={24} alt=""/>{' '}
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
                                />
                                Избранное
                            </Link>
                            <div>
                                <div
                                    className="cursor-pointer wrapper-left__link"
                                    onClick={toggleCategories}
                                >
                                    <Image src="/images/globe-06.svg" width={24} height={24} alt=""/>
                                    Категории
                                </div>
                                {isCatVisible && (
                                    categories.map((category, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleCategoryClick(category.name)}
                                            className={`cursor-pointer wrapper-left__link ${category.name === selectedCategory ? 'active' : ''}`}
                                        >
                                            {category.name}
                                        </div>
                                    ))
                                )}
                            </div>
                            {user.is_superuser && (
                                <Link
                                    href="/complains"
                                    className={`wrapper-left__link ${router.pathname === '/complains' ? 'hovered' : ''
                                    }`}
                                >
                                    <Image src="/images/clock.svg" width={24} height={24} alt=""/>{''}
                                    Жалобы
                                </Link>
                            )}

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
                            <Image src={advert} width={210} height={835} alt="advert" priority/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
