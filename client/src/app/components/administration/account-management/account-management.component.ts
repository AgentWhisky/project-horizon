import { Component, effect, inject, OnInit, viewChild } from '@angular/core';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';

import { Right, RightCode, Role, User } from './account-management';
import { NoDataCardComponent } from '../../../core/no-data-card/no-data-card.component';
import { AccountManagementService } from './account-management.service';
import { RemoveConfirmComponent } from '../../../dialogs/remove-confirm/remove-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { filter, tap } from 'rxjs';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { DatePipe } from '@angular/common';
import { RightDialogComponent } from './right-dialog/right-dialog.component';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';

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
  private dialog = inject(MatDialog);

  // Users Table
  readonly userSort = viewChild<MatSort>('userSort');
  readonly userPaginator = viewChild<MatPaginator>('userPaginator');
  readonly userDisplayedColumns: string[] = ['id', 'name', 'email', 'roles', 'active', 'lastLogin', 'actions'];
  readonly userDataSource = new MatTableDataSource<User>();

  // Roles Table
  readonly roleSort = viewChild<MatSort>('roleSort');
  readonly rolePaginator = viewChild<MatPaginator>('rolePaginator');
  readonly roleDisplayedColumns: string[] = ['id', 'name', 'description', 'active', 'rights', 'actions'];
  readonly roleDataSource = new MatTableDataSource<Role>();

  // Rights Table
  readonly rightSort = viewChild<MatSort>('rightSort');
  readonly rightPaginator = viewChild<MatPaginator>('rightPaginator');
  readonly rightDisplayedColumns: string[] = ['id', 'name', 'internalName', 'description', 'active', 'actions'];
  readonly rightDataSource = new MatTableDataSource<Right>();

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
    // LOAD DATA
    this.accountManagementService.loadMockData();

    this.accountManagementService.loadUsers();
    this.accountManagementService.loadRoles();
    this.accountManagementService.loadRights();
  }

  // *** Users ***
  onCreateUser() {
    this.dialog
      .open(UserDialogComponent, {
        data: { type: 'create' },
        width: '560px',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.accountManagementService.addUser(result.userData))
      )
      .subscribe();
  }

  onEditUser(user: User) {
    this.dialog
      .open(UserDialogComponent, {
        data: { type: 'update', user },
        width: '560px',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.accountManagementService.addUser(result.userData))
      )
      .subscribe();
  }

  onDeleteUser(user: User) {
    const message = 'Are you sure you want to remove this user?';

    this.dialog
      .open(RemoveConfirmComponent, { data: { message } })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.accountManagementService.removeUser(user.id))
      )
      .subscribe();
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

  onEditRole(role: Role) {
    this.dialog
      .open(RoleDialogComponent, {
        data: { type: 'update', role },
        width: '560px',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.accountManagementService.updateRole(result.roleData))
      )
      .subscribe();
  }

  onDeleteRole(role: Role) {
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

  // *** Rights ***
  onCreateRight() {
    this.dialog
      .open(RightDialogComponent, {
        data: { type: 'create' },
        width: '560px',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.accountManagementService.addRight(result.rightData))
      )
      .subscribe();
  }

  onEditRight(right: RightCode) {
    this.dialog
      .open(RightDialogComponent, {
        data: { type: 'update', right },
        width: '560px',
      })
      .afterClosed()
      .pipe(
        filter((result) => result && result.status === true),
        tap((result) => this.accountManagementService.updateRight({ id: right.id, ...result.rightData }))
      )
      .subscribe();
  }

  onDeleteRight(right: RightCode) {
    const message = 'Are you sure you want to remove this right?';

    this.dialog
      .open(RemoveConfirmComponent, { data: { message } })
      .afterClosed()
      .pipe(
        filter((result) => result),
        tap(() => this.accountManagementService.removeRole(right.id))
      )
      .subscribe();
  }
}
