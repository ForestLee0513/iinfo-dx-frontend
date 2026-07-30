export type NavItem = {
  label: string;
  href: string;
  desktopOnly?: boolean;
};

export type MobileMenuContextValue = {
  close: () => void;
};
