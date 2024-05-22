import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import axios, { all } from "axios";
import StdList from "./registerListControl/StdList";
import ModalLec from "./registerListControl/ModalLec";

const RegisterListControl = () => {
  const navigate = useNavigate();
  const searchInfo = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [leclist, setLeclist] = useState([]);
  const [totalcnt, setTotalcnt] = useState(0);
  const [lecModal, setLecModal] = useState(false);
  const [lecId, setLecId] = useState();
  const [searchKey, setSearchKey] = useState("all");

  const searchstyle = {
    fontsize: "15px",
    fontweight: "bold",
  };

  const searchstylewidth = {
    height: "28px",
    width: "200px",
  };

  useEffect(() => {
    searchlec(currentPage);
  }, [currentPage, lecModal]);

  const searchleclist = (lecId) => {
    const query = [`id=${lecId ?? 0}`];
    navigate(`/dashboard/register/registerListControl?${query}`);
  };

  const searchlec = (cpage) => {
    if (typeof cpage === "number") {
      cpage = cpage || 1;
    } else {
      cpage = 1;
    }
    let params = new URLSearchParams();
    params.append("currentPage", cpage);
    params.append("pageSize", 5);
    params.append("searchInfo", searchInfo.current.value);
    params.append("searchKey", searchKey);
    axios
      .post("/register/listLecjson.do", params)
      .then((res) => {
        setTotalcnt(res.data.lec_Total);
        setLeclist(res.data.lec_List);
        setCurrentPage(cpage);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        alert("서버에서 데이터를 불러오는 중에 오류가 발생했습니다.");
      });
  };
  const newlec = () => {
    setLecId("");
    setLecModal(true);
  };

  const openLec = (id) => {
    setLecId(id);
    setLecModal(true);
  };

  const deleteLec = (id) => {
    let params = new URLSearchParams();
    params.append("lec_id", id);
    axios
      .post("/register/delRegister.do", params)
      .then((res) => {
        if (res.data.result === "SUCCESS") {
          alert(res.data.resultMsg);
          setCurrentPage(1);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        alert("삭제 실패하였습니다.");
      });
  };

  return (
    <div>
      <div>
        <p className="Location">
          <span className="btn_nav bold">학습 관리</span>{" "}
          <span className="btn_nav bold"> 강의목록</span>{" "}
        </p>
        <p className="conTitle">
          <span>강의 관리</span>{" "}
          <span className="fr">
            <select
              value={searchKey}
              onChange={(e) => {
                setSearchKey(e.target.value);
              }}
            >
              <option value="all">전체</option>
              <option value="lec_name">강의명</option>
              <option value="t_name">강사명 </option>
            </select>
            <input
              type="text"
              id="searchInfo"
              name="searchInfo"
              className="form-control"
              placeholder=""
              style={searchstylewidth}
              ref={searchInfo}
            />
            <button
              className="btn btn-primary"
              onClick={searchlec}
              name="searchbtn"
              id="searchbtn"
            >
              <span>검색</span>
            </button>

            <button
              className="btn btn-primary"
              name="newReg"
              id="newReg"
              onClick={() => newlec()}
            >
              <span>강의 신규등록</span>
            </button>
          </span>
        </p>

        <div>
          <b>
            총건수 : {totalcnt} 현재 페이지 번호 : {currentPage}
          </b>
          <table className="col">
            <colgroup>
              <col width="10%" />
              <col width="20%" />
              <col width="10%" />
              <col width="10%" />
              <col width="10%" />
              <col width="25%" />
              <col width="15%" />
            </colgroup>
            <thead>
              <tr>
                <th>강의번호</th>
                <th>강의명</th>
                <th>담당교수</th>
                <th>강의실</th>
                <th>수강인원</th>
                <th>기간</th>
                <th>수정/삭제</th>
              </tr>
            </thead>
            <tbody>
              {leclist.map((item) => {
                return (
                  <tr key={item.lec_id}>
                    <td>{item.lec_id}</td>
                    <td
                      className="pointer-cursor"
                      onClick={() => searchleclist(item.lec_id)}
                    >
                      {item.lec_name}
                    </td>
                    <td>{item.t_name}</td>
                    <td>{item.lecrm_name}</td>
                    <td>{item.pre_pnum}</td>
                    <td>
                      {item.start_date} ~ {item.end_date}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          openLec(item.lec_id);
                        }}
                      >
                        수정
                      </button>
                      /
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          deleteLec(item.lec_id);
                        }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPage={totalcnt}
            pageSize={5}
            blockSize={5}
            onClick={searchlec}
          />
        </div>
        <StdList></StdList>
        {lecModal ? (
          <ModalLec
            modalAction={lecModal}
            setCurrentPage={setCurrentPage}
            setModalAction={setLecModal}
            id={lecId}
          ></ModalLec>
        ) : null}
      </div>
    </div>
  );
};

export default RegisterListControl;
