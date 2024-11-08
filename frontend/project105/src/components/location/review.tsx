"use client";

import CommunityCard from "../main/community/communitycard";
import style from "./review.module.css";

export default function Review() {
  return (
    <div className={style.container}>
      <CommunityCard />
      <CommunityCard />
      <CommunityCard />
      <CommunityCard />
      <button className={style.more}>더보기</button>
    </div>
  );
}
