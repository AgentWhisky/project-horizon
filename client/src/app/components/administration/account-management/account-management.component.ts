import { Component, effect, inject, OnInit, viewChild } from '@angular/core';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';

import { RightCode, RoleCode, UserCode } from './account-management';
import { NoDataCardComponent } from '../../../core/no-data-card/no-data-card.component';
import { AccountManagementService } from './account-management.service';
import { RemoveConfirmComponent } from '../../../dialogs/remove-confirm/remove-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { filter, tap } from 'rxjs';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { DatePipe } from '@angular/common';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';
import { UserService } from '../../../services/user.service';
import { USER_RIGHTS } from '../../../constants';

@Component({
  selector: 'app-account-management',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatChipsModule,
    NoDataCardComponent,
    DatePipe,
  ],
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.scss',
})
export class AccountManagementComponent implements OnInit {
  private accountManagementService = inject(AccountManagementService);
  private userService = inject(UserService);

  private dialog = inject(MatDialog);

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
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.accountManagementService.updateRole({ id: role.id, ...result.roleData }))
      )
      .subscribe();
  }

  onDeleteRole(role: RoleCode) {
    const message = 'Are you sure you want to remove this role?';

    this.dialog
      .open(RemoveConfirmComponent, { data: { message } })
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
