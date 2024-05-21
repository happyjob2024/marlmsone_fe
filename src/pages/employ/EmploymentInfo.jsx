import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import axios from "axios";
import Pagination from "../../components/common/Pagination";
import EmpstdList from "./list/EmpstdList.jsx";
import ModalEmpList from "../employ/modal/ModalStdList";
import SelectBox from "../../components/common/SelectBox";

// export const StdCntContext = createContext();

const EmploymentInfo = () => {
    const [employmentInfoList, setEmploymentInfoList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalcnt, setTotalcnt] = useState(0);
    const [searchInfo, setSearchInfo] = useState("");
    const [selected, setSelected] = useState("all");
    const searchEmpList = useRef();

    const [registerModalOn, setRegisterModalOn] = useState(false);
    const [stdId, setStdId] = useState("");
    const [action, setAction] = useState("");

    useEffect(() => {
        searchEmploymentList(currentPage);
    }, [currentPage, totalcnt]);

    const searchEmploymentList = async (cpage) => {
        if (typeof cpage !== 'number') {
            cpage = 1;
        }
        let params = new URLSearchParams();
        params.append("currentPage", cpage);
        params.append("pageSize", 5);
        params.append("searchInfo", searchInfo);
        params.append("searchKey", selected);

        await axios
            .post("/employ/listEmp2.do", params)
            .then((res) => {
                setEmploymentInfoList(res.data.empInfo);
                setTotalcnt(res.data.emp_Total);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const deleteEmploymentInfo = async (std_id) => {
        let params = new URLSearchParams();
        params.append("std_id", std_id);

        await axios
            .post("/employ/delEmploy.do", params)
            .then((res) => {
                alert(res.data.resultMsg);
                searchEmploymentList();
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const handleSearch = () => {
        setSearchInfo(searchEmpList.current.value);
        setCurrentPage(1);
        searchEmploymentList(1);
    };

    const OPTIONS = [
        { value: "all", name: "전체" },
        { value: "name", name: "학생명" },
        { value: "comp_name", name: "회사명" },
    ];

    const handleSelectChange = (event) => {
        setSelected(event.target.value);
    };

    const openModal = (std_id, action) => {
        setStdId(std_id);
        setAction(action);
        setRegisterModalOn(true);
    };

    const searchstylewidth = {
        height: "28px",
        width: "200px",
    };

    return (
        <div className="content">
            <p className="Location">
                <a href="../employ/employmentInfo" className="btn_set home">메인으로</a>
                <span className="btn_nav bold">취업관리</span>
                <span className="btn_nav bold">취업 정보 관리</span>
                <a href="../employ/employmentInfo.do" className="btn_set refresh">새로고침</a>
            </p>

            <p className="conTitle">
                <span>취업목록</span>
                <span className="fr">
                    <SelectBox
                        options={OPTIONS}
                        onChange={handleSelectChange}
                    />
                    <input
                        type="text"
                        id="searchInfo"
                        name="searchInfo"
                        className="form-control"
                        placeholder=""
                        style={searchstylewidth}
                        ref={searchEmpList}
                    />
                    <button
                        className="btn btn-primary"
                        name="searchEnter"
                        id="searchEnter"
                        onClick={handleSearch}
                    >
                        <span>검색</span>
                    </button>
                </span>
            </p>
            <div>
                <table className="col">
                    <caption>caption</caption>
                    <colgroup>
                        <col width="10%" />
                        <col width="10%" />
                        <col width="15%" />
                        <col width="15%" />
                        <col width="15%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="25%" />
                    </colgroup>

                    <thead>
                        <tr>
                            <th scope="col">학번</th>
                            <th scope="col">학생명</th>
                            <th scope="col">연락처</th>
                            <th scope="col">입사일</th>
                            <th scope="col">퇴사일</th>
                            <th scope="col">회사명</th>
                            <th scope="col">재직여부</th>
                            <th scope="col">수정/삭제</th>
                        </tr>
                    </thead>

                    <tbody>
                        {totalcnt === 0 ? (
                            <tr>
                                <td colSpan="8">해당되는 데이터가 없습니다.</td>
                            </tr>
                        ) : (
                            employmentInfoList.map((list) => (
                                <tr key={list.std_id}>
                                    <td>{list.std_num}</td>
                                    <td>{list.name}</td>
                                    <td>{list.tel}</td>
                                    <td>{list.employ_day}</td>
                                    <td>{list.resign_day}</td>
                                    <td>{list.comp_name}</td>
                                    <td>{list.wp_state}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => openModal(list.std_id, "U")}
                                        >
                                            <span>수정</span>
                                        </button>
                                        /
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => deleteEmploymentInfo(list.std_id)}
                                        >
                                            <span>삭제</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPage={Math.ceil(totalcnt / 5)}
                    pageSize={5}
                    blockSize={5}
                    onClick={setCurrentPage}
                />
                <ModalEmpList
                    modalAction={registerModalOn}
                    id={stdId}
                    setModalAction={setRegisterModalOn}
                    searchList={searchEmploymentList}
                    resignDay={""}
                />
            </div>
            {/* <StdCntContext.Provider value={{stdTotalcnt2}}> */}
                <EmpstdList test={totalcnt}/>
            {/* </StdCntContext.Provider> */}
            {/* <EmpstdList test={totalcnt}/> */}
        </div>
    );
};

export default EmploymentInfo;
