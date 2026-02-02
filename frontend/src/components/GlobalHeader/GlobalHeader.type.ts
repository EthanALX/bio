export interface NavigationLink {
  href: string;
  label: string;
}

export interface GlobalHeaderState {
  pathname: string;
  navigationLinks: NavigationLink[];
}

export interface GlobalHeaderActions {
  getActivePageLabel: () => string;
}
