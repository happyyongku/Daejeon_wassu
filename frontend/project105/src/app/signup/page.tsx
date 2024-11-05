import style from "./page.module.css";
import SignupForm from "../../components/signup/signupform";

export default function Page() {
  return (
    <div className={style.container}>
      {/* <div>회원가입 페이지</div> */}
      <SignupForm />
    </div>
  );
}
