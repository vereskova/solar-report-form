import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    kws: "",
    removedBacAcier: "",
    leftBacAcier: "",
    removedPanels: "",
    illeSurFace: "",
    acCable: "",
    actualDays: "",
    people: "",
    notes: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setResult("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResult(`Бонус бригады: ${data.bonusBrigade} | Бонус на человека: ${data.bonusPerson}`);

        setForm({
          kws: "",
          removedBacAcier: "",
          leftBacAcier: "",
          removedPanels: "",
          illeSurFace: "",
          acCable: "",
          actualDays: "",
          people: "",
          notes: "",
        });
      } else {
        setResult("Ошибка сохранения ❌");
      }
    } catch (error) {
      setResult("Ошибка отправки ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h1>Rapport Chantier</h1>

      <form onSubmit={handleSubmit}>
        <input name="kws" placeholder="Кол-во kWs" value={form.kws} onChange={handleChange} />
        <input name="removedBacAcier" placeholder="Снято bac acier (м)" value={form.removedBacAcier} onChange={handleChange} />
        <input name="leftBacAcier" placeholder="Оставлено bac acier (м)" value={form.leftBacAcier} onChange={handleChange} />
        <input name="removedPanels" placeholder="Снято панелей (шт.)" value={form.removedPanels} onChange={handleChange} />
        <input name="illeSurFace" placeholder="Ille sur face (м)" value={form.illeSurFace} onChange={handleChange} />
        <input name="acCable" placeholder="Протяжка AC кабеля (м)" value={form.acCable} onChange={handleChange} />
        <input name="actualDays" placeholder="Фактические дни" value={form.actualDays} onChange={handleChange} />
        <input name="people" placeholder="Кол-во людей" value={form.people} onChange={handleChange} />

        <textarea name="notes" placeholder="Примечания" value={form.notes} onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить"}
        </button>

        {result && <p className="result">{result}</p>}
      </form>

      <style jsx>{`
        .container {
          max-width: 650px;
          margin: 40px auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        h1 {
          margin-bottom: 24px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        input,
        textarea {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
        }

        textarea {
          min-height: 100px;
          resize: vertical;
        }

        button {
          padding: 14px;
          border: none;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }

        button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .result {
          margin-top: 8px;
          padding: 12px;
          border-radius: 8px;
          background: #e8f7ee;
          color: #166534;
          font-weight: 600;
        }
      `}</style>
    </main>
  );
}