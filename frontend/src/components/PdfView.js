import React from 'react';
import { PDFViewer, Document, Page, Text } from '@react-pdf/renderer';

const MyPDFComponent = ({ billItems }) => (
  <PDFViewer style={{ width: '100%', height: '100vh' }}>
    <Document>
      <Page style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Bill</Text>
        {billItems.map((item, index) => (
          <Text key={index} style={{ fontSize: 12, marginBottom: 10 }}>
            {item.code} - {item.name}: ${item.totalPrice}
          </Text>
        ))}
      </Page>
    </Document>
  </PDFViewer>
);

export default MyPDFComponent;
