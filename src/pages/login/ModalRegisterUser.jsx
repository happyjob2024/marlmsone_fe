import React, {useState, useEffect, useRef} from "react";
import Modal from "react-modal";
import axios from "axios";
import * as validationjs from "../../components/common/userValidation.js"
import ModalPostcode from "./ModalPostcode.jsx";


const ModalRegisterUser = (props) => {
    const [selinfo, setSelinfo] = useState({});
    const [checkLoginIdOn, setCheckLoginIdOn] = useState(false);
    const [postcodeModalOn, setPostcodeModalOn] = useState(false);

    const inputLoginId = useRef();
    const inputPassword = useRef();
    const inputPasswordConfirm = useRef();
    const inputName = useRef();
    const inputGenderType = useRef();
    const inputBirthday1 = useRef();
    const inputBirthday2 = useRef();
    const inputTel = useRef();
    const inputEmail = useRef();
    const inputZipcode = useRef();
    const inputAddress = useRef();
    const inputDetailAddress = useRef();


    useEffect(() => {
        
        return () => {
            setSelinfo({});
        }
    }, []);

     // 회원가입
     const registerUser = () => {

        let params = new URLSearchParams();

        params.append('action', "I");
        params.append('user_type', selinfo?.user_type);
        params.append('loginID', selinfo?.loginId);
        params.append('name', selinfo?.name);
        params.append('password', selinfo?.password);
        params.append('tel', selinfo?.tel);
        params.append('gender_cd', selinfo?.gender_cd);
        params.append('user_email', selinfo?.mail);
        params.append('user_zipcode', selinfo?.zipcode);
        params.append('user_address', selinfo?.addr);
        params.append('user_dt_address', selinfo?.addr_dtl);
        params.append('birthday1', selinfo?.birthday1);
        params.append('birthday2', selinfo?.birthday2);

        // console.log("register() params : " + params);

        axios.post("/register.do", params)
            .then((res) => {

                // console.log("register() result console : " + JSON.stringify(res));
                // {"data":{"result":"SUCCESS","resultMsg":"가입 완료"}

                if (res.data.result === "SUCCESS") {
                    alert(res.data.resultMsg);
                    close();
                } else {
                    alert(res.data.resultMsg);
                }
            })
            .catch((err) => {
                console.log("register() result error : " + err.message);
                alert(err.message);
            });
    }

    // 아이디 중복체크
    const checkIdDuplication = () => {
        
        let params = new URLSearchParams();
        params.append('loginID', selinfo?.loginId);

        axios.post("/check_loginID.do", params)
            .then((res) => {

                // console.log("checkLoginId() result console : " + JSON.stringify(res));                
                // {"data":1

                if (res.data === 1) {           // 중복된 아이디 존재함
                    alert("중복된 아이디가 존재합니다.");                    
                    inputLoginId.current.focus();
                } else if (res.data === 0) {    // 중복된 아이디 없음 (사용가능한 아이디임)
                    alert("사용할 수 있는 아이디입니다.");
                    setCheckLoginIdOn(true);
                    inputPassword.current.focus();
                }                
            })
            .catch((err) => {
                console.log("checkLoginId() result error : " + err.message);
                alert(err.message);
            });
    }

    // 이메일 중복체크
    const checkEmailDuplication = async () => {
    
        let params = new URLSearchParams();
        params.append('user_email', selinfo?.mail);

        try {
            const res = await axios.post("/check_email.do", params);

            // console.log("checkEmailDuplication() result console : " + JSON.stringify(res));
            // {"data":1

            if (res.data === 1) { // 중복된 이메일 존재함
                return true;
            }
        } catch(err) {
            console.log("checkEmailDuplication() result error : " + err.message);
            alert(err.message);
        }

        return false;
    }

    const searchZipcode = () => {
        setPostcodeModalOn(true);
    }

    const checkRegisterValidation = async () => {

        // console.log("checkRegisterValidation() selinfo : " + JSON.stringify(selinfo));

        // 필수 입력값 확인
        if ( !validationjs.checkUserType(selinfo?.user_type) )                  { return; }
        if ( !validationjs.checkLoginId(inputLoginId.current.value) )           { inputLoginId.current.focus(); return; }
        if ( !validationjs.checkPassword(inputPassword.current.value) )         { inputPassword.current.focus(); return; }
        if ( !validationjs.checkPassword(inputPasswordConfirm.current.value) )  { inputPasswordConfirm.current.focus(); return; }
        if ( !validationjs.checkPasswordMatch(inputPassword.current.value, inputPasswordConfirm.current.value) ) { 
            alert("비밀번호가 일치하지 않습니다.");
            inputPasswordConfirm.current.focus(); 
            return;
        }
        if ( !validationjs.checkName(inputName.current.value) )                 { inputName.current.focus(); return; }
        if ( !validationjs.checkGenderType(inputGenderType.current.value) )     { inputGenderType.current.focus(); return; }
        if ( !validationjs.checkRRN(inputBirthday1.current.value, 
                                    inputBirthday2.current.value) )             { inputBirthday1.current.focus(); return; }
        if ( !validationjs.checkTel(inputTel.current.value) )                   { inputTel.current.focus(); return; }
        if ( !validationjs.checkEmail(inputEmail.current.value) )               { inputEmail.current.focus(); return; }
        if ( !validationjs.checkZipcode(inputZipcode.current.value) )           { inputZipcode.current.focus(); return; }
        if ( !validationjs.checkAddress(inputAddress.current.value) )           { inputAddress.current.focus(); return; }

        if ( !checkLoginIdOn ) {
            alert("아이디 중복 여부를 확인해 주세요.");
            return;
        }
        if ( await checkEmailDuplication() ) {
            alert("중복된 이메일이 존재합니다.");
            inputEmail.current.focus();
            return;
        }

        registerUser();
    }

    const close = () => {
        setSelinfo({});
        setCheckLoginIdOn(false);
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
            {/* 회원가입 모달 */}
            <Modal style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="registerForm">
                    <p className="conTitle">
                        <span>회원가입</span>
                    </p>
                    <table style={{ width: "500px", height: "450px" }}>
                        <tr>
                            <th style={{width: "100px"}}>회원유형<span className="font_red">*</span></th>
                            <td>
                            <label style={{ marginRight: "20px" }}>
                                <input type="radio"
                                    style={{width: "20px"}}
                                    onChange={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, user_type: "A" }
                                        });
                                    }}
                                    checked={selinfo?.user_type === 'A'}/>일반회원</label>
                            <label>
                                <input type="radio"
                                    style={{width: "20px"}}
                                    onChange={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, user_type: "B" }
                                        });
                                    }}
                                    checked={selinfo?.user_type === 'B'}/>강사회원</label>
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>아이디<span className="font_red">*</span></th>
                            <td>
                                <input type="text"
                                    className="form-control input-sm"
                                    style={{width: "280px"}}
                                    placeholder="숫자, 영문자 조합으로 6~20자리 "
                                    defaultValue={selinfo?.loginId}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, loginId: e.target.value }
                                        });
                                    }}
                                    ref={inputLoginId}
                                />
                                <button className="btn btn-primary mx-2" 
                                        style={{width: "120px"}}
                                        onClick={checkIdDuplication}
                                        >중복확인</button>
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>비밀번호<span className="font_red">*</span></th>
                            <td>
                                <input type="password"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                                    defaultValue={selinfo?.password}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, password: e.target.value }
                                        });
                                    }}
                                    ref={inputPassword}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>비밀번호 확인<span className="font_red">*</span></th>
                            <td>
                                <input type="password"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    defaultValue={selinfo?.password1}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, password1: e.target.value }
                                        });
                                    }}
                                    ref={inputPasswordConfirm}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>이름<span className="font_red">*</span></th>
                            <td>
                                <input type="text"
                                    className="form-control input-sm"
                                    style={{width: "130px"}}
                                    defaultValue={selinfo?.name}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, name: e.target.value }
                                        });
                                    }}
                                    ref={inputName}
                                />
                            </td>
                        </tr>
                        <tr>
                        <th style={{width: "100px"}}>성별<span className="font_red">*</span></th>
                            <td>
                                <select id="genderId" 
                                    className="form-control"
                                    style={{width: "130px"}}
                                    defaultValue={selinfo?.gender_cd}
                                    onChange={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, gender_cd: e.target.value }
                                        });                                    
                                    }}
                                    ref={inputGenderType}
                                >
                                    <option value="" selected="selected">선택</option>
                                    <option value="M">남자</option>
                                    <option value="F">여자</option>
                                </select> 
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>주민등록번호<span className="font_red">*</span></th>
                            <td>
                                <input type="text"
                                    className="form-control input-sm"
                                    style={{width: "185px"}}
                                    minLength="6"
                                    maxLength="6"
                                    defaultValue={selinfo?.birthday1}
                                    onChange={(e) => {
                                        if (e.target.value.length === 6) {
                                            inputBirthday2.current.focus();
                                        }
                                    }}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, birthday1: e.target.value }
                                        });
                                    }}
                                    ref={inputBirthday1}
                                />{" "}-{" "}
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    style={{width: "198px"}}
                                    maxLength="7"
                                    defaultValue={selinfo?.birthday2}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, birthday2: e.target.value }
                                        });
                                    }}
                                    ref={inputBirthday2}
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
                                    defaultValue={selinfo?.tel}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
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
                                    defaultValue={selinfo?.mail}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
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
                                    defaultValue={selinfo?.zipcode}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, zipcode: e.target.value }
                                        });
                                    }}
                                    ref={inputZipcode}
                                />
                                <button className="btn btn-primary mx-2" 
                                        style={{width: "120px"}}
                                        onClick={searchZipcode} >우편번호 찾기</button>
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>주소<span className="font_red">*</span></th>
                            <td>
                                <input type="text"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    defaultValue={selinfo?.addr}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
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
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    defaultValue={selinfo?.addr_dtl}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, addr_dtl: e.target.value }
                                        });
                                    }}
                                    ref={inputDetailAddress}
                                />
                            </td>
                        </tr>
                    </table>
                    <div className="modal-button">
                        <button className="btn btn-primary mx-2" onClick={checkRegisterValidation}>회원가입</button>
                        <button className="btn btn-primary mx-2" onClick={close}>취소</button>
                    </div>
                </div>
            </Modal>{/* End 회원가입 모달 */}
            {postcodeModalOn? <ModalPostcode modalAction={postcodeModalOn} 
                                             setModalAction={setPostcodeModalOn}
                                             selinfo={selinfo}
                                             setSelinfo={setSelinfo}
                                             inputDetailAddress={inputDetailAddress}
                                             ></ModalPostcode> : null}
        </div>
    )    
}

export default ModalRegisterUser