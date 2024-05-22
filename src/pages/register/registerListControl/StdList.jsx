import { useEffect, useState } from "react";
import { useQueryParam } from "../../../hook/useQueryParam ";
import axios from "axios";

const StdList = () => {
  const [stdldis, setStdldis] = useState(false);
  const [stdlcurrentPage, setStdlcurrentPage] = useState(1);
  const [stditemlist, setStditemlist] = useState([]);
  const [stdtotalcnt, setStdtotalcnt] = useState(0);

  const queryParam = useQueryParam();
  const searchlecid = queryParam.get("id");

  useEffect(() => {
    const stdlist = async (currentPage) => {
      currentPage = currentPage || 1;
      setStdlcurrentPage(currentPage);
      setStdldis(true);

      let params = new URLSearchParams();
      params.append("currentPage", currentPage);
      params.append("pageSize", 5);
      params.append("lec_id", searchlecid);

      await axios
        .post("/register/stdListjson.do", params)
        .then((res) => {
          setStdtotalcnt(res.data.std_Total);
          setStditemlist(res.data.stdList);
        })
        .catch((err) => {
          alert(err.message);
        });
    };
    stdlist();
  }, [searchlecid]);

  return (
    <div>
      {stdldis && (
        <div>
          <p className="conTitle">
            <span>학생 목록</span>{" "}
          </p>
          <div>
            <b>
              총건수 : {stdtotalcnt} 현재 페이지 번호 : {stdlcurrentPage}
            </b>
            <table className="col">
              <colgroup>
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
              </colgroup>
              <thead>
                <tr>
                  <th>학번</th>
                  <th>학생명</th>
                  <th>과정명</th>
                </tr>
              </thead>
              <tbody>
                {stditemlist.map((item) => {
                  return (
                    <tr key={item.lec_id}>
                      <td>{item.std_num}</td>
                      <td>{item.name}</td>
                      <td>{item.lec_name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default StdList;
