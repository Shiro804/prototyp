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
  IconBell,
  IconBrandSteam,
  IconBuildingFactory2,
  IconChartInfographic,
  IconDeviceDesktopAnalytics,
  IconGraph,
  IconLogs,
  IconSettings,
  IconTruck,
} from "@tabler/icons-react";
import { ExoticComponent, ReactNode, useEffect } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import SimulationControlOverlay from "./SimulationControlOverlay/SimulationControlOverlay";
import { SimulationProviderMock, useSimulationMock } from "./context/SimulationContextMock";
import { SimulationProviderLive, useSimulationLive } from "./context/SimulationContextLive";

// Interface defining the structure of navigation links
interface LinkDescription {
  icon: ExoticComponent;
  label: string;
  href: string;
}

// Navigation links for the overview section
const overviewLinks: LinkDescription[] = [
  { icon: IconChartInfographic, label: "KPIs", href: "/" },
  { icon: IconDeviceDesktopAnalytics, label: "Monitoring", href: "/monitoring" },
  { icon: IconBaselineDensityLarge, label: "Hybrid Monitoring", href: "/general-monitoring-live" },
];

// Navigation links for mock simulation section
const mockSimulationLinks: LinkDescription[] = [
  { icon: IconChartInfographic, label: "KPIs", href: "/kpis-mock" },
  { icon: IconDeviceDesktopAnalytics, label: "Monitoring", href: "/mock-monitoring" },
  { icon: IconBaselineDensityLarge, label: "Hybrid Monitoring", href: "/general-monitoring-mock" },
];

// Navigation links for reports and analytics section
const reportsAndAnalytics: LinkDescription[] = [
  {
    icon: IconGraph,
    label: "Process Graph",
    href: "/process-graph",
  },
  {
    icon: IconGraph,
    label: "Simulation Analysis",
    href: "/simulation-analysis",
  },
  {
    icon: IconGraph,
    label: "Inventory Visualization",
    href: "/inventory-visualization",
  }
];

// Navigation links for CRUD operations
const crudLinks: LinkDescription[] = [
  { icon: IconBuildingFactory2, label: "Locations", href: "/locations" },
  { icon: IconAddressBook, label: "Resources", href: "/resources" },
  { icon: IconBrandSteam, label: "Machines", href: "/machines" },
  { icon: IconArrowBadgeRight, label: "Process Steps", href: "/process-steps" },
  { icon: IconTruck, label: "Transportsystems", href: "/transport-systems" },
  { icon: IconLogs, label: "Simulation Records", href: "/simulation-records" },
];

// Navigation links for settings section
const settingsLinks: LinkDescription[] = [
  { icon: IconBell, label: "Notification", href: "/notification-settings" },
  { icon: IconSettings, label: "General Settings", href: "/general-settings" },
  {
    icon: IconSettings,
    label: "Simulation Configuration",
    href: "/placeholder5",
  },
];

// Component for rendering individual navigation links
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

// Main container component that provides the application shell and navigation
export default function MainContainer({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // State for mobile navigation toggle
  const [opened, { toggle }] = useDisclosure();

  // Initialize simulation contexts
  const simulationContextMock = useSimulationMock();
  const simulationContextLive = useSimulationLive();

  // Load both simulation contexts on component mount
  useEffect(() => {
    simulationContextMock.load(1);
    simulationContextLive.load(1);
  }, []);

  return (
    // Wrap the entire application with simulation providers
    <SimulationProviderMock>
      <SimulationProviderLive>
        {/* Main application shell */}
        <AppShell
          header={{ height: 60 }}
          navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
          padding="md"
        >
          {/* Application header */}
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
                {/* Mobile navigation toggle */}
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                />
              </Group>
              <SimulationControlOverlay />
            </Flex>
          </AppShell.Header>
          {/* Navigation sidebar */}
          <AppShell.Navbar p="sm" component={ScrollArea}>
            {/* Live Monitoring section */}
            <AppShell.Section my="sm">
              Live Monitoring
              {overviewLinks.map((l) => (
                <MenuLink key={l.href} link={l} />
              ))}
            </AppShell.Section>
            {/* Mock Simulation section */}
            <AppShell.Section my="sm">
              Mock Simulation
              {mockSimulationLinks.map((l) => (
                <MenuLink key={l.href} link={l} />
              ))}
            </AppShell.Section>
            {/* Reports and Analytics section */}
            <AppShell.Section my="md">
              Reports and Analytics
              {reportsAndAnalytics.map((l) => (
                <MenuLink key={l.href} link={l} />
              ))}
            </AppShell.Section>
            {/* CRUD operations section */}
            <AppShell.Section my="sm">
              CRUD
              {crudLinks.map((l) => (
                <MenuLink key={l.href} link={l} />
              ))}
            </AppShell.Section>
            {/* Settings section */}
            <AppShell.Section grow my="md">
              Settings
              {settingsLinks.map((l) => (
                <MenuLink key={l.href} link={l} />
              ))}
            </AppShell.Section>
            {/* User profile section */}
            <AppShell.Section>
              <Flex align="center" gap="md">
                <Avatar /> Admin
              </Flex>
            </AppShell.Section>
          </AppShell.Navbar>
          {/* Main content area */}
          <AppShell.Main m="lg">{children}</AppShell.Main>
          {/* Global notifications */}
          <Notifications />
        </AppShell>
      </SimulationProviderLive>
    </SimulationProviderMock>
  );
}
