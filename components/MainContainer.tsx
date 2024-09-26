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
  IconBuildingFactory2,
  IconHome,
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
];

const entityLinks: LinkDescription[] = [
  { icon: IconBuildingFactory2, label: "Locations", href: "/locations" },
  { icon: IconAddressBook, label: "Resources", href: "/resources" },
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
        <AppShell.Section grow my="md" component={ScrollArea}>
          Entities
          {entityLinks.map((l) => (
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
