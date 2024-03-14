import { Injectable } from '@angular/core';
import { list, ref, Database, set, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor(private database: Database) {}

  addDataa(path: string, data: any) {
    set(ref(this.database, `${path}/${new Date().getTime()}`), data);
  }

  getData(path: string): Observable<any> {
    const starCountRef = ref(this.database, `${path}/`);

    return new Observable<any>((observer) => {
      const unsubscribe = onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();

        observer.next(data);
      });

      return () => unsubscribe();
    });
  }

  deleteData(path: string, key: string) {
    set(ref(this.database, `${path}/${key}`), null);
  }
}
