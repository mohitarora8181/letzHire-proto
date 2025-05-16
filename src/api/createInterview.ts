import { db } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export const createInterview = async (interviewData: any) => {
  const newInterview = {
    ...interviewData,
    createdOn: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, "interviews"), newInterview);
  return { id: docRef.id, ...newInterview };
};
