// main.js
import * as services from "./services.js";

// 현재 요일 확인
const currentDay = new Date().getDay(); 
console.log(currentDay);

// 1. 페이지가 완전히 로드된 후에 코드를 실행하도록 보장
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Script loaded!');
    
    // 토큰 데이터 불러오기 
    const memberKeeperData = await services.fetchMemberKeeperInfo();

    // 10. 폼 제출 처리
    document.getElementById('scheduleForm').addEventListener('submit', function(e) {
        const memberKeeperId = memberKeeperData['memberKeeperId'];
        const phone = memberKeeperData['phone'];

        // 폼의 기본 제출 동작 방지
        e.preventDefault();
        
        // 선택/미선택된 체크박스의 값들을 배열로 수집
        const selectedDays = [];
        const unselectedDays = [];
        document.querySelectorAll('input[name="workDays"]').forEach(checkbox => {
            if (checkbox.checked) {
                selectedDays.push(checkbox.value);
            } else {
                unselectedDays.push(checkbox.value);
            }
        });
        
        // 최소 하나의 날짜가 선택되었는지 확인
        if (selectedDays.length === 0) {
            alert('최소 하나의 일정을 선택해주세요. Please select at least one schedule.');
            return;
        }

        // // 매주 일요일 제출 불가
        // if (currentDay === 7) {
        //     alert('제출 기간이 지났습니다. 일정을 등록하거나 수정할 수 없습니다. The submission period has ended. You cannot register or modify schedules.');
        //     return;
        // }

        if (confirm("다음 주 일정을 등록하시겠습니까? Would you like to register the schedule for next week?")) {
            // 출근스케줄입력 API body값 만들기 
            const bodyData = {
                member_keeper_id: memberKeeperId,
                schedules: [] // schedules 배열을 객체의 속성으로 정의
            };
            
            // 선택된 날짜들 처리
            selectedDays.forEach(day => {
                bodyData.schedules.push({
                    work_date: day,
                    status: 'scheduled'
                });
            });

            // 선택되지 않은 날짜들 처리
            unselectedDays.forEach(day => {
                bodyData.schedules.push({
                    work_date: day,
                    status: 'canceled'
                });
            });
            // API요청 
            services.fetchInsertWorkSchedules(bodyData);
            // 체크박스 초기화
            document.querySelectorAll('input[name="workDays"]:checked').forEach(checkbox => {
                checkbox.checked = false;
            });
            // 전체선택박스 초기화
            document.querySelectorAll('input[id="selectAll"]:checked').forEach(checkbox => {
                checkbox.checked = false;
            });

        }
    });

    // DOM 로드 이벤트 리스너 내부에 추가
    document.getElementById('vacationButton').addEventListener('click', function() {
        const memberKeeperId = memberKeeperData['memberKeeperId'];
        const phone = memberKeeperData['phone'];

        // 체크된 박스가 있는지 확인
        const checkedDays = document.querySelectorAll('input[name="workDays"]:checked');
        const entireDays = document.getElementsByClassName('da')
        
        // 선택/미선택된 체크박스의 값들을 배열로 수집
        const selectedDays = [];
        const unselectedDays = [];
        document.querySelectorAll('input[name="workDays"]').forEach(checkbox => {
            if (checkbox.checked) {
                selectedDays.push(checkbox.value);
            } else {
                unselectedDays.push(checkbox.value);
            }
        });

        if (checkedDays.length > 0) {
            alert('체크하신 일정이 있습니다. 체크박스에 체크를 해제해 주세요. You have selected a schedule. Please uncheck the checkbox.');
            return;
        }

        // 매주 일요일 제출 불가
        if (currentDay === 6) {
            alert('제출 기간이 지났습니다. 일정을 등록하거나 수정할 수 없습니다. The submission period has ended. You cannot register or modify schedules.');
            return;
        }

        // 확인 팝업 표시
        if (confirm('다음 주는 키퍼 예정이 없으신가요? Do you have no work schedule planned for next week?')) {
            // 출근스케줄입력 API body값 만들기 
            const bodyData = {
                member_keeper_id: memberKeeperId,
                schedules: [] // schedules 배열을 객체의 속성으로 정의
            };
            
            // 선택되지 않은 날짜들 처리
            unselectedDays.forEach(day => {
                bodyData.schedules.push({
                    work_date: day,
                    status: 'canceled'
                });
            });
            // API요청 
            services.fetchInsertVacationSchedules(bodyData);
        }
    });
});