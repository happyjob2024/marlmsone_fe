import React, {useState, useRef, useEffect} from "react";
import axios from "axios";
import Pagination from "../../components/common/Pagination";
import ChartComponent from "./ChartComponent";



const CourseSize = () => {

    let pageSize = 15;
    let blockSize = 5;

    const [currentPage, setCurrentPage] = useState(1);
    const [searchKey, setSearchKey] = useState('');
    const searchInput = useRef('');
    const inputFromDate = useRef();
    const inputToDate = useRef();

    const [lecList, setLecList] = useState([]);         // 수강가능한 강의목록
    const [lecTotalCnt, setLecTotalCnt] = useState(0);  // 수강가능한 강의 총 개수

    const [chartModalOn, setChartModalOn] = useState(false);
    const [selLecId, setSelLecId] = useState('');

    
    useEffect(() => {
        searchLecInfoList();
    }, []);

    // 강의목록 조회
    const searchLecInfoList = (cpage) => {
        
        cpage = typeof cpage === 'object'? 1 : cpage || 1;
        setCurrentPage(cpage);

        // var param = {
        //     searchKey : searchKey,
        //     searchWord : searchWord,
        //     currentPage : currentPage,
        //     pageSize : pageSize,
        //     from_date : from_date,
        //     to_date : to_date
        // }
        // callAjax("/adm/selectCourse.do", "post", "text", true, param, resultCallback);

        let params = new URLSearchParams();

        params.append('searchKey', searchKey);
        params.append('searchWord', searchInput.current.value);
        params.append('currentPage', cpage);
        params.append('pageSize', pageSize);
        params.append('from_date', inputFromDate.current.value);
        params.append('to_date', inputToDate.current.value);

        axios.post("/adm/selectCoursejson.do", params)
            .then((res) => {
                console.log("selectCourse() result console : " + JSON.stringify(res));
                // "data":{"totalCnt":20,
                //         "lecList":[{"lec_id":1,"tutor_id":null,"lec_name":"자바의이해",
                //                     "max_pnum":50,"pre_pnum":0,"start_date":"2024.03.05","end_date":"2024.06.15",
                //                     "process_day":null,"test_id":0,"loginID":null,"user_type":null,
                //                     "use_yn":null,"name":"스티븐잡스","std_id":null,"test_score":0,"tot_score":286,
                //                     "max_score":100,"min_score":43,"avg_score":71,"fail_cnt":2,"fail_rate":0}],
                //         "pageSize":5,
                //         "currentPage":1}
                
                setLecTotalCnt(res.data.totalCnt);
                setLecList(res.data.lecList);
            })
            .catch((err) => {
                console.log("selectCourse() result error : " + err.message);
                alert(err.message);
            });
    };

    // 강의 정보 상세보기 modal open
    const searchCourseSizeDetail = (id) => {
        setSelLecId(id);
        setChartModalOn(true);
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
                <span className='btn_nav bold'>통계</span>
                <span className='btn_nav bold'>수강인원</span>
                <a className='btn_set refresh'>새로고침</a>
            </p>

            {/* 강사의 강의목록 조회 */}
            <p className="conTitle">
                <span>수강 인원</span>{" "}            
                <span className="fr">
                    <select id="searchKey" 
                            className="form-control"
                            style={searchstyle}
                            onChange={(e) => {
                                setSearchKey(e.target.value)
                            }}>
                        <option value="all">전체</option>
                        <option value="lec_name">강의명</option>
                        <option value="tutor_name">강사명</option>
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
                            searchLecInfoList(currentPage)
                        }}
                    >
                        <span>검색</span>
                    </button><br/>
                </span>
            </p>
            <span className="fr">
                <strong>수업일 조회</strong>{" "}
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
                            searchLecInfoList(currentPage)
                        }}
                    >                    
                        <span>조회</span>
                    </button>
            </span><br/>
        
            <div>
                <span>총 건수 : {lecTotalCnt} / 현재 페이지 번호 : {currentPage}</span>
                <table className="col">
                    <colgroup>
                        <col width="15%"/>
                        <col width="17%"/>
                        <col width="8%"/>
                        <col width="8%"/>
                        <col width="8%"/>
                        <col width="8%"/>
                        <col width="8%"/>
                        <col width="8%"/>
                        <col width="8%"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>과정명</th>
                            <th>기간</th>
                            <th>강사명</th>
                            <th>수강인원</th>
                            <th>과락인원</th>
                            <th>총점수</th>
                            <th>평균</th>
                            <th>최대 점수</th>
                            <th>최소 점수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lecTotalCnt === 0 && (
                            <tr><td colSpan="9">데이터가 없습니다.</td></tr>
                        )}
                        {/* 강의 목록 looping */}
                        {/* "data":{"totalCnt":20,
                            "lecList":[{"lec_id":1,"tutor_id":null,"lec_name":"자바의이해",
                                        "max_pnum":50,"pre_pnum":0,"start_date":"2024.03.05","end_date":"2024.06.15",
                                        "process_day":null,"test_id":0,"loginID":null,"user_type":null,
                                        "use_yn":null,"name":"스티븐잡스","std_id":null,"test_score":0,"tot_score":286,
                                        "max_score":100,"min_score":43,"avg_score":71,"fail_cnt":2,"fail_rate":0}],
                            "pageSize":5,
                            "currentPage":1} */}
                        {
                            lecTotalCnt > 0 && lecList.map((item) => {
                                return (
                                    <tr>
                                        <td className="pointer-cursor" 
                                            onClick={() => {
                                                searchCourseSizeDetail(item.lec_id)
                                            }}><strong>{item.lec_name}</strong></td>
                                        <td>{item.start_date} ~ {item.end_date}</td>
                                        <td>{item.name}</td>
                                        <td>{item.pre_pnum}</td>
                                        <td>{item.fail_cnt}</td>
                                        <td>{item.tot_score}</td>
                                        <td>{item.avg_score}</td>
                                        <td>{item.max_score}</td>
                                        <td>{item.min_score}</td>
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
            {chartModalOn? <ChartComponent lecId={selLecId}/> : null}
        </div>
    )    
}

export default CourseSize