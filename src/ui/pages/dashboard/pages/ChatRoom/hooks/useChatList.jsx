import { useState, useEffect } from "react";
import axios from "axios";

export function useChatList(userId) {
  const [chatlist, setChatlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return; 

    setLoading(true);

    axios
      .get(`http://localhost:5000/api/chats/${userId}`)
      .then((response) => {
        setChatlist(response.data.data);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [userId]);

  return [ chatlist, loading];
}
