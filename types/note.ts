export interface Note {
  id: string;
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
  created_at?: string;
  updated_at?: string;
}


export type TagList = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";