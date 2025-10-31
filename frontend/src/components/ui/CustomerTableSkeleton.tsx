import { Box, Table, Skeleton } from "@chakra-ui/react";

export function CustomerTableSkeleton() {
  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      overflowX="auto"
      bg="white"
      shadow="sm"
    >
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader minW="200px">Cliente</Table.ColumnHeader>
            <Table.ColumnHeader minW="180px">Email</Table.ColumnHeader>
            <Table.ColumnHeader minW="140px">Telefone</Table.ColumnHeader>
            <Table.ColumnHeader minW="120px">Ações</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: 10 }).map((_, index) => (
            <Table.Row key={index}>
              <Table.Cell minW="200px">
                <Skeleton height="20px" borderRadius="md" />
              </Table.Cell>
              <Table.Cell minW="180px">
                <Skeleton height="20px" borderRadius="md" />
              </Table.Cell>
              <Table.Cell minW="140px">
                <Skeleton height="20px" borderRadius="md" />
              </Table.Cell>
              <Table.Cell minW="120px">
                <Skeleton height="20px" borderRadius="md" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
