import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import LecPlanModal from "./LecPlanModal";

const LecturePlan = () => {
  const navigate = useNavigate();
  const searchRoomName = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [leclist, setLeclist] = useState([]);
  const [roomlist, setRoomlist] = useState([]);
  const [totalcnt, setTotalcnt] = useState(0);
  const [progress, setProgress] = useState('ing');
  const [lecplanModal, setLecplanModal] = useState(false);
  const [lec_id, setLecid] = useState();

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

  }, [currentPage, progress]);


  const searchequlist = (lecrmId) => {
    const query = [`id=${lecrmId ?? 0}`];
    navigate(`/dashboard/tut/TestLecturePlan?${query}`)
  }

  const searchroom = (cpage) => {
    if (typeof cpage === 'number') {
      cpage = cpage || 1;
    } else {
      cpage = 1;
    }
    let params = new URLSearchParams();
    params.append("currentPage", cpage);
    params.append("pageSize", 10);
    params.append("searchWord", searchRoomName.current.value);
    params.append("progress", progress);
    axios
      .post("/tut/fLectureListJson.do", params)
      .then((res) => {
        setTotalcnt(res.data.listcnt);
        setLeclist(res.data.listdata);
        setRoomlist(res.data.lec_room);
        setCurrentPage(cpage);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const toggle = (state) => {
    setProgress(state);
  }

  const openlec = (id) => {
    setLecid(id);
    setLecplanModal(true);
  }

  return (
    <div>
      <div>
        <p className="Location">
          <span className="btn_nav bold">기준정보</span>
          <span className="btn_nav bold"> 공지사항 관리</span>
        </p>
        <p className="conTitle">
          <span>강의계획서 관리</span>
          <span className="fr">
            <span style={searchstyle}>강의 명 </span>
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


          </span>
        </p>

        <div>
          <button className="btn btn-primary"
            onClick={() => {
              toggle('ing');
            }}>진행중 강의 </button>{" "}
          <button className="btn btn-primary"
            onClick={() => {
              toggle('end');
            }}> 종료된 강의</button>
          <table className="col">
            <colgroup>
              <col width="20%" />
              <col width="35%" />
              <col width="30%" />
              <col width="40%" />

            </colgroup>
            <thead>
              <tr>
                <th>분류</th>
                <th>강의명</th>
                <th>기간</th>
                <th>수강인원</th>
              </tr>
            </thead>
            <tbody>
              {leclist.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item.lec_type_name}</td>
                    <td className="pointer-cursor"
                      onClick={() => openlec(item.lec_id)}>
                      {item.lec_name} </td>
                    <td>{item.start_date} ~ {item.end_date}</td>
                    <td>{item.pre_pnum}/{item.max_pnum}</td>
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
        {lecplanModal ? <LecPlanModal id={lec_id} roomlist={roomlist} idlist={leclist} modalAction={lecplanModal} setModalAction={setLecplanModal} ></LecPlanModal> : null}
      </div>
    </div>
  )
}

export default LecturePlan;