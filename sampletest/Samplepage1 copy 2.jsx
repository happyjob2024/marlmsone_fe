import React, { useState,useEffect } from "react";

const SamplePage1 = () => {

  const [searchTitle, setSearchTitle] = useState(""); // 검색명
  const [searchStartDate, setSearchStartDate] = useState(""); // 검색시작일
  const [searchEndDate, setSearchEndDate] = useState(""); // 검색마감일

  const [notisList, setNotisList] = useState([]); // 공지사항 목록
  const [totalcnt, setTotalcnt] = useState([]); // 페이지 총 개수

  const [arrList, setArrList] = useState([]);

  useEffect(() => {
    //add();
    console.log(arrList);
  }, [arrList]);

  const add = () => {
    let aa = arrList;
    let bb = aa.length+1;
    aa.push(bb);
    setArrList(aa);
  }

  const remove = () => {
    arrList.pop();
    setArrList(arrList);
  }

  return (
    <div>
      <br />
      {arrList.map((item, index) => (
        <p>
          {item}
          <input type="radio" id={item} name={item} value={item} />
        </p>
      ))}
      <br />
      <button onClick={add}>추가</button>
      <button onClick={remove}>삭제</button>
    </div>
  );
};

export default SamplePage1;