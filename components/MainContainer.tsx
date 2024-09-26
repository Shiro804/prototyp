"use client";

import {
  AppShell,
  Avatar,
  Burger,
  Flex,
  Group,
  NavLink,
  ScrollArea,
  Skeleton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications, Notifications } from "@mantine/notifications";
import {
  IconAddressBook,
  IconBuildingFactory2,
  IconHome,
} from "@tabler/icons-react";
import { ExoticComponent, ReactNode, useEffect } from "react";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import { Location } from "@prisma/client";
import { Logo } from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

function LocationLinks() {
  const { data, error } = useSWR<Location[], Error>("/api/locations", fetcher);

  useEffect(() => {
    if (error) {
      notifications.show({
        color: "red",
        title: "Error while loading locations",
        message: error.message,
      });
    }
  }, [error]);

  if (!data) return <Skeleton h={28} mt="sm" />;

  return data.map((l) => (
    <NavLink
      key={l.id}
      href={`/locations/${l.id}`}
      label={l.name}
      leftSection={<IconBuildingFactory2 />}
    />
  ));
}

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

const menuLink = (l: LinkDescription) => {
  const path = usePathname();

  return (
    <NavLink
      active={path === l.href}
      key={l.href}
      href={l.href}
      label={l.label}
      leftSection={<l.icon />}
      component={Link}
    />
  );
};

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
          {overviewLinks.map(menuLink)}
          <LocationLinks />
        </AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea}>
          Entities
          {entityLinks.map(menuLink)}
        </AppShell.Section>
        <AppShell.Section>
          <Flex align="center" gap="md">
            <Avatar /> Admin
          </Flex>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <Notifications />
    </AppShell>
  );
}
