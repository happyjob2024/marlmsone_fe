import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js의 모든 컴포넌트를 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = (props) => {

    const [data, setData] = useState({
        labels: ['수강 정원', '수강 인원', '과락 인원'],
        datasets: [
            {
                label: 'Votes',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    });;

    useEffect(() => {
        if (props.lecId !== null && props.lecId !== "") {
            searchCourseSizeDetail(props.lecId);
        }
    }, [props.lecId]);


    // 그래프 옵션
    const options = {
        responsive: true,
        plugins: {
            legend: {
            display: true,
            position: 'top',
            labels: {
                font: {
                    size: 16, // 레이블 폰트 크기
                    weight: 'bold', // 레이블 폰트 굵기
                },
                },
            },
            title: {
            display: true,
            text: '수강 인원',
            font: {
                size: 24, // 폰트 크기
                weight: 'bold', // 폰트 굵기
            },
            },
        },
        scales: {
            y: {
            beginAtZero: true,
            },
        },
    };

  // 수강인원 상세정보 조회
  const searchCourseSizeDetail = (lecId) => {

    // data : {
    //     lec_id : lec_id
    // },
    // url : "/adm/showChart.do",

    let params = new URLSearchParams();
    params.append('lec_id', lecId);

    axios.post("/adm/showChart.do", params)
        .then((res) => {
            // {"data":{"result":"SUCCESS",
            //          "courseSizeModel":[{"lec_id":1,"tutor_id":null,"lec_name":"자바의이해",
            //                              "max_pnum":50,"pre_pnum":0,"start_date":null,"end_date":null,
            //                              "process_day":null,"test_id":0,"loginID":null,
            //                              "user_type":null,"use_yn":null,"name":null,"std_id":null,
            //                              "test_score":0,"tot_score":0,"max_score":0,"min_score":0,"avg_score":0,
            //                              "fail_cnt":2,"fail_rate":0}],
            //          "resultMsg":"조회 되었습니다."}
            console.log("searchCourseSizeDetail() result console : " + JSON.stringify(res));

            const courseSize = res.data.courseSizeModel[0];
            setData({
                labels: ['수강 정원', '수강 인원', '과락 인원'],
                datasets: [
                    {
                        label: courseSize.lec_name,
                        data: [
                            courseSize.max_pnum,
                            courseSize.pre_pnum,
                            courseSize.fail_cnt
                        ],
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        })
        .catch((err) => {
            console.log("searchCourseSizeDetail() result error : " + err.message);
            alert(err.message);
        });
}

  return <Bar data={data} options={options} />;
};

export default ChartComponent;