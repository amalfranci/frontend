import React from "react";
import { TbSocial } from "react-icons/tb";
import AutocompleteSearch from "./Autocomplete";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsFillChatDotsFill, BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { fetchPosts } from "../utils";
import { useState } from "react";

function TopBar({ user }) {
  const { theme } = useSelector((state) => state.theme);
  const { user: data } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };
  const handleSearch = async (data) => {
    await fetchPosts(user.token, dispatch, "", data);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="topbar w-full  flex items-center justify-between  md:py-2.5 px-4 bg-primary">
      <Link to="/" className="flex gap-2 items-center">
        <div className="p-1 md:p-2 bg-[#065ad8] rounded text-white">
          <TbSocial />
        </div>
        <span className="text-xl md:text-2xl text-[#065ad8] font-semibold">
          LookUp
        </span>
      </Link>
      <div className="hidden md:flex items-center justify-center">
        <div style={{ position: "relative", width: "200px" }}>
          <AutocompleteSearch
            onSearch={handleSearch}
            user={user}
            dispatch={dispatch}
          />
        </div>
      </div>

      <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl">
        <button onClick={() => handleTheme()}>
          {theme === "light" ? <BsMoon /> : <BsSunFill />}
        </button>
      
        <div>
          <Link to="/chats" className="text-ascent-1">
            <BsFillChatDotsFill user={user} />
          </Link>
        </div>
        <div className="relative">
          <button
            onClick={() => handleDropdownToggle()}
            className="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
          >
            {user?.firstName}
          </button>
          {isDropdownOpen && (
            <div className="absolute mt-2 py-2    rounded-md">
              <button
                onClick={() => dispatch(Logout())}
                className="block w-full px-5 border rounded-full text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
