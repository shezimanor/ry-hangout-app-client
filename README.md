# Chat App Client (with Socket.io)

Socket.io + Vue3 + TailwindCSS + Vite 的聊天專案

這是 Client 端的專案，可搭配 Server 端的 [repo](https://github.com/shezimanor/ry-hangout-app-server)

Live Demo(專案尚未收尾，所以還沒部署)

## 開發筆記

### 專案結構

```
src/
├─ components/ui/
│   ├─ AppChatWindow.vue     - 聊天視窗元件
│   ├─ AppInput.vue          - 輸入框元件
│   ├─ AppOnlineList.vue     - 線上人員元件
│   ├─ AppToast.vue          - 通知訊息元件
│   └─ AppToastContainer.vue - 通知訊息容器元件
├─ stores/
│   ├─ globalStore.ts        - 使用者狀態管理
│   ├─ socketStore.ts        - Socket 實例狀態管理
│   └─ toastStore.ts         - 通知訊息狀態管理
├─ views/
│   ├─ ChatGroupView.vue     - 聊天頁子頁：群組聊天
│   ├─ ChatPrivateView.vue   - 聊天頁子頁：私訊聊天
│   ├─ ChatView.vue          - 聊天頁
│   └─ HomeView.vue          - 首頁
├─ App.vue
└─ main.js
```

### 專案路由

```
首頁：
'/'             - 頁面功能：輸入使用者名稱後進入聊天頁

聊天頁：（內含巢狀路由）
'/chat/group'   - 頁面功能：群組聊天室
'/chat/:id'     - 頁面功能：私訊聊天室
```
