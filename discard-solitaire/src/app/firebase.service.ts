import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {addDoc, getFirestore, collection,  CollectionReference, DocumentData, getDocs, Timestamp } from 'firebase/firestore';
import {CloudFireScore, Score} from "./high-scores/models";
import {DataBaseConfigData} from "./models";



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private readonly db;
  constructor() {
        const firebaseConfig  = {
          apiKey: 'AIzaSyB4pPDmwTWAtT7ODw0l6cs8y6Z_U9BS-uo',
          authDomain: 'discard-solitaire-tk.firebaseapp.com',
          databaseURL: 'https://discard-solitaire-tk-default-rtdb.europe-west1.firebasedatabase.app',
          projectId: 'discard-solitaire-tk',
          storageBucket: 'discard-solitaire-tk.appspot.com',
          messagingSenderId: '788850939197',
          appId: '1:788850939197:web:3c59668cf93e55c6466154'
        };


    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  public addNewScore(score: Score): void {
    //
    if(!this.isValidScore(score)) {
      return;
    }
    // adding score
    addDoc(this.getCollectionReference(), score)
      .then(this.handleAddSuccess)
      .catch(this.handleError);
  }

  public getAllScores(): Promise<Score[]> {
    return getDocs(this.getCollectionReference()).then(snapshot=> {
    const scores: CloudFireScore[] = snapshot.docs.map(doc => doc.data() as CloudFireScore)
      return scores.map(score => ({...score, recordDate:  new Timestamp(score.recordDate.seconds, score.recordDate.nanoseconds).toDate()}));
    });

  };

  private isValidScore(score: Score): boolean {
    return score.name &&
           score.score &&
           score.recordDate &&
           score.name.length < 60
           && score.score.toString().length < 60;
  }

  private handleAddSuccess(value: DocumentData): string {
    return value.id;
  }

  private handleError(err: string) {
    console.log(err);
  }

  private getCollectionReference():CollectionReference<DocumentData>  {
    return collection(this.db, DataBaseConfigData.collectionName);
  }

}

