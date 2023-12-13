import React from "react";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
import { useDispatch } from "react-redux";

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    authService
      .logoutUser()
      .then(() => dispatch(logout()))
      .catch((err) =>
        console.log(`Error while logging out current user :: APPWRITE : ${err}`)
      );
  };
  return <button onClick={logoutHandler}>Logout</button>;
};

export default LogoutBtn;
