import { useState } from "react";

const SERVICES = [
  { id: "collision", label: "Collision / Accident Repair" },
  { id: "paint", label: "Paint Correction" },
  { id: "dent", label: "Dent & Scratch Repair" },
  { id: "custom", label: "Custom Paint Work" },
  { id: "restore", label: "Full Body Restoration" },
  { id: "other", label: "Other / Not Sure" },
];

const TIME_SLOTS = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

function getAvailableDates() {
  const dates: Date[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (dates.length < 14) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) dates.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

type Step = "service" | "datetime" | "info" | "done";

export default function AppointmentScheduler() {
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const dates = getAvailableDates();

  return (
    <div className="scheduler">
      {/* Progress */}
      <div className="steps">
        {(["service", "datetime", "info"] as Step[]).map((s, i) => (
          <div
            key={s}
            className={`step ${step === s ? "active" : ""} ${
              (step === "datetime" && i === 0) ||
              (step === "info" && i < 2) ||
              step === "done"
                ? "done"
                : ""
            }`}
          >
            <span className="step-num">{i + 1}</span>
            <span className="step-label">
              {s === "service" ? "Service" : s === "datetime" ? "Date & Time" : "Your Info"}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === "service" && (
        <div className="panel">
          <h3>What can we help with?</h3>
          <div className="service-grid">
            {SERVICES.map(svc => (
              <button
                key={svc.id}
                className={`service-btn ${service === svc.id ? "selected" : ""}`}
                onClick={() => setService(svc.id)}
                type="button"
              >
                {svc.label}
              </button>
            ))}
          </div>
          <button
            className="cta-btn"
            disabled={!service}
            onClick={() => setStep("datetime")}
            type="button"
          >
            Next →
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === "datetime" && (
        <div className="panel">
          <h3>Pick a date</h3>
          <div className="date-grid">
            {dates.map(d => (
              <button
                key={d.toISOString()}
                className={`date-btn ${date?.toDateString() === d.toDateString() ? "selected" : ""}`}
                onClick={() => setDate(d)}
                type="button"
              >
                {fmt(d)}
              </button>
            ))}
          </div>
          {date && (
            <>
              <h3 style={{ marginTop: "1.5rem" }}>Pick a time</h3>
              <div className="time-grid">
                {TIME_SLOTS.map(t => (
                  <button
                    key={t}
                    className={`time-btn ${time === t ? "selected" : ""}`}
                    onClick={() => setTime(t)}
                    type="button"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="btn-row">
            <button className="back-btn" onClick={() => setStep("service")} type="button">← Back</button>
            <button
              className="cta-btn"
              disabled={!date || !time}
              onClick={() => setStep("info")}
              type="button"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === "info" && (
        <div className="panel">
          <h3>Your information</h3>
          <div className="form-fields">
            <input
              className="field"
              type="text"
              placeholder="Full name *"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              className="field"
              type="tel"
              placeholder="Phone number *"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <input
              className="field"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <textarea
              className="field"
              placeholder="Describe the damage or work needed (optional)"
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
          <div className="btn-row">
            <button className="back-btn" onClick={() => setStep("datetime")} type="button">← Back</button>
            <button
              className="cta-btn"
              disabled={!name || !phone}
              onClick={() => setStep("done")}
              type="button"
            >
              Request Appointment
            </button>
          </div>
        </div>
      )}

      {/* Done */}
      {step === "done" && (
        <div className="panel done-panel">
          <div className="check">✓</div>
          <h3>Request received!</h3>
          <p>
            Thanks, <strong>{name}</strong>. We'll call you at <strong>{phone}</strong> to confirm your{" "}
            <strong>{SERVICES.find(s => s.id === service)?.label}</strong> appointment on{" "}
            <strong>{date && fmt(date)}</strong> at <strong>{time}</strong>.
          </p>
          <p className="small">
            Questions? Call us at <a href="tel:+18188467291">(818) 846-7291</a>
          </p>
          <button className="back-btn" onClick={() => { setStep("service"); setService(""); setDate(null); setTime(""); setName(""); setPhone(""); setEmail(""); setNotes(""); }} type="button">
            Book another
          </button>
        </div>
      )}

      <style>{`
        .scheduler {
          background: #1a1a1a;
          border: 1px solid #2e2e2e;
          border-radius: 12px;
          padding: 2rem;
          max-width: 680px;
          margin: 0 auto;
          font-family: Inter, system-ui, sans-serif;
        }

        .steps {
          display: flex;
          gap: 0;
          margin-bottom: 2rem;
          border-bottom: 1px solid #2e2e2e;
          padding-bottom: 1.25rem;

          & .step {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1;
            color: #555;
            font-size: 0.85rem;

            & .step-num {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 1.5px solid #555;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.75rem;
              flex-shrink: 0;
            }

            &.active {
              color: #f0f0f0;

              & .step-num {
                background: #e63946;
                border-color: #e63946;
                color: #fff;
              }
            }

            &.done {
              color: #888;

              & .step-num {
                background: #2e2e2e;
                border-color: #2e2e2e;
                color: #aaa;
              }
            }
          }
        }

        .panel {
          & h3 {
            font-size: 1rem;
            font-weight: 600;
            color: #f0f0f0;
            margin-bottom: 1rem;
          }
        }

        .service-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 1.5rem;

          @media (max-width: 480px) {
            grid-template-columns: 1fr;
          }
        }

        .service-btn {
          padding: 0.7rem 1rem;
          border-radius: 8px;
          border: 1.5px solid #2e2e2e;
          background: #242424;
          color: #ccc;
          font-size: 0.875rem;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.2s, color 0.2s;

          &:hover { border-color: #555; color: #f0f0f0; }
          &.selected { border-color: #e63946; color: #f0f0f0; background: rgba(230,57,70,0.08); }
        }

        .date-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-bottom: 0.5rem;

          @media (max-width: 520px) {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .date-btn {
          padding: 0.55rem 0.5rem;
          border-radius: 7px;
          border: 1.5px solid #2e2e2e;
          background: #242424;
          color: #ccc;
          font-size: 0.78rem;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.2s, color 0.2s;

          &:hover { border-color: #555; color: #f0f0f0; }
          &.selected { border-color: #e63946; color: #f0f0f0; background: rgba(230,57,70,0.08); }
        }

        .time-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-bottom: 1.5rem;

          @media (max-width: 520px) {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .time-btn {
          padding: 0.55rem 0.25rem;
          border-radius: 7px;
          border: 1.5px solid #2e2e2e;
          background: #242424;
          color: #ccc;
          font-size: 0.82rem;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.2s, color 0.2s;

          &:hover { border-color: #555; color: #f0f0f0; }
          &.selected { border-color: #e63946; color: #f0f0f0; background: rgba(230,57,70,0.08); }
        }

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 1.5rem;
        }

        .field {
          background: #242424;
          border: 1.5px solid #2e2e2e;
          border-radius: 8px;
          padding: 0.7rem 0.9rem;
          color: #f0f0f0;
          font-size: 0.9rem;
          font-family: inherit;
          transition: border-color 0.2s;
          width: 100%;
          resize: vertical;

          &::placeholder { color: #555; }
          &:focus {
            outline: none;
            border-color: #555;
          }
        }

        .btn-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .cta-btn {
          background: #e63946;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.65rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;

          &:hover:not(:disabled) { background: #c1121f; }
          &:disabled { opacity: 0.4; cursor: not-allowed; }
        }

        .back-btn {
          background: none;
          border: 1.5px solid #2e2e2e;
          border-radius: 8px;
          color: #888;
          padding: 0.65rem 1rem;
          font-size: 0.9rem;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.2s, color 0.2s;

          &:hover { border-color: #555; color: #f0f0f0; }
        }

        .done-panel {
          text-align: center;
          padding: 1rem 0;

          & .check {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: rgba(230,57,70,0.15);
            color: #e63946;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
          }

          & h3 { font-size: 1.2rem; margin-bottom: 0.75rem; }

          & p {
            color: #aaa;
            font-size: 0.9rem;
            line-height: 1.7;
            margin-bottom: 0.5rem;

            & strong { color: #f0f0f0; }

            &.small { font-size: 0.82rem; margin-bottom: 1.5rem; }

            & a { color: #e63946; }
          }
        }
      `}</style>
    </div>
  );
}
