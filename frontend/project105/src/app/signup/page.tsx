import style from "./page.module.css";
import SignupForm from "../../components/signup/signupform";

export default function Page() {
  return (
    <div className={style.container}>
      {/* <div>회원가입 페이지</div> */}
      <div className={style.logo_container}>
        <img className={style.logotext} src="/images/logotext.png" alt="" />
        <p className={style.logo_description}>
          대전의 숨겨진 매력을 찾아 떠나는 여행
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
