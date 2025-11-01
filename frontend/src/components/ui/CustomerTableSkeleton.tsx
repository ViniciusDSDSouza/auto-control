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
            <Table.ColumnHeader
              fontSize="xs"
              fontWeight="bold"
              minW="200px"
              w="40%"
              color="black"
              pl={4}
            >
              Cliente
            </Table.ColumnHeader>
            <Table.ColumnHeader
              fontSize="xs"
              fontWeight="bold"
              minW="180px"
              w="25%"
              color="black"
            >
              Email
            </Table.ColumnHeader>
            <Table.ColumnHeader
              fontSize="xs"
              fontWeight="bold"
              minW="140px"
              w="20%"
              color="black"
            >
              Telefone
            </Table.ColumnHeader>
            <Table.ColumnHeader
              fontSize="xs"
              fontWeight="bold"
              textAlign="center"
              minW="120px"
              w="15%"
              color="black"
            >
              Ações
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: 10 }).map((_, index) => (
            <Table.Row key={index} _hover={{ bg: "orange.50" }}>
              <Table.Cell fontSize="lg" minW="200px" pl={4}>
                <Skeleton height="20px" borderRadius="md" />
              </Table.Cell>
              <Table.Cell fontSize="lg" color="gray.600" minW="180px">
                <Skeleton height="20px" borderRadius="md" />
              </Table.Cell>
              <Table.Cell fontSize="lg" color="gray.600" minW="140px">
                <Skeleton height="20px" borderRadius="md" />
              </Table.Cell>
              <Table.Cell minW="120px">
                <Skeleton height="20px" borderRadius="md" w="60px" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
