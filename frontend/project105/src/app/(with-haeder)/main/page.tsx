"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ToLoginModal from "../../../components/main/tologinmodal";
import style from "./page.module.css";

import Reco from "@/components/main/reco/reco";
import Community from "../../../components/main/community/community";
import SearchResultCard from "@/components/main/searchresultcard";

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const router = useRouter();

  // 로컬 스토리지에서 토큰 확인 및 유효성 검사
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const isValidToken = checkTokenValidity(token);
      if (isValidToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setIsModalOpen(true);
      }
    } else {
      setIsAuthenticated(false);
      setIsModalOpen(true);
    }
  }, []);

  const checkTokenValidity = (token: string): boolean => {
    return token !== "";
  };

  const goToLogin = () => {
    router.push("/login");
  };

  // 쿼리 스트링 넣을 state
  const [qString, setQSting] = useState("");
  const [searchResult, setSearchResult] = useState([1, 2, 3]);
  const [word, setWord] = useState("");
  const [forResultPage, setForResultPage] = useState(false);

  const handleWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    const wordValue = e.target.value;
    setWord(wordValue);
  };

  // 검색 요청하는 axios
  const searchReqest = () => {};

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter 키가 눌렸을 때
    if (e.key === "Enter") {
      console.log("Enter 키가 눌렸습니다!", word);
      router.push(`/main?q=${word}`);
      setQSting(word);
      setForResultPage(true);
    }
  };

  // 메인 페이지
  if (isAuthenticated) {
    return (
      <div className={style.container}>
        <div className={style.main_container}>
          {/* <div>메인 페이지 입니다.</div> */}
          <div className={style.mainbox}>
            <img
              className={style.mainimage}
              src="/images/mainimage.png"
              alt="mainimage"
            />
            <div className={style.maintext}>
              <div className={style.sayhello}>안녕하세요, 노은맨님</div>
              <div className={style.textpromo}>재밌게 즐기세요,</div>
              <div className={style.textpromo}>대전왔슈</div>
            </div>
          </div>
          <div className={style.content_container}>
            <div className={style.deco}></div>

            <div className={style.searchbarcontainer}>
              <img
                className={style.searchicon}
                src="/images/searchicon.png"
                alt=""
              />
              <input
                className={style.searchbar}
                type="text"
                placeholder="대전 관광지를 검색해주세요"
                onChange={handleWord}
                onKeyDown={handleSearch}
              />
            </div>
            {forResultPage ? (
              <div>
                {searchResult.length !== 0 ? (
                  <div className={style.resultcontainer}>
                    <div className={style.resulttitlecontainer}>
                      <div className={style.resulttitle}>
                        <span className={style.qstring1}>
                          &quot;{qString}&quot;
                        </span>{" "}
                        과 일치하는 장소
                      </div>
                    </div>
                    <div>
                      {/* 반복문 작성하고 props로 넘겨주면 된다. */}
                      <SearchResultCard />
                      <SearchResultCard />
                    </div>
                  </div>
                ) : (
                  <div className={style.resultcontainer}>
                    <div className={style.qstring}>&quot;{qString}&quot;</div>
                    <div className={style.noresult}>검색결과가 없습니다.</div>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}

            <Reco />
            <div className={style.bar}></div>
            <Community />
          </div>
        </div>
      </div>
    );
  }

  if (isModalOpen) {
    return <ToLoginModal onLoginClick={goToLogin} />;
  }

  // 모달 컴포넌트
  return (
    <div className={style.prom}>
      <svg className={style.loading_container}>
        <rect className={`${style.loading_boxes}`}></rect>
      </svg>
    </div>
  );
}
