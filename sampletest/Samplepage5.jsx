import { useEffect, useRef, useState } from "react";
import Equipment from "./sampletest5/Equipment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import ModalLecture from "./sampletest5/ModalLecture";

const SamplePage5 = () => {
  const navigate = useNavigate();
  const searchRoomName = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [roomlist, setRoomlist] = useState([]);
  const [totalcnt, setTotalcnt] = useState(0);
  const [lectureModal, setLectureModal] = useState(false);
  const [lecrmId, setLecrmId] = useState();

  const searchstyle = {
    fontsize: "15px",
    fontweight: "bold",
  };

  const searchstylewidth = {
    height: "28px",
    width: "200px",
  };

  useEffect(() => {
    searchroom(currentPage);
  }, [currentPage, lectureModal]);

  const searchequlist = (lecrmId,lecrmName) => {
    const query = [`id=${lecrmId ?? 0}&name=${lecrmName}`];
    navigate(`/dashboard/sampletest/samplepage5?${query}`)
  }

  const searchroom = (cpage) => {
    if (typeof cpage === 'number') {
      cpage = cpage || 1;
    } else {
      cpage = 1;
    }
    let params = new URLSearchParams();
    params.append("cpage", cpage);
    params.append("pagesize", 5);
    params.append("searchRoomName", searchRoomName.current.value);
    axios
      .post("/adm/lectureRoomListjson.do", params)
      .then((res) => {
        setTotalcnt(res.data.listcnt);
        setRoomlist(res.data.listdata);
        setCurrentPage(cpage);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const openLecture = (id) => {
    setLecrmId(id);
    setLectureModal(true);
  }

  const newroom = () => {
    setLecrmId("");
    setLectureModal(true);
  }

  return (
    <div>
      <div>
        <p className="Location">
          <span className="btn_nav bold">시설 관리</span>
          <span className="btn_nav bold"> 강의실</span>
        </p>
        <p className="conTitle">
          <span>강의실</span>
          <span className="fr">
            <span style={searchstyle}>강의실 명 </span>
            <input
              type="text"
              id="searchRoomName"
              name="searchRoomName"
              className="form-control"
              placeholder=""
              style={searchstylewidth}
              ref={searchRoomName}
            />
            <button
              className="btn btn-primary"
              onClick={searchroom}
              name="searchbtn"
              id="searchbtn"
            >
              <span>검색</span>
            </button>

            <button
              className="btn btn-primary"
              onClick={() => newroom()}
              name="newReg"
              id="newReg"
            >
              <span>강의실 신규등록</span>
            </button>
          </span>
        </p>

        <div>
          <b>
            총건수 : {totalcnt} 현재 페이지 번호 : {currentPage}
          </b>
          <table className="col">
            <colgroup>
              <col width="20%" />
              <col width="15%" />
              <col width="15%" />
              <col width="40%" />
              <col width="15%" />
            </colgroup>
            <thead>
              <tr>
                <th>강의실 명</th>
                <th>강의실 크기</th>
                <th>강의실 자리수</th>
                <th>비고</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {roomlist.map((item) => {
                return (
                  <tr key={item.lecrm_id}>
                    <td
                      className="pointer-cursor"
                      onClick={() => searchequlist(item.lecrm_id,item.lecrm_name)}
                    >
                      {item.lecrm_name}
                    </td>
                    <td>{item.lecrm_size}</td>
                    <td>{item.lecrm_snum}</td>
                    <td>{item.lecrm_note}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          openLecture(item.lecrm_id)
                        }}
                      >
                        수정
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
            onClick={searchroom}
          />
        </div>
        <Equipment></Equipment>
        {lectureModal ? <ModalLecture modalAction={lectureModal} setCurrentPage={setCurrentPage} setModalAction={setLectureModal} id={lecrmId}></ModalLecture> : null}
      </div>
    </div>
  )
}

export default SamplePage5; 