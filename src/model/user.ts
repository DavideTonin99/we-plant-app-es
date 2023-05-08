export class UserModel {
  email: string;
  password: string;
  userToken: string;
  id: number;
  constructor(email: string, password: string, userToken: string) {
    this.email = email;
    this.password = password;
    this.userToken = userToken;
  }
}
