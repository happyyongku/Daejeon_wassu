import style from "./header.module.css";

export default function Header() {
  return (
    <div className={style.header}>
      <img
        className={style.logotext}
        src="/images/logotext.png"
        alt="logotext"
      />
    </div>
  );
}
