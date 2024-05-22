import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import axios from "axios";


const ModalTutor = (props) => {
    const [tutorDetail, setTutorDetail] = useState({});             // 강사 유저정보
    const [tutorLecList, setTutorLecList] = useState([]);           // 강사 강의 목록
    const [tutorLecTotalCnt, setTutorLecTotalCnt] = useState(0);    // 강사 강의 총 개수


    useEffect(() => {

        if (props.tutorId !== null && props.tutorId !== "") {
            // console.log("ModalTutor> props.tutorId=" + props.tutorId);
            searchTutorDetail(props.tutorId);
            searchTutorLecList(props.tutorId);
        }
        return () => {
            setTutorDetail({});
            setTutorLecList([]);
        }
    }, [props.tutorId]);


    // 강사 유저정보 상세보기
    const searchTutorDetail = (tutorId) => {
    
        // var param = {
      //    loginID : loginID
      // };
      // callAjax("/adm/user_info.do", "post", "json", true, param, resultCallback);

        let params = new URLSearchParams();
        params.append('loginID', tutorId);

        axios.post("/adm/user_info.do", params)
            .then((res) => {
                // {"data":{"result":"SUCCESS",
                //          "user_model":{"lec_id":0,"lecrm_id":0,"max_pnum":0,"pre_pnum":0,
                //                        "start_date":null,"end_date":null,"process_day":0,
                //                        "lec_type_id":0,"lec_type_name":null,"test_id":0,
                //                        "test_start":null,"test_end":null,"tutor_id":null,
                //                        "lec_name":null,"lec_goal":null,"lec_sort":null,
                //                        "loginID":"rkdtk3000","user_type":"B","use_yn":null,
                //                        "name":"강사고고","password":"rkdtk123!","tel":"010-2322-2020",
                //                        "sex":"F","mail":"rkdtk@naver.com","addr":"서울 강동구 천호대로213길 14",
                //                        "join_date":"2024.04.16","regi_num":null,"std_num":"77"},
                //          "resultMsg":"조회 되었습니다."}
                // console.log("searchTutorDetail() result console : " + JSON.stringify(res));

                setTutorDetail(res.data.user_model);
            })
            .catch((err) => {
                console.log("searchTutorDetail() result error : " + err.message);
                alert(err.message);
            });
    };

    // 강사 강의목록 조회
    const searchTutorLecList = (tutorId) => {
    
      // var param = {
      //    loginID : loginID,
      //    user_type : 'b'
      // }
      // callAjax("/adm/slist_lec.do", "post", "text", true, param, resultCallback);

        let params = new URLSearchParams();
        params.append('loginID', tutorId);
        params.append('user_type', 'b');

        axios.post("/adm/slist_lecjson.do", params)
            .then((res) => {
                // {"data":{"tlist_lec":[{"lec_id":1,"lecrm_id":0,"max_pnum":0,"pre_pnum":0,
                //                        "start_date":"2024.03.05","end_date":"2024.06.15",
                //                        "process_day":0,"lec_type_id":0,"lec_type_name":null,
                //                        "test_id":0,"test_start":null,"test_end":null,"tutor_id":null,
                //                        "lec_name":"자바의이해","lec_goal":null,"lec_sort":null,
                //                        "loginID":null,"user_type":null,"use_yn":null,"name":null,
                //                        "password":null,"tel":null,"sex":null,"mail":null,"addr":null,
                //                        "join_date":null,"regi_num":null,"std_num":null},],
                //          "tut_lec_count":6}
                // console.log("searchTutorLecList() result console : " + JSON.stringify(res));

                setTutorLecList(res.data.tlist_lec);
                setTutorLecTotalCnt(res.data.tut_lec_count);
            })
            .catch((err) => {
                console.log("searchTutorLecList() result error : " + err.message);
                alert(err.message);
            });
    };

    const tutorLecEnded = (dateString) => {
        const now = new Date();

        const [year, month, day] = dateString.split('.').map(Number);
        const endDate = new Date(year, month - 1, day);

        return endDate < now;
    };

    const close = () => {
        setTutorDetail({});
        setTutorLecList([]);
        props.setModalAction(false);
    };

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

    return (
        <div>
            {/* 강사 상세정보 모달 */}
            <Modal style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="stdDtlForm">
                    <p className="conTitle">
                        <span>강사 정보</span>
                    </p>
                    {/* {"data":{"result":"SUCCESS",
                                 "user_model":{"lec_id":0,"lecrm_id":0,"max_pnum":0,"pre_pnum":0,
                                               "start_date":null,"end_date":null,"process_day":0,
                                               "lec_type_id":0,"lec_type_name":null,"test_id":0,
                                               "test_start":null,"test_end":null,"tutor_id":null,
                                               "lec_name":null,"lec_goal":null,"lec_sort":null,
                                               "loginID":"rkdtk3000","user_type":"B","use_yn":null,
                                               "name":"강사고고","password":"rkdtk123!","tel":"010-2322-2020",
                                               "sex":"F","mail":"rkdtk@naver.com","addr":"서울 강동구 천호대로213길 14",
                                               "join_date":"2024.04.16","regi_num":null,"std_num":"77"},
                                 "resultMsg":"조회 되었습니다."} */}
                    <table style={{ width: "550px", height: "200px" }}>
                        <colgroup>
                            <col width="15%"/>
                            <col width="35%"/>
                            <col width="15%"/>
                            <col width="35%"/>
                        </colgroup>
                        <tr>
                            <th>ID</th>
                            <td>{tutorDetail?.loginID}</td>
                            <th>이름</th>
                            <td>{tutorDetail?.name}</td>
                        </tr>
                        <tr>
                            <th>생년월일</th>
                            <td>{tutorDetail?.regi_num}</td>
                            <th>성별</th>
                            <td>{tutorDetail?.sex}</td>
                        </tr>
                        <tr>
                            <th>전화번호</th>
                            <td>{tutorDetail?.tel}</td>
                            <th>이메일</th>
                            <td>{tutorDetail?.mail}</td>
                        </tr>
                        <tr>
                            <th>주소</th>
                            <td colSpan="3">{tutorDetail?.addr}</td>
                        </tr>                                          
                    </table>

                    <h3 style={{fontWeight: "bold"}}>강의 목록</h3>
                    <table className="col">
                        <colgroup>
                            <col width="15%"/>
                            <col width="40%"/>
                            <col width="30%"/>
                            <col width="15%"/>
                        </colgroup>
                        <thead>
                            <tr>
                                <th>강의ID</th>
                                <th>강의명</th>
                                <th>기간</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 강사 강의 목록 looping */}
                            {/* {"data":{"tlist_lec":[{"lec_id":1,"lecrm_id":0,"max_pnum":0,"pre_pnum":0,
                                                       "start_date":"2024.03.05","end_date":"2024.06.15",
                                                       "process_day":0,"lec_type_id":0,"lec_type_name":null,
                                                       "test_id":0,"test_start":null,"test_end":null,"tutor_id":null,
                                                       "lec_name":"자바의이해","lec_goal":null,"lec_sort":null,
                                                       "loginID":null,"user_type":null,"use_yn":null,"name":null,
                                                       "password":null,"tel":null,"sex":null,"mail":null,"addr":null,
                                                       "join_date":null,"regi_num":null,"
                                                       std_num":null},],
                                         "tut_lec_count":6} */}
                            {tutorLecTotalCnt === 0 && (
                                <tr><td colSpan="4">데이터가 존재하지 않습니다.</td></tr>
                            )}  
                            {
                                tutorLecTotalCnt > 0 && tutorLecList.map((item) => {
                                    return (
                                        <tr key={item.lec_id}>
                                            <td>{item.lec_id}</td>
                                            <td>{item.lec_name}</td>
                                            <td>{item.start_date} ~ {item.end_date}</td>
                                            <td>{tutorLecEnded(item.end_date)? "완료" : "진행중"}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table><br/>
                    <div className="modal-button">
                        <button className="btn btn-primary mx-2" onClick={close}>닫기</button>
                    </div>
                </div>    
            </Modal>{/* End 강사 상세정보 모달 */}
        </div>
    )   
}

export default ModalTutor