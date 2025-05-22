import { tool } from 'ai';
import { z } from 'zod';

export const makeBarChartTool = tool({
    description:
        'Generates data and configuration for a bar chart. Use this to display categorical data with rectangular bars with heights or lengths proportional to the values that they represent.',
    parameters: z.object({
        title: z.string().describe('The title of the bar chart.'),
        data: z
            .array(z.number())
            .describe('An array of numerical values for the bars.'),
        labels: z
            .array(z.string())
            .describe('An array of string labels for each bar/category.'),
    }),
    execute: async ({ title, data, labels }) => {
        if (data.length !== labels.length) {
            // This basic validation can be helpful, though Zod handles structure.
            // Depending on strictness, you might throw an error or attempt to reconcile.
            // For simplicity, we'll proceed, assuming the LLM provides matching lengths
            // or a UI component later handles mismatches.
            console.warn('Bar chart data and labels arrays have different lengths.');
        }

        return {
            title,
            kind: 'bar-chart',
            details: {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: title, // Or a more generic label like 'Dataset 1'
                            data: data,
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgb(54, 162, 235)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top' as const,
                        },
                        title: {
                            display: true,
                            text: title,
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            },
            content: `Bar chart "${title}" configured and ready for display.`,
        };
    },
});





