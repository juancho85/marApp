import firebase from 'firebase';

export class AuthService {

  login(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logout(): firebase.Promise<any> {
    return firebase.auth().signOut();
  }

  signup(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  getActiveUser(): firebase.User|null {
    return firebase.auth().currentUser;
  }
}
