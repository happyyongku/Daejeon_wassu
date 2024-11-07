"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ToLoginModal from "../../../components/main/tologinmodal";
import style from "./page.module.css";

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  // 로컬 스토리지에서 토큰 확인 및 유효성 검사
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const isValidToken = checkTokenValidity(token);
      if (isValidToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setIsModalOpen(true);
      }
    } else {
      setIsAuthenticated(false);
      setIsModalOpen(true);
    }
  }, []);

  const checkTokenValidity = (token: string): boolean => {
    return token !== "";
  };

  const goToLogin = () => {
    router.push("/login");
  };

  if (isAuthenticated) {
    return <div>메인 페이지 입니다.</div>;
  }

  if (isModalOpen) {
    return <ToLoginModal onLoginClick={goToLogin} />;
  }

  return (
    <div className={style.prom}>
      <svg className={style.loading_container}>
        <rect className={`${style.loading_boxes}`}></rect>
      </svg>
    </div>
  );
}
