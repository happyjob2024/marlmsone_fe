import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import * as commonjs from "../../../components/common/commonfunction.js";

const ModalAdvList = (props) => {
    const [selinfo, setSelinfo] = useState({});

    useEffect(() => {
        roommod(props.id);
        return () => {
            setSelinfo({});
        }
    }, [props.id]);

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

    const roommod = (id) => {
        let params = new URLSearchParams();

        params.append("adv_id", id);
    
        axios
            .post("/adv/advDetail.do", params)
            .then((res) => {
                setSelinfo(res.data.data);
                console.log("1"+res.data.data.tut_id);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const postHandler = (action) => {

        if (action !== "D") {
            let checkresult = commonjs.nullcheck([
                { inval: selinfo.lec_name, msg: "강의를 선택해 주세요." },
                { inval: selinfo.std_name, msg: "수강 학생을 선택해 주세요" },
                { inval: selinfo.adv_date, msg: "상담 날짜를 선택해 주세요." },
                { inval: selinfo.adv_content, msg: "상담 내용을 입력해 주세요." },
            ]);
            if (!checkresult) return;
        }
        let params = new URLSearchParams(selinfo);
        params.append("adv_id", props.id);
        params.append("action", action);
        axios
            .post("/adv/advSave.do", params)
            .then((res) => {

                if (res.data.result === "SUCCESS") {
                    alert(res.data.resultMsg);
                    props.setModalAction(false);

                    if (action === "I") {
                        props.setCurrentPage(1);
                        props.setModalAction(false);
                    } else if(action === "U"){
                        props.setCurrentPage(1);
                        props.setModalAction(false);
                    } else {
                        props.setModalAction(false);
                    }
                } else {
                    alert(res.data.resultMsg);
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };
    //삭제 버튼을 클릭하면 실행
    const postDelete = (action) => {

        let params = new URLSearchParams(selinfo);
        params.append("adv_id", props.id);
        params.append("action", action);
        axios
            .post("/adv/advDelete.do", params)
            .then((res) => {

                if (res.data.result === "SUCCESS") {
                    alert(res.data.resultMsg);
                    props.setModalAction(false);
                } else {
                    alert(res.data.resultMsg);
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const close = () => {
        props.setModalAction(false);
    }

    return (
        <div className="content">
            <Modal
                style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
            <div>
			<dt>
				<strong>수강상담 관리</strong>
			</dt>
			<div className="content">
				<table className="row">
					<colgroup>
						<col width="20%"/>
						<col width="30%"/>
						<col width="20%"/>
						<col width="30%"/>
					</colgroup>
					<tbody>
						<tr>
							<th>과정명 </th>
							<td>
								<select id="mlecList" className="inputTxt p100">
								</select>
								<input 
                                    type="text" 
                                    className="inputTxt p100" 
									id="lecName" 
                                    name="lecName" 
                                    disabled="disabled"
                                    style={{ width: "150px" }}
                                        defaultValue={selinfo?.lec_name}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return { ...prev, lec_name: e.target.value }
                                            });
                                        }}
                                    />
							</td>			
							<th>학생명 </th>
							<td>
								<select id="mlecStdList" className="inputTxt p100">					
								</select>   
								<input type="text" className="inputTxt p100"
									id="stdName" name="stdName" disabled="disabled"
                                    style={{ width: "150px" }}
                                    value={selinfo?.std_name +"("+selinfo?.std_id+")"} 
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return { ...prev, std_id : e.target.value}
                                            });
                                        }}
                                    />
							</td>
						</tr>
						<tr>
							<th>상담일자 </th>
							<td>
								<input type="text" className="inputTxt p100" 
									id="datepicker" name="advDate" 
									data-date-format='yyyy.mm.dd'
                                    style={{ width: "150px" }}
                                    defaultValue={selinfo?.adv_date} 
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, adv_date: e.target.value }
                                        });
                                    }}
                                    />
							</td>
							<th>상담장소</th>
							<td>
								<input type="text" className="inputTxt p100"
									id="advPlace" name="advPlace"
                                    style={{ width: "150px" }}
                                    defaultValue={selinfo?.adv_place} 
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, adv_place: e.target.value }
                                        });
                                    }}
                                    />
							</td>						
						</tr>						
						<tr className="trDtlInfo">
							<th>최종 수정일자</th>
							<td>
								{/* <input type="text" className="inputTxt p100" 
									id="modDate" name="modDate"
									data-date-format='yyyy.mm.dd HH:MM' readonly> */}
                                <input type="text" className="inputTxt p100"
									id="modDate" name="modDate"
                                    style={{ width: "150px" }}
                                    defaultValue={selinfo?.tut_name} 
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, mod_date: e.target.value }
                                        });
                                    }}
                                    />
							</td>
							<th>상담자</th>
							<td>
								<input type="text" className="inputTxt p100"
									id="tutName" name="tutName" disabled="disabled"
                                    style={{ width: "150px" }}
                                    value={selinfo?.tut_name + "("+selinfo?.tut_id +")"} 
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, tut_name: e.target.value   }
                                        });
                                    }}
                                    
                                    />
							</td>						
						</tr>
						<tr>
							<td colSpan="4">
								<textarea id="summernote" name="advContent"
									style={{height: "300px"}}
                                    defaultValue={selinfo?.adv_content} 
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, adv_content: e.target.value }
                                        });
                                    }}
                                    ></textarea>
							</td>
						</tr>			
					</tbody>
				</table>

				<div className="btn_areaC mt30">
                    {
                        props.id === "" ? 
                        <button className="btnType blue" onClick={() => postHandler("I")}>
                            등록
                        </button>   : null
                    }
                    {
                        props.id !== "" ? 
                        <button className="btnType blue" onClick={() => postHandler("U")}>
                            수정
                        </button>   : null
                    }
                    {
                        props.id !== "" ? 
                        <button className="btnType blue" onClick={() => postDelete("D")}>
                            삭제
                        </button>   : null
                    }
					<button className="btnType gray" onClick={close}>취소</button>
				</div>
			</div>
		</div>
        </Modal>
		</div>
    
    )
}

export default ModalAdvList;