import { Code, Group, ScrollArea, rem } from "@mantine/core";
import {
  IconAdjustments,
  IconCalendarStats,
  IconFileAnalytics,
  IconGauge,
  IconLock,
  IconNotes,
  IconPresentationAnalytics,
} from "@tabler/icons-react";
import { ExoticComponent } from "react";
import { LinksGroup } from "../NavbarLinksGroup/NavbarLinksGroup";
import { UserButton } from "../UserButton/UserButton";
import { Logo } from "./Logo";
import classes from "./NavbarNested.module.css";

export interface NavbarLink {
  label: string;
  icon: ExoticComponent;
  href?: string;
  initiallyOpened?: boolean;
  sublinks?: NavbarSublink[];
}

export interface NavbarSublink {
  label: string;
  href: string;
}

const mockdata: NavbarLink[] = [
  { label: "Dashboard", icon: IconGauge },
  {
    label: "Market news",
    icon: IconNotes,
    initiallyOpened: true,
    sublinks: [
      { label: "Overview", href: "/" },
      { label: "Forecasts", href: "/" },
      { label: "Outlook", href: "/" },
      { label: "Real time", href: "/" },
    ],
  },
  {
    label: "Releases",
    icon: IconCalendarStats,
    sublinks: [
      { label: "Upcoming releases", href: "/" },
      { label: "Previous releases", href: "/" },
      { label: "Releases schedule", href: "/" },
    ],
  },
  { label: "Analytics", icon: IconPresentationAnalytics },
  { label: "Contracts", icon: IconFileAnalytics },
  { label: "Settings", icon: IconAdjustments },
  {
    label: "Security",
    icon: IconLock,
    sublinks: [
      { label: "Enable 2FA", href: "/" },
      { label: "Change password", href: "/" },
      { label: "Recovery codes", href: "/" },
    ],
  },
];

export function Navbar() {
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Logo style={{ width: rem(120) }} />
          <Code fw={700}>v3.1.2</Code>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserButton />
      </div>
    </nav>
  );
}
