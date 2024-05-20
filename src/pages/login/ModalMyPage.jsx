import React, {useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import * as commonjs from "../../components/common/commonfunction.js"
import * as validationjs from "../../components/common/userValidation.js"
import ModalChangePassword from "./ModalChangePassword.jsx"
import ModalPostcode from "./ModalPostcode.jsx";


const ModalMyPage = (props) => {
    const [userInfoDetail, setUserInfoDetail] = useState({});
    const [postcodeModalOn, setPostcodeModalOn] = useState(false);
    const [changePasswordModalOn, setChangePasswordModalOn] = useState(false);

    const inputCurrentPassword = useRef();
    const inputTel = useRef();
    const inputEmail = useRef();
    const inputZipcode = useRef();
    const inputAddress = useRef();
    const inputDetailAddress = useRef();
    const navigate = useNavigate();

    
    useEffect(() => {
        searchMyPage();
        return () => {
            setUserInfoDetail({});
        }
    }, []);

    // 마이페이지 조회
    const searchMyPage = () => {

        // <a class="mypage" href="/personal/personalInfo.do">MY PAGE</a>
        let params = new URLSearchParams();

        axios.post("/personal/personalInfojson.do", params)
            .then((res) => {

                // console.log("searchMyPage() result console : " + JSON.stringify(res));
                // {"data":{"userInfo":{"loginId":"bbb123","name":"스티븐잡스","password":null,
                //                      "tel":"010-8478-6861","mail":"soobin84786861@gmail.com",
                //                      "zipcode":null,"addr":"부산 기장군 장안읍 판곡길 2,101호,46031",
                //                      "addr_dtl":null,"regi_num":null,"resume_fname":null,
                //                      "resume_url":null,"resume_fsize":null}}

                setUserInfoDetail(res.data.userInfo);
                inputCurrentPassword.current.value = '';                
            })
            .catch((err) => {
                console.log("searchMyPage() result error : " + err.message);
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
            // {"data":{"resultmsg":"SUCCESS"}}

            if (res.data.resultmsg === "SUCCESS") {
                return true;
            }
        } catch (err) {
            console.log("checkCurrentPassword() result error : " + err.message);
            alert(err.message);            
        }

        return false;
    }

    // 이메일 중복체크
    const checkEmailDuplication = async (email) => {

        // var param = {
        //     user_email : user_email
        // }
        // url : '/check_email.do',

        let params = new URLSearchParams();
        params.append('user_email', email);

        try {
            const res = await axios.post("/check_email.do", params);

            // console.log("checkEmailDuplication() result console : " + JSON.stringify(res));
            if (res.data === 1) { // 중복된 이메일 존재함
                // console.log("이메일 중복됨!!!!");
                return true;
            }
        } catch (err) {
            console.log("checkEmailDuplication() result error : " + err.message);
            alert(err.message);
        }

        return false;
    }

    // 회원정보 수정
    const updateUser = () => {

        // <update id="updateUserInfoNoResume">
        // /*kr.happyjob.study.personal.dao.PersonalServiceDao.updateUserInfo*/
        //     update tb_userinfo
        //     set      zipcode = #{zipcode} 
        //             , addr = #{addr}
        //             , addr_dtl = #{addr_dtl}
        //             , tel = #{tel}
        //             , mail = #{mail}
        //     where loginId = #{loginId}
        // </update>
        // callAjaxFileUploadSetFormData("/personal/personalSave.do", "post", "json", false, fileData, callback);

        let params = new URLSearchParams();

        params.append('zipcode', inputZipcode.current.value);
        params.append('addr', inputAddress.current.value);
        params.append('addr_dtl', inputDetailAddress.current.value);
        params.append('tel', inputTel.current.value);
        params.append('mail', inputEmail.current.value);
        params.append('loginId', userInfoDetail?.loginId);

        // console.log("updateUser() params : " + params);

        axios.post("/personal/personalBasicSave.do", params)
            .then((res) => {

                // console.log("updateUser() result console : " + JSON.stringify(res));
                // {"data":{"result":"S","resultmsg":"저장 되었습니다."}

                if (res.data.result === "S") {
                    alert(res.data.resultmsg);
                    searchMyPage();
                } else {
                    alert(res.data.resultmsg);
                }
            })
            .catch((err) => {
                console.log("updateUser() result error : " + err.message);
                alert(err.message);
            });
    }

    // 회원탙퇴
    const quitUser = () => {

        if ( window.confirm("정말 탈퇴하겠습니까?") ) {
            // callAjax("/personal/personalQuit.do", "post", "json", false, "", callback);   

            axios.post("/personal/personalQuit.do")
                .then((res) => {
                    
                    // console.log("quitUser() result console : " + JSON.stringify(res));
                    // {"data":{"result":"S","resultmsg":"저장 되었습니다."}

                    if (res.data.resultmsg === "SUCCESS") {
                        alert("성공적으로 탈퇴하였습니다.");                    
                        props.setModalAction(false);
                        navigate("/login");
                    } else {
                        alert(res.data.resultmsg);
                    }
                })
                .catch((err) => {
                    console.log("quitUser() result error : " + err.message);
                    alert(err.message);
                });
        }
    }

    const checkUpdateValidation = async () => {

        // console.log("mail : " + userInfoDetail.mail);
        // console.log("inputEmail : " + inputEmail.current.value);        
        // console.log("password : " + inputCurrentPassword.current.value);

        // 필수 입력값 확인
        if ( !validationjs.checkTel(inputTel.current.value) )           { inputTel.current.focus(); return; }
        if ( !validationjs.checkEmail(inputEmail.current.value) )       { inputEmail.current.focus(); return; }
        if ( !validationjs.checkZipcode(inputZipcode.current.value) )   { inputZipcode.current.focus(); return; }
        if ( !validationjs.checkAddress(inputAddress.current.value) )   { inputAddress.current.focus(); return; }
        if ( !commonjs.nullcheck([{ inval: inputCurrentPassword.current.value, msg: "현재 비밀번호를 입력하세요."},])) {
            inputCurrentPassword.current.focus(); 
            return;
        }

        if ( !await checkCurrentPassword(inputCurrentPassword.current.value) ) {
            alert("비밀번호가 일치하지 않습니다.");
            inputCurrentPassword.current.focus();
            return;
        }
        if ( (userInfoDetail?.mail !== inputEmail.current.value) && 
                await checkEmailDuplication(inputEmail.current.value) ) {
            alert("중복된 이메일이 존재합니다.");
            inputEmail.current.focus();
            return;
        }

        updateUser();
    }

    const close = () => {
        setUserInfoDetail({});
        setPostcodeModalOn(false);
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
            {/* 회원정보 수정 모달 */}
            <Modal style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="updateForm">
                    <p className="conTitle">
                        <span>회원 정보 변경</span>
                    </p>
                    <div style={{textAlign: 'right'}}>
                        <button className="btn btn-primary mx-2" onClick={() => setChangePasswordModalOn(true)}>비밀번호 변경</button>
                    </div>                    
                    <table style={{ width: "500px", height: "400px" }}>
                        <tr>
                            <th style={{width: "100px"}}>아이디<span className="font_red">*</span></th>
                            <td>
                                <input type="text"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    placeholder="숫자, 영문자 조합으로 6~20자리 "
                                    defaultValue={userInfoDetail?.loginId}
                                    readOnly={true}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>현재 비밀번호<span className="font_red">*</span></th>
                            <td>
                                <input type="password"
                                    className="form-control input-sm"
                                    style={{width: "280px"}}
                                    onBlur={(e) => {
                                        setUserInfoDetail((prev) => {
                                            return { ...prev, password: e.target.value }
                                        });
                                    }}
                                    ref={inputCurrentPassword}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>이름<span className="font_red">*</span></th>
                            <td>
                                <input type="text"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    defaultValue={userInfoDetail?.name}
                                    readOnly={true}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>전화번호<span className="font_red">*</span></th>
                            <td>
                                <input type="text"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    maxLength="11"
                                    defaultValue={userInfoDetail?.tel}
                                    onBlur={(e) => {
                                        setUserInfoDetail((prev) => {
                                            return { ...prev, tel: e.target.value }
                                        });
                                    }}
                                    ref={inputTel}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>이메일<span className="font_red">*</span></th>
                            <td>
                                <input type="text"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    defaultValue={userInfoDetail?.mail}
                                    onBlur={(e) => {
                                        setUserInfoDetail((prev) => {
                                            return { ...prev, mail: e.target.value }
                                        });
                                    }}
                                    ref={inputEmail}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>우편번호<span className="font_red">*</span></th>
                            <td>
                                <input type="text"
                                    className="form-control input-sm"
                                    style={{width: "280px"}}                                    
                                    defaultValue={userInfoDetail?.zipcode}
                                    onBlur={(e) => {
                                        setUserInfoDetail((prev) => {
                                            return { ...prev, zipcode: e.target.value }
                                        });
                                    }}
                                    ref={inputZipcode}
                                />
                                <button className="btn btn-primary mx-2" 
                                        style={{width: "120px"}}
                                        onClick={() => setPostcodeModalOn(true)} >우편번호 찾기</button>
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>주소<span className="font_red">*</span></th>
                            <td>
                                <input type="text"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    defaultValue={userInfoDetail?.addr}
                                    onBlur={(e) => {
                                        setUserInfoDetail((prev) => {
                                            return { ...prev, addr: e.target.value }
                                        });
                                    }}
                                    ref={inputAddress}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>상세주소</th>
                            <td>
                                <input type="text"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    defaultValue={userInfoDetail?.addr_dtl}
                                    onBlur={(e) => {
                                        setUserInfoDetail((prev) => {
                                            return { ...prev, addr_dtl: e.target.value }
                                        });
                                    }}
                                    ref={inputDetailAddress}
                                />
                            </td>
                        </tr>
                    </table>
                    <div className="modal-button">
                        <button className="btn btn-primary mx-2" onClick={checkUpdateValidation}>저장</button>                        
                        <button className="btn btn-primary mx-2" onClick={quitUser}>회원탈퇴</button>
                        <button className="btn btn-primary mx-2" onClick={close}>취소</button>
                    </div>
                </div>
            </Modal>{/* End 회원정보 수정 모달 */}
            {changePasswordModalOn? <ModalChangePassword modalAction={changePasswordModalOn} 
                                             setModalAction={setChangePasswordModalOn}
                                             ></ModalChangePassword> : null}
            {postcodeModalOn? <ModalPostcode modalAction={postcodeModalOn} 
                                             setModalAction={setPostcodeModalOn}
                                             selinfo={userInfoDetail}
                                             setSelinfo={setUserInfoDetail}
                                             inputDetailAddress={inputDetailAddress}
                                             ></ModalPostcode> : null}
        </div>
    )
}

export default ModalMyPage