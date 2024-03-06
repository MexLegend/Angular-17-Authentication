export interface IGmailResponse {
  messages: IGmailMailItem[];
}

export interface IGmailMailItem {
  id: string;
  threadId: string;
}

export interface IGmailMailDetails {
  threadId: string;
  labelIds: string[];
  snippet: string;
}
