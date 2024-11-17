"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function KakaoMap() {
  const [isKakaoMapLoaded, setIsKakaoMapLoaded] = useState(false);

  // 맵 로딩 함수
  useEffect(() => {
    if (isKakaoMapLoaded && window.Kakao && window.Kakao.maps) {
      const container = document.getElementById("map");
      if (!container) {
        console.error("Map container not found!");
        return;
      }

      const options = {
        center: new window.Kakao.maps.LatLng(37.5665, 126.978), // 서울 위도, 경도
        level: 3,
      };

      // 카카오맵 로드 후 실행
      window.Kakao.maps.load(() => {
        new window.Kakao.maps.Map(container, options);
        console.log("Kakao Map is loaded and displayed!");
      });
    }
  }, [isKakaoMapLoaded]); // 스크립트가 로드된 후 맵을 로드합니다.

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=7081816cda06eadc33cc160b7fbdfaa1&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => setIsKakaoMapLoaded(true)} // 스크립트 로드 완료 후 상태 변경
        onError={(error) =>
          console.error("Kakao Map script failed to load", error)
        } // 에러 핸들링
      />
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </>
  );
}
