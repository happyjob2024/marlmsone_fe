import * as commonjs from "./commonfunction.js"


export function checkUserType(userType) {

    let nullcheckResult = commonjs.nullcheck([
        { inval: userType, msg: "회원유형을 선택하세요." },
    ]);
    return nullcheckResult;
}

export function checkLoginId(loginId) {

    let idRules = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
    let nullcheckResult = commonjs.nullcheck([
        { inval: loginId, msg: "아이디를 입력하세요." },
    ]);

    if ( !nullcheckResult ) {
        return false;
    }
    if ( !idRules.test(loginId) ) {
        alert("아이디는 숫자, 영문자 조합으로 6~20자리를 사용해야 합니다.");
        return false;
    }

    return true;
}

export function checkPassword(password) {

    let passwordRules = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=])[a-zA-Z0-9!@#$%^&*+=]{8,15}$/;
    let nullcheckResult = commonjs.nullcheck([
        { inval: password, msg: "비밀번호를 입력하세요." },
    ]);

    if ( !nullcheckResult ) {
        return false;
    }
    if ( !passwordRules.test(password) ) {
        alert("비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다.");
        return false;
    }

    return true;
}

export function checkPasswordConfirm(passwordConfirm) {

    let passwordRules = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=])[a-zA-Z0-9!@#$%^&+=]{8,15}$/;
    let nullcheckResult = commonjs.nullcheck([
        { inval: passwordConfirm, msg: "비밀번호 확인을 입력하세요." },
    ]);

    if ( !nullcheckResult ) {
        return false;
    }
    if ( !passwordRules.test(passwordConfirm) ) {
        console.log(passwordConfirm);
        alert("비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다.");
        return false;
    }

    return true;
}

export function checkPasswordMatch(password, passwordConfirm) {

    if ( password !== passwordConfirm ) {
        return false;
    }

    return true;
}

export function checkName(name) {

    let nullcheckResult = commonjs.nullcheck([
        { inval: name, msg: "이름을 입력하세요." },
    ]);

    return nullcheckResult;
}

export function checkGenderType(genderType) {

    let nullcheckResult = commonjs.nullcheck([
        { inval: genderType, msg: "성별을 선택해 주세요." },
    ]);

    return nullcheckResult;
}

export function checkRRN (birthday1, birthday2) {

    let nullcheckResult = commonjs.nullcheck([
        { inval: birthday1, msg: "주민등록번호를 입력하세요." },
        { inval: birthday2, msg: "주민등록번호를 입력하세요." },
    ]);
    if ( !nullcheckResult ) {
        return false;
    }
    if (birthday1.length !== 6 || birthday2.length !== 7) {
        alert("올바른 주민등록번호 형식이 아닙니다.");
        return false;
    }

    let rrn = birthday1 + birthday2;
    let sum = 0;
    let weight = [2,3,4,5,6,7,8,9,2,3,4,5];
    let checkDigit = parseInt(rrn.charAt(12));

    for (let i = 0; i < 12; i++) {
        sum += parseInt(rrn.charAt(i)) * weight[i];
    }
    sum = 11 - (sum % 11);
    if (sum > 9) { sum = sum % 10; }

    // 테스트를 위해 주석 처리함
    // if (sum !== checkDigit) {
    //     alert("유효하지 않은 주민등록번호입니다.");
    //     return false;
    // }

    return true;
}

export function checkTel(tel) {

    let numberRules = /^[0-9]+$/;
    let nullcheckResult = commonjs.nullcheck([
        { inval: tel, msg: "전화번호를 입력하세요." },
    ]);

    if ( !nullcheckResult ) {
        return false;
    }
    // if ( !numberRules.test(tel) ) {
    //     alert("전화번호는 숫자로만 입력해 주세요.");
    //     return false;
    // }
    if (tel.substring(0, 3) !== '010') {
        alert("올바른 핸드폰 번호 형식이 아닙니다.");
        return false;
    }

    return true;
}

export function checkEmail(email) {

    let emailRules = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let nullcheckResult = commonjs.nullcheck([
        { inval: email, msg: "이메일을 입력하세요." },
    ]);

    if ( !nullcheckResult ) {
        return false;
    }
    if ( !emailRules.test(email) ) {
        alert("올바른 이메일 형식이 아닙니다.");
        return false;
    }
    
    return true;
}

export function checkZipcode(zipcode) {

    let nullcheckResult = commonjs.nullcheck([
        { inval: zipcode, msg: "우편번호를 입력하세요." },
    ]);

    return nullcheckResult;
}

export function checkAddress(address) {

    let nullcheckResult = commonjs.nullcheck([
        { inval: address, msg: "주소를 입력하세요." },
    ]);
    
    return nullcheckResult;
}