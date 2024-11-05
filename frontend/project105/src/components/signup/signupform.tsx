"use client";

import style from "./signupform.module.css";

export default function SignupForm() {
  return (
    <div className={style.container}>
      <label className={style.label_st} htmlFor="email">
        이메일
      </label>
      <input className={style.input_box} type="text" id="email" name="email" />
      <button className={style.auth_button}>인증하기</button>
      <label className={style.label_st} htmlFor="password1">
        비밀번호
      </label>
      <input
        className={style.input_box}
        type="password"
        id="password1"
        name="password1"
      />
      <label className={style.label_st} htmlFor="password2">
        비밀번호확인
      </label>
      <input
        className={style.input_box}
        type="password"
        id="password2"
        name="password2"
      />

      <div className={style.label_st}>성별</div>

      <label>
        <input type="radio" name="identity" value="male" />
        남자
      </label>

      <label>
        <input type="radio" name="identity" value="female" />
        여자
      </label>

      <label className={style.label_st} htmlFor="birth">
        출생년도
      </label>
      <input className={style.input_box} type="text" id="birth" name="birth" />
      <label className={style.label_st} htmlFor="nickname">
        닉네임
      </label>
      <input
        className={style.input_box}
        type="text"
        id="nickname"
        name="nickname"
      />
      <button className={style.signup_button}>회원가입</button>
    </div>
  );
}
