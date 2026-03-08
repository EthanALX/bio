export interface SocialLink {
  href: string;
  label: string;
  iconPath: string;
  className: string;
  qrCode?: string; // 二维码图片路径（可选）
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
