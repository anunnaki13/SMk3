# SMK3 Audit Application - PLN Nusantara Power PLTU Tenayan

Aplikasi audit **Sistem Manajemen Keselamatan dan Kesehatan Kerja (SMK3)** untuk PLN Nusantara Power PLTU Tenayan. Aplikasi ini memfasilitasi proses audit berbasis 12 kriteria dan 166 klausul SMK3 dengan dukungan AI untuk analisis dokumen dan penilaian auditor.

## 📋 Deskripsi

Aplikasi full-stack untuk mengelola proses audit SMK3 yang mencakup:
- Upload dan manajemen dokumen evidence per klausul
- Analisis dokumen menggunakan AI (Google Gemini)
- Penilaian dan assessment oleh auditor
- Dashboard statistik dan progress audit
- Generasi laporan PDF komprehensif
- Role-based access (Auditor & Auditee)

## 🚀 Tech Stack

### Backend
- **FastAPI** (Python 3.11+)
- **MongoDB** - Database NoSQL untuk data audit
- **GridFS** - Penyimpanan file dokumen
- **Motor** - MongoDB async driver
- **Pydantic** - Data validation
- **Passlib + Bcrypt** - Password hashing
- **PyJWT** - Authentication
- **ReportLab** - PDF generation
- **Emergent Integrations** - Google Gemini AI integration

### Frontend
- **React** (v18+)
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Lucide React** - Icons
- **date-fns** - Date manipulation
- **Sonner** - Toast notifications

## 💻 Supported Platforms

Aplikasi ini dapat dijalankan di:
- ✅ **Linux** (Ubuntu 20.04+, Debian 11+, CentOS 8+)
- ✅ **Windows** (Windows 10/11, Windows Server 2019+)
- ✅ **macOS** (dengan sedikit penyesuaian)

**Panduan Instalasi:**
- **Linux/Ubuntu**: Lihat [INSTALL.md](INSTALL.md)
- **Windows**: Lihat [INSTALL_WINDOWS.md](INSTALL_WINDOWS.md)

## 📦 Prerequisites

Sebelum instalasi, pastikan sistem Anda memiliki:

1. **Python 3.11 atau lebih tinggi**
   ```bash
   # Linux/Mac
   python3 --version
   
   # Windows
   python --version
   ```

2. **Node.js 18+ dan Yarn**
   ```bash
   node --version
   yarn --version
   ```

3. **MongoDB 6.0+**
   - Install MongoDB Community Edition
   - Pastikan MongoDB service berjalan di `localhost:27017`
   
   ```bash
   # Linux
   sudo systemctl status mongod
   
   # Windows
   sc query MongoDB
   ```

4. **Git**
   ```bash
   git --version
   ```

## 🔧 Instalasi Local

### 1. Clone Repository

```bash
git clone <repository-url>
cd smk3-audit-app
```

### 2. Setup Backend

```bash
cd backend

# Buat virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# atau
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

**File `backend/.env`**: Buat file `.env` di folder `backend/`
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=smk3_audit_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256
EMERGENT_LLM_KEY=your-emergent-llm-key-or-gemini-api-key
```

**Catatan**: 
- Untuk `EMERGENT_LLM_KEY`, Anda bisa menggunakan Emergent LLM Key atau API key Google Gemini langsung
- Generate `JWT_SECRET` yang kuat untuk production

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
yarn install
```

**File `frontend/.env`**: Buat file `.env` di folder `frontend/`
```env
REACT_APP_BACKEND_URL=http://localhost:8001
PORT=3000
```

### 4. Populate Initial Data (Optional)

Jika Anda ingin mengisi database dengan 166 klausul SMK3:

```bash
cd backend
python populate_all_166_clauses.py
# atau jika ada script terpisah:
python add_remaining_61_clauses.py
```

**Atau** gunakan endpoint seed data via API (setelah server berjalan):
```bash
curl -X POST http://localhost:8001/api/seed-data \
  -H "Content-Type: application/json" \
  -d '{"admin_password": "admin123"}'
```

## 🏃 Menjalankan Aplikasi

### Development Mode

#### Terminal 1: Jalankan Backend
```bash
cd backend
source venv/bin/activate  # aktifkan virtual env
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Backend akan berjalan di: `http://localhost:8001`

#### Terminal 2: Jalankan Frontend
```bash
cd frontend
yarn start
```

Frontend akan berjalan di: `http://localhost:3000`

### Production Mode

Untuk production, gunakan supervisor atau systemd untuk mengelola service.

**Contoh dengan Supervisor** (recommended):

1. Install supervisor:
```bash
sudo apt-get install supervisor
```

2. Buat config file `/etc/supervisor/conf.d/smk3-app.conf`:
```ini
[program:smk3-backend]
directory=/path/to/app/backend
command=/path/to/app/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
autostart=true
autorestart=true
stderr_logfile=/var/log/smk3-backend.err.log
stdout_logfile=/var/log/smk3-backend.out.log

[program:smk3-frontend]
directory=/path/to/app/frontend
command=yarn start
autostart=true
autorestart=true
stderr_logfile=/var/log/smk3-frontend.err.log
stdout_logfile=/var/log/smk3-frontend.out.log
```

