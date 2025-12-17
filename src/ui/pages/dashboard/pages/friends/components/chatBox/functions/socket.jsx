import { io } from "socket.io-client";
import { BASE_API_URL } from "../../../../../../../data";

const socket = io(BASE_API_URL);

export default socket;
