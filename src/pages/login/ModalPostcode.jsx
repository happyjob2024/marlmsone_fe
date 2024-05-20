import React, {useEffect} from "react";
import Modal from "react-modal";
import DaumPostcode from "react-daum-postcode";


const ModalPostcode = (props) => {

    useEffect(() => {
    }, []);

    const handleComplete = (data) => {
        props.setSelinfo({...props.selinfo, 
                          zipcode: data.zonecode,
                          addr: data.address,
                        });
        props.inputDetailAddress.current.focus();
        props.setModalAction(false);
    }

    const close = () => {
        props.setModalAction(false);
    }

    const modalStyle = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            width: "50%",
            height : "60%",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            transform: "translate(-50%, -50%)",
        },
    };
    
    return (
        <div>
            {/* 우편번호 찾기 모달 */}
            <Modal style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <DaumPostcode onComplete={handleComplete} />
                <div className="modal-button">                        
                    <button className="btn btn-primary mx-2" onClick={close}>닫기</button>
                </div>
            </Modal>{/* End 우편번호 찾기 모달 */}
        </div>
    )  
}

export default ModalPostcode