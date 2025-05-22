import { Artifact } from "@/components/create-artifact";
import { toast } from "sonner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartData {
  labels: string[];
  data: number[];
  title?: string;
}

interface BarChartMetadata {
  info: string;
}

export const barChartArtifact = new Artifact<"Bar Chart", BarChartMetadata>({
  kind: "Bar Chart",
  description: "A custom artifact for demonstrating custom bar chart functionality.",
  initialize: async ({ documentId, setMetadata }) => {
    setMetadata({
      info: documentId
    });
  },
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === "bar-chart-delta") {
      // Store as stringified chart data in content only
      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: streamPart.content as string, // store as stringified chart data
        status: "streaming",
      }));
    }
  },
  content: ({
    mode,
    status,
    content,
    isCurrentVersion,
    currentVersionIndex,
    onSaveContent,
    getDocumentContentById,
    isLoading,
    metadata,
  }) => {
    if (isLoading) {
      return <div>Loading custom artifact...</div>;
    }
    if (mode === "diff") {
      const oldContent = getDocumentContentById(currentVersionIndex - 1);
      const newContent = getDocumentContentById(currentVersionIndex);
      return (
        <div>
          <h3>Diff View</h3>
          <pre>{oldContent}</pre>
          <pre>{newContent}</pre>
        </div>
      );
    }
    // Always parse chart data from content
    let parsedChartData: BarChartData | null = null;
    if (content) {
      try {
        parsedChartData = JSON.parse(content);
      } catch {
        parsedChartData = null;
      }
    }
    if (!parsedChartData) {
      return <div>No chart data available.</div>;
    }
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: parsedChartData.title || 'Bar Chart',
        },
      },
    };
    const chartDataset = {
      labels: parsedChartData.labels,
      datasets: [
        {
          label: 'Value',
          data: parsedChartData.data,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };
    return (
      <div className="custom-artifact">
        <Bar options={options} data={chartDataset} />
        <button
          onClick={() => {
            navigator.clipboard.writeText(content);
            toast.success("Content copied to clipboard!");
          }}
        >
          Copy
        </button>
      </div>
    );
  },
  actions: [],
  toolbar: [
    {
      icon: <span>✎</span>,
      description: "Edit custom artifact",
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: "user",
          content: "Edit the custom artifact content.",
        });
      },
    },
  ],
});

