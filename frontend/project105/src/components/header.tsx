"use client";

import { useRouter } from "next/navigation";
import style from "./header.module.css";

export default function Header() {
  const router = useRouter();

  const toMain = () => {
    router.push("/main");
  };

  return (
    <div className={style.header}>
      <img
        className={style.logotext}
        src="/images/logotext.png"
        alt="logotext"
        onClick={toMain}
      />
    </div>
  );
}
