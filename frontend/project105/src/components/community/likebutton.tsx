"use client";

import { useState } from "react";
import style from "./likebutton.module.css";

export default function LikeButton() {
  const [isLike, setIsLike] = useState(false);
  // 마운트 됐을 때 좋아요 하고 있는지 조회하는 요청

  // 좋아요/좋아요취소 하는 요청

  return (
    // 조건문으로 나눠야 한다. 좋아요됐는지 안됐는지에 따라서 버튼 다르게 출력
    <div>
      {!isLike ? (
        <div className={style.buttonbox}>
          <button className={style.button}>🤍</button>
        </div>
      ) : (
        <div className={style.buttonbox}>
          <button className={style.button}>❤️</button>
        </div>
      )}
    </div>
  );
}
