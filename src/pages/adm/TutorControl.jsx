import React, {useState, useRef, useEffect} from "react";
import axios from "axios";
import Pagination from "../../components/common/Pagination";
import ModalTutor from "./ModalTutor";


const TutorControl = () => {

    let pageSize = 10;
    let blockSize = 5;

    const [currentPage, setCurrentPage] = useState(1);
    const [searchKey, setSearchKey] = useState('all');
    const searchInput = useRef('');
    const inputFromDate = useRef();
    const inputToDate = useRef();
    
    const [tutorList, setTutorList] = useState([]);
    const [tutorTotalCnt, setTutorTotalCnt] = useState(0);

    const [tutorDetailModalOn, setTutorDetailModalOn] = useState(false);
    const [selTutorId, sestSelTutorId] = useState('');

    
    useEffect(() => {
        searchTutorList();
    }, []);

    // 강사목록 조회
    const searchTutorList = (cpage, userType) => {
        
        cpage = typeof cpage === 'object'? 1 : cpage || 1;
        userType = userType? userType : '';

        setCurrentPage(cpage);

        // var param = {
      //    searchKey : searchKey,
      //    searchWord : searchWord,
      //    lec_id : lec_id,
      //    currentPage : currentPage,
      //    pageSize : pageSize,
      //    from_date : from_date,
      //    to_date : to_date,
      //    user_type : user_type
      // }
        // callAjax("/adm/list_tut.do", "post", "text", true, param, resultCallback);

        let params = new URLSearchParams();

        params.append('searchKey', searchKey);
        params.append('searchWord', searchInput.current.value);
        // params.append('lec_id', "");
        params.append('currentPage', currentPage);
        params.append('pageSize', pageSize);
        params.append('from_date', inputFromDate.current.value);
        params.append('to_date', inputToDate.current.value);
        params.append('user_type', userType);

        axios.post("/adm/list_tutjson.do", params)
            .then((res) => {
                console.log("selectCourse() result console : " + JSON.stringify(res));
                // {"data":{"totalCnt":77,
                //          "list_tut":[{"lec_id":0,"lecrm_id":0,"max_pnum":0,"pre_pnum":0,"start_date":null,"end_date":null,
                //                       "process_day":0,"lec_type_id":0,"lec_type_name":null,"test_id":0,"test_start":null,"test_end":null,
                //                       "tutor_id":null,"lec_name":null,"lec_goal":null,"lec_sort":null,"loginID":"hawawa1",
                //                       "user_type":"A","use_yn":null,"name":"홍길동","password":null,
                //                       "tel":"01028588029","sex":null,"mail":"hsbzzang@naver.com","addr":null,
                //                       "join_date":"2024.05.21","regi_num":null,"std_num":null},],
                //          "pageSize":10,"currentPage":1}
                setTutorList(res.data.list_tut);
                setTutorTotalCnt(res.data.totalCnt);
            })
            .catch((err) => {
                console.log("selectCourse() result error : " + err.message);
                alert(err.message);
            });
    };

    // 강사 승인
    const approveTutor = (tutorId) => {

        if ( window.confirm("승인 하시겠습니까?") ) {
            // var param = {
         //    loginID : loginID
         // }
            // callAjax("/adm/apv_tut.do", "post", "json", true, param, resultCallback);

            let params = new URLSearchParams();
            params.append('loginID', tutorId);

            axios.post("/adm/apv_tut.do", params)
                .then((res) => {
                    // {"data":{"result":"SUCCESS","resultMsg":"강사 승인 되었습니다."}
                    console.log("approveTutor() result console : " + JSON.stringify(res));

                    if (res.data.result === "SUCCESS") {
                        alert(res.data.resultMsg);
                        searchTutorList();
                    } else {
                        alert(res.data.resultMsg);
                    }
                })
                .catch((err) => {
                    console.log("approveTutor() result error : " + err.message);
                    alert(err.message);
                });
        }
    }
    
    // 강사 탈퇴
    const banTutor = (tutorId) => {

        if ( window.confirm("정말 탈퇴시키겠습니까?") ) {
            // var param = {
         //    loginID : loginID
         // }
            // callAjax("/adm/ban_user.do", "post", "json", true, param, resultCallback);

            let params = new URLSearchParams();
            params.append('loginID', tutorId);

            axios.post("/adm/ban_user.do", params)
                .then((res) => {
                    // {"data":{"result":"SUCCESS","resultMsg":"회원 탈퇴 되었습니다."}
                    console.log("banTutor() result console : " + JSON.stringify(res));

                    if (res.data.result === "SUCCESS") {
                        alert(res.data.resultMsg);
                        searchTutorList();
                    } else {
                        alert(res.data.resultMsg);
                    }
                })
                .catch((err) => {
                    console.log("banTutor() result error : " + err.message);
                    alert(err.message);
                });
        }
    }

    // 강사 정보 상세보기 modal open
    const searchTutorDetail = (id) => {
        sestSelTutorId(id);
        setTutorDetailModalOn(true);
    }

    const searchstyle = {
        fontsize: "15px",       
        fontweight: "bold",
        height: "35px",
    };

    const searchstylewidth = {
        height: "35px",
        width: "200px",    
    };

    return (
        <div className='content'>
            <p className='Location'>
                <a className='btn_set home'>메인으로</a>
                <span className='btn_nav bold'>인원관리</span>
                <span className='btn_nav bold'>강사관리</span>
                <a className='btn_set refresh'>새로고침</a>
            </p>

            {/* 강사목록 조회 */}
            <p className="conTitle">
                <span>강사 목록</span>{" "}            
                <span className="fr">
                    <select id="searchKey" 
                            className="form-control"
                            style={searchstyle}
                            onChange={(e) => {
                                setSearchKey(e.target.value)
                            }}>
                        <option value="all">전체</option>
                        <option value="name">강사명</option>
                        <option value="id">ID</option>
                        <option value="tel">전화번호</option>
                    </select>{" "}
                    <input type="text" 
                        className="form-control"
                        id="searchLecInput"
                        name="searchLecInput"
                        placeholder=""
                        style={searchstylewidth}
                        ref={searchInput}
                    />{" "}
                    <button className="btn btn-primary"
                        id="searchbtn"
                        name="searchbtn"
                        onClick={(e) => {
                            searchTutorList(currentPage)
                        }}
                    >
                        <span>검색</span>
                    </button><br/>
                </span>
            </p>
            <span className="fl">
                <button className="btn btn-primary"
                    id="searchbtn"
                    name="searchbtn"
                    onClick={(e) => {
                        searchTutorList(1, 'B')
                    }}
                >                    
                    <span>승인강사</span>
                </button>
                <button className="btn btn-primary"
                    id="searchbtn"
                    name="searchbtn"
                    onClick={(e) => {
                        searchTutorList(1, 'E')
                    }}
                >                    
                    <span>미승인강사</span>
                </button>
            </span>
            <span className="fr">
                <strong>가입일 조회</strong>{" "}
                    <input type ="date"
                        style={{ width: "150px"}}
                        className="form-control input-sm"
                        ref={inputFromDate}
                    />{" "} ~ {" "}
                    <input type ="date"
                        style={{ width: "150px"}}
                        className="form-control input-sm"
                        ref={inputToDate}
                    />{" "}
                    <button className="btn btn-primary"
                        id="searchbtn"
                        name="searchbtn"
                        onClick={(e) => {
                            searchTutorList(currentPage)
                        }}
                    >                    
                        <span>조회</span>
                    </button>
            </span><br/><br/>        
            <div>
                <span>총 건수 : {tutorTotalCnt} / 현재 페이지 번호 : {currentPage}</span>
                <table className="col">
                    <colgroup>
                        <col width="30%"/>
                        <col width="20%"/>
                        <col width="20%"/>
                        <col width="10%"/>
                        <col width="20%"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>강사명 (ID)</th>
                            <th>휴대전화</th>
                            <th>가입일자</th>
                            <th>승인여부</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tutorTotalCnt === 0 && (
                            <tr><td colSpan="5">데이터가 없습니다.</td></tr>
                        )}
                        {/* 강사 목록 looping */}
                        {/* {"data":{"totalCnt":77,
                                     "list_tut":[{"lec_id":0,"lecrm_id":0,"max_pnum":0,"pre_pnum":0,"start_date":null,"end_date":null,
                                                  "process_day":0,"lec_type_id":0,"lec_type_name":null,"test_id":0,"test_start":null,"test_end":null,
                                                  "tutor_id":null,"lec_name":null,"lec_goal":null,"lec_sort":null,"loginID":"hawawa1",
                                                  "user_type":"A","use_yn":null,"name":"홍길동","password":null,
                                                  "tel":"01028588029","sex":null,"mail":"hsbzzang@naver.com","addr":null,
                                                  "join_date":"2024.05.21","regi_num":null,"std_num":null},],
                                     "pageSize":10,"currentPage":1} */}
                        {/* <c:if test="${list.user_type =='E'}">
                        <td><span style="color:red">미승인</span></td>
                        </c:if>
                        <c:if test="${list.user_type =='B'}">
                        <td><span style="color:blue">승인</span></td>
                        </c:if>                                      */}
                        {
                            tutorTotalCnt > 0 && tutorList.map((item) => {
                                return (
                                    <tr>
                                        <td className="pointer-cursor" 
                                            onClick={() => {
                                                searchTutorDetail(item.loginID)
                                            }}><strong>{item.name} ({item.loginID})</strong></td>
                                        <td>{item.tel}</td>
                                        <td>{item.join_date}</td>
                                        <td>{item.user_type === 'E'? '미승인' : '승인'}</td>
                                        <td>
                                            {
                                            item.user_type === 'E' &&
                                                <button className="btn btn-primary"
                                                id="searchbtn"
                                                name="searchbtn"
                                                onClick={(e) => {
                                                    approveTutor(item.loginID)
                                                }}
                                                >
                                                    <span>승인</span>
                                                </button>
                                            }{" "}
                                            <button className="btn btn-primary"
                                            id="searchbtn"
                                            name="searchbtn"
                                            onClick={(e) => {
                                                banTutor(item.loginID)
                                            }}
                                            >
                                                <span>탈퇴</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                {/* 강사목록 페이징 */}
                {tutorTotalCnt > 0 && <Pagination currentPage={currentPage}
                                                totalPage={tutorTotalCnt}
                                                pageSize={pageSize}
                                                blockSize={blockSize}
                                                onClick={searchTutorList}/>}
            </div> {/* End 강사목록 조회 */}
            {tutorDetailModalOn? <ModalTutor modalAction={tutorDetailModalOn} 
                                             setModalAction={setTutorDetailModalOn} 
                                             tutorId={selTutorId}
                                             ></ModalTutor> : null}
        </div>
    )    
}

export default TutorControl