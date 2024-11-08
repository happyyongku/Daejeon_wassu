// "use client";

import style from "./page.module.css";

import LikeButton from "../../../../components/community/likebutton";
import UpdateDelete from "@/components/community/updatedelete";

export default function Page() {
  return (
    <div>
      <div className={style.userbox}>
        <img
          className={style.profileimagae}
          src="/images/logo.png"
          alt="profileimage"
        />
        <p className={style.username}>노은맨</p>
      </div>
      <div className={style.contentbox}>
        <div className={style.title}>성심당 케익부띠끄에 다녀왔어요</div>
        <p className={style.date}>2024.10.30</p>
      </div>
      <div className={style.ectbox}>
        <div className={style.likenumber}>
          <p className={style.heartimg}>❤️</p>
          <p className={style.heartnumber}>534</p>
        </div>
        {/* 여기는 클라이언트 컴포넌트 */}
        <div>
          <UpdateDelete />
        </div>
      </div>
      <div>
        <img className={style.image} src="/images/building.png" alt="" />
      </div>
      <div className={style.descbox}>
        <div className={style.desctext}>설명</div>
        <p className={style.desc}>
          한밭 수목원입니다. 이곳은 자연 카테고리에 속하며 모든 사람들이
          편안하게 와서 휴식하다가 가면 되는 대전의 유명 관광 코스 중
          하나입니다. 편하게 와서 쉬다가 가면 될 것 같습니다. 한밭 수목원입니다.
          이곳은 자연 카테고리에 속하며 모든 사람들이 편안하게 와서 휴식하다가
          가면 되는 대전의 유명 관광 코스 중 하나입니다. 편하게 와서 쉬다가 가면
          될 것 같습니다.한밭 수목원입니다. 이곳은 자연 카테고리에 속하며 모든
          사람들이 편안하게 와서 휴식하다가 가면 되는 대전의 유명 관광 코스 중
          하나입니다. 편하게 와서 쉬다가 가면 될 것 같습니다. 한밭 수목원입니다.
          이곳은 자연 카테고리에 속하며 모든 사람들이 편안하게 와서 휴식하다가
          가면 되는 대전의 유명 관광 코스 중 하나입니다. 편하게 와서 쉬다가 가면
          될 것 같습니다.
        </p>
        {/* 클라이언트 컴포넌트로 작성 */}
        <div className={style.button}>
          <LikeButton></LikeButton>
        </div>
      </div>
    </div>
  );
}
