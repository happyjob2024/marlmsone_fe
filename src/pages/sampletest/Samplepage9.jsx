import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
// import ModalAdvList from "./advice/ModalAdvList";
// import ModalMlecList from "./advice/ModalMlecList";


const SamplePage9 = () => {
  const navigate = useNavigate();
  const searchName = useRef();
  const [roomlist, setRoomlist] = useState([]);
  const [advlist, setAdvlist] = useState([]);
  const [lecrmId, setLecrmId] = useState();
  const [lectureModal, setLectureModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalcnt, setTotalcnt] = useState(0);
  
  useEffect(() => {
    console.log("SamplePage9 useEffect  시작");
    searchList();
    adviceList(currentPage);
  }, [currentPage,lectureModal]);

  const searchequlist = (lecrmId) => {
    const query = [`id=${lecrmId ?? 0}`];
    navigate(`/dashboard/sampletest/samplepage9?${query}`)
  }

  const searchList = (cpage) => {
    if (typeof cpage === 'number') {
      cpage = cpage || 1;
    } else {
      cpage = 1;
    }
    
    let params = new URLSearchParams();
    params.append("pageSize", 5);
    params.append("searchName", searchName);
    params.append("currentPage", cpage);
    axios
      .post("/adv/lecListjson.do", params)
      .then((res) => {
        setTotalcnt(res.data.listCnt);
        setRoomlist(res.data.listData);
        setCurrentPage(cpage);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const adviceList = (cpage) => {
    if (typeof cpage === 'number') {
      cpage = cpage || 1;
    } else {
      cpage = 1;
    }
    
    let params = new URLSearchParams();
    params.append("pageSize", 5);
    params.append("searchName", searchName);
    params.append("currentPage", cpage);
    axios
      .post("/adv/advListjson.do", params)
      .then((res) => {
        setTotalcnt(res.data.listCnt);
        setAdvlist(res.data.listData);
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
    <div className="content">
						<p className="Location">
							<a className="btn_set home">메인으로</a> <span
								className="btn_nav bold">학습관리</span> <span 
								className="btn_nav bold">수강상담 관리</span> 
              <a className="btn_set refresh">새로고침</a>
						</p>						
						
						<p className="conTitle">
							<span>수강상담 관리</span>
							<span className="fr">
              <select id="lecList"
                style={{width: "200px"}}
                // onChange={fn_selLecture}
                >   
                <option value="">전체 과정</option>
                {
                  roomlist.map((item, index) => {
                    return (
                      <option value={item.lec_id} key={index}>{item.lec_name}</option>
                    )
                  })
                }
              </select>     
								<button 
                  className="btnType blue"
                  name="modal"
                  onClick={() => newroom()}
                >
                  <span>상담 등록</span>
                </button>						
							</span>	
						</p>				
       
						<div className="divList">
							<table className="col">
								<caption>caption</caption>
								<colgroup>
									<col width="10%"/>
									<col width="30%"/>
									<col width="20%"/>
									<col width="20%"/>
									<col width="20%"/>
								</colgroup>
	
								<thead>
									<tr>										
										<th scope="col">상담 번호</th>
										<th scope="col">과정 명</th>
										<th scope="col">학생 명 (ID)</th>
										<th scope="col">상담일자</th>
										<th scope="col">상담자 명 (ID)</th>
									</tr>
								</thead>
								<tbody id="advListBody">
                {advlist.map((item) => {
                return (
                  <tr key={item.adv_id}>
                    <td
                      className="pointer-cursor"
                      onClick={() => searchequlist(item.adv_id)}
                    >
                      {item.adv_id}
                    </td>
                    <td>{item.lec_name+"("+ item.lec_id+")"}</td>
                    <td onClick={() => {
                          openLecture(item.adv_id)
                        }}
                      >{item.std_name +"("+ item.std_id+")"}</td>
                    <td>{item.adv_date}</td>
                    <td>{item.tut_name +"("+ item.tut_id+")"}</td>
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
                onClick={adviceList}
              />
						</div>
            {/*
            {lectureModal ? <ModalAdvList modalAction={lectureModal} setCurrentPage={setCurrentPage} setModalAction={setLectureModal} id={lecrmId}></ModalAdvList> : null}
            {lectureModal ? <ModalMlecList modalAction={lectureModal} setCurrentPage={setCurrentPage} setModalAction={setLectureModal} id={lecrmId}></ModalMlecList> : null}
            */}
           
					</div>
  )
}

export default SamplePage9
