import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
  } from 'firebase/auth';
  import { auth } from '../firebase/config';
  
  export const register = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  
  export const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  export const logout = async () => {
    return signOut(auth);
  };