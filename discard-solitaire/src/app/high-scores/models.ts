import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Score {
  name: string,
  score: number
  recordDate: Date
}

export interface CloudFireScore {
  name: string,
  score: number
  recordDate: Timestamp
}
