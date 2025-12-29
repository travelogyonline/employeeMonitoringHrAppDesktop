import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../../../../data";
import formatChatlistAsHostAndClient from "../functions/formatChatlistAsHostAndClient";

export function useChatList(userId) {
  const [chatlist, setChatlist] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    if (!userId) return;

    setLoading(true);

    axios
      .get(`${BASE_API_URL}api/chats/${userId}`)
      .then((response) => {
        const res = formatChatlistAsHostAndClient(userId, response.data.data)
        setChatlist(res);
      })
      .catch((err) => {
        setChatlist([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return [ chatlist, loading, loadData];
}
