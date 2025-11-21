import http from "../../../../lib/axios";

export type AskFAQResponse = {
  answer: string;
  source: string;
};

export const askFAQ = async (question: string, lang: "en" | "ar" = "en") => {
  const res = await http.post("/faq/ask", { question, lang });
  return res.data as AskFAQResponse;
};
