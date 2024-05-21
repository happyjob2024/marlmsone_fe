import React, {useState, useEffect, useRef} from "react";
import Modal from "react-modal";
import axios from "axios";
import * as commonjs from "../../components/common/commonfunction.js"
import * as validationjs from "../../components/common/userValidation.js"


const ModalChangePassword = (props) => {
    const [selinfo, setSelinfo] = useState({});
    const inputCurrentPassword = useRef();
    const inputChangePassword = useRef();
    const inputChangePasswordConfirm = useRef();


    useEffect(() => {
        return () => {
            setSelinfo({});
        }
    }, []);


    // 비밀번호 변경
    const changePassword = () => {

        // var param = {
        //         newPsd : $("#newPsd").val(),        
        //         originPwd : $("#originPwd").val(),
        // }
        // callAjax("/personal/personalPwdChange.do", "post", "json", false, param, callback);

        let params = new URLSearchParams();

        params.append('newPsd', inputChangePassword.current.value);
        params.append('originPwd', inputCurrentPassword.current.value);

        axios.post("/personal/personalPwdChange.do", params)
        .then((res) => {

            // console.log("changePassword() result console : " + JSON.stringify(res));
            // {"data":{"resultmsg":"비밀번호 변경 완료"}
            // msg = "FAIL2";   // 현재 비밀번호 == 새 비밀번호 일 때
            // msg = "FAIL3";   // 조회된 비밀번호 != 현재 비밀번호
            // msg = "FAIL1";   // 알 수 없는 오류로 변경에 실패하였을 때

            if (res.data.resultmsg === "FAIL2") {
                alert("현재 비밀번호와 같은 비밀번호로 설정할 수 없습니다.");
            } else if (res.data.resultmsg === "FAIL3") {
                alert("현재 비밀번호가 일치하지 않습니다.");
            } else if (res.data.resultmsg === "FAIL1") {
                alert("비밀번호 변경에 실패하였습니다.");
            } else {
                alert("비밀번호를 변경하였습니다.");
                close();
            }
        })
        .catch((err) => {
            console.log("changePassword() result error : " + err.message);
            alert(err.message);
        });    
    }


    // 비밀번호 일치여부 체크
    const checkCurrentPassword = async (password) => {
    
        // var param = {
        //     password : $("#pwdCheck").val()
        // }
        // callAjax("/personal/checkPwd.do", "post", "json", false, param, callback);   

        let params = new URLSearchParams();
        params.append('password', password);

        try {
            const res = await axios.post("/personal/checkPwd.do", params);

            // console.log("checkCurrentPassword() result console : " + JSON.stringify(res));
            // {"data":{"resultmsg":"SUCCESS"}

            if (res.data.resultmsg === "SUCCESS") {
                return true;
            }
        } catch (err) {
            console.log("checkCurrentPassword() result error : " + err.message);
            alert(err.message);            
        }

        return false;
    }

    const checkUpdateValidation = async () => {

        // console.log("checkUpdateValidation> selinfo : " + JSON.stringify(selinfo));

        // 필수 입력값 확인
        if ( !validationjs.checkPassword(selinfo?.changePassword) ) { 
            inputChangePassword.current.focus(); 
            return;
        }
        if ( !validationjs.checkPasswordConfirm(selinfo?.changePasswordConfirm) )  { 
            inputChangePasswordConfirm.current.focus(); 
            return;
        }
        if ( !commonjs.nullcheck([{ inval: selinfo?.password, msg: "현재 비밀번호를 입력하세요."},])) {
            inputCurrentPassword.current.focus(); 
            return;
        }
        if ( !validationjs.checkPasswordMatch(selinfo?.changePassword, selinfo?.changePasswordConfirm) )   { 
            alert("비밀번호가 일치하지 않습니다.");
            inputChangePassword.current.focus();
            return; 
        }
        if ( !await checkCurrentPassword(selinfo?.password) ) {
            alert("현재 비밀번호가 일치하지 않습니다.");
            inputCurrentPassword.current.focus();
            return;
        }
        if ( validationjs.checkPasswordMatch(selinfo?.changePassword, selinfo?.password) )   { 
            alert("현재 비밀번호와 같은 비밀번호로 설정할 수 없습니다.");
            inputChangePassword.current.focus(); 
            return; 
        }

        changePassword();
    }

    const close = () => {
        setSelinfo({});
        props.setModalAction(false);
    }

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
            {/* 비밀번호 변경 모달 */}
            <Modal style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="updateForm">
                    <p className="conTitle">
                        <span>비밀번호 변경</span>
                    </p>
                    <table style={{ width: "500px", height: "150px" }}>
                        <tr>
                            <td colSpan="2">
                                <span className="font_red">
                                    <strong>이전에 사용한 적 없는 비밀번호가 안전합니다. 새로운 비밀번홀 변경해 주세요.</strong>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>비밀번호 변경<span className="font_red">*</span></th>
                            <td>
                                <input type="password"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, changePassword: e.target.value }
                                        });
                                    }}
                                    ref={inputChangePassword}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>비밀번호 확인<span className="font_red">*</span></th>
                            <td>
                                <input type="password"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, changePasswordConfirm: e.target.value }
                                        });
                                    }}
                                    ref={inputChangePasswordConfirm}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>현재 비밀번호<span className="font_red">*</span></th>
                            <td>
                                <input type="password"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, password: e.target.value }
                                        });
                                    }}
                                    ref={inputCurrentPassword}
                                />
                            </td>
                        </tr>
                    </table>
                    <div className="modal-button">
                        <button className="btn btn-primary mx-2" onClick={checkUpdateValidation}>저장</button>
                        <button className="btn btn-primary mx-2" onClick={close}>취소</button>
                    </div>
                </div>
            </Modal>{/* End 비밀번호 변경 모달 */}
        </div>
    )    
}

export default ModalChangePassword