import React, { useState, useEffect } from 'react'
import axios from "axios";
import Pagination from "../../components/common/Pagination";

import Modal from "react-modal";

const SamplePage3 = (props) => {
  
  const [blockSize                           ] = useState(5);     // 
  const [currentPage     , setCurrentPage    ] = useState(1);     // 현재 페이지
  const [pageSize        , setPageSize       ] = useState(10);    // 페이지 크기
  const [totalCnt        , setTotalCnt       ] = useState(0);     // 총 페이지 수

  const [action          , setAction         ] = useState("");    // 등록/수정 코드 관리 
  const [queId           , setQueId          ] = useState("");    // 게시글 ID
  const [lecTypeId       , setLecTypeId      ] = useState("");    // 시분류 타입 ID
  const [useYn           , setUseYn          ] = useState("Y");   // 비활성화 코드
  const [lecList         , setLecList        ] = useState([]);    // 시험문제 목록
  const [lectureList     , setLectureList    ] = useState([]);    // 시분류 목록
  const [updateSel       , setUpdateSel      ] = useState([]);    // 수정모달창 정보
  const [roomdis         , setRoomdis        ] = useState(false); // 모달창 관리



    /* 로드시 시험문제 목록 조회 */
    useEffect(() => {
      fn_lecList();
    }, []);

    useEffect(() => {
      if(action === "U"){
        fn_updateSel();
      }else{
        fn_lecList();
      }
    }, [lecTypeId,useYn,action]);

  
    /* 모달 스타일 */
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

    /* 모달 닫기관리 */
    const fn_closeRoomModal = () => {
      setRoomdis(false);
      setAction("");
      setUpdateSel([]);
    };


    /* 등록 모달 상태관리 */
    const fn_addModal = () => {
      setRoomdis(true);
      setAction("I");
      setUpdateSel([]);
    };

    /* 수정 모달 상태관리 */
    const fn_updateModal = (e) => {
      setRoomdis(true);
      setAction("U");
      setQueId(e.target.getAttribute('data-item-id'));
    };

  /* 시험문제 목록 */
  const fn_lecList = (cpage) => {
    cpage = cpage || 1;
    setCurrentPage(cpage);

    let params = new URLSearchParams();
    params.append("cpage"      , cpage);
    params.append("lecList"    , lecTypeId);
    params.append("use_yn"    , useYn);
    params.append("pagesize"  , pageSize);

    axios
      .post("/tut/testListRtn.do", params)
      .then((res) => {
        // 성공시
        setLectureList(res.data.lectureListData);
        setTotalCnt(res.data.listcnt);
        setLecList(res.data.listdata);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  
  /* 시분류코드 관리 */
  const fn_selLecture = (e) => {
    setLecTypeId(e.target.value);
  }

  /* 비활성문제 관리 */
  const fn_useYn = () => {
    let yn = document.getElementById("deactiveCk").checked;
    if(yn){
      setUseYn("N");
      document.getElementById("activebtn").innerHTML  = "활성";
    } else{
      setUseYn("Y");
      document.getElementById("activebtn").innerHTML  = "비활성";
    }
  }

  /* 전체선택 */
  const fn_allChackd = () => {
    let cnt = lecList.length;
    if(document.getElementById("allRowCheck").checked===true){
      for(let i=0;i<cnt;i++) document.getElementsByName("rowCheckbox")[i].checked=true;
   }
   if(document.getElementById("allRowCheck").checked===false){
      for(let i=0;i<cnt;i++) document.getElementsByName("rowCheckbox")[i].checked=false;  
   }
  }

  /* 비활성 */
  const fn_inactive = () => {
		let selectedItems = []; // 선택한 항목들을 저장할 배열
		let checkboxes = document.getElementsByClassName('rowCheckbox');

		// 체크박스 선택 유무를 확인하여 유효성 검사를 수행
	  let isChecked = false;
	  for (let i = 0; i < checkboxes.length; i++) {
	      if (checkboxes[i].checked) {
	          isChecked = true;
	          break;
	      }
	  }

	  if (!isChecked) {
	      alert("문제를 선택해주세요.");
	      return;
	  }

		for (let i = 0; i < checkboxes.length; i++) {
			console.log("checkBoxed Value" + i + ":" + checkboxes[i].checked);
			if (checkboxes[i].checked) {
				selectedItems.push(checkboxes[i].getAttribute('data-item-id'));
			}
		}

    let params = new URLSearchParams();

    params.append("que_id"         , selectedItems);

    axios
      .post("/tut/testDeactivate.do", params)
      .then((res) => {
        // 성공시
        let rtnMsg = document.getElementById("activebtn").innerHTML;
        fn_lecList();
        alert(res.data.rtnCnt+"건이 "+rtnMsg+"화 되었습니다.");
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  /* 시험문제 등록/수정 */
  const fn_addReg = () => {

  let lecTypeId = document.getElementById("lec_type_id").value;
  let queId     = updateSel.que_id;
  let testQue   = document.getElementById("test_que").value;
  let queAns    = document.getElementById("que_ans").value;
  let queEx1    = document.getElementById("que_ex1").value;
  let queEx2    = document.getElementById("que_ex2").value;
  let queEx3    = document.getElementById("que_ex3").value;
  let queEx4    = document.getElementById("que_ex4").value;
  let useYn     = document.getElementById("inactive").value;

  if(lecTypeId === ''){
    alert("시험분류를 선택해주세요.");
    return;
  }else if(testQue === ''){
    alert("문제를 입력해주세요.");
    return;
  }else if(queAns === ''){
    alert("정답을 입력해주세요.");
    return;
  }else if(queEx1 === ''){
    alert("보기1을 입력해주세요.");
    return;
  }else if(queEx2 === ''){
    alert("보기2를 입력해주세요.");
    return;
  }else if(queEx3 === ''){
    alert("보기3을 입력해주세요.");
    return;
  }else if(queEx4 === ''){
    alert("보기4를 입력해주세요.");
    return;
  }

  let params = new URLSearchParams();
  params.append("lec_type_id" , lecTypeId);
  params.append("que_id"      , queId);
  params.append("test_que"    , testQue);
  params.append("que_ans"     , queAns);
  params.append("que_ex1"     , queEx1);
  params.append("que_ex2"     , queEx2);
  params.append("que_ex3"     , queEx3);
  params.append("que_ex4"     , queEx4);
  params.append("use_yn"      , useYn);
  params.append("action"      , action);

  axios
    .post("/tut/testSave.do", params)
    .then((res) => {
      fn_closeRoomModal();
      fn_lecList();
    })
    .catch((err) => {
      alert(err.message);
    });
  }

  /* 수정 조회 */
  const fn_updateSel = () => {
    let params = new URLSearchParams();
    params.append("que_id" , queId);

    axios
    .post("/tut/testModifyList.do", params)
    .then((res) => {
      setUpdateSel(res.data.selinfo);
      document.getElementById("inactive").value = res.data.selinfo.use_yn;
    })
    .catch((err) => {
      alert(err.message);
    });
  }

  /* 새로고침 */
  const fn_reload = () => {
    window.location.replace("samplepage3");
  }

  /* 메인화면 */
  const fn_main = () => {
    window.location.replace("/");
  }

  return (
    <div className="content">
      <p className="Location">
        <a className="btn_set home" onClick={fn_main}>메인으로</a>
        <span className="btn_nav bold">학습 관리</span>
        <span className="btn_nav bold">시험 관리 </span>
        <a className="btn_set refresh" onClick={fn_reload}>새로고침</a>
      </p>

      <p className="conTitle">
        <span>시험 문제 관리</span>
        <span className="fr">
            <input type="checkbox" name="deactiveCk" id="deactiveCk" onClick={fn_useYn}/> 비활성화 문제
        <select id="lectureList"
                style={{width: "200px"}}
                onChange={fn_selLecture}>	
          <option value="">시험분류 선택</option>
          {
            lectureList.map((item, index) => {
              return (
                <option value={item.lec_type_id} key={index}>{item.lec_type_name}</option>
              )
            })
          }
        </select>						
        <a className="btnType blue"
          name="newreg" id="newreg" onClick={fn_addModal}><span>문제등록</span></a>
        </span>
      </p>

      <div className="divComGrpCodList">
        <table className="col">
          <caption>caption</caption>
          <colgroup>
            <col width="10%"/>
            <col width="8%"/>
            <col width="20%"/>
            <col width="5%"/>
            <col width="10%"/>
            <col width="10%"/>
            <col width="10%"/>
            <col width="10%"/>
            <col width="9%"/>
          </colgroup>

          <thead>
            <tr>
              <th scope="col">전체선택&nbsp;
              <input type="checkbox" 
                     name="allRowCheck"
                     id="allRowCheck"
                     onClick={fn_allChackd}
              />
              </th>
              <th scope="col">시험분류</th>
              <th scope="col">문제</th>
              <th scope="col">정답</th>
              <th scope="col">보기1</th>
              <th scope="col">보기2</th>
              <th scope="col">보기3</th>
              <th scope="col">보기4</th>
              <th scope="col">
                <div className="btn_areaC"/>
                  <a className="btnType3 color1" onClick={fn_inactive}>
                    <span id="activebtn" value="비활성">비활성</span>
                  </a>
                </th>
            </tr>
          </thead>
          
          <tbody id="listTestbody">
            {totalCnt === 0 && (
              <tr>
                <td colSpan="5"> 조회된 데이터가 없습니다.</td>
              </tr>
            )}
            {totalCnt > 0 &&
              lecList.map((item) => {
                return (
                    <tr key={item.que_id}>
                      <td><input type="checkbox" name="rowCheckbox" className="rowCheckbox" data-item-id={item.que_id}/></td>
                      <td>{item.lec_type_name}</td>
                      <td>{item.test_que}</td>
                      <td>{item.que_ans}</td>
                      <td>{item.que_ex1}</td>
                      <td>{item.que_ex2}</td>
                      <td>{item.que_ex3}</td>
                      <td>{item.que_ex4}</td>
                      <td><a className="btnType3 color1" data-item-id={item.que_id} onClick={fn_updateModal}><span data-item-id={item.que_id} >수정</span></a></td>
                    </tr>
                  );
                }
              )
            } 
          </tbody>
        </table>
      </div>
      <Pagination
          currentPage={currentPage}
          totalPage={totalCnt}
          pageSize={pageSize}
          blockSize={blockSize}
          onClick={fn_lecList}
        />

      <Modal
        style={modalStyle}
        isOpen={roomdis}
        onRequestClose={fn_closeRoomModal}
        ariaHideApp={false}
      >
        <div id="layer1">
          <dl>
            <dt>
            {action === "I" && (
              <strong>시험문제 등록</strong>
            )}
            {action === "U" && (
              <strong>시험문제 수정</strong>
            )}
            </dt>
            <dd className="content">
              <table className="row">
                <caption>caption</caption>
                <colgroup>
                  <col width="120px"/>
                  <col width="*"/>
                  <col width="120px"/>
                  <col width="*"/>
                </colgroup>

                <tbody>
                  <tr>
                    <th scope="row">시험분류<span className="font_red">*</span></th>
                    <td colSpan="7">
                      <select name="sort" id="lec_type_id" style={{width: "100%"}} value={updateSel.lec_type_id} >
                        <option value="">시험분류 선택</option>
                        {
                          lectureList.map((item, index) => {
                            return (
                              <option value={item.lec_type_id} key={index}>{item.lec_type_name}</option>
                            )
                          })
                        }
                    </select>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">문제 <span className="font_red">*</span></th>
                    <td colSpan="7"><textarea name="test_que" id="test_que"
                        className="inputTxt p100" cols="40" rows="1" defaultValue={updateSel.test_que}></textarea></td>
                  </tr>
                  <tr>
                    <th scope="row">정답 <span className="font_red">*</span></th>
                    <td colSpan="3"><input type="text" className="inputTxt p50"
                      name="que_ans" id="que_ans" defaultValue={updateSel.que_ans}/></td>
                  </tr>

                  <tr>
                    <th scope="row">보기1 <span className="font_red">*</span></th>
                    <td colSpan="7"><textarea name="que_ex1" id="que_ex1"
                        className="inputTxt p100" cols="40" rows="1" defaultValue={updateSel.que_ex1}></textarea></td>
                  </tr>
                  <tr>
                    <th scope="row">보기2<span className="font_red">*</span></th>
                    <td colSpan="7"><textarea name="que_ex2" id="que_ex2"
                        className="inputTxt p100" cols="40" rows="1" defaultValue={updateSel.que_ex2}></textarea></td>
                  </tr>
                  <tr>
                    <th scope="row">보기3 <span className="font_red">*</span></th>
                    <td colSpan="7"><textarea name="que_ex3" id="que_ex3"
                        className="inputTxt p100" cols="40" rows="1" defaultValue={updateSel.que_ex3}></textarea></td>
                  </tr>
                  <tr>
                    <th scope="row">보기4 <span className="font_red">*</span></th>
                    <td colSpan="7"><textarea name="que_ex4" id="que_ex4"
                        className="inputTxt p100" cols="40" rows="1" defaultValue={updateSel.que_ex4}></textarea></td>
                  </tr>
                  <tr>
                    <th scope="row">사용여부<span className="font_red">*</span></th>
                    <td colSpan="7">
                      <select name="inactive" id="inactive"
                        style={{width: "100%"}}>
                            <option value="Y">활성화</option>
                            <option value="N">비활성화</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="btn_areaC mt30">
                <a className="btnType blue" id="btnSave" name="btn" onClick={fn_addReg}><span>저장</span></a>
                <a className="btnType gray" id="btnClose" name="btn" onClick={fn_closeRoomModal}><span>취소</span></a>
              </div>
            </dd>
          </dl>
          <a className="closePop"><span className="hidden"onClick={fn_closeRoomModal}>닫기</span></a>
        </div>
      </Modal>




  </div>
  )
}

export default SamplePage3
