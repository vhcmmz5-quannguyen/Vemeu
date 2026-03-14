// 1. Khởi tạo dữ liệu
let users = JSON.parse(localStorage.getItem('vnedu_users')) || [];

// 2. Kiểm tra nếu chưa có Admin thì tự tạo lại ngay lập tức
const hasAdmin = users.find(u => u.username === 'admin');
if (!hasAdmin) {
    users.push({
        username: "admin",
        password: "123", // Bạn có thể đổi pass ở đây
        role: "super_admin",
        avatar: "https://via.placeholder.com/150",
        score: 100,
        history: []
    });
    localStorage.setItem('vnedu_users', JSON.stringify(users));
}

let currentLoginUser = null;
let scoringIndex = null;

// 3. Hàm đăng nhập
function handleLogin() {
    const u = document.getElementById('user').value.trim();
    const p = document.getElementById('pass').value.trim();
    
    const found = users.find(x => x.username === u && x.password === p);

    if (!found) {
        alert("Sai tài khoản hoặc mật khẩu!");
        return;
    }
    
    currentLoginUser = found;
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('nav-bar').style.display = 'flex';
    document.getElementById('user-header').style.display = 'block';
    document.getElementById('current-user-name').innerText = found.username;
    document.getElementById('current-user-img').src = found.avatar;
    
    const roles = { "super_admin": "TỔNG TƯ LỆNH", "admin": "QUẢN TRỊ", "parent": "PHỤ HUYNH", "student": "HỌC SINH" };
    document.getElementById('display-role-name').innerText = roles[found.role];

    switchPage('home');
}

// 4. Chuyển trang
function switchPage(page, el) {
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('calendar-page').style.display = 'none';
    document.getElementById('admin-controls').style.display = 'none';
    document.getElementById('view-section').style.display = 'none';

    if (page === 'home') {
        document.getElementById('home-page').style.display = 'block';
        if (currentLoginUser.role === 'super_admin' || currentLoginUser.role === 'admin') {
            document.getElementById('admin-controls').style.display = 'block';
            renderAdminList();
        } else {
            document.getElementById('view-section').style.display = 'block';
            showInfo();
        }
    } else {
        document.getElementById('calendar-page').style.display = 'block';
    }
    
    if(el) {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        el.classList.add('active');
    }
}

// Các hàm bổ trợ (Tạo user, Chấm điểm, Xóa...)
function toggleChildInput() {
    const role = document.getElementById('new-user-role').value;
    document.getElementById('child-link').style.display = (role === 'parent') ? 'block' : 'none';
}

function createUser() {
    const n = document.getElementById('new-username').value;
    const p = document.getElementById('new-password').value;
    const r = document.getElementById('new-user-role').value;
    const c = document.getElementById('child-link').value;
    
    if(!n || !p) return alert("Điền đủ tên và pass!");
    users.push({ username: n, password: p, role: r, childName: c, avatar: "https://via.placeholder.com/150", score: 100, history: [] });
    localStorage.setItem('vnedu_users', JSON.stringify(users));
    renderAdminList();
    alert("Đã tạo!");
}
content://com.android.externalstorage.documents/tree/primary%3AApp%20qu%E1%BA%A3n%20l%C3%BD%20::primary:App quản lý /script.js
function renderAdminList() {
    const list = document.getElementById('user-list');
    list.innerHTML = users.map((u, i) => {
        if (currentLoginUser.role === "admin" && u.role === "super_admin") return '';
        return `
            <div class="user-item">
                <div style="flex:1"><b>${u.username}</b> <small>(${u.role})</small></div>
                ${u.role === 'student' ? `<button class="score-btn" onclick="openScore(${i})">CHẤM</button>` : ''}
                ${u.username !== currentLoginUser.username && u.role !== 'super_admin' ? `<button onclick="deleteUser(${i})" style="color:red; border:none; background:none;">✕</button>` : ''}
            </div>`;
    }).join('');
}

function handleLogout() { location.reload(); }
// (Các hàm showInfo, openScore, submitScore giữ nguyên như bản trước)
