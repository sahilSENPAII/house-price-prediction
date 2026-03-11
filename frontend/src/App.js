import { useState } from "react";
import { Home, MapPin, Layers, Droplets, Star, Activity, Waves, RefreshCw, BarChart2, GitBranch, Shield } from "lucide-react";

const API_URL = "https://house-price-backend-wjp6.onrender.com";

const AREA_DATA = [
  { label: "DLF Phase 1",         postalCode: 122002, lat: 28.4797, lng: 77.0921, airport: 22 },
  { label: "DLF Phase 2",         postalCode: 122002, lat: 28.4732, lng: 77.0886, airport: 23 },
  { label: "DLF Phase 3",         postalCode: 122010, lat: 28.4923, lng: 77.0854, airport: 21 },
  { label: "DLF Phase 4",         postalCode: 122009, lat: 28.4612, lng: 77.0798, airport: 19 },
  { label: "DLF Phase 5",         postalCode: 122009, lat: 28.4573, lng: 77.0756, airport: 18 },
  { label: "MG Road",             postalCode: 122002, lat: 28.4739, lng: 77.0624, airport: 21 },
  { label: "Cyber City",          postalCode: 122002, lat: 28.4950, lng: 77.0890, airport: 20 },
  { label: "Golf Course Road",    postalCode: 122022, lat: 28.4421, lng: 77.1024, airport: 19 },
  { label: "Golf Course Ext.",    postalCode: 122018, lat: 28.4023, lng: 77.0412, airport: 33 },
  { label: "Sohna Road",          postalCode: 122018, lat: 28.4089, lng: 77.0350, airport: 32 },
  { label: "Sector 14",           postalCode: 122001, lat: 28.4745, lng: 77.0290, airport: 28 },
  { label: "Sector 15",           postalCode: 122001, lat: 28.4712, lng: 77.0234, airport: 29 },
  { label: "Sector 23",           postalCode: 122017, lat: 28.4634, lng: 77.0187, airport: 24 },
  { label: "Sector 31",           postalCode: 122001, lat: 28.4589, lng: 77.0312, airport: 27 },
  { label: "Sector 40",           postalCode: 122003, lat: 28.4523, lng: 77.0456, airport: 24 },
  { label: "Sector 42",           postalCode: 122003, lat: 28.4498, lng: 77.0534, airport: 23 },
  { label: "Sector 43",           postalCode: 122009, lat: 28.4467, lng: 77.0612, airport: 20 },
  { label: "Sector 44",           postalCode: 122003, lat: 28.4445, lng: 77.0589, airport: 22 },
  { label: "Sector 45",           postalCode: 122003, lat: 28.4412, lng: 77.0645, airport: 22 },
  { label: "Sector 46",           postalCode: 122003, lat: 28.4389, lng: 77.0698, airport: 21 },
  { label: "Sector 47",           postalCode: 122018, lat: 28.4356, lng: 77.0734, airport: 26 },
  { label: "Sector 48",           postalCode: 122018, lat: 28.4323, lng: 77.0767, airport: 27 },
  { label: "Sector 49",           postalCode: 122018, lat: 28.4289, lng: 77.0812, airport: 28 },
  { label: "Sector 50",           postalCode: 122018, lat: 28.4256, lng: 77.0856, airport: 29 },
  { label: "Sector 51",           postalCode: 122022, lat: 28.4223, lng: 77.0889, airport: 22 },
  { label: "Sector 52",           postalCode: 122022, lat: 28.4512, lng: 77.0934, airport: 20 },
  { label: "Sector 53",           postalCode: 122022, lat: 28.4478, lng: 77.0967, airport: 21 },
  { label: "Sector 54",           postalCode: 122022, lat: 28.4445, lng: 77.1001, airport: 22 },
  { label: "Sector 55",           postalCode: 122011, lat: 28.4267, lng: 77.0956, airport: 23 },
  { label: "Sector 56",           postalCode: 122011, lat: 28.4230, lng: 77.0989, airport: 24 },
  { label: "Sector 57",           postalCode: 122012, lat: 28.4198, lng: 77.0921, airport: 25 },
  { label: "South City",          postalCode: 122001, lat: 28.4312, lng: 77.0123, airport: 25 },
  { label: "Palam Vihar",         postalCode: 122017, lat: 28.5187, lng: 76.9998, airport: 15 },
  { label: "Udyog Vihar",         postalCode: 122016, lat: 28.5023, lng: 77.0823, airport: 17 },
  { label: "Huda Sectors",        postalCode: 122015, lat: 28.4634, lng: 77.0534, airport: 22 },
  { label: "Nirvana Country",     postalCode: 122018, lat: 28.4134, lng: 77.0534, airport: 31 },
  { label: "Vatika City",         postalCode: 122018, lat: 28.3978, lng: 77.0423, airport: 34 },
  { label: "Manesar",             postalCode: 122051, lat: 28.3567, lng: 76.9387, airport: 42 },
  { label: "New Gurgaon (82-95)", postalCode: 122051, lat: 28.3823, lng: 76.9712, airport: 38 },
];

