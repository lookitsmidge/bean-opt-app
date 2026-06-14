import { InjectionToken } from '@angular/core';
import { IAuthRepository } from './auth-repository.interface';
import { IProfileRepository } from './profile-repository.interface';

/** Injection Token for the Auth Repository */
export const AUTH_REPOSITORY_TOKEN = new InjectionToken<IAuthRepository>('JamesMartland_DDD_Core_AuthRepositoryToken');

/** Injection Token for the Profile Repository */
export const PROFILE_REPOSITORY_TOKEN = new InjectionToken<IProfileRepository>('JamesMartland_DDD_Core_ProfileRepositoryToken');
