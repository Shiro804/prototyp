"use client";

import {
  AppShell,
  Avatar,
  Burger,
  Flex,
  Group,
  NavLink,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import {
  IconAddressBook,
  IconArrowBadgeRight,
  IconBell,
  IconBrandSteam,
  IconBuildingFactory2,
  IconCarCrane,
  IconChartInfographic,
  IconDeviceDesktopAnalytics,
  IconHome,
  IconPackages,
  IconReportAnalytics,
  IconReportSearch,
  IconSettings,
  IconTruck,
  IconUserCog,
} from "@tabler/icons-react";
import { ExoticComponent, ReactNode, useEffect } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { SimulationContextMock, SimulationContextLive, useSimulationContextMock, useSimulationContextLive } from "./SimulationContext";
import SimulationControlOverlay from "./SimulationControlOverlay";

interface LinkDescription {
  icon: ExoticComponent;
  label: string;
  href: string;
}

const overviewLinks: LinkDescription[] = [
  { icon: IconHome, label: "Dashboard", href: "/" },
  { icon: IconDeviceDesktopAnalytics, label: "Monitoring", href: "/monitoring" },
  {
    icon: IconBuildingFactory2,
    label: "Incoming Commodities",
    href: "/incoming-goods",
  },
  // {
  //   icon: IconPackages,
  //   label: "Commodity Monitoring",
  //   href: "/commodities-monitoring",
  // },
];

const mockSimulationLinks: LinkDescription[] = [
  { icon: IconHome, label: "Dashboard", href: "/mock-dashboard" },
  { icon: IconDeviceDesktopAnalytics, label: "Monitoring", href: "/mock-monitoring" },
  {
    icon: IconBuildingFactory2,
    label: "Incoming Commodities",
    href: "/mock-incoming-goods",
  },
  // {
  //   icon: IconPackages,
  //   label: "Commodity Monitoring",
  //   href: "/commodities-monitoring",
  // },
];

const crudLinks: LinkDescription[] = [
  { icon: IconBuildingFactory2, label: "Locations", href: "/locations" },
  { icon: IconAddressBook, label: "Resources", href: "/resources" },
  { icon: IconBrandSteam, label: "Machines", href: "/machines" },
  { icon: IconArrowBadgeRight, label: "Process Steps", href: "/process-steps" },
  { icon: IconTruck, label: "Transportsystems", href: "/transport-systems" },
];

const reportsAndAnalytics: LinkDescription[] = [
  {
    icon: IconChartInfographic,
    label: "Operational Efficiency Reports",
    href: "/placeholder1",
  },
  {
    icon: IconReportSearch,
    label: "Inventory and Stock Reports",
    href: "/placeholder2",
  },
  {
    icon: IconReportAnalytics,
    label: "Quality Control & Compliance Reports",
    href: "/placeholder3",
  },
];

const settingsLinks: LinkDescription[] = [
  { icon: IconUserCog, label: "User Management", href: "/placeholder4" },
  {
    icon: IconSettings,
    label: "Simulation Configuration",
    href: "/placeholder5",
  },
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

  const simulationContextMock = useSimulationContextMock(0.5);
  const simulationContextLive = useSimulationContextLive(10);

  useEffect(() => {
    simulationContextLive.load(1000)
  }, [])

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <SimulationContextMock.Provider value={simulationContextMock}>
        <SimulationContextLive.Provider value={simulationContextLive}>
          <AppShell.Header>
            <Flex
              h="100%"
              px="md"
              gap="md"
              justify="space-between"
              align="center"
              direction="row"
              wrap="nowrap"
            >
              <Group>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                />
                <Logo />
              </Group>
              <SimulationControlOverlay />
            </Flex>
          </AppShell.Header>
          <AppShell.Navbar p="sm" component={ScrollArea}>
            <AppShell.Section my="sm">
              Live Monitoring
              {overviewLinks.map((l) => (
                <MenuLink key={l.href} link={l} />
              ))}
            </AppShell.Section>
            <AppShell.Section my="sm">
              Mock Simulation
              {mockSimulationLinks.map((l) => (
                <MenuLink key={l.href} link={l} />
              ))}
            </AppShell.Section>
            <AppShell.Section my="sm">
              CRUD
              {crudLinks.map((l) => (
                <MenuLink key={l.href} link={l} />
              ))}
            </AppShell.Section>
            <AppShell.Section my="md">
              Reports and Analytics
              {reportsAndAnalytics.map((l) => (
                <MenuLink key={l.href} link={l} />
              ))}
            </AppShell.Section>
            <AppShell.Section grow my="md">
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
        </SimulationContextLive.Provider>
      </SimulationContextMock.Provider>
    </AppShell >
  );
}
