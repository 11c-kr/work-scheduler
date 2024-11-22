// auth.js

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (!token) {
        alert('유효하지 않은 접근입니다.');
        // window.location.href = '/error.html'; // 또는 다른 페이지로 리다이렉트
        return;
    }
    // token이 있으면 계속 진행
}