const DEFAULT_AREA = AREA_DATA[0];

const GRADE_OPTIONS = [
  [5,  "Average"],
  [6,  "Above Average"],
  [7,  "Good"],
  [8,  "Very Good"],
  [9,  "Excellent"],
  [10, "Premium"],
  [11, "Luxury"],
  [12, "Ultra Luxury"],
  [13, "Mansion"],
];

// Auto Crore / Lakh formatter
const formatPrice = (inr) => {
  const lakh = inr / 100000;
  if (lakh >= 100) {
    const crore = (lakh / 100).toFixed(2);
    return { main: `₹${crore} Cr`, sub: `₹${lakh.toFixed(2)} Lakh` };
  }
  return { main: `₹${lakh.toFixed(2)} L`, sub: null };
};

const buildForm = (area) => ({
  number_of_bedrooms: 3,
  number_of_bathrooms: 2,
  living_area: 1800,
  lot_area: 5000,
  number_of_floors: 2,
  waterfront_present: 0,
  number_of_views: 0,
  condition_of_the_house: 3,
  grade_of_the_house: 7,
  area_of_house_excluding_basement: 1800,
  area_of_basement: 0,
  postal_code: area.postalCode,
  lattitude: area.lat,
  longitude: area.lng,
  number_of_schools_nearby: 2,
  distance_from_airport: area.airport,
  built_year: 2005,
  renovation_year: 0,
});

// ── Small components ──────────────────────────────────────────────────────

