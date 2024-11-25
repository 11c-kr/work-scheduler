export function showError() {
    document.getElementById('contentContainer').style.display = 'none';
    document.getElementById('errorContainer').style.display = 'block';
}

export function showContent() {
    document.getElementById('errorContainer').style.display = 'none';
    document.getElementById('contentContainer').style.display = 'block';
}

// 오늘날짜 추출
const sendDate = new Date().toISOString().split('T')[0];

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
export function createDayRows() {
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

    // 전체 선택 버튼 추가
    const selectAllDiv = document.createElement('div');
    selectAllDiv.className = 'select-all-row';
    selectAllDiv.innerHTML = `
        <label class="select-all-label">
            <span>전체 선택</span>
            <input type="checkbox" id="selectAll">
        </label>
    `;
    container.appendChild(selectAllDiv);

    // 전체 선택 이벤트 리스너 추가
    const selectAllCheckbox = selectAllDiv.querySelector('#selectAll');
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = container.querySelectorAll('input[name="workDays"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

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

    // 개별 체크박스 이벤트 - 전체 선택 상태 업데이트
   container.querySelectorAll('input[name="workDays"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const allCheckboxes = container.querySelectorAll('input[name="workDays"]');
            // 모든 체크박스가 선택되었는지 확인
            const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
            selectAllCheckbox.checked = allChecked;
        });
    });
}