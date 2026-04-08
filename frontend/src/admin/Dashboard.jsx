import { useState, useEffect } from "react";
import { getProduct } from "../api/productAPI";
import { getBrand } from "../api/brandAPI";
import { getCategory } from "../api/categoryAPI";
import { getStaff } from "../api/staffAPI";
import { getAccounts } from "../api/accountAPI";
import "./CSS/dashboard.css";

/* ─────────────────────────────────────────
   Hook: đếm số từ 0 → target (easeOutCubic)
───────────────────────────────────────── */
function useCountUp(target, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let raf;
    const start = performance.now();
    const run = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

/* ─────────────────────────────────────────
   Component: Mini Sparkline SVG
───────────────────────────────────────── */
function Sparkline({ data = [], color = "#7c3aed", width = 80, height = 36 }) {
  if (data.length < 2) return <div style={{ width, height }} />;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pad = 3;
  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (width - pad * 2),
    pad + (height - pad * 2) - ((v - min) / range) * (height - pad * 2),
  ]);
  const line = pts.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${pts[0][0]},${height} ${line} ${pts.at(-1)[0]},${height}`;
  const id = `spk${color.replace("#", "")}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} overflow="visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Component: Big Line Chart SVG
───────────────────────────────────────── */
function LineChart({ data = [], labels = [], color = "#7c3aed" }) {
  const W = 560, H = 200, pL = 44, pR = 16, pT = 20, pB = 36;
  const cW = W - pL - pR, cH = H - pT - pB;
  const max = Math.max(...data) * 1.15, range = max;
  const pts = data.map((v, i) => [
    pL + (i / (data.length - 1)) * cW,
    pT + cH - (v / range) * cH,
  ]);
  // Smooth bezier curve
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const cx = (pts[i - 1][0] + pts[i][0]) / 2;
    d += ` C ${cx},${pts[i-1][1]} ${cx},${pts[i][1]} ${pts[i][0]},${pts[i][1]}`;
  }
  const area = `${d} L ${pts.at(-1)[0]},${pT+cH} L ${pts[0][0]},${pT+cH} Z`;
  const gridRows = [0, 0.25, 0.5, 0.75, 1];
  const maxI = data.indexOf(Math.max(...data));
  const [hx, hy] = pts[maxI];
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Grid */}
      {gridRows.map((t, i) => {
        const y = pT + cH - t * cH;
        return (
          <g key={i}>
            <line x1={pL} y1={y} x2={W-pR} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
            <text x={pL-6} y={y+4} fontSize="9" fill="#9ca3af" textAnchor="end">
              {Math.round(t * Math.max(...data))}
            </text>
          </g>
        );
      })}

      {/* X labels */}
      {labels.map((lbl, i) => (
        <text key={i} x={pL+(i/(labels.length-1))*cW} y={H-8}
          fontSize="9" fill="#9ca3af" textAnchor="middle">{lbl}</text>
      ))}

      {/* Area + Line */}
      <path d={area} fill="url(#lineGrad)" />
      <path d={d} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" className="chart-line" />

      {/* Highlight tooltip */}
      <line x1={hx} y1={pT} x2={hx} y2={pT+cH} stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 3" />
      <circle cx={hx} cy={hy} r="5" fill="white" stroke={color} strokeWidth="2.5" filter="url(#glow)" />
      <rect x={hx-30} y={hy-34} width="60" height="22" rx="6" fill="#1e1b4b" />
      <text x={hx} y={hy-20} fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">
        ↑ {Math.max(...data)} SP
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────
   Component: Donut Chart SVG
