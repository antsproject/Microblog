import Link from 'next/link'
import Image from 'next/image';
import Lenta from './Lenta';
// import { ReactComponent as ClockImg } from '../images/clock.svg';
// import { ReactComponent as RocketImg } from '../images/rocket-02.svg';
// import { ReactComponent as ZapfastImg } from '../images/zap-fast.svg';
// import { ReactComponent as BookmarkImg } from '../images/bookmark-check.svg';
// import Adv from '../images/adv.svg';

const Wrapper = (component) => {
  return (
    <>
      <div className="wrapper">
        <div className="container-wrapper">
          <div className="wrapper-left">
            <Link href="/post" className="wrapper-left__link hovered">
              <Image src="./images/rocket-02.svg" width={40} height={40} /> Популярное
            </Link>
            <Link href="/user/1-zhelnov-vladimir" className="wrapper-left__link">
              <Image src="./images/clock.svg" width={40} height={40} /> Свежее
            </Link>
            <Link href="/subscriptions" className="wrapper-left__link">
              <Image src="./images/zap-fast.svg" width={40} height={40} /> Подписки
            </Link>
            <Link href="/favorite" className="wrapper-left__link">
              <Image src="./images/bookmark-check.svg" width={40} height={40} /> Избранное
            </Link>
            <div className="wrapper-left__bottom">
              <Link href="#">Заказать рекламу</Link>
              <Link href="#">О проекте</Link>
              <Link href="#">Вакансии</Link>
            </div>
          </div>
          <div className="wrapper-center">
            <Lenta/>
          </div>
          <div className="wrapper-right">
            <Image src="./images/adv.svg" width={250} height={40} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Wrapper;
