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
  IconBrandSteam,
  IconBuildingFactory2,
  IconCarCrane,
  IconChartInfographic,
  IconHome,
  IconReportAnalytics,
  IconReportSearch,
  IconSettings,
  IconUserCog,
  IconWashMachine

} from "@tabler/icons-react";
import { ExoticComponent, ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import SimulationControlOverlay from "./SimulationControlOverlay";

interface LinkDescription {
  icon: ExoticComponent;
  label: string;
  href: string;
}

const overviewLinks: LinkDescription[] = [
  { icon: IconHome, label: "Dashboard", href: "/" },
  { icon: IconBuildingFactory2, label: "Locations", href: "/locations" },
  { icon: IconAddressBook, label: "Resources", href: "/resources" },
  { icon: IconCarCrane, label: "Machines", href: "/machines" },
  { icon: IconBrandSteam, label: "Process Steps", href: "/processSteps" },
];

const entityLinks: LinkDescription[] = [
  { icon: IconBuildingFactory2, label: "Incoming Goods", href: "/incoming-goods" },
  { icon: IconChartInfographic, label: "Operational Efficiency Reports", href: "/placeholder1" },
  { icon: IconReportSearch, label: "Inventory and Stock Reports", href: "/placeholder2" },
  { icon: IconReportAnalytics, label: "Quality Control & Compliance Reports", href: "/placeholder3" },
];

const settingsLinks: LinkDescription[] = [
  { icon: IconUserCog, label: "User Management", href: "/placeholder4" },
  { icon: IconSettings, label: "Simulation Configuration", href: "/placeholder5" },
  { icon: IconBell, label: "Notification", href: "/placeholder6" },
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
        <Flex h="100%" px="md" gap="md" justify="space-between" align="center" direction="row" wrap="nowrap">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Logo />
          </Group>
          <SimulationControlOverlay />
        </Flex>
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