───────────────────────────────────────── */
function DonutChart({ segments, total }) {
  const cx = 85, cy = 85, R = 68, r = 42;
  const sum = segments.reduce((s, x) => s + x.value, 0) || 1;
  let angle = -Math.PI / 2;
  const arcs = segments.map((seg) => {
    const sweep = (seg.value / sum) * 2 * Math.PI;
    const end = angle + sweep;
    const large = sweep > Math.PI ? 1 : 0;
    const x1 = cx + R * Math.cos(angle),   y1 = cy + R * Math.sin(angle);
    const x2 = cx + R * Math.cos(end),     y2 = cy + R * Math.sin(end);
    const ix1 = cx + r * Math.cos(end),    iy1 = cy + r * Math.sin(end);
    const ix2 = cx + r * Math.cos(angle),  iy2 = cy + r * Math.sin(angle);
    const d = `M${x1},${y1} A${R},${R} 0 ${large} 1 ${x2},${y2} L${ix1},${iy1} A${r},${r} 0 ${large} 0 ${ix2},${iy2}Z`;
    angle = end;
    return { ...seg, d };
  });
  return (
    <svg width="170" height="170" viewBox="0 0 170 170">
      {arcs.map((arc, i) => (
        <path key={i} d={arc.d} fill={arc.color} className="donut-seg"
          style={{ animationDelay: `${i * 0.08}s` }}>
          <title>{arc.name}: {arc.value}</title>
        </path>
      ))}
      <circle cx={cx} cy={cy} r={r - 4} fill="white" />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="16" fill="#111827" fontWeight="800">
        {total}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#9ca3af">Tổng SP</text>
    </svg>
  );
}

