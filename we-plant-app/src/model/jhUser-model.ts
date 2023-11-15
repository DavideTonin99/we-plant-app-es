export interface IJhUserModel {
  activated?: boolean;
  authorities?: string[];
  createdBy?: string;
  createdDate?: Date;
  email?: string;
  firstName?: string;
  id: number;
  imageUrl?: string;
  langKey?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  modifiedCounter?: number;
  lastName?: string;
  login?: string;

}
export class JhUserModel implements IJhUserModel {
  constructor(public id: number,
     public activated?: boolean,
      public authorities?: string[],
      public createdBy?: string,
      public createdDate?: Date,
      public email?: string,
      public firstName?: string,
      public imageUrl?: string,
      public langKey?: string,
      public lastModifiedBy?: string,
      public lastModifiedDate?: Date,
      public modifiedCounter?: number,
      public lastName?: string,
      public login?: string,
    ) {}
}
