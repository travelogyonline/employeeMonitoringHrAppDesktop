function formatChatlistAsHostAndClient(hostId, chatlist){
    const res = chatlist.map(item=> ({
        roomID: item.roomID,
        hostId: hostId===item.user1? item.user1 : item.user2,
        hostName: hostId===item.user1? item.user1name : item.user2name,
        clientId: hostId===item.user1? item.user2 : item.user1,
        clientName: hostId===item.user1? item.user2name : item.user1name
    }))
    return res;
}
export default formatChatlistAsHostAndClient;