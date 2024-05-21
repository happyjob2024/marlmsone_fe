import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import * as commonjs from "../../../components/common/commonfunction.js";

const TestGenerateModal = (props) => {

    const [setSelinfo] = useState({});
    const [testId] = useState(props.testId);
    const [lecId] = useState(props.lecId);
    const [lecName] = useState(props.lecName);
    const [lecTypeName] = useState(props.lecTypeName);
    const [lecTypeId] = useState(props.lecTypeId);
    const [testName, setTestName] = useState('');
    const [testItemCnt, setTestItemCnt] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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

    const postHandler = () => {

        // let checkresult = commonjs.nullcheck([
        //     { inval: lecName, msg: "강의명을 입력해 주세요." },
        //     { inval: lecTypeName, msg: "강의 분류를 입력해 주세요." },
        // ]);
        // if (!checkresult) return;
        
        let params = new URLSearchParams();
        params.append("test_id", testId);
        params.append("test_name", testName);        
        params.append("generate_cnt", testItemCnt);
        params.append("lec_type_id", lecTypeId);
        params.append("lec_id", lecId);
        params.append("start_date", startDate);
        params.append("end_date", endDate);       

        axios
            .post("/tut/generateTest.do", params)
            .then((res) => {
                props.setCurrentPage(1);
                props.setModalAction(false);                
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const inputCnt = (e) => {
        setTestItemCnt(e.target.value)
    }

    const inputName = (e) => {
        setTestName(e.target.value)
    }

    const changeStartDate = (e) => {
        setStartDate(e.target.value)        
    }

    const changeEndDate = (e) => {
        setEndDate(e.target.value)
    }

    const close = () => {
        props.setModalAction(false);
    }

    return (
        <div>
            <Modal
                style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="testform">
                    <p className="conTitle">
                        <span>{props.id === "" ? "시험문제 등록" : "시험문제 확인"}</span>
                    </p>
                    <table style={{ width: "550px", height: "350px" }}>
                        <tbody>
                            <tr>
                                <th>
                                    {" "}
                                    강의명 
                                    <span className="font_red">*</span>
                                </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        style={{ width: "150px" }}
                                        defaultValue={lecName}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return { ...prev, lec_name: e.target.value }
                                            });
                                        }}
                                    />
                                </td>
                                <th>
                                    {" "}
                                    강의분류
                                    <span className="font_red">*</span>
                                </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ width: "150px" }}
                                        defaultValue={lecTypeName}
                                    />
                                </td> 
                            </tr>
                            <tr>
                                <th> 시험명 </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ width: "150px" }}
                                        onChange={inputName}
                                        value={testName}
                                    />
                                </td>
                                <th> 문항수 </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ width: "150px" }}
                                        onChange={inputCnt}
                                        value={testItemCnt}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th> 시험 시작일 </th>
                                <td>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        onChange={changeStartDate}
                                        value={startDate}
                                        name="testStartDate" 
                                        data-date-format='yyyy.mm.dd'
                                        style={{ width: "150px" }}
                                    />
                                </td>
                                <th> 시험 종료일 </th>
                                <td>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        onChange={changeEndDate}
                                        value={endDate} 
                                        name="testEndDate" 
                                        data-date-format='yyyy.mm.dd'
                                        style={{ width: "150px" }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="modal-button" style={{alignContent : "center"}}>
                        <button 
                            className="btn btn-primary mx-2" 
                            onClick={() => postHandler()}
                        >
                            {" "}
                            시험지 생성
                            {" "}
                        </button>
                        <button className="btn btn-primary" onClick={close}>
                            {" "}
                            닫기
                            {" "}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default TestGenerateModal;