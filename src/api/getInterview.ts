import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const getInterviews = async () => {
  const snapshot = await getDocs(collection(db, "interviews"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
