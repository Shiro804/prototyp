"use client";

import { Button, Center, Loader, Modal, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { ProcessStep } from "@prisma/client";
import { IconCheck, IconPlus } from "@tabler/icons-react";

import { CreateModalProps } from "./CreateModal";
import { useSubmit } from "./SubmitHook";

export function CreateResourceModal({
    onSubmit,
}: Readonly<CreateModalProps<ProcessStep>>) {
    const [opened, { open, close }] = useDisclosure(false);
    const { pending, submit } = useSubmit(onSubmit);

    const form = useForm<ProcessStep>({
        mode: "uncontrolled",
        validate: {
            id: isNotEmpty("ID is required"),
        },
    });

    return (
        <>
            <Modal opened={opened} onClose={close} title="Create ProcessStep">
                <form onSubmit={form.onSubmit((d) => submit(d).then(close))}>
                    <TextInput
                        {...form.getInputProps("id")}
                        key={form.key("id")}
                        label="ID"
                        placeholder="ID"
                    />
                    <Center>
                        <Button type="submit" mt="md" color="green" disabled={pending}>
                            {pending ? <Loader color="white" size="1.5em" /> : <IconCheck />}
                        </Button>
                    </Center>
                </form>
            </Modal>
            <Button color="green" onClick={open} mt="md">
                <IconPlus />
            </Button>
        </>
    );
}
