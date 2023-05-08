export interface JhUserModel {
  activated: boolean;
  authorities: string[];
  createdBy: string;
  createdDate: Date;
  email: string;
  firstName: string;
  id: number;
  imageUrl: string;
  langKey: string;
  lastModifiedBy: string;
  lastModifiedDate: Date;
  lastName: string;
  login: string;
}
