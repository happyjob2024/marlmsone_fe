import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useQueryParam } from "../../../hook/useQueryParam";
import ModalEqu from "./ModalEqu";

const Equipment = () => {
    const [equdis, setEqudis] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [equcurrentPage, setEqucurrentPage] = useState(1);
    const [equitemlist, setEquitemlist] = useState([]);
    const [equtotalcnt, setEqutotalcnt] = useState(0);
    const [equModal, setEquModal] = useState(false);
    const [equId, setEquId] = useState();
    const queryParam = useQueryParam();
    const searchroomid = queryParam.get('id');
    const searchroomNm = queryParam.get('name');


    useEffect(() => {
        const equlist = async (cpage) => {
            cpage = cpage || 1;
            setEqucurrentPage(cpage);
            setEqudis(true);
            let params = new URLSearchParams();
            params.append("cpage", cpage);
            params.append("pagesize", 5);
            params.append("lecrm_id", searchroomid);

            await axios
                .post("/adm/equListjson.do", params)
                .then((res) => {
                    setEqutotalcnt(res.data.listcnt);
                    setEquitemlist(res.data.listdata);
                })
                .catch((err) => {
                    alert(err.message);
                });
        };
        equlist();
    }, [searchroomid,equModal]);


    const openEqu = (id) => {
        setEquId(id);
        setEquModal(true);
      }

    return (
        <div>
            {equdis && (
                <div>
                    <p className="conTitle">
                        <span>장비 목록</span>
                        <span className="fr">
                            <button
                                className="btn btn-primary"
                                name="newRegEqu"
                                id="newRegEqu"
                                onClick={() => {
                                    openEqu("")
                                  }}
                            >
                                <span>장비 신규등록</span>
                            </button>
                        </span>
                    </p>
                    <div>
                        <b>
                            총건수 : {equtotalcnt} 현재 페이지 번호 : {equcurrentPage}
                        </b>
                        <table className="col">
                            <colgroup>
                                <col width="20%" />
                                <col width="15%" />
                                <col width="15%" />
                                <col width="40%" />
                                <col width="15%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>강의실 명</th>
                                    <th>장비 명</th>
                                    <th>장비수</th>
                                    <th>비고</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {equitemlist.map((item) => {
                                    return (
                                        <tr key={item.equ_id}>
                                            <td>{item.lecrm_name}</td>
                                            <td>{item.equ_name}</td>
                                            <td>{item.equ_num}</td>
                                            <td>{item.equ_note}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        openEqu(item.equ_id)
                                                      }}
                                                >
                                                    수정
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {equModal ? <ModalEqu modalAction={equModal} setCurrentPage={setCurrentPage} setModalAction={setEquModal} id={equId} lecrmNm={searchroomNm} lecrmId={searchroomid}></ModalEqu> : null}
        </div>
    )
}

export default Equipment;