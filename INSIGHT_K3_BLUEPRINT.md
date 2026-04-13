# INSIGHT-K3 Platform — Blueprint Pengembangan v2.0
**Intelligent Safety & Health Integrated Governance Tool**  
PLN Nusantara Power — UP Tenayan, Pekanbaru, Riau

---

> **Dokumen ini adalah panduan pengembangan bertahap** dari aplikasi Audit SMK3 (v1.0) menuju platform manajemen risiko K3 terpadu (v2.0) yang mencakup ERM Risk Register, Underwriting Survey, Risk Survey Lapangan, Kesiapan Peralatan Tanggap Darurat, dan Risk Heatmap.

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Status Aplikasi Saat Ini (v1.0)](#2-status-aplikasi-saat-ini-v10)
3. [Visi Platform v2.0](#3-visi-platform-v20)
4. [Arsitektur Sistem](#4-arsitektur-sistem)
5. [Modul Pengembangan Baru](#5-modul-pengembangan-baru)
   - [Modul A — ERM Risk Register K3](#modul-a--erm-risk-register-k3)
   - [Modul B — Underwriting Survey Digital](#modul-b--underwriting-survey-digital)
   - [Modul C — Risk Survey Lapangan](#modul-c--risk-survey-lapangan)
   - [Modul D — Kesiapan Peralatan Tanggap Darurat](#modul-d--kesiapan-peralatan-tanggap-darurat)
   - [Modul E — Risk Heatmap & Analytics Dashboard](#modul-e--risk-heatmap--analytics-dashboard)
6. [Integrasi Antar Modul](#6-integrasi-antar-modul)
7. [Skema Database](#7-skema-database)
8. [API Endpoints Baru](#8-api-endpoints-baru)
9. [UI/UX Frontend Baru](#9-uiux-frontend-baru)
10. [Roadmap & Milestone](#10-roadmap--milestone)
11. [Tech Stack & Dependencies Tambahan](#11-tech-stack--dependencies-tambahan)
12. [Standar Referensi & Regulasi](#12-standar-referensi--regulasi)

---

## 1. Ringkasan Eksekutif

### Latar Belakang

INSIGHT-K3 v1.0 telah berhasil diimplementasikan di UP Tenayan pada 26 Mei 2025 dan mencapai skor audit SMK3 **88% (Kategori GOLD)**. Aplikasi ini membuktikan bahwa pendekatan berbasis AI untuk audit K3 terbukti efektif meningkatkan kepatuhan regulasi, efisiensi waktu, dan akuntabilitas.

Namun, audit SMK3 hanyalah satu dimensi dari pengelolaan risiko K3 di unit pembangkit. Sebuah unit PLTU skala besar seperti UP Tenayan beroperasi dalam lingkungan risiko yang kompleks — mulai dari risiko operasional mesin berat, bahan kimia berbahaya, potensi kebakaran dan ledakan, hingga keselamatan personil di lapangan. Pengelolaan risiko ini membutuhkan pendekatan yang jauh lebih komprehensif.

### Tujuan Pengembangan v2.0

| # | Tujuan | Outcome yang Diharapkan |
|---|--------|------------------------|
| 1 | Membangun ERM Risk Register K3 digital | Seluruh risiko K3 unit terdokumentasi, terrating, dan dapat dipantau real-time |
| 2 | Digitalisasi Underwriting Survey | Proses survey asuransi lebih cepat, akurat, dan terstandar |
| 3 | Sistem Risk Survey Lapangan mobile-friendly | Temuan lapangan masuk ke sistem dalam hitungan menit, bukan hari |
| 4 | Inventory & mapping kesiapan alat tanggap darurat | Tidak ada lagi APAR expired atau alat hilang yang tidak terdeteksi |
| 5 | Risk Heatmap visual untuk manajemen | Manajemen dapat membuat keputusan berbasis data visual, bukan laporan teks panjang |

---

## 2. Status Aplikasi Saat Ini (v1.0)

### Fitur yang Sudah Ada dan Berfungsi

```
INSIGHT-K3 v1.0
├── Backend (FastAPI + Python 3.11)
│   ├── Authentication (JWT, role: admin/auditor/auditee)
│   ├── Criteria Management (12 kriteria SMK3)
│   ├── Clauses Management (166 klausul PP 50/2012)
│   ├── Document Upload & Storage (GridFS MongoDB)
│   ├── AI Analysis (Google Gemini via Emergent Integrations)
│   ├── Auditor Assessment (Confirm / NC-Minor / NC-Major)
│   ├── Recommendations Management
│   ├── Dashboard & Statistics
│   ├── PDF Report Generation (ReportLab)
│   └── ZIP Evidence Download
│
├── Frontend (React 18 + Tailwind CSS + Shadcn UI)
│   ├── AuthPage — Login & Register
│   ├── DashboardPage — Statistik & Progress Audit
│   ├── CriteriaPage — Kelola 12 Kriteria
│   ├── ClausesPage — Kelola 166 Klausul + Knowledge Base
│   ├── AuditPage — Upload Evidence + AI Analysis + Penilaian Auditor
│   ├── RecommendationsPage — Tracking Rekomendasi
│   └── ReportsPage — Generate PDF
│
└── Database (MongoDB)
    ├── Collection: users
    ├── Collection: criteria
    ├── Collection: clauses
    ├── Collection: documents (metadata)
    ├── Collection: audit_results
    ├── Collection: recommendations
    └── GridFS: fs.files + fs.chunks (file storage)
```

### Keterbatasan v1.0

- Hanya mencakup audit SMK3, belum mencakup manajemen risiko operasional secara keseluruhan
- Tidak ada pencatatan risiko di luar konteks klausul SMK3
- Tidak ada inventory peralatan tanggap darurat
- Tidak ada fitur survey lapangan mobile
- Tidak ada visualisasi spasial / peta risiko
- Tidak ada modul untuk kebutuhan underwriting asuransi

---

## 3. Visi Platform v2.0

```
┌─────────────────────────────────────────────────────────────────┐
│                   INSIGHT-K3 Platform v2.0                      │
│         Integrated K3 Risk Governance for Power Plant           │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│ Audit SMK3   │  ERM Risk    │ Underwriting │  Risk Survey      │
│ (existing)   │  Register    │  Survey      │  Lapangan         │
│              │  (NEW)       │  (NEW)       │  (NEW)            │
├──────────────┴──────────────┴──────────────┴───────────────────┤
│            Kesiapan Peralatan Tanggap Darurat (NEW)             │
├─────────────────────────────────────────────────────────────────┤
│              Risk Heatmap & Analytics Dashboard (NEW)           │
├─────────────────────────────────────────────────────────────────┤
│          AI Engine (Gemini · OCR · Risk Scoring · NLP)         │
├─────────────────────────────────────────────────────────────────┤
│     MongoDB · GridFS · FastAPI · React · Tailwind CSS           │
└─────────────────────────────────────────────────────────────────┘
```

### Prinsip Desain Platform

1. **Interkoneksi Data** — Setiap modul saling terhubung; temuan di satu modul mempengaruhi status di modul lain secara otomatis
2. **Mobile-First untuk Lapangan** — Modul survey dan inspeksi harus bisa digunakan dari smartphone di lapangan, termasuk dalam kondisi jaringan terbatas
3. **AI-Assisted, Human-Decided** — AI membantu analisis dan scoring awal, tapi keputusan akhir tetap di tangan personil yang berwenang
4. **Compliance-Ready** — Semua output harus memenuhi standar pelaporan yang diminta regulator (PP 50/2012, Permenaker 26/2014) dan asuransi
5. **Audit Trail** — Setiap perubahan data tercatat dengan timestamp dan user ID untuk keperluan akuntabilitas

---

## 4. Arsitektur Sistem

### Struktur Folder yang Direkomendasikan

```
insight-k3-v2/
├── backend/
│   ├── server.py                          # Main FastAPI app (existing)
│   ├── routers/                           # NEW: Pisahkan router per modul
│   │   ├── __init__.py
│   │   ├── auth.py                        # Existing auth routes
│   │   ├── audit_smk3.py                  # Existing audit routes
│   │   ├── erm_risk.py                    # NEW: ERM Risk Register
│   │   ├── underwriting.py                # NEW: Underwriting Survey
│   │   ├── risk_survey.py                 # NEW: Risk Survey Lapangan
│   │   ├── emergency_equipment.py         # NEW: Peralatan Tanggap Darurat
│   │   └── heatmap.py                     # NEW: Risk Heatmap data
│   ├── models/                            # NEW: Pydantic models per modul
│   │   ├── __init__.py
│   │   ├── erm_models.py
│   │   ├── survey_models.py
│   │   ├── equipment_models.py
│   │   └── heatmap_models.py
│   ├── services/                          # NEW: Business logic layer
│   │   ├── __init__.py
│   │   ├── ai_service.py                  # AI integration (refactor dari server.py)
│   │   ├── risk_scoring.py                # Risk rating calculation
│   │   ├── notification_service.py        # Alert & notifikasi
│   │   └── report_service.py              # PDF generation (refactor)
│   ├── populate_all_166_clauses.py        # Existing
│   ├── add_remaining_61_clauses.py        # Existing
│   ├── requirements.txt                   # Updated
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AuthPage.js                # Existing
│   │   │   ├── DashboardPage.js           # Enhanced
│   │   │   ├── CriteriaPage.js            # Existing
│   │   │   ├── ClausesPage.js             # Existing
│   │   │   ├── AuditPage.js               # Existing
│   │   │   ├── RecommendationsPage.js     # Existing
│   │   │   ├── ReportsPage.js             # Enhanced
│   │   │   ├── ERMRiskPage.js             # NEW
│   │   │   ├── UnderwritingPage.js        # NEW
│   │   │   ├── RiskSurveyPage.js          # NEW
│   │   │   ├── EmergencyEquipmentPage.js  # NEW
│   │   │   └── HeatmapPage.js             # NEW
│   │   ├── components/
│   │   │   ├── Layout.js                  # Updated (menu baru)
│   │   │   ├── RiskMatrix.jsx             # NEW
│   │   │   ├── PlantMap.jsx               # NEW (SVG plant layout)
│   │   │   ├── EquipmentCard.jsx          # NEW
│   │   │   └── RiskBadge.jsx              # NEW
│   │   └── App.js                         # Updated (routes baru)
│   └── ...
│
└── docs/
    ├── BLUEPRINT.md                        # File ini
    ├── API_REFERENCE.md                    # Auto-generated dari FastAPI
    └── USER_MANUAL.md                      # Panduan pengguna
```

### Role & Permission Matrix

| Role | Audit SMK3 | ERM Risk | Underwriting | Risk Survey | Equipment | Heatmap |
|------|-----------|---------|--------------|-------------|-----------|---------|
| **super_admin** | Full | Full | Full | Full | Full | Full |
| **admin** | Full | Full | Read+Create | Full | Full | Full |
| **auditor_k3** | Full | Full | Read+Create | Read | Read | Read |
| **risk_officer** | Read | Full | Full | Full | Full | Full |
| **surveyor** | Read | Read | Create | Create | Create | Read |
| **auditee** | Read | Read | Read | Read | Create | Read |
| **management** | Read | Read | Read | Read | Read | Full |

> **Catatan**: Role `risk_officer` dan `surveyor` adalah role **baru** yang perlu ditambahkan di v2.0. Role existing (`admin`, `auditor`, `auditee`) tetap dipertahankan.

---

## 5. Modul Pengembangan Baru

---

### Modul A — ERM Risk Register K3

#### A.1 Deskripsi & Tujuan

ERM (Enterprise Risk Management) Risk Register adalah database terpusat semua risiko K3 yang teridentifikasi di unit. Setiap risiko dinilai menggunakan matriks **Likelihood × Impact** untuk menghasilkan **Risk Rating** (Very Low / Low / Medium / High / Critical).

Modul ini menjadi **backbone** dari seluruh platform — semua temuan dari modul lain (survey lapangan, audit SMK3, inspeksi alat) akan dikonsolidasi ke sini.

#### A.2 Kategori Risiko untuk PLTU Tenayan

```
Kategori Risiko K3 — PLTU Tenayan
├── 1. Risiko Kebakaran & Ledakan
│   ├── Coal dust explosion
│   ├── Fuel oil fire
│   ├── Hydrogen leak (generator cooling)
│   ├── Transformer oil fire
│   └── Cable fire
│
├── 2. Risiko Peralatan Bertekanan Tinggi
│   ├── Boiler explosion / tube burst
│   ├── Steam pipe rupture
│   ├── Pressure vessel failure
│   └── Turbine blade failure
│
├── 3. Risiko Listrik
│   ├── High voltage contact (>1kV)
│   ├── Arc flash
│   ├── Ground fault
│   └── Static discharge near flammable material
│
├── 4. Risiko Bahan Kimia Berbahaya (B3)
│   ├── Chemical spill / tumpahan
│   ├── Toxic gas release (NH3, H2S, CO)
│   ├── Fly ash exposure
│   ├── Bottom ash handling
│   └── Chemical mixing hazard
│
├── 5. Risiko Mekanik
│   ├── Crane / hoist failure
│   ├── Conveyor belt entanglement
│   ├── Rotating machinery contact
│   ├── Falling objects
│   └── Confined space hazard
│
├── 6. Risiko Ergonomi & Fisiologi
│   ├── Heat stress (boiler area)
│   ├── Noise-induced hearing loss
│   ├── Vibration exposure
│   ├── Manual handling injury
│   └── Fatigue (shift work)
│
├── 7. Risiko Lingkungan Kerja
│   ├── Dust exposure (coal area)
│   ├── Chemical vapor inhalation
│   ├── Radiation exposure (jika ada)
│   └── Poor lighting / visibility
│
└── 8. Risiko Kedaruratan
    ├── Natural disaster (banjir, gempa)
    ├── Civil unrest / intruder
    ├── Grid emergency / blackout
    └── Mass casualty event
```

#### A.3 Area / Lokasi PLTU Tenayan

Setiap risk item harus dikaitkan ke salah satu area berikut:

| Kode Area | Nama Area | Deskripsi |
|-----------|-----------|-----------|
| `BOILER` | Boiler House | Area boiler, drum, superheater, reheater |
| `TURBINE` | Turbine Hall | Area turbine, generator, exciter |
| `CONTROL` | Control Room | CCR, DCS room, relay room |
| `COAL` | Coal Handling | Coal yard, crusher, conveyor, bunker |
| `ASH` | Ash Handling | Fly ash silo, bottom ash pond |
| `CHEM` | Chemical Plant | Chemical storage, dosing system, water treatment |
| `ELEC` | Electrical Yard | Transformer yard, switchyard, GIS |
| `FUEL` | Fuel Oil System | HFO tank, pumping station |
| `COOLING` | Cooling System | Cooling tower, condenser, circulating pump |
| `UTIL` | Utility Area | Workshop, warehouse, office, kantin |
| `WATER` | Water Intake | Bendungan, intake pump, raw water treatment |
| `COMMON` | Common Area | Road, parking, fence, gate |

#### A.4 Matriks Risk Rating

```
Likelihood Scale:
  1 = Rare         (< 1x / 5 tahun)
  2 = Unlikely     (1x / 2-5 tahun)
  3 = Possible     (1x / tahun)
  4 = Likely       (1x / bulan)
  5 = Almost Certain (1x / minggu atau lebih)

Impact Scale:
  1 = Insignificant  (No injury, no property damage)
  2 = Minor          (First aid, minor damage < Rp 10jt)
  3 = Moderate       (Medical treatment, damage Rp 10-100jt)
  4 = Major          (Serious injury / LTI, damage Rp 100jt - 1M)
  5 = Catastrophic   (Fatality / permanent disability, damage > Rp 1M)

Risk Score = Likelihood × Impact
  1-4   = Very Low  (Hijau)
  5-9   = Low       (Kuning Muda)
  10-14 = Medium    (Kuning)
  15-19 = High      (Oranye)
  20-25 = Critical  (Merah)
```

#### A.5 Skema Data Risk Item

```python
# models/erm_models.py

class RiskItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    
    # Identifikasi
    risk_code: str               # Auto-generated: "RISK-BOILER-001"
    title: str                   # Judul risiko (singkat)
    description: str             # Deskripsi lengkap potensi bahaya
    area_code: str               # Kode area (lihat tabel di atas)
    risk_category: str           # Salah satu dari 8 kategori
    
    # Penilaian Risiko
    likelihood: int              # 1-5
    impact: int                  # 1-5
    risk_score: int              # Calculated: likelihood × impact
    risk_rating: str             # Very Low / Low / Medium / High / Critical
    
    # Pengendalian Risiko (Hierarki)
    control_elimination: Optional[str]    # Eliminasi sumber bahaya
    control_substitution: Optional[str]   # Substitusi bahan/metode
    control_engineering: Optional[str]    # Engineering control
    control_administrative: Optional[str] # Prosedur, izin kerja, pelatihan
    control_ppe: Optional[str]            # APD yang dipersyaratkan
    
    # Residual Risk (setelah pengendalian)
    residual_likelihood: int
    residual_impact: int
    residual_score: int
    residual_rating: str
    
    # Keterkaitan
    related_clause_ids: List[str]         # Link ke klausul SMK3 terkait
    related_survey_ids: List[str]         # Link ke temuan survey lapangan
    related_equipment_ids: List[str]      # Link ke alat tanggap darurat
    
    # Status & Tracking
    status: str                  # Active / Under Control / Closed
    pic_user_id: str             # Penanggung jawab
    target_date: Optional[str]   # Target tanggal pengendalian
    verified_by: Optional[str]   # User yang verifikasi
    verified_at: Optional[str]
    
    # Metadata
    created_by: str
    created_at: str
    updated_at: str
    last_review_at: Optional[str]
    review_frequency_days: int = 90   # Frekuensi review (default 90 hari)
    
    # AI Analysis
    ai_suggestion: Optional[str]        # Saran pengendalian dari AI
    ai_score_date: Optional[str]

class RiskHistory(BaseModel):
    """Riwayat perubahan risk rating — untuk trend analysis"""
    id: str
    risk_id: str
    likelihood_before: int
    likelihood_after: int
    impact_before: int
    impact_after: int
    changed_by: str
    changed_at: str
    reason: str
```

#### A.6 Fitur UI yang Dibutuhkan

**Halaman ERMRiskPage.js:**
- Filter berdasarkan area, kategori, risk rating, status
- Tabel risiko dengan color coding (Critical = merah, High = oranye, dst.)
- Form tambah/edit risk item (multi-step form)
- Detail view tiap risk item dengan history perubahan
- Tombol "Analyze with AI" untuk saran pengendalian otomatis
- Export ke PDF dan Excel
- Bulk import dari file Excel (untuk migrasi data HIRARC yang sudah ada)

**Komponen RiskMatrix.jsx:**
- Tampilan matriks 5×5 interaktif
- Setiap sel menampilkan jumlah risk item yang masuk ke kategori tersebut
- Klik sel → filter otomatis tabel di bawahnya

---

### Modul B — Underwriting Survey Digital

#### B.1 Deskripsi & Tujuan

Underwriting Survey adalah proses penilaian risiko yang dilakukan oleh atau atas permintaan perusahaan asuransi sebelum penetapan premi atau pada saat perpanjangan polis. Survey ini mencakup penilaian kondisi fisik instalasi, sistem proteksi kebakaran, manajemen K3, dan prosedur operasional.

Modul ini mendigitalisasi seluruh proses survey — dari perencanaan, pelaksanaan di lapangan, hingga penyusunan laporan akhir.

#### B.2 Kategori Penilaian Underwriting

```
Kategori Underwriting Survey — PLTU Tenayan
├── 1. Fire Protection System (FPS)
│   ├── Hydrant system (jumlah, kondisi, tekanan)
│   ├── Automatic sprinkler
│   ├── Fire detector (smoke, heat, flame)
│   ├── Fire suppression (CO2, clean agent)
│   ├── Fire truck (jumlah, kondisi, operasional)
│   └── APAR (jumlah, distribusi, jenis, kondisi)
│
├── 2. Occupational Safety & Health
│   ├── SMK3 certification & score
│   ├── Incident rate (FR, SR, LTI)
│   ├── Safety training & competency
│   └── Emergency response plan
│
├── 3. Machinery & Equipment Risk
│   ├── Boiler inspection certificate (SLF)
│   ├── Pressure vessel certification
│   ├── Lifting equipment certification
│   ├── Maintenance program (PM compliance)
│   └── Critical spare parts availability
│
├── 4. Business Continuity
│   ├── BCP (Business Continuity Plan)
│   ├── Redundancy systems
│   ├── Recovery time objective (RTO)
│   └── Data backup & recovery
│
├── 5. Natural Hazard Exposure
│   ├── Flood risk assessment
│   ├── Earthquake zone
│   ├── Lightning protection
│   └── Wind/storm exposure
│
├── 6. Security & Access Control
│   ├── Perimeter security
│   ├── CCTV coverage
│   ├── Access control system
│   └── Security personnel
│
└── 7. Environmental Compliance
    ├── Emission compliance
    ├── Waste management
    ├── B3 storage compliance
    └── Environmental incident history
```

#### B.3 Skema Data Survey

```python
class UnderwritingSurvey(BaseModel):
    id: str
    survey_code: str                    # "UWS-2025-001"
    title: str                          # "Underwriting Survey Renewal 2025"
    survey_type: str                    # "renewal" / "new_policy" / "mid_term"
    insurance_company: str              # Nama perusahaan asuransi
    policy_number: Optional[str]        # Nomor polis yang akan diperpanjang
    
    # Jadwal
    planned_date: str
    actual_start_date: Optional[str]
    actual_end_date: Optional[str]
    
    # Tim Surveyor
    lead_surveyor_id: str
    surveyor_ids: List[str]
    insurance_representative: Optional[str]
    
    # Status
    status: str                         # "planned" / "in_progress" / "completed" / "submitted"
    
    # Hasil
    overall_score: Optional[float]      # 0-100
    risk_grade: Optional[str]           # A / B / C / D
    premium_recommendation: Optional[str]
    
    # Dokumen
    report_file_id: Optional[str]       # GridFS ID laporan final
    evidence_file_ids: List[str]        # Foto & dokumen pendukung
    
    created_by: str
    created_at: str
    submitted_at: Optional[str]

class SurveyChecklist(BaseModel):
    id: str
    survey_id: str
    category: str                       # Salah satu dari 7 kategori
    item_number: str                    # "FPS-001", "OSH-005", dst.
    item_description: str               # Deskripsi item yang diperiksa
    
    # Penilaian
    score: Optional[int]                # 0-4 (0=tidak ada, 4=sangat baik)
    finding: Optional[str]              # Temuan (jika ada)
    recommendation: Optional[str]       # Rekomendasi perbaikan
    
    # Evidence
    photo_file_ids: List[str]           # Foto evidence
    document_file_ids: List[str]        # Dokumen pendukung
    
    # Status
    is_critical_finding: bool = False   # Temuan kritis
    deadline: Optional[str]
    pic: Optional[str]
    
    assessed_by: str
    assessed_at: str
```

#### B.4 Fitur UI yang Dibutuhkan

**Halaman UnderwritingPage.js:**
- Daftar survey dengan status (Planned, In Progress, Completed, Submitted)
- Form buat survey baru (isi detail, pilih tim, set jadwal)
- Mode pengisian checklist — bisa dibagi per kategori, bisa di-assign ke surveyor berbeda
- Upload foto langsung dari kamera (penting untuk mobile)
- Scoring otomatis saat checklist selesai diisi
- Preview & generate laporan PDF final
- Submit ke manajemen / insurance company (status update)

**Scoring Algorithm:**
```
Score per kategori = rata-rata skor item dalam kategori (0-4)
Overall score = rata-rata tertimbang semua kategori:
  - Fire Protection System: 25%
  - Occupational Safety & Health: 20%
  - Machinery & Equipment: 20%
  - Business Continuity: 15%
  - Natural Hazard: 10%
  - Security: 5%
  - Environmental: 5%

Risk Grade:
  Overall ≥ 80 → Grade A (Very Good)
  Overall 70-79 → Grade B (Good)
  Overall 60-69 → Grade C (Fair)
  Overall < 60 → Grade D (Poor — perlu perbaikan signifikan)
```

---

### Modul C — Risk Survey Lapangan

#### C.1 Deskripsi & Tujuan

Risk Survey Lapangan adalah inspeksi rutin yang dilakukan oleh personil K3 atau supervisor area untuk mengidentifikasi bahaya baru, kondisi tidak aman, atau ketidaksesuaian dengan standar yang berlaku. Berbeda dengan Underwriting Survey yang formal dan periodic-tahunan, Risk Survey Lapangan dilakukan lebih sering (mingguan/bulanan) dan bersifat operasional.

Modul ini didesain **mobile-first** — semua fitur harus dapat diakses dengan nyaman dari smartphone Android/iOS di lapangan, termasuk dalam kondisi sinyal lemah (offline-capable untuk pengisian form).

#### C.2 Tipe Survey

| Tipe | Frekuensi | Pelaksana | Scope |
|------|-----------|-----------|-------|
| **Daily Safety Walk** | Harian | Shift supervisor | Area operasi aktif |
| **Weekly Safety Patrol** | Mingguan | Tim K3 | Seluruh unit |
| **Monthly Inspection** | Bulanan | Auditor internal | Berdasarkan HIRARC |
| **Pre-Work Inspection** | Sebelum pekerjaan | Pelaksana + pengawas | Area pekerjaan |
| **Special Survey** | Insidental | Risk officer | Area pasca insiden / perubahan |

#### C.3 Skema Data Survey Lapangan

```python
class FieldSurvey(BaseModel):
    id: str
    survey_code: str                    # "FS-20250615-001"
    survey_type: str                    # Lihat tabel di atas
    area_code: str                      # Area yang disurvey
    
    # Jadwal & Pelaksana
    planned_date: Optional[str]
    actual_date: str
    surveyor_ids: List[str]
    
    # Ringkasan
    total_findings: int = 0
    critical_findings: int = 0
    high_findings: int = 0
    status: str                         # "open" / "in_review" / "closed"
    
    # Metadata
    created_by: str
    created_at: str
    completed_at: Optional[str]

class FieldFinding(BaseModel):
    id: str
    survey_id: str
    finding_code: str                   # "FF-20250615-001"
    
    # Lokasi & Detail Temuan
    area_code: str
    sub_location: str                   # Deskripsi lokasi lebih spesifik
    finding_type: str                   # "unsafe_condition" / "unsafe_act" / 
                                        # "near_miss" / "non_conformance"
    description: str                    # Deskripsi temuan
    
    # Penilaian Risiko Cepat
    severity: str                       # "low" / "medium" / "high" / "critical"
    potential_consequence: str          # Apa yang bisa terjadi jika dibiarkan
    
    # Evidence
    photo_file_ids: List[str]           # Minimal 1 foto
    
    # Tindak Lanjut
    immediate_action: Optional[str]     # Tindakan langsung yang sudah dilakukan
    recommendation: str                 # Rekomendasi perbaikan
    pic_user_id: Optional[str]
    deadline: Optional[str]
    
    # Status
    status: str                         # "open" / "in_progress" / "verified" / "closed"
    close_evidence_file_ids: List[str]  # Foto bukti sudah diperbaiki
    closed_by: Optional[str]
    closed_at: Optional[str]
    
    # Link ke Modul Lain
    related_risk_id: Optional[str]      # Link ke ERM risk item
    related_clause_id: Optional[str]    # Link ke klausul SMK3
    
    # Metadata
    created_by: str
    created_at: str
    gps_latitude: Optional[float]       # Koordinat GPS (dari smartphone)
    gps_longitude: Optional[float]
```

#### C.4 Fitur UI Mobile-First

**Halaman RiskSurveyPage.js:**
- Quick-report button di halaman utama (untuk report temuan cepat)
- Form report temuan: minimal 3 klik — pilih area → isi deskripsi → foto → submit
- Checklist survey berdasarkan route yang sudah diset
- Status tracking temuan (Open / In Progress / Closed)
- Filter temuan per area, severity, status
- Dashboard summary (berapa open, berapa overdue)

**Fitur Khusus Mobile:**
- Camera capture langsung dari form
- GPS auto-capture untuk lokasi temuan
- Offline draft (simpan lokal, sync saat ada koneksi)
- Push notification untuk reminder dan update status

---

### Modul D — Kesiapan Peralatan Tanggap Darurat

#### D.1 Deskripsi & Tujuan

Kesiapan alat tanggap darurat adalah aspek kritis yang sering terabaikan dalam pengelolaan K3 — APAR yang sudah expire, hydrant yang tidak bertekanan, kotak P3K yang kosong. Modul ini membuat inventory lengkap semua peralatan tanggap darurat dengan sistem monitoring kesiapan otomatis.

#### D.2 Kategori Peralatan

```
Inventory Peralatan Tanggap Darurat — PLTU Tenayan
├── 1. Alat Pemadam Api (Fire Fighting)
│   ├── APAR (Alat Pemadam Api Ringan)
│   │   ├── Jenis: CO2, Dry Powder, Foam, Clean Agent
│   │   └── Data: Nomor seri, lokasi, kapasitas, tanggal isi ulang, expired
│   ├── Hydrant (Fire Hydrant)
│   │   └── Data: Nomor, lokasi, tipe (pillar/box), tekanan terakhir, kondisi
│   ├── Fire Suppression System
│   │   └── Data: Area yang dilindungi, jenis (CO2/FM200/Novec), kondisi
│   └── Fire Truck / Mobil Pemadam
│       └── Data: Nomor kendaraan, kapasitas tangki, kondisi, driver
│
├── 2. Alat Keselamatan Jiwa (Life Safety)
│   ├── Kotak P3K
│   │   └── Data: Lokasi, isi lengkap/tidak, tanggal cek terakhir
│   ├── AED (Automated External Defibrillator)
│   │   └── Data: Nomor seri, lokasi, baterai, pad, tanggal cek
│   ├── Stretcher / Tandu
│   │   └── Data: Jumlah, lokasi, kondisi
│   └── Emergency Eyewash & Shower
│       └── Data: Lokasi, kondisi, tanggal test terakhir
│
├── 3. Alat Pelindung Diri Khusus (Special PPE)
│   ├── SCBA (Self-Contained Breathing Apparatus)
│   │   └── Data: Nomor unit, tekanan silinder, tanggal hydrostatic test
│   ├── Heat Resistant Suit (Baju Tahan Panas)
│   ├── Chemical Suit (Level A/B/C)
│   └── Harness & Fall Arrest
│       └── Data: Nomor seri, tanggal inspeksi, masa pakai
│
├── 4. Alat Tanggap Darurat B3 (Hazmat)
│   ├── Spill Kit (Oil/Chemical)
│   │   └── Data: Lokasi, kapasitas, kondisi, tanggal cek
│   ├── Bund/Secondary Containment Status
│   └── Decontamination Equipment
│
└── 5. Komunikasi & Evakuasi
    ├── Alarm Panel
    │   └── Data: Lokasi, tipe, tanggal test terakhir
    ├── Public Address System
    ├── Emergency Radio / Handy Talky
    │   └── Data: Jumlah unit, kondisi baterai, channel
    └── Assembly Point
        └── Data: Lokasi, tanda, kapasitas, kondisi rambu
```

#### D.3 Skema Data Peralatan

```python
class EmergencyEquipment(BaseModel):
    id: str
    equipment_code: str                 # "APAR-BOILER-001"
    
    # Identifikasi
    equipment_type: str                 # Kategori (apar, hydrant, p3k, aed, dst.)
    equipment_subtype: str              # Sub-tipe (co2, dry_powder, dst.)
    brand: Optional[str]
    serial_number: Optional[str]
    
    # Lokasi
    area_code: str
    sub_location: str                   # "Lantai 2, dekat pintu darurat timur"
    gps_latitude: Optional[float]
    gps_longitude: Optional[float]
    
    # Spesifikasi
    capacity: Optional[str]             # "6 kg", "250 liter", dst.
    specifications: Dict[str, Any]      # Data tambahan spesifik per tipe alat
    
    # Status & Kesiapan
    status: str                         # "ready" / "needs_maintenance" / "expired" / "missing"
    readiness_percentage: float         # 0-100, calculated
    
    # Jadwal & Inspeksi
    last_inspection_date: Optional[str]
    next_inspection_date: Optional[str]
    inspection_frequency_days: int      # 30, 90, 180, atau 365
    
    # Kedaluwarsa (untuk item yang punya expired date)
    manufacture_date: Optional[str]
    expiry_date: Optional[str]
    refill_date: Optional[str]          # Untuk APAR
    
    # Sertifikasi (untuk alat yang butuh sertifikasi)
    certificate_number: Optional[str]
    certificate_expiry: Optional[str]
    certified_by: Optional[str]
    
    # Foto
    photo_file_id: Optional[str]        # Foto alat (kondisi normal)
    
    # Metadata
    added_by: str
    added_at: str
    last_updated_by: str
    last_updated_at: str

class EquipmentInspection(BaseModel):
    """Log inspeksi berkala per alat"""
    id: str
    equipment_id: str
    inspection_date: str
    inspector_id: str
    
    # Checklist inspeksi (tergantung tipe alat)
    checklist_items: List[Dict]         # {"item": "...", "result": "ok/nok", "note": "..."}
    
    # Hasil
    overall_condition: str              # "good" / "fair" / "poor" / "failed"
    findings: Optional[str]
    action_taken: Optional[str]
    next_inspection_date: str
    
    # Evidence
    photo_file_ids: List[str]

class EquipmentAlert(BaseModel):
    """Alert otomatis untuk alat yang mendekati expired / perlu inspeksi"""
    id: str
    equipment_id: str
    alert_type: str                     # "expiry_soon" / "inspection_due" / "status_change"
    alert_message: str
    severity: str                       # "info" / "warning" / "critical"
    due_date: str
    is_acknowledged: bool = False
    acknowledged_by: Optional[str]
    acknowledged_at: Optional[str]
    created_at: str
```

#### D.4 Business Logic — Kesiapan Alat

```python
# services/equipment_service.py

def calculate_readiness(equipment: EmergencyEquipment) -> float:
    """
    Hitung persentase kesiapan alat berdasarkan berbagai faktor
    """
    score = 100.0
    
    # Cek expired date
    if equipment.expiry_date:
        days_to_expiry = (parse_date(equipment.expiry_date) - today()).days
        if days_to_expiry < 0:
            return 0.0  # Sudah expired = 0%
        elif days_to_expiry < 30:
            score -= 40  # Akan expired dalam 30 hari
        elif days_to_expiry < 90:
            score -= 20
    
    # Cek inspeksi terakhir
    if equipment.last_inspection_date:
        days_since_inspection = (today() - parse_date(equipment.last_inspection_date)).days
        if days_since_inspection > equipment.inspection_frequency_days * 1.5:
            score -= 30  # Overdue lebih dari 150%
        elif days_since_inspection > equipment.inspection_frequency_days:
            score -= 15  # Inspeksi overdue
    
    # Cek status manual
    if equipment.status == "needs_maintenance":
        score -= 30
    elif equipment.status == "missing":
        return 0.0
    
    return max(0.0, score)

def generate_equipment_alerts():
    """
    Cron job: Generate alerts otomatis setiap hari
    """
    # Alert 30 hari sebelum expiry
    # Alert 14 hari sebelum due inspection
    # Alert jika status berubah jadi needs_maintenance
    pass
```

#### D.5 Visualisasi Peta Unit (Plant Map)

Salah satu fitur utama modul ini adalah **tampilan peta denah unit PLTU Tenayan** dengan overlay titik-titik alat tanggap darurat. Setiap titik diberi warna sesuai status:

- 🟢 **Hijau** = Ready (status OK, tidak ada yang akan expired dalam 30 hari)
- 🟡 **Kuning** = Warning (ekspirasi < 30 hari ATAU inspeksi overdue)
- 🔴 **Merah** = Critical (sudah expired ATAU status needs_maintenance)
- ⚫ **Abu** = Missing / Tidak Diketahui

**Implementasi Teknis Peta:**
- SVG-based plant layout (bisa di-export dari AutoCAD/Visio ke SVG)
- Overlay marker di atas SVG dengan koordinat X/Y yang di-map ke koordinat GPS
- Filter per tipe alat (tampilkan hanya APAR, hanya hydrant, dst.)
- Klik marker → popup detail alat + tombol untuk lapor inspeksi

```jsx
// components/PlantMap.jsx
// Menggunakan SVG statis sebagai base map
// dengan overlay React components untuk markers

const PlantMap = ({ equipments, filterType }) => {
  return (
    <div className="relative w-full">
      <svg viewBox="0 0 1200 800" className="w-full">
        {/* Denah unit PLTU Tenayan (import dari file SVG) */}
        <image href="/plant-layout.svg" width="1200" height="800" />
        
        {/* Overlay markers */}
        {equipments
          .filter(eq => !filterType || eq.equipment_type === filterType)
          .map(eq => (
            <EquipmentMarker
              key={eq.id}
              equipment={eq}
              x={gpsToSvgX(eq.gps_longitude)}
              y={gpsToSvgY(eq.gps_latitude)}
              onClick={() => setSelectedEquipment(eq)}
            />
          ))
        }
      </svg>
      
      {/* Sidebar detail */}
      {selectedEquipment && (
        <EquipmentDetailPanel equipment={selectedEquipment} />
      )}
    </div>
  );
};
```

---

### Modul E — Risk Heatmap & Analytics Dashboard

#### E.1 Deskripsi & Tujuan

Risk Heatmap adalah dashboard visual level manajemen yang menggabungkan data dari semua modul menjadi satu gambaran komprehensif kondisi risiko K3 unit. Tujuannya adalah memungkinkan manajemen dan pimpinan unit untuk memahami kondisi risiko secara cepat — dalam hitungan detik, bukan jam membaca laporan.

#### E.2 Komponen Dashboard

**Panel 1 — Risk Overview**
```
┌─────────────────────────────────────────────┐
│  Critical: 3  │  High: 12  │  Medium: 28    │
│  Low: 45      │  Very Low: 67               │
│                                             │
│  Trend: ↓ -5% dari bulan lalu              │
└─────────────────────────────────────────────┘
```

**Panel 2 — Heatmap per Area**
Matriks yang menampilkan risk level per area unit. Warna merah = area dengan banyak risiko tinggi.

```
Area           │ Risk Score │ Trend │ Open Actions
─────────────────────────────────────────────────
BOILER         │ ████████░░ │  →   │ 5
COAL           │ █████████░ │  ↑   │ 8 ⚠
TURBINE        │ ██████░░░░ │  ↓   │ 2
ELEC YARD      │ ████████░░ │  →   │ 4
ASH HANDLING   │ █████████░ │  ↑   │ 7 ⚠
...
```

**Panel 3 — Equipment Readiness**
```
Fire Fighting  │ ████████░░ 82%  │  3 items need attention
Life Safety    │ █████████░ 91%  │  1 item expiring soon
Special PPE    │ ███████░░░ 74%  │  5 items need inspection
```

**Panel 4 — Audit & Compliance Score**
Terintegrasi dari modul Audit SMK3 existing.

**Panel 5 — Open Action Items**
Semua tindak lanjut dari berbagai modul yang belum selesai, diurutkan berdasarkan prioritas dan deadline.

#### E.3 KPI yang Dipantau

```python
class UnitKPIs(BaseModel):
    period: str                     # "2025-Q2"
    
    # Safety Performance
    ltifr: float                    # Lost Time Injury Frequency Rate
    trifr: float                    # Total Recordable Injury Frequency Rate
    near_miss_count: int            # Jumlah near miss yang dilaporkan
    unsafe_act_count: int           # Temuan unsafe act
    unsafe_condition_count: int     # Temuan unsafe condition
    
    # Risk Management
    critical_risks_open: int        # Risiko Critical yang belum dikendalikan
    high_risks_open: int            # Risiko High yang belum dikendalikan
    risk_closure_rate: float        # % risk items closed tepat waktu
    
    # Equipment Readiness
    overall_equipment_readiness: float   # % alat dalam kondisi ready
    expired_equipment_count: int
    overdue_inspection_count: int
    
    # Audit & Compliance
    smk3_achievement: float         # Dari modul audit existing
    smk3_grade: str
    
    # Survey
    open_findings_count: int
    overdue_findings_count: int
    avg_finding_closure_days: float
    
    # Underwriting
    latest_risk_grade: str
    premium_trend: str              # "up" / "stable" / "down"
    
    calculated_at: str
```

---

## 6. Integrasi Antar Modul

### Alur Integrasi Utama

```
Trigger: Temuan Field Survey (FieldFinding)
    │
    ├── IF severity = "critical" OR "high"
    │       └── AUTO-CREATE: RiskItem di ERM Register
    │               └── risk_category = derived dari finding_type
    │               └── area_code = sama dengan temuan
    │               └── status = "Active"
    │
    ├── IF related_clause_id diisi
    │       └── UPDATE: AuditResult.needs_review = True
    │               └── Notifikasi ke Auditor
    │
    └── IF area_code memiliki equipment dengan status != "ready"
            └── CREATE: EquipmentAlert
                    └── alert_type = "related_finding"

Trigger: Audit SMK3 → Non-Conform Major (AuditResult)
    │
    ├── AUTO-CREATE atau UPDATE: RiskItem di ERM Register
    │       └── related_clause_id = clause_id
    │       └── risk_rating minimum = "Medium"
    │
    └── IF klausul terkait dengan FPS (klausul 6.7.x)
            └── AUTO-FLAG: Semua equipment di area terkait untuk review

Trigger: Equipment Expiry Alert (EquipmentAlert)
    │
    ├── NOTIFY: PIC equipment + Supervisor K3
    │
    ├── UPDATE: Equipment readiness di Heatmap
    │
    └── IF equipment di area yang ada Critical Risk
            └── ESCALATE: Alert ke management
```

### Notification Rules

```python
# services/notification_service.py

NOTIFICATION_RULES = {
    "critical_risk_new": {
        "recipients": ["risk_officer", "admin", "management"],
        "channels": ["in_app", "email"],
        "urgency": "immediate"
    },
    "equipment_expired": {
        "recipients": ["equipment_pic", "supervisor_k3"],
        "channels": ["in_app", "email"],
        "urgency": "same_day"
    },
    "equipment_expiring_30d": {
        "recipients": ["equipment_pic"],
        "channels": ["in_app"],
        "urgency": "low"
    },
    "finding_overdue": {
        "recipients": ["finding_pic", "supervisor_k3"],
        "channels": ["in_app", "email"],
        "urgency": "same_day"
    },
    "survey_completed": {
        "recipients": ["admin", "risk_officer"],
        "channels": ["in_app"],
        "urgency": "low"
    }
}
```

---

## 7. Skema Database

### Collections MongoDB Baru

```javascript
// Collection: risk_items (Modul A)
{
  _id: ObjectId,
  id: "uuid",
  risk_code: "RISK-BOILER-001",
  title: "String",
  area_code: "BOILER",
  risk_category: "Risiko Kebakaran & Ledakan",
  likelihood: 3,
  impact: 4,
  risk_score: 12,
  risk_rating: "Medium",
  residual_score: 6,
  residual_rating: "Low",
  controls: { elimination, substitution, engineering, administrative, ppe },
  related_clause_ids: ["uuid1", "uuid2"],
  status: "Active",
  pic_user_id: "uuid",
  created_at: ISODate,
  updated_at: ISODate
}

// Collection: risk_history (Modul A — audit trail)
{
  id: "uuid",
  risk_id: "uuid",
  field_changed: "likelihood",
  value_before: 3,
  value_after: 2,
  changed_by: "uuid",
  changed_at: ISODate,
  reason: "String"
}

// Collection: underwriting_surveys (Modul B)
{
  id: "uuid",
  survey_code: "UWS-2025-001",
  insurance_company: "String",
  status: "completed",
  overall_score: 78.5,
  risk_grade: "B",
  checklist_ids: ["uuid1", "uuid2", ...],
  created_at: ISODate
}

// Collection: survey_checklists (Modul B)
{
  id: "uuid",
  survey_id: "uuid",
  category: "Fire Protection System",
  item_number: "FPS-001",
  score: 3,
  finding: "String",
  photo_file_ids: ["gridfs_id1"],
  is_critical_finding: false,
  assessed_at: ISODate
}

// Collection: field_surveys (Modul C)
{
  id: "uuid",
  survey_code: "FS-20250615-001",
  survey_type: "weekly_patrol",
  area_code: "COAL",
  actual_date: ISODate,
  status: "closed",
  total_findings: 5,
  critical_findings: 1
}

// Collection: field_findings (Modul C)
{
  id: "uuid",
  survey_id: "uuid",
  finding_code: "FF-20250615-003",
  area_code: "COAL",
  sub_location: "Coal conveyor #3, bend area",
  finding_type: "unsafe_condition",
  severity: "high",
  description: "Guard belt conveyor lepas sepanjang 2 meter",
  photo_file_ids: ["gridfs_id"],
  immediate_action: "Dipasang barrier dan lockout",
  recommendation: "Perbaiki guard dan lakukan inspeksi semua conveyor",
  status: "in_progress",
  related_risk_id: "uuid",
  gps_latitude: 0.5123,
  gps_longitude: 101.4567,
  created_at: ISODate
}

// Collection: emergency_equipment (Modul D)
{
  id: "uuid",
  equipment_code: "APAR-BOILER-001",
  equipment_type: "apar",
  equipment_subtype: "dry_powder",
  area_code: "BOILER",
  sub_location: "Lantai 2 boiler, dekat pintu darurat",
  capacity: "6 kg",
  status: "ready",
  readiness_percentage: 95.0,
  expiry_date: ISODate,
  last_inspection_date: ISODate,
  next_inspection_date: ISODate,
  photo_file_id: "gridfs_id"
}

// Collection: equipment_inspections (Modul D)
{
  id: "uuid",
  equipment_id: "uuid",
  inspection_date: ISODate,
  inspector_id: "uuid",
  overall_condition: "good",
  checklist_items: [
    {"item": "Segel masih utuh", "result": "ok", "note": ""},
    {"item": "Tekanan normal (1-1.5 MPa)", "result": "ok", "note": ""},
    {"item": "Pin pengaman terpasang", "result": "ok", "note": ""}
  ],
  photo_file_ids: ["gridfs_id"]
}

// Collection: equipment_alerts (Modul D)
{
  id: "uuid",
  equipment_id: "uuid",
  alert_type: "expiry_soon",
  alert_message: "APAR-BOILER-001 akan expired dalam 28 hari",
  severity: "warning",
  due_date: ISODate,
  is_acknowledged: false,
  created_at: ISODate
}

// Collection: unit_kpis (Modul E)
{
  id: "uuid",
  period: "2025-Q2",
  ltifr: 0.0,
  critical_risks_open: 3,
  overall_equipment_readiness: 87.5,
  smk3_achievement: 88.0,
  smk3_grade: "GOLD",
  open_findings_count: 12,
  calculated_at: ISODate
}
```

### Indexes yang Direkomendasikan

```javascript
// Untuk performa query yang sering digunakan
db.risk_items.createIndex({ area_code: 1, risk_rating: 1 })
db.risk_items.createIndex({ status: 1, pic_user_id: 1 })
db.risk_items.createIndex({ risk_score: -1 })
db.field_findings.createIndex({ area_code: 1, status: 1 })
db.field_findings.createIndex({ severity: 1, deadline: 1 })
db.emergency_equipment.createIndex({ area_code: 1, equipment_type: 1 })
db.emergency_equipment.createIndex({ expiry_date: 1, status: 1 })
db.equipment_alerts.createIndex({ is_acknowledged: 1, severity: 1 })
```

---

## 8. API Endpoints Baru

### Modul A — ERM Risk Register

```
GET    /api/risk/items                   → List semua risk items (filter: area, rating, status)
POST   /api/risk/items                   → Buat risk item baru
GET    /api/risk/items/{id}              → Detail risk item
PUT    /api/risk/items/{id}              → Update risk item
DELETE /api/risk/items/{id}              → Hapus risk item (soft delete)
GET    /api/risk/items/{id}/history      → Riwayat perubahan risk item
POST   /api/risk/items/{id}/analyze      → AI analysis untuk saran pengendalian
GET    /api/risk/matrix                  → Data untuk risk matrix visualization
GET    /api/risk/by-area                 → Risk summary per area
GET    /api/risk/dashboard               → Agregat data untuk dashboard
POST   /api/risk/import                  → Bulk import dari Excel (HIRARC existing)
GET    /api/risk/export                  → Export ke Excel/PDF
```

### Modul B — Underwriting Survey

```
GET    /api/underwriting/surveys              → List semua survey
POST   /api/underwriting/surveys              → Buat survey baru
GET    /api/underwriting/surveys/{id}         → Detail survey
PUT    /api/underwriting/surveys/{id}         → Update survey
GET    /api/underwriting/surveys/{id}/score   → Hitung skor survey
POST   /api/underwriting/surveys/{id}/submit  → Submit survey ke manajemen
GET    /api/underwriting/checklists           → Template checklist per kategori
POST   /api/underwriting/checklists/{survey_id}/items → Isi checklist item
PUT    /api/underwriting/checklists/items/{id}         → Update checklist item
POST   /api/underwriting/surveys/{id}/report  → Generate laporan PDF
```

### Modul C — Risk Survey Lapangan

```
GET    /api/field-survey/surveys              → List surveys
POST   /api/field-survey/surveys              → Buat survey baru
GET    /api/field-survey/surveys/{id}         → Detail survey
PUT    /api/field-survey/surveys/{id}/close   → Tutup survey

GET    /api/field-survey/findings             → List findings (filter: area, severity, status)
POST   /api/field-survey/findings             → Report temuan baru (quick report)
GET    /api/field-survey/findings/{id}        → Detail finding
PUT    /api/field-survey/findings/{id}        → Update finding
POST   /api/field-survey/findings/{id}/close  → Tutup finding + upload bukti
GET    /api/field-survey/dashboard            → Dashboard summary
GET    /api/field-survey/patrol-route         → Checklist route per area
```

### Modul D — Peralatan Tanggap Darurat

```
GET    /api/equipment                         → List semua equipment (filter: area, type, status)
POST   /api/equipment                         → Tambah equipment baru
GET    /api/equipment/{id}                    → Detail equipment
PUT    /api/equipment/{id}                    → Update equipment
GET    /api/equipment/{id}/inspections        → Riwayat inspeksi
POST   /api/equipment/{id}/inspect            → Catat inspeksi baru
GET    /api/equipment/alerts                  → List alert equipment
PUT    /api/equipment/alerts/{id}/acknowledge → Acknowledge alert
GET    /api/equipment/readiness-summary       → Summary kesiapan per area
GET    /api/equipment/map-data                → Data untuk plant map overlay
GET    /api/equipment/expiring                → List equipment yang akan expired (30/60/90 hari)
POST   /api/equipment/run-alerts              → Trigger manual untuk generate alerts
```

### Modul E — Heatmap & Analytics

```
GET    /api/heatmap/overview           → Data heatmap utama per area
GET    /api/heatmap/risk-level         → Risk level per area (untuk color coding)
GET    /api/heatmap/equipment-readiness → Equipment readiness per area
GET    /api/analytics/kpi              → KPI period tertentu
GET    /api/analytics/kpi/trend        → Trend KPI beberapa periode
GET    /api/analytics/risk-trend       → Trend risk items (naik/turun per bulan)
GET    /api/analytics/finding-trend    → Trend temuan lapangan
POST   /api/analytics/kpi/calculate    → Recalculate KPI untuk periode tertentu
GET    /api/reports/integrated         → Generate laporan terintegrasi (semua modul)
```

---

## 9. UI/UX Frontend Baru

### Navigation Update (Layout.js)

```javascript
const navigation = [
  // === EXISTING ===
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Audit SMK3', path: '/criteria', icon: ShieldCheck },
  { name: 'Klausul', path: '/clauses', icon: FileCheck },
  { name: 'Pelaksanaan Audit', path: '/audit', icon: ClipboardCheck },
  { name: 'Rekomendasi', path: '/recommendations', icon: FileText },
  { name: 'Laporan', path: '/reports', icon: FileText },
  
  // === NEW ===
  { divider: true, label: 'Manajemen Risiko' },
  { name: 'ERM Risk Register', path: '/erm-risk', icon: AlertTriangle },
  { name: 'Risk Heatmap', path: '/heatmap', icon: BarChart3 },
  
  { divider: true, label: 'Survey & Inspeksi' },
  { name: 'Survey Lapangan', path: '/risk-survey', icon: MapPin },
  { name: 'Underwriting Survey', path: '/underwriting', icon: Building },
  
  { divider: true, label: 'Tanggap Darurat' },
  { name: 'Peralatan Darurat', path: '/equipment', icon: Siren },
];
```

### New Pages Summary

| Halaman | Komponen Utama | Fitur Kunci |
|---------|---------------|-------------|
| `ERMRiskPage.js` | RiskMatrix + RiskTable | Filter multi-dimensi, AI analysis, import HIRARC |
| `HeatmapPage.js` | PlantMap + KPI cards | Visual peta risiko, trend chart, KPI monitoring |
| `RiskSurveyPage.js` | QuickReport + FindingList | Mobile-first, GPS, camera, offline draft |
| `UnderwritingPage.js` | ChecklistForm + ScoreCard | Multi-surveyor, auto scoring, PDF generation |
| `EmergencyEquipmentPage.js` | PlantMap (equipment mode) + EquipmentTable | Peta alat, alert management, QR code scan |

### Komponen Baru yang Perlu Dibuat

```
components/
├── RiskMatrix.jsx          # Matriks 5x5 interaktif
├── PlantMap.jsx            # SVG plant map dengan overlay
├── EquipmentCard.jsx       # Card per alat (kondisi + alert)
├── RiskBadge.jsx           # Badge warna risk level
├── FindingCard.jsx         # Card temuan lapangan
├── KPICard.jsx             # KPI metric card dengan trend
├── QuickReportForm.jsx     # Form lapor temuan cepat (mobile)
├── TrendChart.jsx          # Line chart KPI trend
├── EquipmentMarker.jsx     # Marker untuk plant map
└── AlertBanner.jsx         # Banner untuk alert kritis
```

---

## 10. Roadmap & Milestone

### Timeline Pengembangan (12 Bulan)

```
FASE 1 — Fondasi & ERM Risk Register (Bulan 1-3)
─────────────────────────────────────────────────
Bulan 1:
  [ ] Refactor backend: pisahkan server.py menjadi routers/
  [ ] Tambah role baru: risk_officer, surveyor
  [ ] Buat models/ dan services/ layer
  [ ] Desain dan implement MongoDB schema untuk risk_items
  [ ] API CRUD untuk ERM Risk Register

Bulan 2:
  [ ] Frontend ERMRiskPage.js
  [ ] Komponen RiskMatrix.jsx
  [ ] Import HIRARC dari Excel (migrasi data existing)
  [ ] Integrasi ERM dengan Audit SMK3 (link audit → risk)
  [ ] AI integration untuk risk control suggestions

Bulan 3:
  [ ] Testing & bug fixing ERM module
  [ ] User acceptance testing dengan tim K3 UP Tenayan
  [ ] Dokumentasi penggunaan modul ERM
  [ ] Deployment v1.1 dengan modul ERM

Target Milestone 1: ERM Risk Register live, data HIRARC existing sudah 
                    dimigrasi, integrasi dengan Audit SMK3 berjalan

─────────────────────────────────────────────────
FASE 2 — Peralatan Tanggap Darurat & Survey Lapangan (Bulan 4-6)
─────────────────────────────────────────────────
Bulan 4:
  [ ] Desain dan implement schema emergency_equipment
  [ ] API CRUD equipment + inspection log
  [ ] Business logic: readiness calculation, alert generation
  [ ] Cron job untuk generate alerts harian
  [ ] Frontend EmergencyEquipmentPage.js (list view)

Bulan 5:
  [ ] SVG plant layout UP Tenayan (koordinasikan dengan engineering)
  [ ] Komponen PlantMap.jsx dengan overlay equipment markers
  [ ] QR code generation per alat (untuk scan inspeksi lapangan)
  [ ] Frontend EmergencyEquipmentPage.js (map view)
  [ ] Desain schema field_surveys dan field_findings

Bulan 6:
  [ ] API Survey Lapangan + Field Findings
  [ ] Frontend RiskSurveyPage.js (mobile-first)
  [ ] Komponen QuickReportForm.jsx
  [ ] GPS capture + camera integration
  [ ] Integrasi: Field Finding → ERM Risk Register (auto-create)
  [ ] Integrasi: Field Finding → Equipment Alert

Target Milestone 2: Inventory semua alat tanggap darurat UP Tenayan 
                    sudah masuk sistem. Survey lapangan bisa dilakukan 
                    dari smartphone.

─────────────────────────────────────────────────
FASE 3 — Underwriting Survey & Analytics (Bulan 7-9)
─────────────────────────────────────────────────
Bulan 7:
  [ ] Desain schema underwriting_surveys + survey_checklists
  [ ] Template checklist underwriting sesuai standar industri
  [ ] API Underwriting Survey
  [ ] Frontend UnderwritingPage.js

Bulan 8:
  [ ] Scoring algorithm underwriting (otomatis)
  [ ] PDF report generation untuk underwriting (format formal)
  [ ] Multi-surveyor workflow (assign per kategori)
  [ ] Desain schema unit_kpis
  [ ] Analytics API: KPI calculation

Bulan 9:
  [ ] Frontend HeatmapPage.js
  [ ] Komponen PlantMap.jsx (risk heatmap mode)
  [ ] KPI trend charts
  [ ] Integrated report (semua modul dalam 1 PDF)
  [ ] Dashboard update: tambah widget dari semua modul baru

Target Milestone 3: Underwriting survey pertama bisa dilakukan 
                    full-digital. Risk heatmap tersedia untuk manajemen.

─────────────────────────────────────────────────
FASE 4 — Refinement, Mobile App & Diseminasi (Bulan 10-12)
─────────────────────────────────────────────────
Bulan 10:
  [ ] Performance optimization (indexing, caching)
  [ ] Offline capability untuk survey lapangan
  [ ] Push notification untuk alerts kritis
  [ ] Comprehensive testing semua integrasi

Bulan 11:
  [ ] User training untuk semua role (admin, auditor, surveyor, management)
  [ ] Dokumentasi user manual lengkap
  [ ] Penyusunan SOP penggunaan platform
  [ ] Pilot dengan unit lain PLN NP (jika memungkinkan)

Bulan 12:
  [ ] Review dan evaluasi seluruh platform
  [ ] Performance benchmarking vs manual process
  [ ] Persiapan presentasi inovasi ke korporat
  [ ] Roadmap v3.0 (berdasarkan feedback)

Target Milestone 4: Platform v2.0 fully operational, semua personil 
                    terlatih, siap untuk diseminasi ke unit PLN NP lain.
```

### Prioritas Jika Resources Terbatas

Jika waktu/tenaga pengembang terbatas, ikuti urutan prioritas ini:

1. **MUST HAVE** — ERM Risk Register (tanpa ini, modul lain tidak bermakna)
2. **MUST HAVE** — Inventory Peralatan Tanggap Darurat (risiko keselamatan langsung)
3. **SHOULD HAVE** — Risk Survey Lapangan (nilai operasional tinggi)
4. **SHOULD HAVE** — Risk Heatmap Dashboard (nilai untuk manajemen)
5. **NICE TO HAVE** — Underwriting Survey (bisa tetap dilakukan semi-manual)

---

## 11. Tech Stack & Dependencies Tambahan

### Backend — Tambahan

```txt
# Tambahkan ke requirements.txt

# Excel import/export untuk migrasi HIRARC
openpyxl==3.1.2
xlsxwriter==3.1.9

# QR Code generation untuk label peralatan
qrcode[pil]==7.4.2

# Scheduled tasks (untuk generate alerts harian)
apscheduler==3.10.4

# Geospatial (untuk GPS calculations)
geopy==2.4.1

# Image processing (untuk compress foto dari lapangan)
Pillow==10.2.0

# Push notifications (opsional, jika implementasi notif)
firebase-admin==6.4.0
```

### Frontend — Tambahan

```json
{
  "dependencies": {
    "react-leaflet": "^4.2.1",     // Untuk peta interaktif (opsional)
    "recharts": "^2.12.0",          // Sudah ada di existing
    "react-qr-code": "^2.0.12",    // QR code display
    "html5-qrcode": "^2.3.8",      // QR code scanner dari kamera
    "date-fns": "^3.0.0",           // Sudah ada
    "xlsx": "^0.18.5"               // Excel import/export
  }
}
```

### Environment Variables Tambahan

```env
# .env additions

# Scheduler
ENABLE_SCHEDULER=true
ALERT_CHECK_HOUR=6          # Jam berapa cron job alert berjalan (06:00 pagi)

# Notifications (jika menggunakan Firebase)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# File Storage Settings
MAX_PHOTO_SIZE_MB=5          # Maksimal ukuran foto per upload
PHOTO_COMPRESSION_QUALITY=85 # Kualitas kompresi foto (0-100)

# Risk Scoring
DEFAULT_REVIEW_FREQUENCY_DAYS=90   # Frekuensi review risk item (default)
ALERT_EXPIRY_WARNING_DAYS=30       # Berapa hari sebelum expiry baru alert
ALERT_INSPECTION_WARNING_DAYS=14   # Berapa hari sebelum due inspection
```

---

## 12. Standar Referensi & Regulasi

Platform ini mengacu pada standar dan regulasi berikut. Setiap modul harus memastikan output-nya kompatibel dengan kebutuhan pelaporan/kepatuhan terhadap regulasi ini:

| Regulasi/Standar | Relevansi ke Modul |
|-----------------|-------------------|
| **PP No. 50 Tahun 2012** — Penerapan SMK3 | Modul Audit SMK3 (existing), ERM Risk Register |
| **Permenaker No. 26 Tahun 2014** — Penyelenggaraan Penilaian Penerapan SMK3 | Modul Audit SMK3 (existing) |
| **Permenaker No. 02/MEN/1992** — Ahli K3 | User management (role auditor_k3) |
| **Kepmenaker 186/MEN/1999** — Unit Penanggulangan Kebakaran | Modul Peralatan Tanggap Darurat |
| **Permenaker 04/MEN/1995** — Perusahaan Jasa K3 | Underwriting Survey (PJK3 untuk riksa uji) |
| **ISO 45001:2018** — Occupational H&S Management System | ERM Risk Register (risk assessment methodology) |
| **ISO 31000:2018** — Risk Management | ERM Risk Register (framework) |
| **NFPA 10** — Standard for Portable Fire Extinguisher | Modul Peralatan (APAR) |
| **SNI 03-3987-1995** — Pemasangan Alat Pemadam Api Ringan | Modul Peralatan (APAR placement) |
| **PLN NP Policy: Pedoman CSMS** | Underwriting Survey, Risk Survey |
| **PLN NP Policy: Panduan ERM** | ERM Risk Register (risk rating scale) |

---

## Catatan Pengembang

### Hal yang Perlu Dikoordinasikan dengan Tim Unit

1. **Denah Unit (Plant Layout SVG)** — Minta ke bagian engineering UP Tenayan untuk mendapatkan denah unit dalam format digital. Ini dibutuhkan untuk fitur plant map di Modul D dan E.

2. **Kode Area & Sub-lokasi** — Konfirmasi list area dan sub-lokasi yang digunakan di lapangan agar konsisten dengan sistem yang sudah ada (Ellipse, IZAT).

3. **Data HIRARC Existing** — Minta file Excel HIRARC yang sudah ada untuk diimport ke ERM Risk Register. Ini akan menghemat waktu dan memastikan data historis tidak hilang.

4. **Inventory Awal Peralatan** — Lakukan survey cepat inventory semua alat tanggap darurat yang ada sebelum modul D go-live. Bisa dilakukan paralel dengan pengembangan.

5. **SOP Pengisian Form** — Untuk survey lapangan dan inspeksi alat, perlu dibuat SOP singkat agar data yang diinput konsisten antar pengguna.

6. **Integrasi dengan IZAT** — Pertimbangkan apakah perlu integrasi data dari IZAT (patrol system yang sudah ada) atau cukup berjalan paralel. Prioritaskan jika ada API yang tersedia.

---

*Dokumen ini akan diperbarui seiring perkembangan pengembangan.*  
*Versi dokumen: 2.0.0*  
*Terakhir diperbarui: Juni 2025*  
*Penyusun: Tim Pengembang INSIGHT-K3 — UP Tenayan, PLN Nusantara Power*
