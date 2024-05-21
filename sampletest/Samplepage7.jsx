import React, { useState,useEffect } from 'react'
import axios from "axios";
import Pagination from "../../components/common/Pagination";
import * as commonjs from "../../components/common/commonfunction.js";

import Modal from "react-modal";

const SamplePage7 = (props) => {
  const [blocksize                        ] = useState(5);      // 보일 페이지 수
  const [pageSize                         ] = useState(5);      // 페이지 크기
  const [currentPage   , setCurrentPage   ] = useState(1);      // 현재 페이지
  const [searchRoomName, setSearchRoomName] = useState("");     // 검색창 값
  const [totalcnt      , setTotalcnt      ] = useState(0);      // 총 페이지 수

  const [roomlist      , setRoomlist      ] = useState([]);     // 강의실 목록
  const [searchroomid  , setSearchroomid  ] = useState(0);      // 강의실 ID
  const [roomname      , setRoomname      ] = useState("");     // 강의실 명
  const [roomsize      , setRoomsize      ] = useState(0);      // 강의실 크기
  const [roomsite      , setRoomsite      ] = useState(0);      // 강의실 자리 수
  const [roometc       , setRoometc       ] = useState("");     // 강의실 비고

  const [equid         , setEquid         ] = useState(0);      // 장비 ID
  const [equcnt        , setEqucnt        ] = useState(0);      // 장비 수
  const [equname       , setEquname       ] = useState("");     // 장비 명
  const [equetc        , setEquetc        ] = useState("");     // 장비 비고
  const [equitemlist   , setEquitemlist   ] = useState([]);     // 장비 목록
  const [equdis        , setEqudis        ] = useState(false);  // 장비 목록(show,hide)
  const [equpopdis     , setEqupopdis     ] = useState(false);  // 장비 모달창(닫기)
  const [isequRegBtn   , setIsequRegBtn   ] = useState(false);  // 장비 버튼 관리
  const [equtotalcnt   , setEqutotalcnt   ] = useState(0);      // 총 건수
  const [equcurrentPage, setEqucurrentPage] = useState(1);      // 현재 페이지 번호

  const [eaction       , setEaction       ] = useState("");     // 장비 CRUD상태 관리
  const [action        , setAction        ] = useState("");     // 강의실 CRUD상태 관리
  const [isroomRegBtn  , setIsroomRegBtn  ] = useState(false);  // 모달창 강의실 버튼 관리
  const [roomdis       , setRoomdis       ] = useState(false);  // 모달창 관리

  /* 로드시 searchroom조회 */
  useEffect(() => {
    console.log("useEffect");
    searchroom();
  }, []);

  /* 강의실ID변경시 장비목록 조회*/
  useEffect(() => {
    console.log("searchroomid useEffect");
    equlist();
  }, [searchroomid]);

  /* 강의실 목록 */
  const searchroom = (cpage) => {
    if (typeof cpage == "object") {
      cpage = 1;
    }
    cpage = cpage || 1;
    setCurrentPage(cpage);

    //alert(searchRoomName);

    let params = new URLSearchParams();
    params.append("cpage"         , currentPage);
    params.append("pagesize"      , pageSize);
    params.append("searchRoomName", searchRoomName);

    axios
      .post("/adm/lectureRoomListjson.do", params)
      .then((res) => {
        setTotalcnt(res.data.listcnt);
        setRoomlist(res.data.listdata);
      })
      .catch((err) => {
        console.log("list error");
        alert(err.message);
      });
  };

  /* 검색할 강의실 ID 관리 */
  const searchequlist = (id) => {
    setSearchroomid(id);
  };

  /* 강의실 상세 조회 */
  const roommod = (id) => {

    let params = new URLSearchParams();

    params.append("lecrm_id", id);

    axios
      .post("/adm/lectureRoomDtl.do", params)
      .then((res) => {
        setRoomname(res.data.selinfo.lecrm_name);
        setRoomsize(res.data.selinfo.lecrm_size);
        setRoomsite(res.data.selinfo.lecrm_snum);
        setRoometc(res.data.selinfo.lecrm_note);

        setAction("U");
        setSearchroomid(id);
        setIsroomRegBtn(false);
        setRoomdis(true);
      })
      .catch((err) => {
        console.log("list error");
        alert(err.message);
      });
  };

  /* 강의실 명 선택 시 함수 호출 */
  const changesearchroom = (e) => {
    setSearchRoomName(e.target.value);
  };

  /* 장비 리스트 */
  const equlist = async (cpage) => {
    cpage = cpage || 1;
    setEqucurrentPage(cpage);
    setEqudis(true);

    let params = new URLSearchParams();
    params.append("cpage"   , cpage);
    params.append("pagesize", pageSize);
    params.append("lecrm_id", searchroomid);

    await axios
      .post("/adm/equListjson.do", params)
      .then((res) => {
        setEqutotalcnt(res.data.listcnt);
        setEquitemlist(res.data.listdata);
      })
      .catch((err) => {
        console.log("list error");
        alert(err.message);
      });
  };

  /* 장비 상세 조회 */
  const equmod = (id) => {
    setEquid(id);

    let params = new URLSearchParams();
    params.append("equ_id", id);

    axios
      .post("/adm/equDtl.do", params)
      .then((res) => {
        console.log("result equ dtl : " + JSON.stringify(res));
        setEquname(res.data.selinfo.equ_name);
        setEqucnt(res.data.selinfo.equ_num);
        setEquetc(res.data.selinfo.equ_note);

        setEaction("U");
        setIsequRegBtn(false);
        setEqupopdis(true);
      })
      .catch((err) => {
        console.log("list error");
        alert(err.message);
      });
  };

  /* 강의실 신규등록 팝업 */
  const newroom = () => {
    setRoomdis(true);
    setIsroomRegBtn(true);

    setRoomname("");
    setRoomsize(0);
    setRoomsite(0);
    setRoometc("");
    setAction("I");
  };

  /* 장비 신규 등록 */
  const newequ = () => {
    if (searchroomid === 0) {
      alert("강의실을 먼저 선택해 주세요");
      return;
    }

    setIsequRegBtn(true);
    setEqupopdis(true);
    setEaction("I");

    setEquname("");
    setEqucnt(0);
    setEquetc("");
  };

  /* 강의실 삭제 */
  const roomdel = () => {
    roomreg("D");
  };

  /* 강의실 CRUD관리 */
  const roomreg = (type) => {
    if (typeof type == "object") {
      type = action;
    }
  }

  /* 장비 모달창 관리 */
  const closeequModal = () => {
    setEqupopdis(false);
  };

  /* 모달 스타일 관리 */
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

  /* 모달창 관리 */
  const closeroomModal = () => {
    setRoomdis(false);
  };

  /* 장비 CRUD관리 */
  const equreg = (type) => {
    let params = new URLSearchParams();

    if (typeof type === "object") {
      type = eaction;
    }

    if (type != "D") {
      let checkresult = commonjs.nullcheck([
        { inval: equname, msg: "장비 명을 입력해 주세요." },
        { inval: equcnt, msg: "장비 갯수을 입력해 주세요." },
      ]);

      //console.log("checkresult : " + checkresult);

      if (!checkresult) return;
    }

    params.append("lecrm_id", searchroomid);
    params.append("equ_name", equname);
    params.append("equ_num", equcnt);
    params.append("equ_note", equetc);
    params.append("equ_id", equid);
    params.append("action", type);

    axios
      .post("/adm/equSave.do", params)
      .then((res) => {
        console.log("result save : " + JSON.stringify(res));

        if (res.data.result === "S") {
          alert(res.data.resultmsg);
          closeequModal();

          if (action === "I") {
            equlist();
          } else {
            equlist(equcurrentPage);
          }
        } else {
          alert(res.data.resultmsg);
        }
      })
      .catch((err) => {
        console.log("list error");
        alert(err.message);
      });
  };

  const equdel = () => {
    setEaction("D");
    equreg("D");
  };

  return (
    <div className="content">
      {/* 강의실 목록 */}
      <p className="Location">
        <a className="btn_set home">메인으로</a>
        <span className="btn_nav bold">시설 관리</span>
        <span className="btn_nav bold"> 강의실</span>
        <a className="btn_set refresh">새로고침</a>
      </p>

      <p className="conTitle">
        <span>강의실</span>
        <span className="fr">
          <span style={{fontsize: "15px", fontweight: "bold"}}>강의실 명 </span>
          <input type="text" 
                id="searchRoomName"
                name="searchRoomName"  
                className="form-control"
                placeholder=""
                style={{height: "28px",width: "200px"}}
                onChange={changesearchroom}
          />
          <button className="btn btn-primary"
              name="searchbtn"
              id="searchbtn"
              onClick={searchroom}
          >
            <span>검색</span>
          </button>
          <button className="btn btn-primary"
            name="newReg"
            id="newReg"
            onClick={newroom}
          >
            <span>강의실 신규등록</span>
          </button>
        </span>
      </p>
    
      <div>
        <table className="col">
          <colgroup>
            <col width="20%"/>
            <col width="15%"/>
            <col width="15%"/>
            <col width="40%"/>
            <col width="15%"/>
          </colgroup>

          <thead>
            <tr>
              <th scope="col">강의실 명</th>
              <th scope="col">강의실 크기</th>
              <th scope="col">강의실 자리수</th>
              <th scope="col">비고</th>
              <th scope="col"></th>
            </tr>
          </thead> 
          {/* 강의실 목록 랜더링 */}
          <tbody>
            {
              roomlist.map((item) => {
                return(
                  <tr key={item.lecrm_id}>
                    <td className="pointer-cursor"
                        onClick={() => searchequlist(item.lecrm_id)}
                    >
                    {item.lecrm_name}
                    </td>
                    <td>{item.lecrm_size}</td>
                    <td>{item.lecrm_snum}</td>
                    <td>{item.lecrm_note}</td>
                    <td>
                      <button className="btn btn-primary"
                              onClick={() => roommod(item.lecrm_id)}
                      >
                        수정
                      </button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        {/* 강의실 페이징 */}
        <Pagination
          currentPage={currentPage}
          totalPage={totalcnt}
          pageSize={pageSize}
          blockSize={blocksize}
          onClick={searchroom}
        />
      </div>
      {equdis && (
        <div>
          {/* 장비 목록 */}
          <p className="conTitle">
            <span>장비 목록</span>
            <span className="fr">
              <button className="btn btn-primary"
                name="newReg"
                id="newReg"
                onClick={newequ}
              >
                <span>장비 신규등록</span>
              </button>
            </span>
          </p>
        
          <div>
            <table className="col">
              <colgroup>
                <col width="20%"/>
                <col width="15%"/>
                <col width="15%"/>
                <col width="40%"/>
                <col width="15%"/>
              </colgroup>

              <thead>
                <tr>
                  <th scope="col">강의실 명</th>
                  <th scope="col">장비 명</th>
                  <th scope="col">장비 수</th>
                  <th scope="col">비고</th>
                  <th scope="col"></th>
                </tr>
              </thead>
            {/* 장비 목록 랜더링 */}
            <tbody>
              {
                equitemlist.map((item) => {
                  return (
                        <tr key={item.equ_id}>
                          <td>{item.lecrm_name}</td>
                          <td>{item.equ_name}</td>
                          <td>{item.equ_num}</td>
                          <td>{item.equ_note}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                equmod(item.equ_id);
                              }}
                            >
                          수정
                        </button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          {/* 장비 페이징 */}
          <Pagination
            currentPage={currentPage}
            totalPage={equtotalcnt}
            pageSize={pageSize}
            blockSize={blocksize}
            onClick={equlist}
          />
          </div>
        </div>
      )}

      {/* 강의실 모달창 */}
      <Modal
        style={modalStyle}
        isOpen={roomdis}
        onRequestClose={closeroomModal}
      >
        <div id="noticeform">
          <p className="conTitle">
            <span>{isroomRegBtn ? "강의실 등록" : "강의실 수정"}</span>
          </p>
          <table style={{ width: "550px", height: "350px" }}>
            <tbody>
              <tr>
                <th>
                  
                  강의실명 <span className="font_red">*</span>
                </th>
                <td colSpan="3">
                  <input
                    type="text"
                    className="form-control input-sm"
                    style={{ width: "150px" }}
                    value={roomname}
                    onChange={(e) => {
                      setRoomname(e.target.value);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  
                  강의실 크기<span className="font_red">*</span>
                </th>
                <td>
                  <input
                    type="text"
                    className="form-control input-sm"
                    style={{ width: "150px" }}
                    value={roomsize}
                    onChange={(e) => {
                      setRoomsize(e.target.value);
                    }}
                  />
                </td>
                <th>
                  
                  강의실 자릿수<span className="font_red">*</span>
                </th>
                <td>
                  <input
                    type="text"
                    className="form-control input-sm"
                    style={{ width: "150px" }}
                    value={roomsite}
                    onChange={(e) => {
                      setRoomsite(e.target.value);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th> 비고 </th>
                <td colSpan="3">
                  <input
                    type="text"
                    className="form-control input-sm"
                    style={{ width: "350px" }}
                    value={roometc}
                    onChange={(e) => {
                      setRoometc(e.target.value);
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="modal-button">
            {isroomRegBtn && (
              <button className="btn btn-primary mx-2" onClick={roomreg}>
                
                등록
              </button>
            )}
            {!isroomRegBtn && (
              <button className="btn btn-primary mx-2" onClick={roomreg}>
                
                수정
              </button>
            )}
            {!isroomRegBtn && (
              <button className="btn btn-primary mx-2" onClick={roomdel}>
                
                삭제
              </button>
            )}
            <button className="btn btn-primary" onClick={closeroomModal}>
              
              닫기
            </button>
          </div>
        </div>
      </Modal>

      {/* 강의실 모달창 */}
      <Modal
        style={modalStyle}
        isOpen={equpopdis}
        onRequestClose={closeequModal}
      >
        <div id="noticeform">
          <p className="conTitle">
            <span>{isequRegBtn ? "장비 등록" : "정비 수정"}</span>
          </p>
          <table style={{ width: "550px", height: "350px" }}>
            <tbody>
              <tr>
                <th>
                  
                  장비명 <span className="font_red">*</span>
                </th>
                <td>
                  <input
                    type="text"
                    className="form-control input-sm"
                    style={{ width: "150px" }}
                    value={equname}
                    onChange={(e) => {
                      setEquname(e.target.value);
                    }}
                  />
                </td>
                <th>
                  장비수<span className="font_red">*</span>
                </th>
                <td>
                  <input
                    type="text"
                    className="form-control input-sm"
                    style={{ width: "150px" }}
                    value={equcnt}
                    onChange={(e) => {
                      setEqucnt(e.target.value);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th> 비고 </th>
                <td colSpan="3">
                  <input
                    type="text"
                    className="form-control input-sm"
                    style={{ width: "350px" }}
                    value={equetc}
                    onChange={(e) => {
                      setEquetc(e.target.value);
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="modal-button">
            {isequRegBtn && (
              <button className="btn btn-primary mx-2" onClick={equreg}>
                등록
              </button>
            )}
            {!isequRegBtn && (
              <button className="btn btn-primary mx-2" onClick={equreg}>
                수정
              </button>
            )}
            {!isequRegBtn && (
              <button className="btn btn-primary mx-2" onClick={equdel}>
                삭제
              </button>
            )}
            <button className="btn btn-primary" onClick={closeequModal}>
              닫기
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SamplePage7