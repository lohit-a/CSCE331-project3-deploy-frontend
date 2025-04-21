import { useContext } from "react";
import UserContext from "../contexts/UserProvider"; 

const useUser = () => useContext(UserContext);

export default useUser;