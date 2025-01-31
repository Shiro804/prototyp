// MainContainer.tsx
"use client";

import {
  AppShell,
  Avatar,
  Burger,
  Flex,
  Group,
  NavLink,
  ScrollArea
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import {
  IconAddressBook,
  IconArrowBadgeRight,
  IconBaselineDensityLarge,
  IconBaselineDensitySmall,
  IconBell,
  IconBrandSteam,
  IconBuildingFactory2,
  IconChartInfographic,
  IconDeviceDesktopAnalytics,
  IconGraph,
  IconHome,
  IconLogs,
  IconSettings,
  IconTruck,
} from "@tabler/icons-react";
import { ExoticComponent, ReactNode, useEffect } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

import SimulationControlOverlay from "./SimulationControlOverlay/SimulationControlOverlay";
import { SimulationProviderMock, useSimulationMock } from "./context/SimulationContextMock";
import { SimulationProviderLive, useSimulationLive } from "./context/SimulationContextLive";

interface LinkDescription {
  icon: ExoticComponent;
  label: string;
  href: string;
}

const overviewLinks: LinkDescription[] = [
  { icon: IconHome, label: "Dashboard", href: "/" },
  { icon: IconChartInfographic, label: "KPIs", href: "/kpis" },
  { icon: IconDeviceDesktopAnalytics, label: "Monitoring", href: "/monitoring" },
  // { icon: IconBaselineDensityLarge, label: "Hybrid Monitoring", href: "/general-monitoring-live" },
];

const mockSimulationLinks: LinkDescription[] = [
  { icon: IconHome, label: "Dashboard", href: "/mock-dashboard" },
  { icon: IconChartInfographic, label: "KPIs", href: "/kpis-mock" },
  { icon: IconDeviceDesktopAnalytics, label: "Monitoring", href: "/mock-monitoring" },
  // { icon: IconBaselineDensityLarge, label: "Hybrid Monitoring", href: "/general-monitoring-mock" },
];


const reportsAndAnalytics: LinkDescription[] = [
  {
    icon: IconGraph,
    label: "Process Graph",
    href: "/simulation-overview",
  },
  {
    icon: IconGraph,
    label: "Material Flow Graph",
    href: "/material-flow-graph",
  },
  {
    icon: IconGraph,
    label: "Simulation Analysis",
    href: "/simulation-analysis",
  },
  //   {
  //     icon: IconChartInfographic,
  //     label: "Operational Efficiency Reports",
  //     href: "/placeholder1",
  //   },
  //   {
  //     icon: IconReportSearch,
  //     label: "Inventory and Stock Reports",
  //     href: "/placeholder2",
  //   },
  //   {
  //     icon: IconReportAnalytics,
  //     label: "Quality Control & Compliance Reports",
  //     href: "/placeholder3",
  //   },
];

const crudLinks: LinkDescription[] = [
  { icon: IconBuildingFactory2, label: "Locations", href: "/locations" },
  { icon: IconAddressBook, label: "Resources", href: "/resources" },
  { icon: IconBrandSteam, label: "Machines", href: "/machines" },
  { icon: IconArrowBadgeRight, label: "Process Steps", href: "/process-steps" },
  { icon: IconTruck, label: "Transportsystems", href: "/transport-systems" },
  { icon: IconLogs, label: "Simulation Records", href: "/simulation-records" },
];

const settingsLinks: LinkDescription[] = [
  { icon: IconBell, label: "Notification", href: "/notification-settings" },
  { icon: IconSettings, label: "General Settings", href: "/general-settings" },
  {
    icon: IconSettings,
    label: "Simulation Configuration",
    href: "/placeholder5",
  },
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

  // Initialize both simulation contexts
  const simulationContextMock = useSimulationMock();
  const simulationContextLive = useSimulationLive();

  useEffect(() => {
    // Load both simulations if needed
    // Assuming you want to load both Mock and Live simulations on mount
    simulationContextMock.load(1);
    simulationContextLive.load(1);
  }, []);

  return (
    <SimulationProviderMock>
      <SimulationProviderLive>
        <AppShell
          header={{ height: 60 }}
          navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
          padding="md"
        >
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
            <AppShell.Section my="md">
              Reports and Analytics
              {reportsAndAnalytics.map((l) => (
                <MenuLink key={l.href} link={l} />
              ))}
            </AppShell.Section>
            <AppShell.Section my="sm">
              CRUD
              {crudLinks.map((l) => (
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
        </AppShell>
      </SimulationProviderLive>
    </SimulationProviderMock>
  );
}
