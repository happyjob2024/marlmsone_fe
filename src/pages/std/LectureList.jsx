import React, {useState, useRef, useEffect} from "react";
import axios from "axios";

import Pagination from "../../components/common/Pagination";
import ModalLecture from "./ModalLecture";



const LectureList = () => {

    let pageSize = 5;
    let blockSize = 10;

    const [currentPage, setCurrentPage] = useState(1);
    const [searchKey, setSearchKey] = useState('all');
    const searchInput = useRef('');

    const [lecList, setLecList] = useState([]);         // 수강가능한 강의목록
    const [lecTotalCnt, setLecTotalCnt] = useState(0);  // 수강가능한 강의 총 개수

    const [lecDtlModalOn, setLecDtlModalOn] = useState(false);
    const [selLecId, setSelLecId] = useState('');

    
    useEffect(() => {
        searchLecInfoList();
    }, []);

    // 수강가능한 강의목록 조회
    const searchLecInfoList = (cpage) => {
        
        cpage = typeof cpage === 'object'? 1 : cpage || 1;
        setCurrentPage(cpage);

		// var param = {
        //     pageSize : pageSize,
        //     currentPage : currentPage,
        //     searchInfo : $("#searchInfo").val(),
        //     searchKey : $("#searchKey").val()
        // }
        // url : '/std/lecList.do',

        let params = new URLSearchParams();

        params.append('pageSize', pageSize);
        params.append('currentPage', cpage);
        params.append('searchInfo', searchInput.current.value);
        params.append('searchKey', searchKey);

        axios.post("/std/lecListjson.do", params)
            .then((res) => {
                // console.log("searchLecInfoList() result console : " + JSON.stringify(res));
                // {"data":{"lecList":[{"lec_id":14,"tutor_id":"b_zzz","lecrm_id":0,"lec_name":"gggg",
                //                      "lecrm_name":null,"max_pnum":50,"pre_pnum":1,
                //                      "start_date":1704034800000,"end_date":1716994800000,
                //                      "lec_goal":null,"test_id":0,"test_start":null,"test_end":null,
                //                      "lec_type_id":0,"lec_type_name":null,"lec_sort":null,
                //                      "name":"실험 강사","tel":null,"mail":null,"week":null,
                //                      "learn_goal":null,"learn_con":null}],
                //          "lecTotal":7}
                
                setLecTotalCnt(res.data.lecTotal);
                setLecList(res.data.lecList);
            })
            .catch((err) => {
                console.log("searchLecInfoList() result error : " + err.message);
                alert(err.message);
            });
    };

    // 강의 정보 상세보기 modal open
    const searchLecDetail = (id) => {
        setSelLecId(id);
        setLecDtlModalOn(true);
    }

    // 날짜를 yyyy-MM-dd 형식으로 포맷하는 함수
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const searchstyle = {
        fontsize: "15px",    
        fontweight: "bold",
    };

    const searchstylewidth = {
        height: "28px",
        width: "200px",    
    };

    return (
        <div className='content'>
            <p className='Location'>
                <a className='btn_set home'>메인으로</a>
                <span className='btn_nav bold'>학습지원</span>
                <span className='btn_nav bold'>강의목록</span>
                <a className='btn_set refresh'>새로고침</a>
            </p>

            {/* 강사의 강의목록 조회 */}
            <p className="conTitle">
                <span>강의목록</span>{" "}            
                <span className="fr">
                    <select id="searchKey" 
                            className="form-control"
                            style={searchstyle}
                            onChange={(e) => {
                                setSearchKey(e.target.value)
                            }}>
                        <option value="all">전체</option>
                        <option value="name">강사명</option>
                        <option value="lec_name">강의명</option>
                    </select> 
                    <input type="text" 
                        className="form-control"
                        id="searchLecInput"
                        name="searchLecInput"
                        placeholder=""
                        style={searchstylewidth}
                        ref={searchInput}
                    />
                    <button className="btn btn-primary"
                        id="searchbtn"
                        name="searchbtn"
                        onClick={(e) => {
                            searchLecInfoList(currentPage)
                        }}
                    >
                        <span>검색</span>
                    </button>
                </span>
            </p>
            <div>
                {/* {"data":{"lecList":[{"lec_id":14,"tutor_id":"b_zzz","lecrm_id":0,"lec_name":"gggg",
                             "lecrm_name":null,"max_pnum":50,"pre_pnum":1,
                             "start_date":1704034800000,"end_date":1716994800000,
                             "lec_goal":null,"test_id":0,"test_start":null,"test_end":null,
                             "lec_type_id":0,"lec_type_name":null,"lec_sort":null,
                             "name":"실험 강사","tel":null,"mail":null,"week":null,
                             "learn_goal":null,"learn_con":null}] */}
                <span>총 건수 : {lecTotalCnt} / 현재 페이지 번호 : {currentPage}</span>
                <table className="col">
                    <colgroup>
                        <col width="15%"/>
                        <col width="10%"/>
                        <col width="15%"/>
                        <col width="15%"/>
                        <col width="15%"/>
                        <col width="10%"/>
                        <col width="10%"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>강의명</th>
                            <th>수강대상</th>
                            <th>강사명</th>
                            <th>개강일</th>
                            <th>종강일</th>
                            <th>수강인원</th>
                            <th>최대인원</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lecTotalCnt === 0 && (
                            <tr><td colSpan="7">데이터가 없습니다.</td></tr>
                        )}
                        {/* 강의 목록 looping */}
                        {
                            lecTotalCnt > 0 && lecList.map((item) => {
                                return (
                                    <tr>
                                        <td className="pointer-cursor" 
                                            onClick={() => {
                                                searchLecDetail(item.lec_id)
                                            }}>{item.lec_name}</td>
                                        <td>{item.lec_sort}</td>
                                        <td>{item.name}</td>
                                        <td>{formatDate(item.start_date)}</td>
                                        <td>{formatDate(item.end_date)}</td>
                                        <td>{item.pre_pnum}</td>
                                        <td>{item.max_pnum}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                {/* 강의목록 페이징 */}
                {lecTotalCnt > 0 && <Pagination currentPage={currentPage}
                                                totalPage={lecTotalCnt}
                                                pageSize={pageSize}
                                                blockSize={blockSize}
                                                onClick={searchLecInfoList}/>}
            </div> {/* End 강사의 강의목록 조회 */}
            {/* {lecStdListOn? <Student></Student> : null} */}
            {lecDtlModalOn? <ModalLecture modalAction={lecDtlModalOn} 
                                          setModalAction={setLecDtlModalOn}
                                          lecId={selLecId}
                                          searchList={searchLecInfoList}
                                          ></ModalLecture> : null}
        </div>
    )    
}

export default LectureList