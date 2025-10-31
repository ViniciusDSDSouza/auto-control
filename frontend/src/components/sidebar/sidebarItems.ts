import { IconType } from "react-icons/lib";
import { FaUser, FaFileInvoiceDollar, FaCar, FaTools } from "react-icons/fa";

interface SidebarItem {
  label: string;
  href: string;
  icon: IconType;
}

export const sidebarItems: SidebarItem[] = [
  {
    label: "Notas",
    href: "/notas",
    icon: FaFileInvoiceDollar,
  },
  {
    label: "Clientes",
    href: "/clientes",
    icon: FaUser,
  },
  {
    label: "Carros",
    href: "/carros",
    icon: FaCar,
  },
  {
    label: "Peças",
    href: "/pecas",
    icon: FaTools,
  },
];
