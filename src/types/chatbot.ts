export interface HistoryItem {
  id: number;
  user_email: string;
  question: string;
  ai_answer: string;
  message: string;
  db_sql: string;
  db_rows: string;
  vals: string;
  created_at: string;
}
