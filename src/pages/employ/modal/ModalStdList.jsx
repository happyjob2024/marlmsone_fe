import { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import * as commonjs from "../../../components/common/commonfunction.js";

const ModalStdList = (props) => {
    const [stdinfo, setStdinfo] = useState({});

    useEffect(() => {

        if (props.id !== null && props.id !== "") {
            console.log("ModalStdList> pros.id=" + props.id);
            console.log("#### searchList: " + props.searchList);

            stdDetail(props.id);
        }
        return () => {
            setStdinfo({});
        }
    }, [props.id]);
    //useEffect는 [] 안 상태가 변하면 위의 명령을 실행하게 하는 것
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

    // 강의실 정보 상세보기
    const stdDetail = (id) => {

        let params = new URLSearchParams();
        params.append("std_id", id);

        axios
            .post("/employ/stdinfo.do", params)
            .then((res) => {
                setStdinfo(res.data.stdinfo);
                console.log("ModalStdList> res.data.stdinfo : " + JSON.stringify(res.data.stdinfo));
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    // 강의실 등록/수정/삭제
    const postHandler = (action) => {

        if (action !== "D") {
            let checkresult = commonjs.nullcheck([
                { inval: stdinfo.comp_name, msg: "회사명을 입력해 주세요." },
                { inval: stdinfo.employ_day, msg: "입사일을 입력해 주세요." },
            ]);
            if (!checkresult) return;
        }
        console.log(props.id)
        let params = new URLSearchParams({
            ...stdinfo,
            "std_id": props.id,
            "action": action
        });

        axios
            .post("/employ/stdEmploy.do", params)
            .then((res) => {
                console.log(res)

                if (res.data.result === "SUCCESS") {
                    if (action === "I") {
                        alert(res.data.resultMsg);
                        // props.setCurrentPage(1);
                        close();
                    } else {
                        alert(res.data.resultMsg);
                        close();
                    }
                } else {
                    alert(res.data.resultMsg);
                }
            })
            .catch((err) => {
                alert(err.message);
            });

    };

    const close = () => {
        setStdinfo({});
        props.searchList();
        props.setModalAction(false);
    }
    
    return (
        <div>
            <Modal
                style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="noticeform">
                    <p className="conTitle">
                        <span>{props.companyId === "" ? "취업 등록" : "취업 수정"}</span>
                    </p>
                    <table style={{ width: "550px", height: "350px" }}>
                        <tbody>
                            <tr>
                                <th>
                                    학생명
                                </th>
                                <td colSpan="3">
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        style={{ width: "150px" }}
                                        defaultValue={stdinfo?.name}
                                        onBlur={(e) => {
                                            setStdinfo((prev) => {
                                                return { ...prev, name: e.target.value }
                                            });
                                            console.log(stdinfo)
                                        }}
                                        disabled={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    회사명<span className="font_red">*</span>
                                </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        style={{ width: "150px" }}
                                        defaultValue={stdinfo?.comp_name}
                                        onBlur={(e) => {
                                            setStdinfo((prev) => {
                                                return { ...prev, comp_name: e.target.value }
                                            })
                                        }}
                                    />
                                </td>
                                </tr>
                                <tr>
                                <th>
                                    연락처
                                </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        style={{ width: "150px" }}
                                        defaultValue={stdinfo?.tel}
                                        onBlur={(e) => {
                                            setStdinfo((prev) => {
                                                return { ...prev, tel: e.target.value }
                                            })
                                        }}
                                        disabled={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th> 입사일 <span className="font_red">*</span> </th>
                                <td colSpan="3">
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        style={{ width: "350px" }}
                                        defaultValue={stdinfo?.employ_day}
                                        onBlur={(e) => {
                                            setStdinfo((prev) => {
                                                return { ...prev, employ_day: e.target.value }
                                            })
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th> 퇴사일 </th>
                                <td colSpan="3">
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        style={{ width: "350px" }}
                                        defaultValue={stdinfo?.resign_day}
                                        onBlur={(e) => {
                                            setStdinfo((prev) => {
                                                return { ...prev, resign_day: e.target.value }
                                            })
                                        }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="modal-button">
                        {
                            props.companyId  === "" ?
                                <button className="btn btn-primary mx-2" onClick={() => postHandler("I")}>
                                    등록
                                </button> : null
                        }
                        {
                            props.companyId !== "" ?
                                <button className="btn btn-primary mx-2" onClick={() => postHandler("U")}>
                                    수정
                                </button> : null
                        }
                        <button className="btn btn-primary" onClick={close}>
                            닫기
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ModalStdList;