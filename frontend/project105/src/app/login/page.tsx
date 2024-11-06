import LoginForm from "@/components/login/loginform";
import ToSignup from "@/components/login/tosignup";
import style from "./page.module.css";

export default function Page() {
  return (
    <div className={style.container}>
      <img className={style.logo} src="/images/logo.png" alt="logo-image" />
      <h1 className={style.title}>대전 왓슈</h1>
      <p className={style.description}>대전의 숨겨진 매력을 찾아 떠나는 여행</p>
      <LoginForm />
      <ToSignup />
    </div>
  );
}
