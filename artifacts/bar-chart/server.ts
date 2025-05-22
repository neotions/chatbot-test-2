import { createDocumentHandler } from "@/lib/artifacts/server";

// Helper to generate demo bar chart data
function generateBarChartData(title: string) {
  // Example: 7 months, random data
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  const data = labels.map(() => Math.floor(Math.random() * 100));
  return { labels, data, title };
}

export const barChartDocumentHandler = createDocumentHandler<"Bar Chart">({
  kind: "Bar Chart",
  // Called when the document is first created.
  onCreateDocument: async ({ title, dataStream }) => {
    // Generate chart data
    const chartData = generateBarChartData(title);
    // Stream the chart data as a single delta
    dataStream.writeData({
      type: "bar-chart-delta",
      content: JSON.stringify(chartData),
    });
    return JSON.stringify(chartData);
  },
  // Called when updating the document based on user modifications.
  onUpdateDocument: async ({ document, description, dataStream }) => {
    // For demo, just regenerate chart data (could parse description for real use)
    const chartData = generateBarChartData(description || "Updated Chart");
    dataStream.writeData({
      type: "bar-chart-delta",
      content: JSON.stringify(chartData),
    });
    return JSON.stringify(chartData);
  },
});