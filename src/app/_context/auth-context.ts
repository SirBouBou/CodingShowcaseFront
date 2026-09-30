import { HttpContextToken } from '@angular/common/http';

export const SKIP_401_REDIRECT =
  new HttpContextToken<boolean>(() => false);