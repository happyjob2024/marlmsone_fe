import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";


const SamplePage8 = () => {

  
  return (
    <div id="wrap_area">

		<h2 className="hidden">컨텐츠 영역</h2>
		<div id="container">
			<ul>
				<li className="lnb">
				</li>
				<li className="contents">
					<h3 className="hidden">contents 영역</h3>
					
					<div className="content">
						<p className="Location">
							<a href="../dashboard/dashboard.do" 
								className="btn_set home">메인으로</a> <span
								className="btn_nav bold">학습관리</span> <span 
								className="btn_nav bold">수강상담 관리</span> <a href="../adv/advice.do" 
								className="btn_set refresh">새로고침</a>
						</p>						
						
						<p className="conTitle">
							<span>수강상담 관리</span>
							<span className="fr">
								<select id="lecList" style={{width: "200px"}}>							
								</select>
								<a className="btnType blue" name="modal"><span>상담 등록</span></a>						
							</span>	
						</p>				
       
						<div className="divList">
							<table className="col">
								<caption>caption</caption>
								<colgroup>
									<col width="10%"/>
									<col width="30%"/>
									<col width="20%"/>
									<col width="20%"/>
									<col width="20%"/>
								</colgroup>
	
								<thead>
									<tr>										
										<th scope="col">상담 번호</th>
										<th scope="col">과정 명</th>
										<th scope="col">학생 명 (ID)</th>
										<th scope="col">상담일자</th>
										<th scope="col">상담자 명 (ID)</th>
									</tr>
								</thead>
								<tbody id="advListBody"></tbody>								
							</table>
						</div>
						                
						<div className="paging_area"  id="advPagination"> </div>						
						
					</div>
				</li>
			</ul>
		</div>
	</div>
  )
}

export default SamplePage8