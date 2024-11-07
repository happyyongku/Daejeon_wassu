import React from "react";
import style from "./tologinmodal.module.css";

interface LoginModalProps {
  onLoginClick: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLoginClick }) => {
  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <p>로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?</p>
        <button onClick={onLoginClick}>로그인</button>
      </div>
    </div>
  );
};

export default LoginModal;
