// 1. 페이지가 완전히 로드된 후에 코드를 실행하도록 보장
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded!');

    // 2. URL에서 파라미터 가져오기
    // 예: ?date=2023-11-24 같은 형식의 파라미터를 찾음
    const urlParams = new URLSearchParams(window.location.search);
    // date 파라미터가 없으면 오늘 날짜를 사용
    const sendDate = urlParams.get('date') || new Date().toISOString().split('T')[0];

    // 3. 다음 주 월요일 날짜 계산 함수
    function getNextMonday(date) {
        // 현재 날짜 객체 생성
        const currentDate = new Date(date);
        // 새로운 날짜 객체 생성 (다음 주 월요일용)
        const nextMonday = new Date(currentDate);
        // 현재 요일 구하기 (0: 일요일, 1: 월요일, ..., 6: 토요일)
        const currentDay = currentDate.getDay();
        
        // getDay()는 0(일요일)~6(토요일) 반환
        if (currentDay === 0) {
        // 일요일인 경우 다음날이 월요일
        nextMonday.setDate(currentDate.getDate() + 1);
        } else {
            // 그 외의 경우 다음 주 월요일 계산
            nextMonday.setDate(currentDate.getDate() + (8 - currentDay));
        }
        
        return nextMonday;
    }

    // 4. 날짜를 "월월 일일" 형식으로 변환하는 함수
    function formatDate(date) {
        const month = date.getMonth() + 1; // getMonth()는 0~11 반환
        const day = date.getDate();
        return `${month}월 ${day}일`;
    }

    // 5. 요일 목록을 생성하는 메인 함수
    function createDayRows() {
        // HTML에서 요일들이 들어갈 컨테이너 찾기
        const container = document.getElementById('daysContainer');
        // 다음 주 월요일 날짜 가져오기
        const startDate = getNextMonday(sendDate);
        // 요일 이름 배열
        const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
        
        // 6. 주간 표시 업데이트 (예: 11월 27일 - 12월 3일)
        const endDate = new Date(startDate);
        // 시작일로부터 6일 후 설정 (일요일)
        endDate.setDate(startDate.getDate() + 6);
        // 주간 범위를 화면에 표시
        document.getElementById('weekDisplay').textContent = 
            `${formatDate(startDate)} - ${formatDate(endDate)}`;
        
        // 7. 기존 내용 제거
        container.innerHTML = '';

        // 8. 7일 동안의 요일 행 생성 (월~일)
        for (let i = 0; i < 7; i++) {
            // 각 날짜 계산
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            // div 요소 생성
            const div = document.createElement('div');
            div.className = 'day-row';
            // HTML 내용 설정
            div.innerHTML = `
                <span class="day-label">${dayNames[i]}요일</span>
                <span class="date-display">${formatDate(date)}</span>
                <span class="checkbox-wrapper">
                    <input type="checkbox" name="workDays" 
                        value="${date.toISOString().split('T')[0]}">
                </span>
            `;
            // 생성한 요일 행을 컨테이너에 추가
            container.appendChild(div);
        }
    }


    // 9. 페이지 로드 시 요일 생성 함수 호출
    createDayRows();

    // 10. 폼 제출 처리
    document.getElementById('scheduleForm').addEventListener('submit', function(e) {
        // 폼의 기본 제출 동작 방지
        e.preventDefault();
        
        // 선택된 체크박스의 값들을 배열로 수집
        const selectedDays = [];
        document.querySelectorAll('input[name="workDays"]:checked').forEach(checkbox => {
            selectedDays.push(checkbox.value);
        });
        
        // 최소 하나의 날짜가 선택되었는지 확인
        if (selectedDays.length === 0) {
            alert('최소 하나의 출근일을 선택해주세요.');
            return;
        }

        if (confirm("다음 주 일정을 등록하시겠습니까?")) {
            // 성공 메시지 표시 및 3초 후 숨김
            document.querySelector('.success-message').style.display = 'block';
            // 휴무 메시지는 숨김
            document.querySelector('.vacation-message').style.display = 'none';
            
            setTimeout(() => {
                document.querySelector('.success-message').style.display = 'none';
            }, 3000);

            // 선택된 날짜들 콘솔에 출력 (테스트용)
            console.log('Selected days:', selectedDays);

            // 체크박스 초기화
            document.querySelectorAll('input[name="workDays"]:checked').forEach(checkbox => {
                checkbox.checked = false;
            });
        }
    });

    // DOM 로드 이벤트 리스너 내부에 추가
    document.getElementById('vacationButton').addEventListener('click', function() {
        // 체크된 박스가 있는지 확인
        const checkedDays = document.querySelectorAll('input[name="workDays"]:checked');
        
        if (checkedDays.length > 0) {
            alert('휴무 신청 시에는 출근일을 선택하지 않아야 합니다.');
            return;
        }

        // 확인 팝업 표시
        if (confirm('다음 주 휴무를 신청하시겠습니까?')) {
            // 휴무 신청 메시지 표시
            document.querySelector('.vacation-message').style.display = 'block';
            // 성공 메시지는 숨김
            document.querySelector('.success-message').style.display = 'none';
            
            // 3초 후 메시지 숨김
            setTimeout(() => {
                document.querySelector('.vacation-message').style.display = 'none';
            }, 3000);
            
            // 여기에 API 호출 등 휴무 신청 처리 로직 추가
            console.log('Vacation requested for next week');
        }
    });
});