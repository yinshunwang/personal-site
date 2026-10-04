// 留言板功能：使用 localStorage 在浏览器本地保存留言
const STORAGE_KEY = "felix_messages";

// 页面加载时渲染已有留言
window.onload = function () {
    renderMessages();
};

// 读取本地留言
function getMessages() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// 渲染留言列表
function renderMessages() {
    const list = document.getElementById("message-list");
    const messages = getMessages();
    document.getElementById("msg-count").textContent = messages.length;

    if (messages.length === 0) {
        list.innerHTML = '<p class="msg-empty">暂无留言，来抢沙发吧～</p>';
        return;
    }

    // 新的留言显示在最上面
    list.innerHTML = messages.slice().reverse().map(function (m) {
        return '<div class="msg-item">'
            + '<div class="msg-head">'
            + '<span class="msg-nick">' + escapeHTML(m.nickname) + '</span>'
            + '<span class="msg-time">' + m.time + '</span>'
            + '</div>'
            + '<div class="msg-content">' + escapeHTML(m.content) + '</div>'
            + '</div>';
    }).join("");
}

// 添加留言
function addMessage() {
    const nickInput = document.getElementById("nickname");
    const contentInput = document.getElementById("content");
    const nickname = nickInput.value.trim();
    const content = contentInput.value.trim();

    if (nickname === "" || content === "") {
        alert("昵称和留言内容都不能为空哦！");
        return;
    }

    const messages = getMessages();
    const now = new Date();
    const time = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-"
        + pad(now.getDate()) + " " + pad(now.getHours()) + ":" + pad(now.getMinutes());

    messages.push({ nickname: nickname, content: content, time: time });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));

    nickInput.value = "";
    contentInput.value = "";
    renderMessages();
}

// 清空全部留言
function clearMessages() {
    if (confirm("确定要清空所有留言吗？")) {
        localStorage.removeItem(STORAGE_KEY);
        renderMessages();
    }
}

// 防止 XSS：对特殊字符进行转义
function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// 数字补零
function pad(n) {
    return n < 10 ? "0" + n : n;
}
