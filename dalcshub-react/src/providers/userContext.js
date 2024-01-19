//Author: Shiwen(Lareina) Yang
import { createContext, useContext, useState, useMemo, useCallback } from "react";
import { API_URL } from "../utils";

export const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export const defaultUserDetail = {
  _id: '',
  firstName: '',
  lastName: '',
  type: '',
  email: '',
  followedCourses: [],
  savedPosts: [],
  createdAt: '',
  updatedAt: '',
};

export function UserProvider({ children }) {
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const [user, setUser] = useState(storedUser ?? defaultUserDetail);

  const userDetailRefresh = useCallback ( 
    async (userId) => {
      const res = await fetch(`${API_URL}/api/user/${userId}`);
      if (res.status === 200) {
        const result = await res.json();
        setUser(result.data ?? defaultUserDetail);
        const currentUserString = JSON.stringify(result.data);
        localStorage.setItem("currentUser", currentUserString);
      } else {
        console.log('At least one of the fields is invalid from front end');
      }
    }, []
  );

  const removeUser = useCallback ( 
    () => {
      setUser(defaultUserDetail);
    }, []
  );

  const userContextValue = useMemo(
    () => ({user, setUser, userDetailRefresh, removeUser}),
    [user, setUser, userDetailRefresh, removeUser]
  );

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
}
