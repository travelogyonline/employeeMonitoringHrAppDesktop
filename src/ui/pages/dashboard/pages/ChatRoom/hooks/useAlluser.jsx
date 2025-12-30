import { useEffect, useState } from "react";
import { BASE_API_URL } from "../../../../../data";

import axios from 'axios';





export function useAlluser() {
    const [loading, setLoading] = useState(true);
    const [alluser, setAlluser] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRes = await axios.get(`${BASE_API_URL}api/user`);
                const users = usersRes.data.data;

                const usersWithDp = await Promise.all(
                    users.map(async (item) => {
                        try {
                            const dpRes = await axios.get(
                                `${BASE_API_URL}api/dp/${item._id}`
                            );

                            return {
                                ...item,
                                dp:
                                    dpRes.data.data.length > 0
                                        ? dpRes.data.data[0].profilePicture
                                        : null,
                            };
                        } catch (err) {
                            return { ...item, dp: null };
                        }
                    })
                );
                setAlluser(usersWithDp);
            } catch (error) {} 
            finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return [alluser, loading]

}