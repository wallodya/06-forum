import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import "../../style/global.css";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { useQuery } from "react-query";
import { closeSession, getUserData } from "../../api/api";
import { useLogin, useLoginUpdate } from "../../context/LoginProvider";

export const Header = ({ id }) => {
    const navigate = useNavigate();

    const user = useLogin()
    const updateUser = useLoginUpdate()

    return (
        <div className="container-flex-row-header ">
        {   
            user?.is_admin
            &&
            <SecondaryButton
                text={"admin"}
                onClick={() => navigate("/admin")}
            />
        }
        {
            user
                ?
                <>
                    <Link to={"/" + user.login} style={{ marginLeft: 'auto' }}>
                        <p className="text-primary-100 fw-regular fs-m ff-body username-header">
                            {user.login}
                        </p>
                    </Link>
                    <Link to="/profile" style={{ margin: '0' }}>
                        <img
                            className="avatar-header"
                            alt="avatar"
                            src={user.avatar}
                        />
                    </Link>
                    <PrimaryButton
                        text={"Logout"}
                        onClick={() => {
                            updateUser(null)
                            navigate("/login")
                            window.location.reload()
                        }}
                    />
                </>
                :
                <PrimaryButton text={"Login"} style={{ marginLeft: 'auto' }} onClick={() => navigate("/login")} />
        }          
        </div>
    )
};
