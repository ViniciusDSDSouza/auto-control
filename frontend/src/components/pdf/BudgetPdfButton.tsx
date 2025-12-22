"use client";

import dynamic from "next/dynamic";
import { Box, Spinner } from "@chakra-ui/react";
import { CustomerNote, Customer } from "@/src/modules/customer/types";

const BudgetPdfButtonInner = dynamic(
  () =>
    import("./BudgetPdfButtonInner").then((mod) => mod.BudgetPdfButtonInner),
  {
    ssr: false,
    loading: () => (
      <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        p={2}
        borderRadius="md"
        bg="gray.100"
        color="gray.400"
        cursor="wait"
      >
        <Spinner size="sm" />
      </Box>
    ),
  }
);

interface BudgetPdfButtonProps {
  note: CustomerNote;
  customer: Customer;
}

export const BudgetPdfButton = ({ note, customer }: BudgetPdfButtonProps) => {
  return <BudgetPdfButtonInner note={note} customer={customer} />;
};
