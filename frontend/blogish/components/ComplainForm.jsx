import Image from "next/image"
import { useState, useEffect } from "react";
import ComplainRequests from "../api/requests/Complain";
import ComplainStruct from "../api/struct/Complain";
import { useSelector } from 'react-redux';

export default function ComplainSend({ windowComplain, post_id }) {
    const [complains, setComplains] = useState(null);
    const user = useSelector((state) => state.user.value);

    useEffect(() => {
        let query = ComplainStruct.get;

        ComplainRequests.get(query, function (success, response) {
            if (success) {
                setComplains(response.data.results);
            }
        })
    }, [])

    async function onSubmit(event) {
        alert('Жалоба была отправлена');
        windowComplain();
        event.preventDefault();

        const checkboxed = document.querySelectorAll('.complain-form input[type="checkbox"]');
        const selectedComplains = Array.from(checkboxed)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);

        let query = ComplainStruct.create
        query.email = user.email
        query.user_id = user.id
        query.post_id = post_id
        query.complain_types = selectedComplains

        ComplainRequests.create(query, function (success, response) {
            if (success) {
                console.log('Done!');
            }
        })

    }
    return (
        <>
            <div className="auth-shadow">
                <div className="complain-form">
                    <div className="form-content">
                        <form className="form" onSubmit={onSubmit} >
                            <h1 className="form-title">Пожаловаться</h1>
                            {complains ? (
                                <>
                                    {complains.map((complain) => (
                                        <div key={complain.id} className="complain-field">
                                            <input type="checkbox" value={complain.id} />

                                            <label className="checkbox-field">
                                                {complain.type}
                                            </label>
                                        </div>))}

                                </>) : ('')}
                            <button className="btn-red btn-cmp" type="submit">
                                Отправить
                            </button>
                        </form>
                    </div>
                    <p onClick={windowComplain} className="auth-close">
                        <Image src="/images/close.svg" width={19} height={19} alt="close" />
                    </p>
                </div>
            </div>
        </>
    )
}