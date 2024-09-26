import { Title, TextInput, NumberInput, Button } from "@mantine/core";
import { isInRange, isNotEmpty, useForm } from "@mantine/form";
import { Location } from "@prisma/client";

export default async function Locations() {
  const form = useForm<Location>({
    mode: "uncontrolled",
    validate: {
      name: isNotEmpty("Name is required"),
    },
  });

  return (
    <>
      <Title>Create Location</Title>
      <TextInput
        {...form.getInputProps("name")}
        key={form.key("name")}
        label="Name"
        placeholder="Name"
      />
      <Button
        // onClick={() => apiRequest().then((values) => form.initialize(values))}
        mt="md"
      >
        Initialize form
      </Button>
    </>
  );
}
