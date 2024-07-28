# 開發筆記

```javascript
socket.emit('private-message', {
  senderUser: { id: 'id1', name: 'Ryan' },
  receiverId: 'id2',
  msg: 'Hello receiver'
});
```
