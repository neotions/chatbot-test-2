// lib/ai/tools/create-bar-chart.ts
import { generateUUID } from '@/lib/utils';
import { DataStreamWriter, tool } from 'ai';
import { z } from 'zod';
import { Session } from 'next-auth';
import { saveDocument } from '@/lib/db/queries';

interface CreateBarChartProps {
  session: Session;
  dataStream: DataStreamWriter;
}

export const createBarChart = ({ session, dataStream }: CreateBarChartProps) =>
  tool({
    description:
      'Create a bar chart visualization with the provided data. Use this when users want to visualize categorical data with bars.',
    parameters: z.object({
      title: z.string().describe('The title of the bar chart'),
      labels: z.array(z.string()).describe('Labels for each bar category'),
      data: z.array(z.number()).describe('Numerical values for each bar'),
      description: z.string().optional().describe('Optional description of the chart'),
    }),
    execute: async ({ title, labels, data, description }) => {
      const id = generateUUID();

      // Signal that we're creating a bar chart artifact
      dataStream.writeData({
        type: 'kind',
        content: 'Bar Chart',
      });

      dataStream.writeData({
        type: 'id',
        content: id,
      });

      dataStream.writeData({
        type: 'title',
        content: title,
      });

      dataStream.writeData({
        type: 'clear',
        content: '',
      });

      // Create the chart data structure
      const chartData = {
        labels,
        data,
        title,
        description,
      };

      // Stream the chart data
      dataStream.writeData({
        type: 'bar-chart-delta',
        content: JSON.stringify(chartData),
      });

      // Save to database if user is authenticated
      if (session?.user?.id) {
        await saveDocument({
          id,
          title,
          content: JSON.stringify(chartData),
          kind: 'Bar Chart',
          userId: session.user.id,
        });
      }

      dataStream.writeData({ type: 'finish', content: '' });

      return {
        id,
        title,
        kind: 'Bar Chart',
        content: 'Bar chart created and is now visible to the user.',
      };
    },
  });