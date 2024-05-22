//   /*eslint-disale */  아래 Worning 메세지 안나옴

import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../../components/common/Pagination.jsx";
import * as commonjs from "../../components/common/commonfunction.js";
import Modal from "react-modal";

const Notice = () => {

  const [useType        , setUseType        ] = useState("");    // 유저 타입
  const [searchStartDate, setSearchStartDate] = useState("");    // 검색 시작일
  const [searchEndDate  , setSearchEndDate  ] = useState("");    // 검색 마감일
  const [searchTitle    , setSearchTitle    ] = useState("");    // 검색창 값
  const [noticeList     , setNoticeList     ] = useState([]);    // 공지사항 목록
  const [selNoticeNo    , setSelNoticeNo    ] = useState(0);     // 공지사항 번호
  const [inputTitle     , setInputTitle     ] = useState("");    // 공지사항 제목
  const [inputCon       , setInputCon       ] = useState("");    // 공지사항 내용
  const [noticeDis      , setNoticeDis      ] = useState(false); // 모달창 노출유무
  const [disFileNm      , setDisFileNm      ] = useState("");
  const [fileYn         , setFileYn         ] = useState("");

  const [action         , setAction         ] = useState("");    // CRUD관리코드
  const [isRegBtn       , setIsRegBtn       ] = useState(true);  // 버튼관리코드
  const [preview        , setPreView        ] = useState("");    // 파일명
  const [selFileYn      , setSelFileYn      ] = useState(false); // 파일유무
  const [attFile        , setAttFile        ] = useState({});    // 파일
  const [fileNm         , setFileNm         ] = useState("");    // 파일명

  const [blockSize                          ] = useState(5);     // 
  const [currentPage    , setCurrentPage    ] = useState(1);     // 현재 페이지
  const [pageSize       , setPageSize       ] = useState(10);    // 페이지 크기
  const [totalCnt       , setTotalCnt       ] = useState(0);     // 총 페이지 수

  
  /* 로드시 달력 날짜 입력 및 공지사항 조회 */
  useEffect(() => {
    let today = new Date();

    let year  = today.getFullYear() ; // 년도
    let month = today.getMonth() + 1; // 월
    let sDate = today.getDate()  - 2; // 날짜
    let eDate = today.getDate()  + 1; // 날짜

    let monthstr = "";
    let sDatestr = "";
    let eDatestr = "";

    if (month < 10) {
      monthstr = "0" + month.toString();
    } else {
      monthstr = month.toString();
    }

    if (sDate < 10) {
      sDatestr = "0" + sDate.toString();
    } else {
      sDatestr = sDate.toString();
    }

    if (eDate < 10) {
      eDatestr = "0" + eDate.toString();
    } else {
      eDatestr = eDate.toString();
    }

    setSearchStartDate(year.toString() + "-" + monthstr + "-" + sDatestr);
    setSearchEndDate(year.toString() + "-" + monthstr + "-" + eDatestr);

    console.log(year.toString() + "-" + monthstr + "-" + sDatestr);

    serachButton();
  }, []);

  /* 모달 스타일관리 */
  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      transform: "translate(-50%, -50%)",
    },
  };

  /* 공지사항 목록 버튼 */
  const serachButton = () => {
    searchList(1);
  };

  /* 공지사항 목록 */
  const searchList = (cpage) => {
    cpage = cpage || 1;
    setCurrentPage(cpage);

    let params = new URLSearchParams();
    params.append("cpage"       , cpage);
    params.append("pagesize"    , pageSize);
    params.append("searchtitle" , searchTitle);
    params.append("searchstdate", searchStartDate);
    params.append("searcheddate", searchEndDate);

    axios
      .post("/notice/noticelistjson.do", params)
      .then((res) => {
        setTotalCnt(res.data.listcnt);
        setNoticeList(res.data.listdata);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  /* 공지사항 상세 */
  const deteilNotice = (id) => {
    let params = new URLSearchParams();
    params.append("notice_id", id);

    axios
      .post("/notice/noticeView.do", params)
      .then((res) => {
        setSelNoticeNo(id);
        setInputTitle(res.data.selinfo.notice_tit);
        setInputCon(res.data.selinfo.notice_con);
        setFileNm(res.data.selinfo.filename);
        setAction("U");
        setIsRegBtn(false);

        let fileext = res.data.selinfo.fileext;

        if (res.data.selinfo.filename === "") {
          // 파일 미첨부
          setPreView("");
          setSelFileYn(false);
          setAttFile();
          setFileNm("");
        } else {
          if (
            fileext === "jpg" ||
            fileext === "png" ||
            fileext === "gif" ||
            fileext === "jpeg"
          ) {
            setSelFileYn(true); //  이미지 파일 업로드 된 경우  미리보기 처리   다운로드 URL 호출
            attachFileProc("P", id);
          } else {
            setPreView(res.data.selinfo.filename);
            setSelFileYn(false);
          }
        }
        setNoticeDis(true);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  /* 신규등록버튼 */
  const newreg = () => {
    setInputTitle("");
    setInputCon("");
    setAction("I");
    setSelNoticeNo(0);

    setIsRegBtn(true);
    setNoticeDis(true);

    setPreView();
  };

  /* 파일정보 */
  const attachFileProc = (ptype, noticeNo) => {
    let params = new URLSearchParams();
    params.append("notice_id", noticeNo);

    axios
    .post("/notice/noticeDownload2.do", params, { responseType: "blob" })
      .then((res) => {
        console.log("attachfileproc res start");
        console.log(res);
        const reader = new FileReader();
        reader.readAsDataURL(new Blob([res.data]));
        reader.onloadend = (event) => {
          if (ptype === "P") {
            setPreView(reader.result);
          } else {
            let docUrl = document.createElement("a");
            docUrl.href = reader.result;
            docUrl.setAttribute("download", fileNm);
            document.body.appendChild(docUrl);
            docUrl.click();
          }
        };
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  /* 파일 미리보기 */
  const previewfunc = (e) => {
    let selfile = e.currentTarget;

    if (selfile.files[0]) {
      setAttFile(selfile.files[0]);
      let filePath = selfile.value; // c:\\a.jpg
      console.log(filePath);
      //전체경로를 \ 나눔.
      let filePathSplit = filePath.split("\\");

      //전체경로를 \로 나눈 길이.
      let filePathLength = filePathSplit.length;
      //마지막 경로를 .으로 나눔.
      let fileNameSplit = filePathSplit[filePathLength - 1].split(".");
      //파일명 : .으로 나눈 앞부분
      let fileName = fileNameSplit[0];
      //파일 확장자 : .으로 나눈 뒷부분
      let fileExt = fileNameSplit[1];
      //파일 크기
      let fileSize = selfile.files[0].size;

      if (
        fileExt === "jpg" ||
        fileExt === "png" ||
        fileExt === "gif" ||
        fileExt === "jpeg"
      ) {
        console.log("selfile.files[0] : " + selfile.files[0]);
        const reader = new FileReader();
        reader.readAsDataURL(selfile.files[0]);
        reader.onloadend = () => {
          setPreView(reader.result);
        };
        setSelFileYn(true);
      } else {
        setPreView("./logo.svg");
        setSelFileYn(false);
      }
    }
  };

  /* 파일 미리보기 관리 */
  const filePreView = () => {
    attachFileProc("D", selNoticeNo);
  };

  /* 등록/수정/삭제 관리 */
  const noticereg = (e) => {
    e.preventDefault();
    let actionVal = e.target.value;
    
    let params = new FormData();
    params.append("notice_tit", inputTitle);
    params.append("notice_con", inputCon);
    params.append("noticeNo"  , selNoticeNo);
    params.append("file_yn"   , fileYn);
    params.append("file"      , attFile);
    params.append("action"    , actionVal);

    let callurl = "";

    if (actionVal === "I") {
      callurl = "/notice/noticeSave.do";
    } else if (actionVal === "U") {
      callurl = "/notice/noticeModify.do";
    } else if (actionVal === "D") {
      params.append("notice_id", selNoticeNo);
      callurl = "/notice/noticeDelete.do";
    }

    axios
      .post(callurl, params)
      .then((res) => {
        if (res.data.result === "sucess" || res.data.success === true) {
          closeNoticeModal();
          searchList();
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  /* 모달 창닫기 */
  const closeNoticeModal = () => {
    setNoticeDis(false);
  };

  return (
		<div id="container">
      {/* <!-- contents --> */}
      <h3 className="hidden">contents 영역</h3>
      <div className="content">
        <p className="Location">
          <a className="btn_set home">메인으로</a>
          <span className="btn_nav bold">학습지원</span>
          <span className="btn_nav bold">공지사항</span>
          <a className="btn_set refresh">새로고침</a>
        </p>

        <p className="conTitle">
            <span>공지사항</span> 
            <span className="fr">제목
              <input type="text" 
                      id="searchTitle" 
                      name="searchTitleNm" 
                      style={{width:'150px', height : "30px"}}
                      onChange={(e) => {
                        setSearchTitle(e.target.value);
                      }}
              />
                기간
              <input type="date" 
                      id="searchStdate" 
                      name="searchStdateNm"
                      value={searchStartDate}
                      onChange={(e) => {
                      setSearchStartDate(e.target.value);
                    }}
              />
                ~
              <input type="date" 
                      id="searchEdDate"
                      name="searchEdDateNm"
                      value={searchEndDate}
                      onChange={(e) => {
                        setSearchEndDate(e.target.value);
                      }}
                      /> 
              <button className="btn btn-primary" 
                      name="searchbtn"
                      id="searchbtn"
                      onClick={serachButton}
              >
                <span>검색</span>
              </button>
              <button className="btn btn-primary"
                      id="saveBtn"
                      name="saveBtnNm"
                      onClick={newreg}
              >
                <span>신규등록</span>
              </button>
            </span>
        </p>
        
        <div className="divComGrpCodList">
          <table className="col">
            <caption>caption</caption>
            <colgroup>
              <col width="10%"/>
              <col width="50%"/>
              <col width="15%"/>
              <col width="15%"/>
              <col width="10%"/>
            </colgroup>

            <thead>
              <tr>
                <th scope="col">번호</th>
                <th scope="col">제목</th>
                <th scope="col">작성자</th>
                <th scope="col">등록일</th>
                <th scope="col">조회수</th>
              </tr>
            </thead>
            <tbody>
              {totalCnt === 0 && (
                <tr>
                  <td colSpan="5"> 조회된 데이터가 없습니다.</td>
                </tr>
              )}
              {totalCnt > 0 &&
                noticeList.map((item) => {
                  return (
                    <tr key={item.notice_id}>
                      <td
                        className="pointer-cursor"
                      >
                        {item.notice_id}
                      </td>
                      <td><a onClick={() => deteilNotice(item.notice_id)}>{item.notice_tit}</a></td>
                      <td>{item.loginID}</td>
                      <td>{item.regdate}</td>
                      <td>{item.hit}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <Pagination
          currentPage={currentPage}
          totalPage={totalCnt}
          pageSize={pageSize}
          blockSize={blockSize}
          onClick={searchList}
        />
        </div>

      <Modal
        style={modalStyle}
        isOpen={noticeDis}
        onRequestClose={closeNoticeModal}
      >
        <form action="" method="post" id="saveForm">
          <div id="noticeform">
            <p className="conTitle">
              <span>{isRegBtn ? "공지사항 등록" : "공지사항 수정"}</span>
            </p>
            <table style={{ width: "550px", height: "350px" }}>
              <tbody>
                <tr>
                  <th>
                    제목 <span className="font_red">*</span>
                  </th>
                  <td colSpan="3">
                    <input
                      type="text"
                      className="form-control input-sm"
                      style={{ width: "470px" }}
                      value={inputTitle}
                      onChange={(e) => {
                        setInputTitle(e.target.value);
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    내용<span className="font_red">*</span>
                  </th>
                  <td colSpan="3">
                    <textarea
                      className="form-control input-sm"
                      value={inputCon}
                      cols="40"
                      rows="5"
                      onChange={(e) => {
                        setInputCon(e.target.value);
                      }}
                    ></textarea>
                  </td>
                </tr>
                <tr>
                  <th>
                    파일<span className="font_red">*</span>
                  </th>
                  <td colSpan="3">
                    <input
                      type="file"
                      className="form-control input-sm"
                      onChange={previewfunc}
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    미리보기<span className="font_red">*</span>
                  </th>
                  <td colSpan="3">
                    {selFileYn && (
                      <img
                        src={preview ? preview : `./logo.svg`}
                        alt="preview"
                        className="filePreView"
                        onClick={filePreView}
                      />
                    )}
                    {!selFileYn && disFileNm}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="modal-button">
              {isRegBtn && (
                <button className="btn btn-primary mx-2" onClick={noticereg} value="I">
                  등록
                </button>
              )}
              {!isRegBtn && (
                <button className="btn btn-primary mx-2" onClick={noticereg} value="U">
                  수정
                </button>
              )}
              {!isRegBtn && (
                <button className="btn btn-primary mx-2"onClick={noticereg} value="D"> 삭제 </button>
              )}
              <button className="btn btn-primary" onClick={closeNoticeModal}>
                닫기
              </button>
            </div>
          </div>
        </form>
      </Modal>
      </div>
		</div>
  );
};

export default Notice;