/* ─────────────────────────────────────────
   Component: Progress Ring
───────────────────────────────────────── */
function Ring({ pct, color, size = 58, stroke = 6 }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        className="ring-fill" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   MAIN DASHBOARD COMPONENT
───────────────────────────────────────── */
export default function AdminDashboard() {
  const [products,   setProducts]   = useState([]);
  const [brands,     setBrands]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [staffs,     setStaffs]     = useState([]);
  const [accounts,   setAccounts]   = useState([]);
  const [loaded,     setLoaded]     = useState(false);

  useEffect(() => {
    Promise.all([
      getProduct().catch(() => []),
      getBrand().catch(() => []),
      getCategory().catch(() => []),
      getStaff().catch(() => []),
      getAccounts().catch(() => []),
    ]).then(([p, b, c, s, acc]) => {
      setProducts(Array.isArray(p) ? p : []);
      setBrands(Array.isArray(b) ? b : []);
      setCategories(Array.isArray(c) ? c : []);
      setStaffs(Array.isArray(s) ? s : []);
      setAccounts(Array.isArray(acc) ? acc : []);
      setLoaded(true);
    });
  }, []);

  // Animated counters
  const cProduct  = useCountUp(products.length,   1200);
  const cBrand    = useCountUp(brands.length,     1400);
  const cCategory = useCountUp(categories.length, 1500);
  const cStaff    = useCountUp(staffs.length,     1600);
  const cAccount  = useCountUp(accounts.length,   1700);

  // KPI: tổng giá trị kho (triệu đồng)
  const totalStock = products.reduce((s, p) => s + (p.soLuong || 0), 0);
  const totalValue = products.reduce((s, p) => s + (p.soLuong || 0) * (p.donGia || 0), 0);
  const cStock = useCountUp(totalStock, 1800);
  const cValue = useCountUp(Math.round(totalValue / 1_000_000), 2000);

  // Mock weekly chart data
  const weeklyData   = [28, 45, 38, 62, 55, 78, 91, 67, 105, 84, 118, 96];
  const weeklyLabels = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];
  const sparkA = [30, 45, 38, 60, 55, 70, 65];
  const sparkB = [50, 40, 55, 45, 65, 58, 72];
  const sparkC = [20, 35, 28, 40, 38, 55, 48];

  // Donut segments (top 5 categories or mock)
  const catColors = ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  let donutSegs = categories.slice(0, 5).map((cat, i) => ({
    name:  cat.tenDanhMuc || cat.name || `DM ${i+1}`,
    value: Math.max(1, products.filter(p => p.maDanhMuc === cat.maDanhMuc).length || (5 - i) * 4),
    color: catColors[i],
  }));
  if (donutSegs.length === 0) {
    donutSegs = [
      { name: "Laptop",    value: 35, color: "#7c3aed" },
      { name: "PC",        value: 25, color: "#3b82f6" },
      { name: "CPU & RAM", value: 18, color: "#10b981" },
      { name: "Màn hình",  value: 12, color: "#f59e0b" },
      { name: "Phụ kiện",  value: 10, color: "#ef4444" },
    ];
  }

  // Top 3 brands for dark cards
  const topBrandData = [
    { icon: "💻", label: brands[0]?.tenBrand || "Laptop", sub: "Top thương hiệu", value: `${brands.length}`, unit: "/ thương hiệu", bg: "#7c3aed" },
    { icon: "🏷️", label: categories[0]?.tenDanhMuc || "Danh mục", sub: "Phân loại SP",   value: `${categories.length}`, unit: "/ danh mục",   bg: "#3b82f6" },
    { icon: "👤", label: "Nhân viên",  sub: "Đang làm việc",   value: `${staffs.length}`,    unit: "/ nhân sự",   bg: "#10b981" },
  ];

  // Stats rows
  const statsRows = [
    { label: "Tổng sản phẩm",  pct: Math.min(100, Math.round(products.length  / 2)),  color: "#7c3aed", val: cProduct  },
    { label: "Tài khoản",      pct: Math.min(100, Math.round(accounts.length  / 1.5)), color: "#3b82f6", val: cAccount  },
    { label: "Tồn kho (chiếc)",pct: Math.min(100, Math.round(totalStock / 5)),         color: "#10b981", val: cStock    },
  ];

  if (!loaded) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 320 }}>
      <div className="spinner-border text-primary me-3" />
      <span className="text-muted">Đang tải dữ liệu...</span>
    </div>
  );

  return (
    <div className="dashboard-wrapper">

      {/* ══════════ ROW 1 – STAT CARDS ══════════ */}
      <div className="row g-3 mb-3">

        {/* Big featured card */}
        <div className="col-12 col-md-5 col-xl-4">
          <div className="stat-card featured delay-1" style={{ minHeight: 160 }}>
            <div className="stat-label">Giá Trị Kho Hàng</div>
            <div className="d-flex align-items-end gap-3 mt-2">
              <div className="stat-number">{cValue.toLocaleString()}<span style={{ fontSize: "1rem", fontWeight: 500 }}>M</span></div>
              <span className="badge-up">↑ VNĐ</span>
            </div>
            <div className="stat-sub mt-1">{cStock.toLocaleString()} sản phẩm · {products.length} loại</div>
            <div className="mt-3">
              <Sparkline data={weeklyData} color="#a78bfa" width={220} height={48} />
            </div>
          </div>
        </div>

        {/* 3 small cards */}
        <div className="col-6 col-md col-xl">
          <div className="stat-card delay-2">
            <div className="stat-label">Sản Phẩm</div>
            <div className="d-flex align-items-center justify-content-between mt-1">
              <div className="stat-number text-primary">{cProduct}</div>
              <Sparkline data={sparkA} color="#3b82f6" />
            </div>
            <div className="d-flex align-items-center mt-2 gap-2">
              <span className="badge-up">↑ 12%</span>
              <span className="stat-sub">so tháng trước</span>
            </div>
          </div>
        </div>

        <div className="col-6 col-md col-xl">
          <div className="stat-card delay-3">
            <div className="stat-label">Thương Hiệu</div>
            <div className="d-flex align-items-center justify-content-between mt-1">
              <div className="stat-number text-success">{cBrand}</div>
              <Sparkline data={sparkB} color="#10b981" />
            </div>
            <div className="d-flex align-items-center mt-2 gap-2">
              <span className="badge-up">↑ 5%</span>
              <span className="stat-sub">thương hiệu mới</span>
            </div>
          </div>
        </div>

        <div className="col-6 col-md col-xl">
          <div className="stat-card delay-4">
            <div className="stat-label">Tài Khoản</div>
            <div className="d-flex align-items-center justify-content-between mt-1">
              <div className="stat-number text-warning">{cAccount}</div>
              <Sparkline data={sparkC} color="#f59e0b" />
            </div>
            <div className="d-flex align-items-center mt-2 gap-2">
              <span className="badge-up red">↓ 2%</span>
              <span className="stat-sub">người dùng</span>
            </div>
          </div>
        </div>

        <div className="col-6 col-md col-xl">
          <div className="stat-card delay-5">
            <div className="stat-label">Nhân Viên</div>
            <div className="d-flex align-items-center justify-content-between mt-1">
              <div className="stat-number text-danger">{cStaff}</div>
              <Sparkline data={[40,38,42,39,44,46,43]} color="#ef4444" />
            </div>
            <div className="d-flex align-items-center mt-2 gap-2">
              <span className="badge-up">↑ 8%</span>
              <span className="stat-sub">nhân sự</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ ROW 2 – CHARTS ══════════ */}
      <div className="row g-3 mb-3">

        {/* Big line chart */}
        <div className="col-12 col-xl-8">
          <div className="chart-card delay-4" style={{ height: "100%" }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <div className="card-title">📈 Tổng Quan Nhập Hàng</div>
                <div className="card-sub">Số lượng sản phẩm nhập theo kỳ (mock data)</div>
              </div>
              <select className="form-select form-select-sm" style={{ width: "auto" }}>
                <option>12 tháng qua</option>
                <option>Quý này</option>
                <option>Năm nay</option>
              </select>
            </div>
            <LineChart data={weeklyData} labels={weeklyLabels} color="#7c3aed" />
          </div>
        </div>

        {/* Donut chart */}
        <div className="col-12 col-xl-4">
          <div className="chart-card delay-5" style={{ height: "100%" }}>
            <div className="card-title mb-1">🗂️ Phân Bố Danh Mục</div>
            <div className="card-sub mb-3">Sản phẩm theo từng danh mục</div>
            <div className="d-flex justify-content-center mb-3">
              <DonutChart segments={donutSegs} total={cCategory} />
            </div>
            {/* Legend */}
            <div className="d-flex flex-column gap-1 px-1">
              {donutSegs.map((seg, i) => (
                <div key={i} className="d-flex align-items-center gap-2">
                  <span className="legend-dot" style={{ background: seg.color }} />
                  <span style={{ fontSize: "0.75rem", color: "#374151", flex: 1 }}>{seg.name}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#111827" }}>{seg.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ ROW 3 – TOP CARDS + STATISTICS ══════════ */}
      <div className="row g-3">

        {/* Top 3 dark session cards */}
        <div className="col-12 col-xl-7">
          <div className="chart-card delay-6" style={{ height: "100%" }}>
            <div className="card-title mb-3">🏆 Tổng Quan Hệ Thống</div>
            <div className="row g-3">
              {topBrandData.map((item, i) => (
                <div key={i} className={`col-12 col-sm-4 delay-${i + 6}`}>
                  <div className="session-card">
                    <div className="session-icon" style={{ background: `${item.bg}22` }}>
                      {item.icon}
                    </div>
                    <div className="session-value">{item.value}<span style={{ fontSize: "0.9rem", fontWeight: 500 }}>+</span></div>
                    <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{item.label}</div>
                    <div className="session-sub">{item.unit}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini summary bar */}
            <div className="mt-4 p-3 rounded-3" style={{ background: "#f9fafb" }}>
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Tỷ lệ tồn kho còn nhiều</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#7c3aed" }}>
                  {products.length ? Math.round(products.filter(p => (p.soLuong || 0) > 20).length / products.length * 100) : 0}%
                </span>
              </div>
              <div className="progress" style={{ height: 6, borderRadius: 8 }}>
                <div className="progress-bar"
                  style={{
                    width: `${products.length ? Math.round(products.filter(p => (p.soLuong || 0) > 20).length / products.length * 100) : 0}%`,
                    background: "linear-gradient(90deg, #7c3aed, #3b82f6)",
                    transition: "width 1.5s ease",
                    borderRadius: 8,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics with rings */}
        <div className="col-12 col-xl-5">
          <div className="chart-card delay-7" style={{ height: "100%" }}>
            <div className="card-title mb-3">📊 Thống Kê Chi Tiết</div>
            {statsRows.map((row, i) => (
              <div key={i} className={`stat-row delay-${i + 7}`}>
                <Ring pct={row.pct} color={row.color} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="stat-row-label">{row.label}</div>
                  <div style={{ fontSize: "0.68rem", color: "#9ca3af" }}>Max {row.pct * 2}</div>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <div className="stat-row-value">{row.val.toLocaleString()}</div>
                  <div style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{row.pct}% đã cập nhật</div>
                </div>
              </div>
            ))}

            {/* Average value */}
            <div className="mt-3 p-3 rounded-3 d-flex align-items-center justify-content-between"
              style={{ background: "linear-gradient(135deg, #ede9fe, #dbeafe)" }}>
              <div>
                <div style={{ fontSize: "0.72rem", color: "#5b21b6", fontWeight: 600 }}>Giá Trị Trung Bình / SP</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#3730a3", lineHeight: 1.2 }}>
                  {products.length
                    ? `${(totalValue / products.length / 1_000_000).toFixed(1)}M`
                    : "—"}
                </div>
              </div>
              <Sparkline data={weeklyData.slice(-7)} color="#7c3aed" width={90} height={44} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}