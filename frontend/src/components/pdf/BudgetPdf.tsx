"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { shopInfo } from "@/src/config/shopInfo";
import { CustomerNote, Customer } from "@/src/modules/customer/types";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#333",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    borderBottom: "2px solid #e65100",
    paddingBottom: 15,
  },
  shopName: {
    fontSize: 22,
    fontWeight: 700,
    color: "#e65100",
    marginBottom: 4,
  },
  shopInfo: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff3e0",
    padding: 10,
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: "#e65100",
  },
  date: {
    fontSize: 10,
    color: "#666",
  },
  section: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#fafafa",
    borderRadius: 4,
    border: "1px solid #eee",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#e65100",
    marginBottom: 8,
    borderBottom: "1px solid #e65100",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 100,
    fontWeight: 700,
    color: "#555",
  },
  value: {
    flex: 1,
    color: "#333",
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e65100",
    padding: 8,
    borderRadius: 4,
  },
  tableHeaderText: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottom: "1px solid #eee",
  },
  tableRowAlt: {
    backgroundColor: "#fff8f0",
  },
  colName: {
    flex: 3,
  },
  colQty: {
    flex: 1,
    textAlign: "center",
  },
  colPrice: {
    flex: 1.5,
    textAlign: "right",
  },
  colTotal: {
    flex: 1.5,
    textAlign: "right",
  },
  summarySection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff3e0",
    borderRadius: 4,
    border: "2px solid #e65100",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingBottom: 6,
    borderBottom: "1px dashed #ffcc80",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#555",
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: 700,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTop: "2px solid #e65100",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: "#e65100",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 700,
    color: "#e65100",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#999",
    borderTop: "1px solid #eee",
    paddingTop: 10,
  },
  noParts: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    padding: 15,
  },
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("pt-BR");
};

interface BudgetPdfProps {
  note: CustomerNote;
  customer: Customer;
}

export const BudgetPdf = ({ note, customer }: BudgetPdfProps) => {
  const car = note.car;
  const parts = note.parts || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.shopName}>{shopInfo.name}</Text>
          <Text style={styles.shopInfo}>{shopInfo.address}</Text>
          <Text style={styles.shopInfo}>
            {shopInfo.city} - Tel: {shopInfo.phone}
          </Text>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.title}>ORÇAMENTO</Text>
          <Text style={styles.date}>Data: {formatDate(note.createdAt)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DADOS DO CLIENTE</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{customer.name || "-"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Telefone:</Text>
            <Text style={styles.value}>{customer.phone || "-"}</Text>
          </View>
          {customer.email && (
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{customer.email}</Text>
            </View>
          )}
        </View>

        {car && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DADOS DO VEÍCULO</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Veículo:</Text>
              <Text style={styles.value}>
                {car.brand} {car.model}
              </Text>
            </View>
            {car.plate && (
              <View style={styles.row}>
                <Text style={styles.label}>Placa:</Text>
                <Text style={styles.value}>{car.plate}</Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.label}>Ano:</Text>
              <Text style={styles.value}>{car.year || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Cor:</Text>
              <Text style={styles.value}>{car.color}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PEÇAS E MATERIAIS</Text>
          {parts.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.colName]}>
                  Descrição
                </Text>
                <Text style={[styles.tableHeaderText, styles.colQty]}>Qtd</Text>
                <Text style={[styles.tableHeaderText, styles.colPrice]}>
                  Preço Unit.
                </Text>
                <Text style={[styles.tableHeaderText, styles.colTotal]}>
                  Subtotal
                </Text>
              </View>
              {parts.map((partInNote, index) => (
                <View
                  key={partInNote.id}
                  style={[
                    styles.tableRow,
                    index % 2 === 1 ? styles.tableRowAlt : {},
                  ]}
                >
                  <Text style={styles.colName}>
                    {partInNote.part?.name || "Peça"}
                    {partInNote.part?.model
                      ? ` (${partInNote.part.model})`
                      : ""}
                  </Text>
                  <Text style={styles.colQty}>{partInNote.quantity}</Text>
                  <Text style={styles.colPrice}>
                    {formatCurrency(partInNote.price)}
                  </Text>
                  <Text style={styles.colTotal}>
                    {formatCurrency(partInNote.price * partInNote.quantity)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noParts}>Nenhuma peça incluída</Text>
          )}
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal Peças:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(note.partsPrice)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Mão de Obra:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(note.laborPrice)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(note.totalPrice)}
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Orçamento válido por 7 dias. Valores sujeitos a alteração sem aviso
          prévio.
        </Text>
      </Page>
    </Document>
  );
};
