import React, { useState, useEffect } from "react"
import './MyTestInfo.css'
import axios from 'axios'

const MyTest = () => {
    const [testlist, setTestlist] = useState([]);
    const pageSize = 5
    const [currentPage, setCurrentPage] = useState(1);
  
    useEffect(() => {
        searchlist(currentPage);
    }, [currentPage])

    const searchlist = async (page) => {
        let params = new URLSearchParams()
        params.append('currentPage', page)
        params.append('pageSize', pageSize)
  
        try {
            const res = await axios.post('/std/myTestListResponsebody.do', params);
            setTestlist(res.data.listData);
        } catch (error) {
            console.error('Error fetching test list:', error);
        }
    }

    const fSearch_myTestList = async (searchKey) => {
        let params = new URLSearchParams()
        params.append('currentPage', currentPage)
        params.append('pageSize', pageSize)
        params.append('searchKey', searchKey)
    
        try {
            const res = await axios.post('/std/myTestListResponsebody.do', params);
            setTestlist(res.data.listData);
        } catch (error) {
            console.error('Error fetching test list:', error);
        }
    }

    return (
        <div className="content">
            <p className="Location">
                <a href="/dashboard" className="btn_set home">메인으로</a>
                <a className="btn_nav bold">학습관리</a>
                <a className="btn_nav bold">시험응시</a>
                <a href="../std/myTestInfo" className="btn_set refresh">새로고침</a>
            </p>

            <p className="conTitle">
                <span>시험응시</span>
                <span>
                    <select 
                        id="searchKey" 
                        name="searchKey"
                        onChange={(e) => fSearch_myTestList(e.target.value)}
                    >
                        <option value="AllTest">전체 시험목록</option>
                        <option value="ProceedingTest">진행중인 시험</option>
                        <option value="LastTest">지난 시험</option>
                    </select>
                </span>
            </p>

            <div className="divList">
                <table className="col">
                    <colgroup>
                        <col width="20%"></col>
                        <col width="20%"></col>
                        <col width="10%"></col>
                        <col width="30%"></col>
                        <col width="10%"></col>
                        <col width="10%"></col>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>과정명</th>
                            <th>시험명</th>
                            <th>강사명</th>
                            <th>응시기간</th>
                            <th>결과</th>
                            <th>시험응시</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testlist.map((list) => {
                            // 현재 날짜 가져오기
                            const nowDate = new Date();
                            return (
                                <tr key={list.lec_id}>
                                    <td>{list.lec_name}</td>
                                    <td>{list.test_name}</td>
                                    <td>{list.tut_name}</td>
                                    <td>{list.test_start} ~ {list.test_end}</td>
                                    <td>{list.test_yn}</td>
                                    <td>
                                        {list.test_yn === 'Y' ? (
                                            <a href={`javascript:fView_testResult(${list.lec_id}, ${list.test_id});`}>
                                                <span><strong>결과확인</strong></span>
                                            </a>
                                        ) : list.test_yn === 'N' && new Date(list.test_end) >= nowDate ? (
                                            <a href={`javascript:fApply_test(${list.lec_id}, '${list.lec_name}', ${list.test_id}, '${list.test_name}', '${list.tut_name}');`}>
                                                <span><strong>시험응시</strong></span>
                                            </a>
                                        ) : (
                                            <strong>기간종료</strong>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyTest;