3. Reload supervisor:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start smk3-backend smk3-frontend
```

## 📁 Struktur Project

```
smk3-audit-app/
├── backend/
│   ├── server.py                 # Main FastAPI application
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # Environment variables (create this)
│   ├── populate_all_166_clauses.py
│   └── add_remaining_61_clauses.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Axios instance with auth
│   │   ├── components/
│   │   │   ├── Layout.js         # App layout with navigation
│   │   │   └── ui/               # Shadcn UI components
│   │   ├── pages/
│   │   │   ├── AuthPage.js       # Login/Register
│   │   │   ├── DashboardPage.js  # Dashboard dengan statistik
│   │   │   ├── CriteriaPage.js   # Daftar kriteria
│   │   │   ├── ClausesPage.js    # Daftar klausul per kriteria
│   │   │   ├── AuditPage.js      # Upload evidence & penilaian auditor
│   │   │   ├── RecommendationsPage.js
│   │   │   └── ReportsPage.js    # Generasi laporan PDF
│   │   ├── App.js                # Main app component
│   │   └── App.css
│   ├── package.json
│   ├── .env                      # Environment variables (create this)
│   └── tailwind.config.js
│
├── README.md                     # This file
└── .gitignore
```

## 🔑 Default Credentials

Setelah seed data, gunakan credentials berikut untuk login:

### Admin/Auditor
- Email: `auditor@auditor.com`
- Password: `password123`

### Auditee
- Email: `auditee@auditee.com`
- Password: `password123`

**⚠️ PENTING**: Ganti password default ini setelah instalasi pertama!

## 🎯 Fitur Utama

### 1. Authentication & Authorization
- JWT-based authentication
- Role-based access control (Auditor & Auditee)
- Protected routes

### 2. Evidence Management
- Upload dokumen per klausul (PDF, images, dll)
- Preview dokumen (PDF viewer, image viewer)
- Download single file atau ZIP (per klausul, per kriteria, semua)
- Delete dokumen dengan konfirmasi
- Cross-user visibility (auditor dapat melihat upload auditee)

### 3. AI-Assisted Analysis
- Analisis dokumen menggunakan Google Gemini
- Knowledge base spesifik per klausul
- Scoring dan reasoning dari AI
- AI sebagai tools bantuan (bukan keputusan final)

### 4. Auditor Assessment
- Form penilaian auditor dengan 3 status:
  - ✅ **Confirm** (Sesuai/Memenuhi Persyaratan)
  - ⚠️ **Non-Confirm Minor** (Temuan Kecil)
  - ❌ **Non-Confirm Major** (Temuan Serius)
- Catatan dan rekomendasi auditor
- Tanggal kesepakatan penyelesaian
- Status tersimpan dan dapat diupdate

### 5. Dashboard & Statistics
- Total klausul (166)
- Progress audit (klausul teraudit)
- **Pencapaian Audit**: `(confirm_count / 166) × 100%`
- Breakdown per status: Confirm, NC Minor, NC Major
- Statistik per kriteria (12 kriteria)
- Skor AI sebagai referensi

### 6. PDF Report Generation
- Ringkasan audit lengkap
- Detail penilaian auditor per klausul
- Catatan dan tanggal kesepakatan
- Analisis AI sebagai referensi
- Breakdown per kriteria
- Export ke PDF (ReportLab)

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest tests/
```

### Frontend Testing
```bash
cd frontend
yarn test
```

### Manual Testing with cURL

**Login:**
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"auditor@auditor.com","password":"password123"}'
```

**Get Dashboard Stats:**
```bash
curl -X GET http://localhost:8001/api/audit/dashboard \
  -H "Authorization: Bearer <your-token>"
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login

### Criteria & Clauses
- `GET /api/criteria` - Get semua kriteria
- `GET /api/clauses?criteria_id={id}` - Get klausul per kriteria

### Documents
- `POST /api/clauses/{clause_id}/upload` - Upload dokumen
- `GET /api/documents/{doc_id}/preview` - Preview dokumen
- `GET /api/documents/{doc_id}/download` - Download dokumen
- `DELETE /api/documents/{doc_id}` - Hapus dokumen
- `GET /api/clauses/{clause_id}/documents/download-all` - Download ZIP

### Audit
- `POST /api/audit/analyze/{clause_id}` - AI analysis
- `PUT /api/audit/results/{clause_id}/auditor-assessment` - Simpan penilaian auditor
- `GET /api/audit/dashboard` - Dashboard statistics

### Reports
- `POST /api/reports/generate` - Generate PDF report

### Utility
- `POST /api/seed-data` - Seed initial data
- `POST /api/hard-reset` - Reset semua data audit

## 🔒 Security Notes

1. **Ganti JWT_SECRET** di production dengan value yang sangat kuat
2. **Ganti default passwords** setelah instalasi
3. **Enable HTTPS** untuk production deployment
4. **Setup firewall** dan batasi akses MongoDB hanya dari localhost
5. **Backup database** secara regular
6. **Limit file upload size** sesuai kebutuhan (default: 10MB per file)

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Pastikan MongoDB berjalan
sudo systemctl start mongod
sudo systemctl status mongod

# Cek connection string di .env
MONGO_URL=mongodb://localhost:27017
```

### Backend tidak start
```bash
# Pastikan semua dependencies terinstall
pip install -r requirements.txt

# Cek apakah port 8001 sudah digunakan
lsof -i :8001
```

### Frontend tidak compile
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
yarn install
```

### CORS Error
Pastikan `REACT_APP_BACKEND_URL` di frontend/.env sesuai dengan backend URL.

## 📝 Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `smk3_audit_db` |
| `JWT_SECRET` | Secret key untuk JWT | `your-secret-key` |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `EMERGENT_LLM_KEY` | API key untuk Gemini/LLM | `your-api-key` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | Backend API URL | `http://localhost:8001` |
| `PORT` | Frontend dev server port | `3000` |

## 📄 License

[Specify your license here]

## 👥 Contributors

- [Your Name/Team]

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di GitHub repository atau hubungi tim development.

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Maintained by**: PLN Nusantara Power PLTU Tenayan Development Team
