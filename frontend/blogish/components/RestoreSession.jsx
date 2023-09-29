'use client'

import { useDispatch } from "react-redux";
import Storage from "../api/storage/Storage";
import { setUser, setToken } from "../redux/features/userSlice";

export default function RestoreSession() {
    const dispatch = useDispatch();
    dispatch(setToken(Storage.getToken()));
    dispatch(setUser(Storage.getUser()));
}
