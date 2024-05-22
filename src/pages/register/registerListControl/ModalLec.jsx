import axios from "axios";
import { useEffect, useState } from "react";
import * as commonjs from "../../../components/common/commonfunction.js";
import Modal from "react-modal";

const ModalLec = (props) => {
  const [lecinfo, setLecinfo] = useState({});

  const [typeList, setTypeList] = useState([]);
  const [tutList, setTutList] = useState([]);
  const [lecrmList, setLecrmList] = useState([]);
  useEffect(() => {
    if (props.id) {
      lecmod(props.id);
    }
    selectbox(); // 추가 데이터를 불러오는 함수 호출
    return () => {
      setLecinfo({});
    };
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

  const lecmod = (id) => {
    let params = new URLSearchParams();
    params.append("lec_id", id);
    axios
      .post("/register/lecInfo.do", params)
      .then((res) => {
        setLecinfo(res.data.lecinfo);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const postHandle = (action) => {
    if (action !== "D") {
      let checkresult = commonjs.nullcheck([
        { inval: lecinfo.lec_name, msg: "강의 명을 입력해 주세요." },
        { inval: lecinfo.max_pnum, msg: "강의 최대인원을 입력해 주세요." },
        { inval: lecinfo.process_day, msg: "강의 과정일수를 입력해 주세요." },
        { inval: lecinfo.start_date, msg: "강의 개강일을 입력해 주세요." },
        { inval: lecinfo.end_date, msg: "강의 종강일을 입력해 주세요." },
      ]);
      if (!checkresult) return;
    }
    let params = new URLSearchParams(lecinfo);
    params.append("lec_id", props.id);
    params.append("action", action);
    axios
      .post("/register/saveRegister.do", params)
      .then((res) => {
        if (res.data.result === "S") {
          alert(res.data.resultMsg);
          props.setModalAction(false);
          console.log(res.data.value);
          if (action === "I") {
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

  const close = () => {
    props.setModalAction(false);
  };
  const selectbox = () => {
    // 강의 분류명 가져오기
    axios
      .get("/register/registerListControljson.do")
      .then((res) => {
        setTypeList(res.data.typeList);
      })
      .catch((err) => {
        console.error("Error fetching lecture types:", err);
      });

    // 강사 리스트 가져오기
    axios
      .get("/register/registerListControljson.do")
      .then((res) => {
        setTutList(res.data.tutList);
      })
      .catch((err) => {
        console.error("Error fetching tutors:", err);
      });

    // 강의실 리스트 가져오기
    axios
      .get("/register/registerListControljson.do")
      .then((res) => {
        setLecrmList(res.data.lecrmList);
      })
      .catch((err) => {
        console.error("Error fetching lecture rooms:", err);
      });
  };
  return (
    <div>
      <Modal
        style={modalStyle}
        isOpen={props.modalAction}
        appElement={document.getElementById("app")}
      >
        <div id="noticeform">
          <p className="conTitle">
            <span>{props.id === "" ? "강의 등록" : "강의 수정"}</span>
          </p>
          <table style={{ width: "550px", height: "350px" }}>
            <tbody>
              <tr>
                <th>
                  강의명 <span className="font_red">*</span>
                </th>
                <td>
                  <input
                    type="text"
                    className="form-control input-sm"
                    style={{ width: "150px" }}
                    value={lecinfo?.lec_name}
                    onChange={(e) => {
                      setLecinfo((prev) => ({
                        ...prev,
                        lec_name: e.target.value,
                      }));
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">강의 분류</th>
                <td>
                  <select
                    className="inputTxt p100"
                    name="lec_type_id"
                    id="lec_type_id"
                    value={lecinfo?.lec_type_id}
                    onChange={(e) => {
                      setLecinfo((prev) => ({
                        ...prev,
                        lec_type_id: e.target.value,
                      }));
                    }}
                  >
                    <option value="">강의 분류 선택</option>
                    {typeList.map((list) => (
                      <option key={list.lec_type_id} value={list.lec_type_id}>
                        {list.lec_type_name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <th>최대인원</th>
                <td>
                  <input
                    type="text"
                    className="form-control input-sm"
                    style={{ width: "150px" }}
                    value={lecinfo?.max_pnum}
                    onChange={(e) => {
                      setLecinfo((prev) => ({
                        ...prev,
                        max_pnum: e.target.value,
                      }));
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  강사명 <span className="font_red">*</span>
                </th>
                <td>
                  <select
                    className="inputTxt p100"
                    id="tutor_id"
                    name="tutor_id"
                    value={lecinfo?.tutor_id}
                    onChange={(e) => {
                      setLecinfo((prev) => ({
                        ...prev,
                        tutor_id: e.target.value,
                      }));
                    }}
                  >
                    <option value="">강사 선택</option>
                    {tutList.map((list) => (
                      <option key={list.loginID} value={list.loginID}>
                        {list.t_name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <th>강의실</th>
                <td>
                  <select
                    className="inputTxt p100"
                    name="lecrm_id"
                    id="lecrm_id"
                    value={lecinfo?.lecrm_id}
                    onChange={(e) => {
                      setLecinfo((prev) => ({
                        ...prev,
                        lecrm_id: e.target.value,
                      }));
                    }}
                  >
                    <option value="">강의실 선택</option>
                    {lecrmList.map((list) => (
                      <option key={list.lecrm_id} value={list.lecrm_id}>
                        {list.lecrm_name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <th>과정일수</th>
                <td>
                  <input
                    type="text"
                    className="form-control input-sm"
                    style={{ width: "150px" }}
                    value={lecinfo?.process_day}
                    onChange={(e) => {
                      setLecinfo((prev) => ({
                        ...prev,
                        process_day: e.target.value,
                      }));
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  개강일 <span className="font_red">*</span>
                </th>
                <td>
                  <input
                    type="text"
                    className="form-control input-sm"
                    style={{ width: "150px" }}
                    value={lecinfo?.start_date}
                    onChange={(e) => {
                      setLecinfo((prev) => ({
                        ...prev,
                        start_date: e.target.value,
                      }));
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  종강일 <span className="font_red">*</span>
                </th>
                <td>
                  <input
                    type="text"
                    className="form-control input-sm"
                    style={{ width: "150px" }}
                    value={lecinfo?.end_date}
                    onChange={(e) => {
                      setLecinfo((prev) => ({
                        ...prev,
                        end_date: e.target.value,
                      }));
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="modal-button">
            {props.id === "" ? (
              <button
                className="btn btn-primary mx-2"
                onClick={() => postHandle("I")}
              >
                등록
              </button>
            ) : null}
            {props.id !== "" ? (
              <button
                className="btn btn-primary mx-2"
                onClick={() => postHandle("U")}
              >
                수정
              </button>
            ) : null}
            <button className="btn btn-primary" onClick={close}>
              닫기
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalLec;
