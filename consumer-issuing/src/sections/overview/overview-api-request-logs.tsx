import {
  Box,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { format } from "date-fns";
import { prettyPrintJson } from 'pretty-print-json';

import { Scrollbar } from "src/components/scrollbar";

// Add pretty-print-json styles
const jsonStyles = `
  .json-container {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
  }
  .json-container .json-key {
    color: #9cdcfe;
  }
  .json-container .json-string {
    color: #ce9178;
  }
  .json-container .json-number {
    color: #b5cea8;
  }
  .json-container .json-boolean {
    color: #569cd6;
  }
  .json-container .json-null {
    color: #569cd6;
  }
  .json-container .json-mark {
    color: #808080;
  }
`;

type ApiRequestLog = {
  id: number;
  created: string;
  requestUrl: string;
  requestMethod: string;
  requestBody: string | null;
  responseBody: string | null;
};

export const OverviewApiRequestLogs = forwardRef((props: {
  sx?: object;
}, ref) => {
  const { sx } = props;
  const [logs, setLogs] = useState<ApiRequestLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<ApiRequestLog | null>(null);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/get_api_request_logs');
      if (!response.ok) {
        throw new Error('Failed to fetch API request logs');
      }
      const data = await response.json();
      setLogs(data.logs);
    } catch (err) {
      setError('Failed to load API request logs');
      console.error('Error fetching API request logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchLogs
  }));

  useEffect(() => {
    fetchLogs();
  }, []);

  const parseJson = (jsonString: string | null) => {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  };

  const renderJson = (jsonString: string | null) => {
    const parsed = parseJson(jsonString);
    if (!parsed) return jsonString || '-';
    return (
      <div 
        className="json-container"
        dangerouslySetInnerHTML={{ 
          __html: prettyPrintJson.toHtml(parsed, {
            indent: 2,
            lineNumbers: false,
            linkUrls: false,
            quoteKeys: true,
            trailingCommas: false,
          })
        }} 
      />
    );
  };

  return (
    <>
      <style>{jsonStyles}</style>
      <Box sx={{ display: 'flex', gap: 2, ...sx }}>
        <Card sx={{ flex: 1 }}>
          <Scrollbar sx={{ flexGrow: 1 }}>
            <Box sx={{ minWidth: 400 }}>
              {loading ? (
                <Box p={3}>
                  <Typography>Loading logs...</Typography>
                </Box>
              ) : error ? (
                <Box p={3}>
                  <Typography color="error">{error}</Typography>
                </Box>
              ) : logs.length === 0 ? (
                <Box p={3}>
                  <Typography color="text.secondary">No API request logs available</Typography>
                </Box>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>URL</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow 
                        hover 
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        sx={{ 
                          cursor: 'pointer',
                          backgroundColor: selectedLog?.id === log.id ? 'action.selected' : 'inherit'
                        }}
                      >
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {format(new Date(log.created), "MMM dd, yyyy 'at' h:mm a")}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {log.requestMethod}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {log.requestUrl}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Scrollbar>
        </Card>

        {selectedLog && (
          <Card sx={{ width: 500 }}>
            <Scrollbar sx={{ height: '100%' }}>
              <Box p={2}>
                <Typography variant="h6" gutterBottom>
                  Request Details
                </Typography>
                {selectedLog.requestBody && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Request Body
                    </Typography>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        mb: 2,
                        backgroundColor: 'black',
                        fontFamily: 'Courier New, monospace',
                        fontSize: '0.875rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        color: 'white',
                        fontWeight: 'bold',
                        height: 200,
                        overflow: 'auto'
                      }}
                    >
                      {renderJson(selectedLog.requestBody)}
                    </Paper>
                  </>
                )}

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Response Body
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2,
                    backgroundColor: 'black',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: 'white',
                    fontWeight: 'bold',
                    height: 400,
                    overflow: 'auto'
                  }}
                >
                  {renderJson(selectedLog.responseBody)}
                </Paper>
              </Box>
            </Scrollbar>
          </Card>
        )}
      </Box>
    </>
  );
}); 