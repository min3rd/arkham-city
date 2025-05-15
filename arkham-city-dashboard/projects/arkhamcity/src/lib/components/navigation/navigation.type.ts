export interface NavigationItem {
  id?: string;
  title?: string;
  subtitle?: string;
  type?: 'basic' | 'group';
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  link?: string;
  icon?: string;
  badge?: {
    title?: string;
    classes?: string;
  };
  children?: NavigationItem[];
}
