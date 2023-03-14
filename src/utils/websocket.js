
const WebSocketService = {
    connect(api) {
        return new WebSocket(`${process.env.VUE_APP_WS_API}${api}`);
    }
};

export default WebSocketService;
