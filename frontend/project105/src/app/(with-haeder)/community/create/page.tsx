"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface ArticleDTO {
  title: string;
  content: string;
  tags: string[];
}

export default function Page() {
  const router = useRouter();

  // 제목 상태 관리
  const [title, setTitle] = useState<string>("");
  // 내용 상태 관리
  const [content, setContent] = useState<string>("");
  // 카테고리 상태 관리
  const [categories, setCategories] = useState<string[]>([]);
  // 이미지 리스트 상태 관리
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // 미리보기 이미지 URL을 저장할 상태

  // 제목 핸들러
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // 내용 핸들러
  const handleContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 카테고리 핸들러
  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategories([e.target.value]);
  };

  // 이미지 핸들러
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    if (fileInput.files) {
      const file = fileInput.files[0];
      if (file) {
        setImages((prevImages) => [...prevImages, file]);
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImagePreviews((prevPreviews) => [
              ...prevPreviews,
              reader.result as string,
            ]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // 회원가입 폼 제출 핸들러
  const submit = async () => {
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    const articleDTO: ArticleDTO = {
      title: title,
      content: content,
      tags: categories,
    };
    console.log(articleDTO);
    formData.append("articleDTO", JSON.stringify(articleDTO));

    // 이미지 파일들을 FormData에 추가
    images.forEach((image, index) => {
      formData.append("file", image);
    });
    try {
      const response = await axios.post(
        `https://k11b105.p.ssafy.io/wassu/posts/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data) {
        console.log("게시글 생성 성공", response.data);
        router.push("/community");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <div>
          <label>이미지 추가</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            multiple={false}
          />
        </div>

        <div>
          {imagePreviews.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {imagePreviews.map((preview, index) => (
                <div key={index} style={{ margin: "10px" }}>
                  <img
                    src={preview}
                    alt="preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      marginRight: "10px",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="category">카테고리</label>
          <select id="category" onChange={handleCategory} required>
            <option value="">카테고리 선택</option>
            <option value="맛집">맛집</option>
            <option value="숙소">숙소</option>
            <option value="우천">우천</option>
            <option value="스포츠">스포츠</option>
            <option value="예술">예술</option>
            <option value="빵">빵</option>
            <option value="역사">역사</option>
            <option value="과학">과학</option>
          </select>
        </div>
        <div>
          <label htmlFor="">제목</label>
          <input type="text" onChange={handleTitle} />
        </div>
        <div>
          <label htmlFor="">내용</label>
          <textarea onChange={handleContent} />
        </div>
        <div>
          <button onClick={submit}>임시</button>
        </div>
      </div>
    </div>
  );
}
