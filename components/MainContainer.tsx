"use client";

import {
  AppShell,
  Avatar,
  Burger,
  Flex,
  Group,
  NavLink,
  Notification,
  ScrollArea,
  Skeleton,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications, Notifications } from "@mantine/notifications";
import { IconBuildingFactory2 } from "@tabler/icons-react";
import { ReactNode, useEffect, useLayoutEffect } from "react";
import useSWR from "swr";

import type { Location } from "@/data/entities/Location";
import { fetcher } from "@/lib/fetcher";
import { Logo } from "./Logo";

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
        <AppShell.Section grow my="md" component={ScrollArea}>
          Overview
          <LocationLinks />
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
