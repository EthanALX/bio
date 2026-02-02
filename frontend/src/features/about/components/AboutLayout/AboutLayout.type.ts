export interface SocialLink {
  href: string;
  label: string;
  iconPath: string;
  className: string;
}

export interface AboutLayoutState {
  socialLinks: SocialLink[];
  heroText: string;
  storySections: Array<{
    title: string;
    content: string[];
  }>;
  footerText: string;
}

export interface UseAboutLayoutResult {
  state: AboutLayoutState;
}
