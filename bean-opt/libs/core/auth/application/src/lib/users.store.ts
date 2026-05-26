import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap, catchError, of, from } from 'rxjs';

import { AUTH_REPOSITORY_TOKEN, CollectorProfile } from '@boa/core-auth-domain';

export interface UsersState {
  users: CollectorProfile[];
  loading: boolean;
  saving: boolean; // For background updates
  error: string | null;
  searchQuery: string;
  roleFilter: string;
  stats: Record<string, number>;
  totalUsers: number;
  currentPage: number;
  pageSize: number;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  saving: false,
  error: null,
  searchQuery: '',
  roleFilter: 'all',
  stats: {},
  totalUsers: 0,
  currentPage: 1,
  pageSize: 10
};

export const UsersStore = signalStore(
  withState(initialState),
  withMethods((store, repo = inject(AUTH_REPOSITORY_TOKEN)) => {
    const _searchUsers = rxMethod<{ query: string; page: number; pageSize: number; roleFilter: string }>(
      pipe(
        tap(({ query, page, pageSize, roleFilter }) => 
          patchState(store, { searchQuery: query, currentPage: page, pageSize, roleFilter, loading: true, error: null })),
        switchMap(({ query, page, pageSize, roleFilter }) => {
          return from(repo.searchUsers(query, page, pageSize, roleFilter)).pipe(
            tap(({ users, totalCount }) => patchState(store, { 
              users: users as CollectorProfile[], 
              totalUsers: totalCount,
              loading: false 
            })),
            catchError((error) => {
              console.error('Failed to search users', error);
              patchState(store, { error: error.message, loading: false });
              return of({ users: [], totalCount: 0 });
            })
          );
        })
      )
    );

    const loadStats = rxMethod<void>(
      pipe(
        switchMap(() => from(repo.getUsersCountByRole()).pipe(
          tap((stats) => patchState(store, { stats })),
          catchError((error) => {
            console.error('Failed to load user stats', error);
            return of({});
          })
        ))
      )
    );

    const refreshSilently = () => {
      // Use from instead of rxMethod to avoid re-triggering the tap({loading: true})
      repo.searchUsers(store.searchQuery(), store.currentPage(), store.pageSize(), store.roleFilter())
        .then(({ users, totalCount }) => {
          patchState(store, { 
            users: users as CollectorProfile[], 
            totalUsers: totalCount,
            saving: false 
          });
        });
      repo.getUsersCountByRole().then(stats => patchState(store, { stats }));
    };

    return {
      searchUsers: (query?: string) => {
        const q = query !== undefined ? query : store.searchQuery();
        _searchUsers({ 
          query: q, 
          page: 1, 
          pageSize: store.pageSize(), 
          roleFilter: store.roleFilter() 
        });
      },
      setPage: (page: number) => {
        _searchUsers({ 
          query: store.searchQuery(), 
          page, 
          pageSize: store.pageSize(), 
          roleFilter: store.roleFilter() 
        });
      },
      setRoleFilter: (role: string) => {
        _searchUsers({ 
          query: store.searchQuery(), 
          page: 1, 
          pageSize: store.pageSize(), 
          roleFilter: role 
        });
      },
      loadStats,
      updateUserRole: rxMethod<{ uid: string; role: string }>(
        pipe(
          tap(() => patchState(store, { saving: true, error: null })),
          switchMap(({ uid, role }) =>
            from(repo.updateUserRole(uid, role)).pipe(
              tap(() => refreshSilently()),
              catchError((error) => {
                console.error('Failed to update user role', error);
                patchState(store, { error: error.message, saving: false });
                return of(null);
              })
            )
          )
        )
      ),
      toggleUserBan: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { saving: true, error: null })),
          switchMap((uid) =>
            from(repo.toggleUserBan(uid)).pipe(
              tap(() => refreshSilently()),
              catchError((error) => {
                console.error('Failed to toggle user ban', error);
                patchState(store, { error: error.message, saving: false });
                return of(null);
              })
            )
          )
        )
      ),
      hardDeleteUser: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { saving: true, error: null })),
          switchMap((uid) =>
            from(repo.hardDeleteUser(uid)).pipe(
              tap(() => refreshSilently()),
              catchError((error) => {
                console.error('Failed to delete user', error);
                patchState(store, { error: error.message, saving: false });
                return of(null);
              })
            )
          )
        )
      )
    };
  }),
  withComputed((store) => ({
    totalPages: computed(() => Math.ceil(store.totalUsers() / store.pageSize()))
  }))
);
