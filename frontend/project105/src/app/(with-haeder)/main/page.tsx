"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ToLoginModal from "../../../components/main/tologinmodal";
import style from "./page.module.css";

import Community from "../../../components/main/community/community";

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  // 로컬 스토리지에서 토큰 확인 및 유효성 검사
  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   if (token) {
  //     const isValidToken = checkTokenValidity(token);
  //     if (isValidToken) {
  //       setIsAuthenticated(true);
  //     } else {
  //       setIsAuthenticated(false);
  //       setIsModalOpen(true);
  //     }
  //   } else {
  //     setIsAuthenticated(false);
  //     setIsModalOpen(true);
  //   }
  // }, []);

  // const checkTokenValidity = (token: string): boolean => {
  //   return token !== "";
  // };

  // const goToLogin = () => {
  //   router.push("/login");
  // };

  // 메인 페이지
  // if (isAuthenticated) {
  if (true) {
    return (
      <div className={style.container}>
        <div className={style.main_container}>
          {/* <div>메인 페이지 입니다.</div> */}
          <div className={style.mainbox}>
            <img
              className={style.mainimage}
              src="/images/mainimage.png"
              alt="mainimage"
            />
            <div className={style.maintext}>
              <div className={style.sayhello}>안녕하세요, 노은맨님</div>
              <div className={style.textpromo}>재밌게 즐기세요,</div>
              <div className={style.textpromo}>대전왔슈</div>
            </div>
          </div>
          <div className={style.content_container}>
            <Community />
          </div>
        </div>
      </div>
    );
  }

  // if (isModalOpen) {
  //   return <ToLoginModal onLoginClick={goToLogin} />;
  // }

  // 모달 컴포넌트
  return (
    <div className={style.prom}>
      <svg className={style.loading_container}>
        <rect className={`${style.loading_boxes}`}></rect>
      </svg>
    </div>
  );
}
