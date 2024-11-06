"use client";

import style from "./loginform.module.css";

export default function LoginForm() {
  return (
    <div className={style.container}>
      <label className={style.label_st} htmlFor="useremail">
        이메일
      </label>
      <input
        className={style.input_box}
        type="email"
        id="useremail"
        name="useremail"
        placeholder="이메일"
      />
      <label className={style.label_st} htmlFor="password">
        비밀번호
      </label>
      <input
        className={style.input_box}
        type="password"
        id="password"
        name="password"
        placeholder="비밀번호"
      />
      <button className={style.button_st}>로그인</button>
    </div>
  );
}
