"use client";

import { ReactNode, useState } from "react";
import { useEffect } from "react";
import { UserData } from "@/types";
import axios from "axios";
import style from "./layout.module.css";

export default function Layout({ children }: { children: ReactNode }) {
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
  }, []);

  return (
    <div>
      <div className={style.container}>
        <div className={style.profilebox}>
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
        <div className={style.hr}></div>

        <div className={style.main_container}>{children}</div>
      </div>
    </div>
  );
}
