import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID,
      serviceAccountAuth
    );

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
      Date: new Date().toLocaleString("fr-FR"),
      kWs: req.body.kws,
      "Снято bac acier (м)": req.body.removedBacAcier,
      "Оставлено bac acier (м)": req.body.leftBacAcier,
      "Снято панелей (шт.)": req.body.removedPanels,
      "Ille sur face (м)": req.body.illeSurFace,
      "Протяжка AC кабеля (м)": req.body.acCable,
      "Фактические дни": req.body.actualDays,
      "Кол-во людей": req.body.people,
      "Примечания": req.body.notes,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("GOOGLE SHEET ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}