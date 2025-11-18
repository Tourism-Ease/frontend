import http from "../../../../lib/axios";

export const sendMessageToBot = async (message: string) => {
  const res = await http.post("/chatbot", { message });
  return res.data.reply;
};
