import Cookies from "js-cookie";
import React from "react";
import axios from 'axios';

export const isAuthenticated = () => {
  // console.log(Cookies.get("connect.sid"));
  return !!Cookies.get("connect.sid");
};

export const redirectToHome = history => {
  history.push("/");
};

export const AuthenticatedComponent = ({
  component: Component,
  alt: Alternative,
  props
}) =>
  isAuthenticated() ? <Component {...props} /> : <Alternative {...props} />;


export const getUserId = async () => {
  if (!isAuthenticated()) {
    return '';
  }
  try {
    const { data: userId } = await axios.get(
      "http://localhost:4000/getUserId",
      { withCredentials: true }
    );
    return userId;
  } catch (err) {
    console.log(err);
  }  
}