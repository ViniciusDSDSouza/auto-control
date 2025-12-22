"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Box, Spinner } from "@chakra-ui/react";
import { FaFilePdf } from "react-icons/fa";
import { CustomerNote, Customer } from "@/src/modules/customer/types";
import { BudgetPdf } from "./BudgetPdf";

interface BudgetPdfButtonInnerProps {
  note: CustomerNote;
  customer: Customer;
}

export const BudgetPdfButtonInner = ({
  note,
  customer,
}: BudgetPdfButtonInnerProps) => {
  const fileName = `orcamento-${customer.name?.replace(/\s+/g, "-").toLowerCase() || "cliente"}-${new Date(note.createdAt).toISOString().split("T")[0]}.pdf`;

  return (
    <PDFDownloadLink
      document={<BudgetPdf note={note} customer={customer} />}
      fileName={fileName}
      style={{ textDecoration: "none" }}
    >
      {({ loading }) => (
        <Box
          as="button"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          p={2}
          borderRadius="md"
          bg={loading ? "gray.100" : "orange.50"}
          color={loading ? "gray.400" : "orange.600"}
          cursor={loading ? "wait" : "pointer"}
          transition="all 0.2s"
          _hover={
            loading ? {} : { bg: "orange.100", transform: "scale(1.05)" }
          }
          title="Exportar Orçamento PDF"
        >
          {loading ? <Spinner size="sm" /> : <FaFilePdf size={18} />}
        </Box>
      )}
    </PDFDownloadLink>
  );
};

