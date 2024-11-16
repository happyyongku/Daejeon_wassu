"use client";

import { ReactNode, useState } from "react";
import { useEffect } from "react";
import { UserData } from "@/types";
import { useRouter } from "next/navigation";
import useDropdownStore from "@/store/dropdownStore";
import axios from "axios";
import style from "./layout.module.css";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { closeDropdown } = useDropdownStore();
  // 로그아웃 요청 axios
  const logout = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `https://k11b105.p.ssafy.io/wassu/auth/logout`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("로그아웃 성공", response.data);
        localStorage.removeItem("authToken");
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 회원탈퇴 요청 axios
  const deleteAccount = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(
        `https://k11b105.p.ssafy.io/wassu/auth/delete-account`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("회원탈퇴 성공", response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 유저 데이터 요청 axios
  const [profile, setProfile] = useState<UserData | null>(null);

  const getMyData = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://k11b105.p.ssafy.io/wassu/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log("회원정보 조회 성공", response.data);
        setProfile(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyData();
    closeDropdown();
  }, []);

  return (
    <div>
      <div className={style.container}>
        <div className={style.profilebox}>
          <div className={style.foralign}>
            <img
              className={style.profileimg}
              src={profile?.profileImage}
              alt=""
            />
            <div>
              <p className={style.nickname}>
                {profile?.nickname} &nbsp;&nbsp;
                <span className={style.level}>{profile?.level}</span>
              </p>
              <p className={style.email}>{profile?.email}</p>
            </div>
          </div>
          <div className={style.buttons}>
            <button className={style.logoutbutton} onClick={logout}>
              로그아웃
            </button>
            <button className={style.outbutton}>회원탈퇴</button>
          </div>
        </div>
        <div className={style.hr}></div>

        <div className={style.main_container}>{children}</div>
      </div>
    </div>
  );
}
