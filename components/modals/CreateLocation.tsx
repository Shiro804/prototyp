"use client";

import { Button, Center, Loader, Modal, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Location } from "@prisma/client";
import { IconCheck, IconPlus } from "@tabler/icons-react";

import { CreateModalProps } from "./CreateModal";
import { useSubmit } from "./SubmitHook";

export function CreateLocationModal({
  onSubmit,
}: Readonly<CreateModalProps<Location>>) {
  const [opened, { open, close }] = useDisclosure(false);
  const { pending, submit } = useSubmit(onSubmit);

  const form = useForm<Location>({
    mode: "uncontrolled",
    validate: {
      name: isNotEmpty("Name is required"),
    },
  });

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create Location">
        <form onSubmit={form.onSubmit((d) => submit(d).then(close))}>
          <TextInput
            {...form.getInputProps("name")}
            key={form.key("name")}
            label="Name"
            placeholder="Name"
          />
          <Center>
            <Button type="submit" mt="md" color="#5300E8" disabled={pending}>
              {pending ? <Loader color="white" size="1.5em" /> : <IconCheck />}
            </Button>
          </Center>
        </form>
      </Modal>
      <Button color="#5300E8" onClick={open} mt="md">
        <IconPlus />
      </Button>
    </>
  );
}
