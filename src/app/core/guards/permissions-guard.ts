import { CanActivateFn } from '@angular/router';

export const permissionsGuard: CanActivateFn = (route, state) => {
  return true;
};
