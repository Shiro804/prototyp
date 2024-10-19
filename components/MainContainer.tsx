"use client";

import {
  AppShell,
  Avatar,
  Burger,
  Container,
  Flex,
  Group,
  NavLink,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import {
  IconAddressBook,
  IconBell,
  IconBellFilled,
  IconBuildingFactory2,
  IconChartInfographic,
  IconHome,
  IconReportAnalytics,
  IconReportSearch,
  IconSettings,
  IconUserCog

} from "@tabler/icons-react";
import { ExoticComponent, ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

interface LinkDescription {
  icon: ExoticComponent;
  label: string;
  href: string;
}

const overviewLinks: LinkDescription[] = [
  { icon: IconHome, label: "Dashboard", href: "/" },
  { icon: IconBuildingFactory2, label: "Locations", href: "/locations" },
  { icon: IconAddressBook, label: "Resources", href: "/resources" },
];

const entityLinks: LinkDescription[] = [
  { icon: IconChartInfographic, label: "Operational Efficiency Reports", href: "/placeholder" },
  { icon: IconReportSearch, label: "Inventory and Stock Reports", href: "/placeholder" },
  { icon: IconReportAnalytics, label: "Quality Control & Compliance Reports", href: "/placeholder" },
];

const settingsLinks: LinkDescription[] = [
  { icon: IconUserCog, label: "User Management", href: "/placeholder" },
  { icon: IconSettings, label: "Simulation Configuration", href: "/placeholder" },
  { icon: IconBell, label: "Notification", href: "/placeholder" },
];

function MenuLink({ link }: { link: LinkDescription }) {
  const path = usePathname();

  return (
    <NavLink
      active={path === link.href}
      key={link.href}
      href={link.href}
      label={link.label}
      leftSection={<link.icon />}
      component={Link}
    />
  );
}

export default function MainContainer({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Logo />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section my="md" component={ScrollArea}>
          Overview
          {overviewLinks.map((l) => (
            <MenuLink key={l.href} link={l} />
          ))}
        </AppShell.Section>
        <AppShell.Section my="md" component={ScrollArea}>
          Reports and Analytics
          {entityLinks.map((l) => (
            <MenuLink key={l.href} link={l} />
          ))}
        </AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea}>
          Settings
          {settingsLinks.map((l) => (
            <MenuLink key={l.href} link={l} />
          ))}
        </AppShell.Section>
        <AppShell.Section>
          <Flex align="center" gap="md">
            <Avatar /> Admin
          </Flex>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main m="lg">{children}</AppShell.Main>
      <Notifications />
    </AppShell>
  );
}
