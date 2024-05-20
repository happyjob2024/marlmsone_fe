import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import axios from "axios";


const ModalLecture = (props) => {
    const [lecDetail, setLecDetail] = useState({});
    const [lecWeekplanList, setLecWeekplanList] = useState([]);
    

    useEffect(() => {

        if (props.lecId !== null && props.lecId !== "") {
            console.log("ModalLecture> props.lecId=" + props.lecId);
            searchLecInfoDetail(props.lecId);
        }
        return () => {
            setLecDetail({});
            setLecWeekplanList([]);
        }
    }, [props.lecId]);

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

    // 강의 상세정보 조회
    const searchLecInfoDetail = (lecId) => {

		// var param = {
        //     lec_id : lec_id
        // };
        // url : '/std/lecInfo.do',
        let params = new URLSearchParams();

        params.append('lec_id', lecId);

        axios.post("/std/lecInfo.do", params)
            .then((res) => {
                // {"data":{"result":"SUCCESS",
                //          "week_plan":[{"lec_id":74,"tutor_id":null,"lecrm_id":0,"lec_name":null,
                //                        "lecrm_name":null,"max_pnum":0,"pre_pnum":0,
                //                        "start_date":null,"end_date":null,"lec_goal":null,
                //                        "test_id":0,"test_start":null,"test_end":null,
                //                        "lec_type_id":0,"lec_type_name":null,"lec_sort":null,
                //                        "name":null,"tel":null,"mail":null,"week":"1주차",
                //                        "learn_goal":"스프링에 대해","learn_con":"스프링이란 무엇인가를 학습"}],
                //          "lecInfo":{"lec_id":74,"tutor_id":"kang001","lecrm_id":0,"lec_name":"자바의 이해2",
                //                     "lecrm_name":null,"max_pnum":0,"pre_pnum":0,
                //                     "start_date":null,"end_date":null,
                //                     "lec_goal":"스프링의 기초가 되는 언어 자바를 배워 실무에 적용해보는게 목표",
                //                     "test_id":0,"test_start":null,"test_end":null,
                //                     "lec_type_id":0,"lec_type_name":null,"lec_sort":"직장인",
                //                     "name":"홍길동","tel":"010-4653-2462","mail":"kang001@naver.com",
                //                     "week":null,"learn_goal":null,"learn_con":null},
                //          "resultMsg":"조회 되었습니다."}
                // console.log("searchLecInfoDetail() result console : " + JSON.stringify(res));
                
                setLecDetail(res.data.lecInfo);
                setLecWeekplanList(res.data.week_plan);
            })
            .catch((err) => {
                console.log("searchLecInfoDetail() result error : " + err.message);
                alert(err.message);
            });
    }

    // 수강신청
    const applyLecRegister = () => {

        if ( window.confirm("수강을 신청하겠습니까?") ) {
            // var param = {
			// 	lec_id : $("#lec_id").val()
		    // }
            // url : '/std/lecReg.do',

            let params = new URLSearchParams();

            params.append('lec_id', lecDetail?.lec_id);

            axios.post("/std/lecReg.do", params)
                .then((res) => {
                    // {"data":{"result":"SUCCESS","resultMsg":"수강 신청 되었습니다."}
                    // console.log("applyLecRegister() result console : " + JSON.stringify(res));

                    if (res.data.result === "SUCCESS") {
                        alert(res.data.resultMsg);
                        close();                        
                    }
                })
                .catch((err) => {
                    console.log("applyLecRegister() result error : " + err.message);
                    alert(err.message);
                });
        }
    }

    const close = () => {
        setLecDetail({});
        setLecWeekplanList([]);
        props.searchList();
        props.setModalAction(false);
    }

    return (
        <div>
            {/* 강의 상세정보 모달 */}
            <Modal style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="stdDtlForm">
                    <p className="conTitle">
                        <span>강의 정보</span>
                    </p>
                    {/* {"data":{"result":"SUCCESS",
                                 "lecInfo":{"lec_id":74,"tutor_id":"kang001","lecrm_id":0,"lec_name":"자바의 이해2",
                                            "lecrm_name":null,"max_pnum":0,"pre_pnum":0,
                                            "start_date":null,"end_date":null,
                                            "lec_goal":"스프링의 기초가 되는 언어 자바를 배워 실무에 적용해보는게 목표",
                                            "test_id":0,"test_start":null,"test_end":null,
                                            "lec_type_id":0,"lec_type_name":null,"lec_sort":"직장인",
                                            "name":"홍길동","tel":"010-4653-2462","mail":"kang001@naver.com",
                                            "week":null,"learn_goal":null,"learn_con":null},
                             "resultMsg":"조회 되었습니다."} */}
                    {/* <table style={{ width: "550px", height: "200px" }}> */}
                    <table className="col" style={{ width: "550px"}}>
                        <colgroup>
                            <col width="15%"/>
                            <col width="35%"/>
                            <col width="15%"/>
                            <col width="35%"/>
                        </colgroup>
                        <tr>
                            <th>강의명</th>
                            <td>{lecDetail?.lec_name}</td>
                            <th>수강대상</th>
                            <td>{lecDetail?.lec_sort}</td>
                        </tr>
                        <tr>
                            <th>강사명</th>
                            <td>{lecDetail?.name}</td>
                            <th>연락처</th>
                            <td>{lecDetail?.tel}</td>
                        </tr>
                        <tr>
                            <th>이메일</th>
                            <td>{lecDetail?.mail}</td>
                            <th>강의실</th>
                            <td>{lecDetail?.lecrm_name}</td>
                        </tr>
                        <tr>
                            <th>수업목표</th>
                            <td colSpan="3">{lecDetail?.lec_goal}</td>
                        </tr>
                    </table><br/>
                    <p className="conTitle">
                        <span>강의 계획</span>
                    </p>
                    <table className="col">                   
                        <colgroup>
                            <col width="20%"/>
                            <col width="40%"/>
                            <col width="40%"/>
                        </colgroup>
                        <thead>
                            <tr>
                                <th>주차수</th>
                                <th>학습목표</th>
                                <th>학습내용</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 강의계획 목록 looping */}
                            {/* {"data":{"result":"SUCCESS",
                                 "week_plan":[{"lec_id":74,"tutor_id":null,"lecrm_id":0,"lec_name":null,
                                               "lecrm_name":null,"max_pnum":0,"pre_pnum":0,
                                               "start_date":null,"end_date":null,"lec_goal":null,
                                               "test_id":0,"test_start":null,"test_end":null,
                                               "lec_type_id":0,"lec_type_name":null,"lec_sort":null,
                                               "name":null,"tel":null,"mail":null,"week":"1주차",
                                               "learn_goal":"스프링에 대해","learn_con":"스프링이란 무엇인가를 학습"}], */}
                            {
                                lecWeekplanList.length === 0 && (
                                <tr><td colSpan="3">등록된 강의계획이 없습니다.</td></tr>)}
                            {
                                lecWeekplanList.length > 0 && lecWeekplanList.map((item) => {
                                    return (
                                        <tr>
                                            <td>{item.week}</td>
                                            <td>{item.learn_goal}</td>
                                            <td>{item.learn_con}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table><br/>
                    <div className="modal-button">
                        <button className="btn btn-primary mx-2" onClick={applyLecRegister}>수강신청</button>
                        <button className="btn btn-primary mx-2" onClick={close}>확인</button>
                    </div>
                </div>    
            </Modal>{/* End 강의 상세정보 모달 */}
        </div>
    )    
}

export default ModalLecture