export interface AdminDashboardInfo {
  creationCode: string;
  steamInsight: {
    updatesEnabled: boolean;
    updateCronEnabled: boolean;
    updateCancelOnStartup: boolean;
  };
}

export interface CreationCodeRefresh {
  creationCode: string;
}
