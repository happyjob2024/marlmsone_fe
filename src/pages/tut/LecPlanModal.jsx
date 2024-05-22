import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";

const LecPlanModal = ({ id, idlist, modalAction, roomlist, setModalAction }) => {
    const [lecInfo, setLecInfo] = useState(id); // 강의 계획서 관리
    const [weeklyPlan, setWeeklyPlan] = useState([]); // 주간 계획 리스트
    const [subject, setSubject] = useState(id); // 과목
    const goal = useRef(''); //수업 목표
    const [week, setWeek] = useState([]);
    let week2 = [];
    let goalArray = [];
    let conArray = [];

    useEffect(() => {
        getLecPlanDetail(subject);

    }, [subject]);

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

    const getLecPlanDetail = (lec_id) => {
        let params = new URLSearchParams();
        params.append('lec_id', lec_id);

        axios.post('/tut/fLecInfo.do', params).then((res) => {
            setLecInfo(res.data.lec_info);
            setWeeklyPlan(res.data.week_plan);

        }).catch((e) => {
            alert(e);
        })
    }

    const saveLecPlan = () => {  //강의 계획 및 주간 계획 저장
        let params = new URLSearchParams();    //강의 계획 저장 기능 시작
        params.append('tutor_id', lecInfo.tutor_id);
        params.append('lecrm_id', lecInfo.lecrm_id);
        params.append('lec_goal', goal.current.value);
        params.append('lec_type_id', lecInfo.lec_type_id);
        params.append('lec_sort', lecInfo.lec_sort);
        params.append('lec_id', lecInfo.lec_id);

        axios
            .post("/tut/savePlan.do", params)
            .then((res) => {
                alert(res.data.resultMsg);
            })
            .catch((err) => {
                alert(err.message);
            })

        let weekParams = new URLSearchParams();   //주간 계획 저장 기능 시작
        if (week[0]) {
            console.log("뭔가 있습니다." + week[0]);
        }
        else {
            for (let i = 0; i < week2.length; i++) {
                weekParams.append('week[]', week2[i]);
                weekParams.append('learn_goal[]', goalArray[i]);
                weekParams.append('learn_con[]', conArray[i]);
            }
        }

        weekParams.append('lec_id', lecInfo.lec_id);

        for (let i = 0; i < week.length; i++) {
            weekParams.append('week[]', week[i]);
            weekParams.append('learn_goal[]', goalArray[i]);
            weekParams.append('learn_con[]', conArray[i]);
        }
        console.log("위크파람:  ", weekParams);
        axios
            .post("/tut/saveWeekplan.do", weekParams)
            .then((response) => {
                console.log(response.data.resultMsg);
            })
            .catch((err) => {
                alert(err.message);
            })

        close();
    }//saveLecPlan

    const close = () => {
        setModalAction(false);
    }

    const weekAdd = () => { //주차 수 추가
        let arrayAdd = [];
        arrayAdd = [...weeklyPlan]; // 새로운 배열을 참조하게 만들기
        let weekCnt;
        let count;
        let joocha = [...week2];



        if (arrayAdd.length < 1) {
            weekCnt = "1주차";
            count = 1;
        }
        else {
            weekCnt = arrayAdd[arrayAdd.length - 1].week;
            count = parseInt(weekCnt.replace("주차", ""));
            weekCnt = count + 1;
            weekCnt = (String)(weekCnt + "주차");
        }

        arrayAdd.push({ "week": weekCnt }); //추가 버튼 클릭 즉시 눈에 보여야 할 출력용 배열
        joocha.push(weekCnt); //새로 생성된 'n주차' 값들을 API에 전달하기 위해 배열 변수에 따로 보관


        setWeek(joocha);
        setWeeklyPlan(arrayAdd);
    }

    const weekDel = () => {
        let weekparams = new URLSearchParams();
        let delWeekly = [...weeklyPlan];
        weekparams.append("lec_id", lecInfo.lec_id);
        weekparams.append('week', week2[week2.length - 1]);

        axios.post('/tut/delWeekPlan.do', weekparams)
            .then((res) => {

                alert(res.data.resultMsg);
            }).catch((err) => {
                alert(err.message);
            })


        delWeekly.pop();
        setWeeklyPlan(delWeekly);


    }

    const clear = () => {
        const value = {
            lec_id: "",
            lec_type_id: "",
            lec_name: "",
            name: "",
            tel: "",
            mail: "",
            lecrm_name: "",
            tutor_id: "",
            lec_sort: ""
        }
        setLecInfo(value);
        setWeeklyPlan([]);
    }

    return (
        <div>
            <Modal
                style={modalStyle}
                isOpen={modalAction}
                appElement={document.getElementById('app')}
            >
                <div>
                    <span>강의 계획서</span>

                    <table style={{ width: "550px", height: "350px" }}>
                        <tbody>
                            <tr >
                                <th>
                                    {" "}
                                    과목 <span className="font_red">*</span>
                                </th>
                                <td>
                                    <select onChange={(e) => e.target.value == 100 ? clear() : setSubject(e.target.value)} >
                                        <option value={100} >
                                            과목 선택
                                        </option>
                                        {idlist.map((item, i) => {
                                            return (
                                                <option key={i} value={item.lec_id} selected={id === item.lec_id ? true : false}>
                                                    {item.lec_name}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    {" "}
                                    강의분류<span className="font_red" >*</span>
                                </th>
                                <td>
                                    <select onChange={(e) => (lecInfo.lec_type_id = e.target.value)}>
                                        <option>
                                            강의 분류 선택
                                        </option>
                                        <option value="4" key="C" selected={'4' === lecInfo.lec_type_id ? true : false}>
                                            C
                                        </option>
                                        <option value="5" key="C++" selected={'5' === lecInfo.lec_type_id ? true : false}>
                                            C++
                                        </option>
                                        <option value="1" key="Java" selected={'1' === lecInfo.lec_type_id ? true : false}>
                                            Java
                                        </option>
                                        <option value="3" key="JavaScript" selected={'3' === lecInfo.lec_type_id ? true : false}>
                                            JavaScript
                                        </option>
                                        <option value="2" key="Python" selected={'2' === lecInfo.lec_type_id ? true : false}>
                                            Python
                                        </option>
                                    </select>
                                </td>
                                <th>
                                    {" "}
                                    대상자<span className="font_red">*</span>
                                </th>
                                <td>
                                    <select onChange={(e) => (lecInfo.lec_sort = e.target.value)}>
                                        <option>
                                            대상자 선택
                                        </option>
                                        <option value='직장인' key="직장인" selected={'직장인' === lecInfo.lec_sort ? true : false}>
                                            직장인
                                        </option>
                                        <option value='실업자' key="실업자" selected={'실업자' === lecInfo.lec_sort ? true : false}>
                                            실업자
                                        </option>

                                    </select>

                                </td>
                            </tr>
                            <tr>
                                <th>
                                    {" "}
                                    강사명
                                </th>
                                <td>
                                    <input
                                        readOnly
                                        type="text"
                                        className="form-control input-sm"
                                        value={lecInfo.name || ''}
                                    />
                                </td>
                                <th>
                                    {" "}
                                    강의실<span className="font_red">*</span>
                                </th>
                                <td>
                                    <select onChange={(e) => (lecInfo.lecrm_id = e.target.value)}>
                                        <option>
                                            강의실 선택
                                        </option>
                                        {roomlist.map((item, i) => {

                                            return (
                                                <option key={i} value={item.lecrm_id} selected={item.lecrm_id === lecInfo.lecrm_id ? true : false} >
                                                    {item.lecrm_name}

                                                </option >

                                            )
                                        })}
                                    </select>

                                </td>
                            </tr>
                            <tr>
                                <th>
                                    {" "}
                                    이메일
                                </th>
                                <td>
                                    <input
                                        readOnly
                                        type="text"
                                        className="form-control input-sm"
                                        value={lecInfo.mail || ''}
                                    />
                                </td>
                                <th>
                                    {" "}
                                    연락처
                                </th>
                                <td>
                                    <input
                                        readOnly
                                        type="text"
                                        className="form-control input-sm"
                                        value={lecInfo.tel || ''}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    {" "}
                                    수업 목표
                                </th>
                                <td>
                                    <input
                                        onChange={(e) => (lecInfo.lec_goal = e.target.value)}
                                        style={{ width: "250px" }}
                                        type="text"
                                        className="form-control input-sm"
                                        defaultValue={lecInfo.lec_goal || ''}
                                        ref={goal}
                                    />
                                </td>
                            </tr>

                        </tbody>
                    </table>

                    <button onClick={weekAdd}>
                        주차 추가
                    </button>{" "}

                    <button onClick={weekDel}>주차 삭제</button>

                    <table className="col">
                        <colgroup>
                            <col width="20%" />
                            <col width="40%" />
                            <col width="40%" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th >주차수</th>
                                <th >학습 목표</th>
                                <th >학습 내용</th>
                            </tr>
                        </thead>
                        <tbody>
                            {weeklyPlan.map((item, i) => {
                                week2.push(item.week);
                                goalArray.push(item.learn_goal);
                                conArray.push(item.learn_con);
                                return (
                                    <tr key={i}>
                                        <td>
                                            {item.week}
                                        </td>
                                        <td>
                                            <input onInput={(e) => (e.target.value === "" ? null : goalArray[i] = e.target.value)}
                                                defaultValue={item.learn_goal}>
                                            </input>
                                        </td>
                                        <td >
                                            <input onInput={(e) => (conArray[i] = e.target.value)}
                                                defaultValue={item.learn_con}>
                                            </input>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <p></p>
                <button className="btn btn-primary" onClick={() => saveLecPlan()}>
                    {" "}
                    저장{" "}
                </button>{" "}

                <button onClick={() => close()} className="btn btn-primary">
                    {" "}
                    닫기{" "}
                </button>

            </Modal>
        </div>
    )
}

export default LecPlanModal;