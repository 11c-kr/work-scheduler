// auth.js
import { showContent, showError, createDayRows } from './uiController.js';

const accessKey = window.ENV.ACCESS_KEY
const endPoint = window.ENV.PROD_END_POINT

window.WHATAP_CONFIG = {
    projectAccessKey: 'x60591g82bd6d-xqmmt5ui2etak-xsmdq95kek44t',
    pcode: '43276',
    sampleRate: 100,
    ignoreOrigins: [],
};
// 와탭 스크립트 로드
const script = document.createElement('script');
script.src = 'https://repo.whatap-browser-agent.io/rum/prod/';
document.head.appendChild(script);

export async function fetchMemberKeeperInfo() {
    // URL에서 토큰 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        alert('토큰이 없습니다!');
        showError();
        return;
    }

    try {
        const response = await fetch(`${endPoint}/GetScheduleToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessKey}`,
                // CORS 헤더 추가
                'Accept': 'application/json',
            },
            credentials: 'include',  // 쿠키를 포함하려면 필요
            body: JSON.stringify({
                token: token
            })
        })
        // console.log(response);

        const data = await response.json(); // 응답 데이터 저장
        const result = data['result'];
        const message = data['message'];

        if (result === 'SUCCESS') {
            showContent(); // 데이터 로드 성공시 컨텐츠 표시
            createDayRows();
            console.log("The token has been successfully identified!");
            return data;
        } else {
            alert(`토큰이 유효하지 않습니다! ${message}`);
            showError(); 
        }
    } catch (error) {
        alert(`서버와의 통신이 실패했습니다! ${error}`);
        showError();
    }
}

// 일정 등록 API
export async function fetchInsertWorkSchedules(bodyData) {
    try {
        const response = await fetch(`${endPoint}/InsertWorkSchedules`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessKey}`,
                // CORS 헤더 추가
                'Accept': 'application/json',
            },
            body: JSON.stringify(bodyData)
        }).catch(error => {
            // fetch 자체가 실패한 경우 (서버 연결 실패, CORS 등)
            console.log('서버와의 통신 실패:', error);
            throw new Error('서버와의 통신이 실패했습니다.');
        });

        // HTTP 상태 코드 확인
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const result = data['result'];
        const message = data['message'];

        if (result === 'SUCCESS') {
            // 성공 메시지 표시 및 3초 후 숨김
            document.querySelector('.success-message').style.display = 'block';
            setTimeout(() => {
                document.querySelector('.success-message').style.display = 'none';
            }, 3000);
        } else {
            alert("일정 등록 실패. 관리자에게 문의해주세요.");
            console.log(data);
        }
    } catch (error) {
        console.error('에러 발생:', error);
        showError();
    }
}

// 휴무 신청 API (UI만 다름)
export async function fetchInsertVacationSchedules(bodyData) {
    try {
        const response = await fetch(`${endPoint}/InsertWorkSchedules`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessKey}`,
                // CORS 헤더 추가
                'Accept': 'application/json',
            },
            body: JSON.stringify(bodyData)
        }).catch(error => {
            // fetch 자체가 실패한 경우 (서버 연결 실패, CORS 등)
            console.log('서버와의 통신 실패:', error);
            throw new Error('서버와의 통신이 실패했습니다.');
        });

        // HTTP 상태 코드 확인
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const result = data['result'];
        const message = data['message'];

        if (result === 'SUCCESS') {
            // 휴무 신청 메시지 표시
            document.querySelector('.vacation-message').style.display = 'block';
            setTimeout(() => {
                document.querySelector('.vacation-message').style.display = 'none';
            }, 3000);
        } else {
            alert("등록 실패. 관리자에게 문의해주세요.");
            console.log(data);
        }
    } catch (error) {
        console.error('에러 발생:', error);
        showError();
    }
}