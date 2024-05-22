import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import Pagination from "../../../components/common/Pagination";
import ModalStdList from "../modal/ModalStdList";
import SelectBox from "../../../components/common/SelectBox";
// import { StdCntContext } from "../EmploymentInfo";

const EmpstdList = (props) => {
    const [stdInfoList, setStdInfoList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInfo, setSearchInfo] = useState("");
    const [selected, setSelected] = useState("all1");
    const [stdTotalcnt, setStdTotalcnt] = useState("");
    const searchStudentList = useRef();
    
    const [registerModalOn, setRegisterModalOn] = useState(false);
    const [stdId, setStdId] = useState("");
    
    // const {stdTotalcnt2} = useContext(StdCntContext);

    useEffect(() => {
        searchStdList(currentPage);
    }, [currentPage, props.test]);

    const searchStdList = async (cpage) => {
        if (typeof cpage === 'number') {
            cpage = cpage || 1;
        } else {
            cpage = 1;
        }
        let params = new URLSearchParams();
        params.append("currentPage", cpage);
        params.append("pageSize", 5);
        params.append("searchInfo1", searchInfo);
        params.append("searchKey1", selected);
        params.append("std_Total", stdTotalcnt);

        try {
            const res = await axios.post("/employ/empstdList2.do", params);
            setStdInfoList(res.data.stdList);
            setStdTotalcnt(res.data.std_Total);
        } catch (err) {
            alert(err.message);
        }
    };

    const OPTIONS = [
        { value: "all1", name: "전체" },
        { value: "t_name", name: "학생명" },
        { value: "lec_nm", name: "강의명" },
    ];

    const searchstylewidth = {
        height: "28px",
        width: "200px",
    };

    const handleSearch = () => {
        setSearchInfo(searchStudentList.current.value);
        setCurrentPage(1);
        searchStdList(1);
    };

    const handleSelectChange = (event) => {
        setSelected(event.target.value);
    };

    const openModal = (std_id) => {
        setStdId(std_id);
        setRegisterModalOn(true);
    };

    return (
        <div>
            <p className="conTitle">
                <span>학생 정보</span>
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
                        ref={searchStudentList}
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
            <table className="col">
                <colgroup>
                    <col width="10%" />
                    <col width="10%" />
                    <col width="15%" />
                    <col width="15%" />
                    <col width="15%" />
                    <col width="10%" />
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col">학번</th>
                        <th scope="col">학생명</th>
                        <th scope="col">연락처</th>
                        <th scope="col">강의명</th>
                        <th scope="col">가입일자</th>
                        <th scope="col">등록</th>
                    </tr>
                </thead>
                <tbody>
                    {stdTotalcnt === 0 ? (
                        <tr>
                            <td colSpan="6">해당되는 데이터가 없습니다.</td>
                        </tr>
                    ) : (
                    stdInfoList.map((list) => (
                        <tr key={list.std_id}>
                            <td>{list.std_num}</td>
                            <td>{list.name}</td>
                            <td>{list.tel}</td>
                            <td>{list.lec_name}</td>
                            <td>{list.join_date}</td>
                            <td>
                                <button
                                    className="btn btn-primary"
                                    onClick={ () => openModal(list.std_id)}      
                                >
                                    <span>등록</span>
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPage={stdTotalcnt}
                pageSize={5}
                blockSize={5}
                onClick={setCurrentPage}
            />
            <ModalStdList
                modalAction={registerModalOn}
                id={stdId}
                setModalAction={setRegisterModalOn}
                companyId={""}
                resignDay={""}
                searchList={searchStdList}
            ></ModalStdList>
        </div>
    );
};

export default EmpstdList;
