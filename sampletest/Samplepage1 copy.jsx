import React, { useState } from 'react'
import SamplePage3 from './Samplepage3'
import Selectcomponent from './Selectcomponent'

const SamplePage1 = () => {
  
  const [distime   , serDisHtime  ] = useState(0);            // 시간
  const [distimetwo, setDisMtime  ] = useState(0);            // 분
  const [param1    , setParam1    ] = useState("해피잡");     // 페이지3 변수1
  const [param2    , setParam2    ] = useState("파이팅!!");   // 페이지3 변수2
  const [indata    , setIndata    ] = useState("");           // input 값
  const [radioNm   , setRadioNm   ] = useState("genderName"); // 라디오버튼 NAME
  const [radioValue, setRadioValue] = useState("M");          // 라디오 값
  let   [ipText    , setIpText    ] = useState("test");       // textID
  let   [selTest   , setSelTest   ] = useState("1");          // selct확인 값
  let   [chkTest   , setChkTest   ] = useState([]);           // 체크박스 배열
  
  /* 시간 더하기 */
  const hPlusTime = () => {
    serDisHtime(distime + 1);
    paramOne("해피잡");
  }

  /* 시간 빼기*/
  const hMinusTime = () => {
    serDisHtime(distime - 1);
    paramTwo("파이팅!!");
  }

  /* 시간 초기화*/
  const hReset = () => {
    serDisHtime(0);
  }

  /* 분 더하기 */
  const mPlusTime = () => {
    setDisMtime(distimetwo + 1);
    paramOne("배용준");
  }

  /* 분 빼기*/
  const mMinusTime = () => {
    setDisMtime(distimetwo - 1);
    paramTwo("잘생김!!");
  }

  /* 분 초기화*/
  const mReset = () => {
    setDisMtime(0);
  }

  /* param1 관리*/
  const paramOne = (val) => {
    setParam1(val);
  }

  /* param2 관리*/
  const paramTwo = (val) => {
    setParam2(val);
  }

  /*인풋 상태관리*/
  const ipChange = (e) => {
    setIndata(e.target.value);
  }

  /*인풋 초기화 버튼*/
  const ipReset = () => {
    setIndata("");
  }

  /*라디오 값 관리*/
  const radioClick = (e) => {
    setRadioValue(e.target.value);
  }

  /*라디오 값 변경버튼*/
  const radioChange = () => {
    if(radioValue === "M"){
      setRadioNm("changeName");
      setRadioValue("F");
    } else {
      setRadioNm("genderName");
      setRadioValue("M");
    }
  }

  /* select확인버튼 기능 */
  const radioValueConf = () => {
    alert(radioValue);
  }

  const setTingChk = (e, index) => {

    let copyarr = [...chkTest]; // 데이터 복사 후 새로운 저장 공간에 복사
    console.log(copyarr == chkTest);

    if (e.target.checked) {
      copyarr.push(e.target.value);
    } else {
      for (let i = 0; i < copyarr.length; i++) {
        if (copyarr[i] === e.target.value) {
          console.log(index - 1); // 1(선택) -> 2(선택) -> 1(선택 해제) -> 2(선택 해제)  안됨   실제 index 0 인대 삭제 index는 1임
          copyarr.splice(i, 1);
        }
      }
    }

    chkTest = [...copyarr];
    setChkTest(chkTest);
  }

  /**/
  const sComreTurn = (rvalue) => {
    alert(rvalue);
  };

  return (
    <div>
      <h6>
        useState 외 useEffect, React.Fragment, Fragment 등 훅 사용법은 별도로 샘플 설명
      </h6>
      <br/>
      <h6>Lifecycle 사용법, useState(Json) 형태 샘플 은 별도로 샘플 설명</h6>
      <br/>
      <br/>
      <br/>
      <a href="https://codingapple.com/unit/react-if-else-patterns-enum-switch-case/" target="_blank">
        <h6>if 문 샘픔</h6>
      </a>
      <a href="https://codingbroker.tistory.com/123" target="_blank">
        <h6>Looping 샘픔</h6>
      </a>
      <br/>
      <br/>
      시간 : {distime} : {distimetwo} {/*시간 : 분 */}
      <br />
      <button onClick = {hPlusTime}>  시간더하기</button>
      <button onClick = {hMinusTime}> 시간빼기</button>
      <button onClick = {hReset}>     시간초기화</button>
      <br/>
      <button onClick = {mPlusTime}>  분더하기</button>
      <button onClick = {mMinusTime}> 분빼기</button>
      <button onClick = {mReset}>     분초기화</button>
      <br/>
      <br/>
      <input type     = "text"
             id       = "inputtext1"
             name     = "inputtext1"
             value    = {indata}
             onChange = {ipChange}
      />
      <button id      = "ipReset"
              name    = "ipReset"
              onClick = {ipReset}
      >
        초기화
      </button>
      <br/>
      ==================== 외부 componnt Call =============================
      <SamplePage3 param1={param1} param2={param2} />
      <br/>
      <Incomponent msg="해피잡" />
      ==================== Radio 테스트 =============================
      <br/>
      남 : <input type="radio" 
                  id      = "radioM"
                  name    = {radioNm}
                  value   = "M"
                  checked = {radioValue==="M"}
                  onClick = {radioClick}
            />
      여 : <input type="radio" 
                  id      = "radioF"
                  name    = {radioNm}
                  value   = "F"
                  checked = {radioValue==="F"}
                  onClick = {radioClick}
            />
      <br />
      <button onClick={radioChange}>    라디오값 변경</button>  
      <button onClick={radioValueConf}> 라디오값 확인</button> <br />
      <br/>
      ====================== Input Test =======================
      <br/>
      <input type     = "text" 
             id       = "ipText" 
             value    = {ipText} 
             onChange = {(e, prev) => {
                          setIpText(e.target.value);
                          alert(prev + " : " + e.target.value + " : " + ipText);
                        }
             }
      />
      <br/>
      ====================== Select Test =======================
      <br/>
      <select id       = "selId"
              name     = "selNm"
              value    = {selTest}
              onChange ={(e) => {
                                 setSelTest(e.target.value);
                                }
                        }
      >
        <option value="">전체</option>
        <option value="1">one</option>
        <option value="2">two</option>
        <option value="3">three</option>
      </select>
      <button
        onClick={() => {
                        alert(selTest);
                       }
                }
      >
        Select확인
      </button>
      <br/>
      ====================== Check Box Test =======================
      <br/>
      1: <input type  = "checkbox"
             id       = "chk1"
             name     = "chkNm"
             value    = "1"
             onChange = {(e) =>{
                                setTingChk(e, 1);
                               }
                        }
          />
      <br/>
      2: <input type  = "checkbox"
             id       = "chk2"
             name     = "chkNm"
             value    = "2"
             onChange = {(e) =>{
                                setTingChk(e, 1);
                               }
                        }
          />
      <br/>
      배열내용 : {chkTest}
      <br/>
      <br/>
      ====================== Select Box Test(Loop) =======================
      <br/>
      체크박스 선택한 체크박스 값이 배열로 들어가는데, 배열의 내용으로 Select
      <br/>
      <select id="selLoop" name="selLoopNm" >
        <option key="0" value=""> 전체 </option>
        {chkTest.map((item, index) => (
                                        <option key   = {index}
                                                value = {item}
                                        >
                                          {item}
                                        </option>
                                      )
                    )
        }
      </select>
      <br />
      <br />
      {chkTest.map((item, index) => (
                                     <p>
                                      {item}
                                      <input type  = "radio"
                                             id    = {item}
                                             name  = {item}
                                             value = {item} 
                                      />
                                     </p>
                                    )
                   )
       }
       <br/>
       <br/>
       <Selectcomponent datalist={chkTest} refunc={sComreTurn} />
       <br/>
       <br/>
    </div>
  )

}

function Incomponent(props) {
  return (
    <div>
      <h1>{props.msg} 방가방가!!!!!!!!!!!!!!!!</h1>
      <SamplePage3 param1="나는" param2="전채다" />
    </div>
  );
}

export default SamplePage1
