import { Component, effect, inject, OnInit, viewChild } from '@angular/core';
import { filter, tap } from 'rxjs';
import { DatePipe } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';

import { RightCode, RoleCode, UserCode } from './account-management';
import { AccountManagementService } from './account-management.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';

import { USER_RIGHTS } from '@hz/core/constants';
import { UserService } from '@hz/core/services';
import { ConfirmDialogComponent } from '@hz/shared/dialogs';
import { HzBannerModule, HzBreadcrumbItem, HzBreadcrumbModule } from '@hz/shared/components';

@Component({
  selector: 'hz-account-management',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatChipsModule,
    HzBreadcrumbModule,
    DatePipe,
    HzBannerModule,
  ],
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.scss',
})
export class AccountManagementComponent implements OnInit {
  private accountManagementService = inject(AccountManagementService);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  readonly breadcrumbItems: HzBreadcrumbItem[] = [
    { label: 'Administration', route: '/administration', icon: 'admin_panel_settings' },
    { label: 'Account Management', icon: 'manage_accounts' },
  ];

  readonly currentUser = this.userService.userInfo();

  readonly MANAGE_ROLES_RIGHT = USER_RIGHTS.MANAGE_ROLES;

  // Users Table
  readonly userSort = viewChild<MatSort>('userSort');
  readonly userPaginator = viewChild<MatPaginator>('userPaginator');
  readonly userDisplayedColumns: string[] = [
    'id',
    'name',
    'username',
    'roles',
    'active',
    'lastLogin',
    ...(this.hasRight([USER_RIGHTS.MANAGE_USERS]) ? ['actions'] : []),
  ];
  readonly userDataSource = new MatTableDataSource<UserCode>();

  // Roles Table
  readonly roleSort = viewChild<MatSort>('roleSort');
  readonly rolePaginator = viewChild<MatPaginator>('rolePaginator');
  readonly roleDisplayedColumns: string[] = [
    'id',
    'name',
    'description',
    'active',
    'rights',
    ...(this.hasRight([USER_RIGHTS.MANAGE_ROLES]) ? ['actions'] : []),
  ];
  readonly roleDataSource = new MatTableDataSource<RoleCode>();

  // Rights Table
  readonly rightSort = viewChild<MatSort>('rightSort');
  readonly rightPaginator = viewChild<MatPaginator>('rightPaginator');
  readonly rightDisplayedColumns: string[] = ['id', 'name', 'internalName', 'description'];
  readonly rightDataSource = new MatTableDataSource<RightCode>();

  readonly USER_RIGHTS = USER_RIGHTS;

  constructor() {
    // Users Table
    effect(() => {
      this.userDataSource.data = this.accountManagementService.users();
    });

    effect(() => {
      this.userDataSource.sort = this.userSort() ?? null;
      this.userDataSource.paginator = this.userPaginator() ?? null;
    });

    // Roles Table
    effect(() => {
      this.roleDataSource.data = this.accountManagementService.roles();
    });

    effect(() => {
      this.roleDataSource.sort = this.roleSort() ?? null;
      this.roleDataSource.paginator = this.rolePaginator() ?? null;
    });

    // Rights Table
    effect(() => {
      this.rightDataSource.data = this.accountManagementService.rights();
    });

    effect(() => {
      this.rightDataSource.sort = this.rightSort() ?? null;
      this.rightDataSource.paginator = this.rightPaginator() ?? null;
    });
  }

  ngOnInit() {
    this.accountManagementService.loadUsers();
    this.accountManagementService.loadRoles();
    this.accountManagementService.loadRights();
  }

  // *** Users ***
  onEditUser(user: UserCode) {
    this.dialog
      .open(UserDialogComponent, {
        data: { type: 'update', user },
        width: '560px',
        panelClass: 'hz-dialog-container',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.accountManagementService.updateUser({ id: user.id, ...result.userData }))
      )
      .subscribe();
  }

  onToggleUser(user: UserCode) {
    this.accountManagementService.updateUserActive(user.id, !user.active);
  }

  // *** Roles ***
  onCreateRole() {
    this.dialog
      .open(RoleDialogComponent, {
        data: { type: 'create' },
        width: '560px',
        panelClass: 'hz-dialog-container',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.accountManagementService.addRole(result.roleData))
      )
      .subscribe();
  }

  onEditRole(role: RoleCode) {
    this.dialog
      .open(RoleDialogComponent, {
        data: { type: 'update', role },
        width: '560px',
        panelClass: 'hz-dialog-container',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.accountManagementService.updateRole({ id: role.id, ...result.roleData }))
      )
      .subscribe();
  }

  onDeleteRole(role: RoleCode) {
    const title = 'Remove Role';
    const message = 'Are you sure you want to remove this role?';

    this.dialog
      .open(ConfirmDialogComponent, { data: { title, message }, panelClass: 'hz-dialog-container' })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.accountManagementService.removeRole(role.id))
      )
      .subscribe();
  }

  hasRight(rights: string[]) {
    return this.userService.hasRights(rights);
  }
}