const SectionTitle = ({ icon, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
    {icon}
    <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{text}</h2>
  </div>
);

const Chip = ({ label }) => (
  <span style={{
    background: "rgba(0,245,212,0.07)", border: "1px solid rgba(0,245,212,0.15)",
    borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "rgba(255,255,255,0.5)",
  }}>{label}</span>
);

const NumberInput = ({ label, icon, name, value, onChange, onBlur, step = 1, min, max, hint }) => (
  <div style={S.inputGroup}>
    <label style={S.label}>{icon}&nbsp;{label}{hint && <span style={S.hint}> · {hint}</span>}</label>
    <input
      type="number" name={name} value={value}
      onChange={onChange} onBlur={onBlur}
      step={step} min={min} max={max} style={S.input}
      onFocus={e => (e.target.style.borderColor = "#00f5d4")}
    />
  </div>
);

const HowItWorksCard = ({ icon, title, desc }) => (
  <div style={S.howCard}>
    <div style={S.howIcon}>{icon}</div>
    <h3 style={S.howTitle}>{title}</h3>
    <p style={S.howDesc}>{desc}</p>
  </div>
);

// ── Main App ──────────────────────────────────────────────────────────────

export default function App() {
  const [selectedArea, setSelectedArea] = useState(DEFAULT_AREA);
  const [form, setForm]                 = useState(buildForm(DEFAULT_AREA));
  const [result, setResult]             = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [rawFields, setRawFields]       = useState({});

  // State & City are manually typeable but don't affect the model
  const [state, setState] = useState("Haryana");
  const [city, setCity]   = useState("Gurugram");

  const handleAreaChange = (e) => {
    const area = AREA_DATA.find(a => a.label === e.target.value);
    if (area) {
      setSelectedArea(area);
      setForm(prev => ({
        ...prev,
        postal_code: area.postalCode,
        lattitude: area.lat,
        longitude: area.lng,
        distance_from_airport: area.airport,
      }));
    }
  };

  // Fix leading zero — store raw while typing, parse on blur
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRawFields(prev => ({ ...prev, [name]: value }));
    setForm(prev => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const parsed = parseFloat(value) || 0;
    setForm(prev => ({ ...prev, [name]: parsed }));
    setRawFields(prev => ({ ...prev, [name]: undefined }));
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
  };

  const getVal = (name) =>
    rawFields[name] !== undefined ? rawFields[name] : form[name];

  const handleSubmit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Prediction failed. Please check your inputs.");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedArea(DEFAULT_AREA);
    setForm(buildForm(DEFAULT_AREA));
    setState("Haryana");
    setCity("Gurugram");
    setRawFields({});
    setResult(null);
    setError(null);
  };

  const priceDisplay = result ? formatPrice(result.predicted_price) : null;

  return (
    <div style={S.page}>
      <div style={S.blob1} /><div style={S.blob2} /><div style={S.blob3} />
      <div style={S.container}>

        {/* HEADER */}
        <div style={S.header}>
          <div style={S.headerIcon}><Home size={26} color="#00f5d4" /></div>
          <div>
            <h1 style={S.title}>House Price Predictor</h1>
            <p style={S.subtitle}>Gurugram, Haryana &nbsp;·&nbsp; Powered by Random Forest ML</p>
          </div>
        </div>

        {/* LOCATION CARD */}
        <div style={S.card}>
          <SectionTitle icon={<MapPin size={15} color="#00f5d4" />} text="Location" />

          <div style={S.threeCol}>
            {/* State — manually typeable */}
            <div style={S.inputGroup}>
              <label style={S.label}>State</label>
              <input
                value={state}
                onChange={e => setState(e.target.value)}
                style={S.input}
                placeholder="e.g. Haryana"
                onFocus={e => (e.target.style.borderColor = "#00f5d4")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            {/* City — manually typeable */}
            <div style={S.inputGroup}>
              <label style={S.label}>City</label>
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                style={S.input}
                placeholder="e.g. Gurugram"
                onFocus={e => (e.target.style.borderColor = "#00f5d4")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            {/* Area — dropdown */}
            <div style={S.inputGroup}>
              <label style={S.label}>
                <MapPin size={12} style={{ marginRight: 4, color: "#00f5d4" }} />Area / Sector
              </label>
              <select value={selectedArea.label} onChange={handleAreaChange} style={S.select}>
                {AREA_DATA.map(a => <option key={a.label} value={a.label}>{a.label}</option>)}
              </select>
            </div>
          </div>

          {/* Auto-filled read-only chips */}
          <div style={S.chipRow}>
            <Chip label={`📮 Postal: ${form.postal_code}`} />
            <Chip label={`🌐 Lat: ${form.lattitude}`} />
            <Chip label={`🌐 Lng: ${form.longitude}`} />
            <Chip label={`✈️ Airport: ${form.distance_from_airport} km`} />
          </div>
        </div>

        {/* PROPERTY DETAILS CARD */}
        <div style={S.card}>
          <SectionTitle icon={<Home size={15} color="#00f5d4" />} text="Property Details" />
          <div style={S.grid}>

            <NumberInput label="Living Area"  icon={<Layers   size={13} color="#00f5d4" />}
              name="living_area"         value={getVal("living_area")}         onChange={handleChange} onBlur={handleBlur} min={100}            hint="sq ft" />
            <NumberInput label="Lot Area"     icon={<Layers   size={13} color="#00f5d4" />}
              name="lot_area"            value={getVal("lot_area")}            onChange={handleChange} onBlur={handleBlur} min={100}            hint="sq ft" />
            <NumberInput label="Bedrooms"     icon={<Home     size={13} color="#00f5d4" />}
              name="number_of_bedrooms"  value={getVal("number_of_bedrooms")}  onChange={handleChange} onBlur={handleBlur} min={1}   max={20}              />
            <NumberInput label="Bathrooms"    icon={<Droplets size={13} color="#00f5d4" />}
              name="number_of_bathrooms" value={getVal("number_of_bathrooms")} onChange={handleChange} onBlur={handleBlur} min={1}   max={10}  step={1} />
            <NumberInput label="Floors"       icon={<Layers   size={13} color="#00f5d4" />}
              name="number_of_floors"    value={getVal("number_of_floors")}    onChange={handleChange} onBlur={handleBlur} min={1}   max={5}   step={1}  />
            <NumberInput label="Built Year"   icon={<Activity size={13} color="#00f5d4" />}
              name="built_year"          value={getVal("built_year")}          onChange={handleChange} onBlur={handleBlur} min={1800} max={2026}            />

            {/* Grade — Average to Mansion only */}
            <div style={S.inputGroup}>
              <label style={S.label}><Star size={13} color="#00f5d4" />&nbsp;Grade of House</label>
              <select name="grade_of_the_house" value={form.grade_of_the_house} onChange={handleChange} style={S.select}>
                {GRADE_OPTIONS.map(([v, l]) => (
                  <option key={v} value={v}>{v} — {l}</option>
                ))}
              </select>
            </div>

            {/* Waterfront */}
            <div style={S.inputGroup}>
              <label style={S.label}><Waves size={13} color="#00f5d4" />&nbsp;Waterfront</label>
              <select name="waterfront_present" value={form.waterfront_present} onChange={handleChange} style={S.select}>
                <option value={0}>No Waterfront</option>
                <option value={1}>Waterfront Present ✅</option>
              </select>
            </div>

          </div>
        </div>

        {/* BUTTONS */}
        <div style={S.buttonRow}>
          <button style={S.resetBtn} onClick={handleReset}>
            <RefreshCw size={15} style={{ marginRight: 7 }} />Reset
          </button>
          <button
            style={{ ...S.predictBtn, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit} disabled={loading}
          >
            {loading
              ? "⏳  Predicting..."
              : <><span style={{ fontSize: 17, marginRight: 6, fontWeight: 800 }}>₹</span>Predict Price</>}
          </button>
        </div>

        {/* ERROR */}
        {error && <div style={S.errorBox}>⚠️ {error}</div>}

        {/* RESULT */}
        {result && priceDisplay && (
          <div style={S.resultCard}>
            <div style={S.resultLabel}>ESTIMATED PROPERTY VALUE</div>
            <div style={S.resultPrice}>{priceDisplay.main}</div>
            {priceDisplay.sub && <div style={S.resultSub}>{priceDisplay.sub}</div>}
            <div style={S.resultMeta}>
              <span style={S.metaBadge}>🤖 {result.model_used}</span>
              <span style={S.metaBadge}>📊 R² = {result.model_r2}</span>
              <span style={S.metaBadge}>📍 {selectedArea.label}, Gurugram</span>
            </div>
          </div>
        )}

        {/* HOW IT WORKS */}
        <div style={S.howSection}>
          <h2 style={S.howHeading}>How It <span style={{ color: "#00f5d4" }}>Works</span></h2>
          <p style={S.howSubheading}>Our prediction model uses machine learning to estimate property prices</p>
          <div style={S.howGrid}>
            <HowItWorksCard icon={<BarChart2 size={22} color="#00f5d4" />}
              title="Real Market Data"
              desc="Trained on 14,620 Gurugram property transactions to ensure accurate, market-aligned predictions." />
            <HowItWorksCard icon={<GitBranch size={22} color="#00f5d4" />}
              title="ML-Powered"
              desc="Uses a Random Forest model with 200 decision trees for robust, high-accuracy property price predictions." />
            <HowItWorksCard icon={<MapPin size={22} color="#00f5d4" />}
              title="39+ Locations"
              desc="Covers all major sectors, phases and localities across Gurugram city with location-specific accuracy." />
            <HowItWorksCard icon={<Shield size={22} color="#00f5d4" />}
              title="86.78% Accuracy"
              desc="Achieved R² of 0.8678 and RMSE of ₹1.36 Lakh, validated on 2,924 unseen properties." />
          </div>
        </div>

        <p style={S.footer}>Built with React · FastAPI · scikit-learn · Random Forest &nbsp;|&nbsp; Gurugram Real Estate Predictor</p>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const S = {
  page:         { minHeight: "100vh", background: "#050714", fontFamily: "'Segoe UI', sans-serif", color: "#fff", position: "relative", overflow: "hidden", paddingBottom: 60 },
  blob1:        { position: "fixed", top: "-20%",    left: "-10%",  width: 500, height: 500, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(0,245,212,0.12) 0%, transparent 70%)" },
  blob2:        { position: "fixed", top: "40%",     right: "-15%", width: 600, height: 600, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)" },
  blob3:        { position: "fixed", bottom: "-10%", left: "30%",   width: 400, height: 400, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(0,150,255,0.08) 0%, transparent 70%)" },
  container:    { maxWidth: 900, margin: "0 auto", padding: "40px 20px", position: "relative", zIndex: 1 },
  header:       { display: "flex", alignItems: "center", gap: 16, marginBottom: 32 },
  headerIcon:   { width: 56, height: 56, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,245,212,0.1)", border: "1px solid rgba(0,245,212,0.3)" },
  title:        { margin: 0, fontSize: 28, fontWeight: 700, background: "linear-gradient(135deg, #00f5d4, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subtitle:     { margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 },
  card:         { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "24px 28px", marginBottom: 20, backdropFilter: "blur(12px)" },
  threeCol:     { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 },
  chipRow:      { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 },
  grid:         { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 },
  inputGroup:   { display: "flex", flexDirection: "column", gap: 6 },
  label:        { fontSize: 12, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 4 },
  hint:         { color: "rgba(255,255,255,0.25)", fontSize: 11 },
  input:        { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color 0.2s" },
  select:       { background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", cursor: "pointer" },
  buttonRow:    { display: "flex", gap: 12, justifyContent: "flex-end", marginBottom: 20 },
  resetBtn:     { display: "flex", alignItems: "center", cursor: "pointer", fontWeight: 500, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 24px", color: "rgba(255,255,255,0.55)", fontSize: 14 },
  predictBtn:   { display: "flex", alignItems: "center", cursor: "pointer", fontWeight: 700, fontSize: 15, background: "linear-gradient(135deg, #00f5d4, #7c3aed)", border: "none", borderRadius: 12, padding: "12px 32px", color: "#fff", transition: "opacity 0.2s", boxShadow: "0 0 30px rgba(0,245,212,0.2)" },
  errorBox:     { background: "rgba(255,50,50,0.08)", border: "1px solid rgba(255,50,50,0.25)", borderRadius: 12, padding: "14px 20px", color: "#ff6b6b", marginBottom: 20, fontSize: 14 },
  resultCard:   { background: "rgba(0,245,212,0.04)", border: "1px solid rgba(0,245,212,0.18)", borderRadius: 20, padding: "36px 32px", textAlign: "center", marginBottom: 32, boxShadow: "0 0 60px rgba(0,245,212,0.07)" },
  resultLabel:  { fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 },
  resultPrice:  { fontSize: 52, fontWeight: 800, marginBottom: 8, background: "linear-gradient(135deg, #00f5d4, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  resultSub:    { fontSize: 16, color: "rgba(255,255,255,0.35)", marginBottom: 20 },
  resultMeta:   { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" },
  metaBadge:    { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,0.55)" },
  howSection:   { marginTop: 12 },
  howHeading:   { textAlign: "center", fontSize: 26, fontWeight: 700, margin: "0 0 10px 0" },
  howSubheading:{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 14, marginBottom: 28 },
  howGrid:      { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 16 },
  howCard:      { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px 20px", backdropFilter: "blur(10px)" },
  howIcon:      { width: 44, height: 44, borderRadius: 12, marginBottom: 14, background: "rgba(0,245,212,0.08)", border: "1px solid rgba(0,245,212,0.15)", display: "flex", alignItems: "center", justifyContent: "center" },
  howTitle:     { margin: "0 0 8px 0", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)" },
  howDesc:      { margin: 0, fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 },
  footer:       { textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.15)", marginTop: 32 },
};
