import { useEffect, useState } from "react";
import { BASE_API_URL } from "../../../../../data";

import axios from 'axios';





export function useAlluser() {
    const [loading, setLoading] = useState(true);
    const [alluser, setAlluser] = useState([]);

    useEffect(() => {
        let config = {
            method: 'get',
            url: `${BASE_API_URL}api/user`
        };
        axios.request(config)
            .then((response) => {
                setAlluser(response.data.data)
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return [alluser, loading]

}