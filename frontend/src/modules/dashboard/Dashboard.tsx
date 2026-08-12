import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import EmployeeList from '../employees/EmployeeList';
import EmployeeProfile from '../employees/EmployeeProfile';
import ImportWizard from '../imports/ImportWizard';
import LeaveDashboard from '../leave/LeaveDashboard';
import RegulationDashboard from '../regulation/RegulationDashboard';
import PeriodicSalaryDashboard from '../personnel/salary/PeriodicSalaryDashboard';
import PromotionDashboard from '../personnel/promotion/PromotionDashboard';
import FamilyAllowanceDashboard from '../personnel/family/FamilyAllowanceDashboard';
import SystemSettings from '../settings/SystemSettings';
import Logo from '../../components/Logo';
import './Dashboard.css';

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const DashboardHome = ({ currentDate, searchQuery = '' }: { currentDate: Date; searchQuery?: string }) => {
  const navigate = useNavigate();
  const [pagePangkat, setPagePangkat] = React.useState(0);
  const [pageKGB, setPageKGB] = React.useState(0);

  const pegawaiPangkat = [
    { nama: 'Dina Marlina, S.T.', nip: '198705052012052005' },
    { nama: 'Eko Prasetyo, S.Kom.', nip: '199106062016061006' },
    { nama: 'Fajar Nugroho', nip: '199201012015041001' },
    { nama: 'Gita Pertiwi', nip: '198802022010012002' },
    { nama: 'Hendra Setiawan', nip: '198503032009021003' },
    { nama: 'Indah Kusuma', nip: '199004042014032004' },
    { nama: 'Joko Widodo', nip: '198005052000052005' },
    { nama: 'Kiki Amalia', nip: '199306062017061006' },
  ];

  const pegawaiKGB = [
    { nama: 'Ahmad Budi, S.E.', nip: '198501012010011001' },
    { nama: 'Budi Santoso, S.Sos.', nip: '197902022005022002' },
    { nama: 'Citra Lestari, S.E.', nip: '199203032015032003' },
    { nama: 'Dewi Sartika', nip: '198804042011012004' },
    { nama: 'Erwin Rommel', nip: '198705052012021005' },
    { nama: 'Fiona Putri', nip: '199506062019032006' },
    { nama: 'Galih Ginanjar', nip: '199007072014071007' },
    { nama: 'Hana Anisa', nip: '199408082018082008' },
    { nama: 'Ivan Gunawan', nip: '198909092013091009' },
    { nama: 'Jihan Fahira', nip: '198610102011102010' },
    { nama: 'Kevin Aprilio', nip: '199611112020111011' },
    { nama: 'Luna Maya', nip: '198312122008122012' },
  ];

  React.useEffect(() => {
    setPagePangkat(0);
    setPageKGB(0);
  }, [searchQuery]);

  const searchLower = searchQuery.trim().toLowerCase();

  const filteredPangkat = pegawaiPangkat.filter(p => 
    !searchLower || p.nama.toLowerCase().includes(searchLower) || p.nip.toLowerCase().includes(searchLower)
  );

  const filteredKGB = pegawaiKGB.filter(p => 
    !searchLower || p.nama.toLowerCase().includes(searchLower) || p.nip.toLowerCase().includes(searchLower)
  );

  const monthName = MONTHS[currentDate.getMonth()].toUpperCase();
  const year = currentDate.getFullYear();

  const next1Month = new Date(currentDate); next1Month.setMonth(next1Month.getMonth() + 1);
  const next2Month = new Date(currentDate); next2Month.setMonth(next2Month.getMonth() + 2);

  // Dynamic counts based on month to simulate data changing
  const baseMultiplier = currentDate.getMonth() + 1;
  const kgbCount = 12 + (baseMultiplier % 3);
  const pangkatCount = 8 + (baseMultiplier % 2);
  const tunjCount = 5 + (baseMultiplier % 4);
  const cutiCount = 7 + (baseMultiplier % 5);

  const [employeeStats, setEmployeeStats] = React.useState({
    total: 0,
    pns: 0,
    pppkFullTime: 0,
    pppkPartTime: 0,
    opdCount: 0
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/v1/employees/');
        if (res.ok) {
          const employees = await res.json();
          let pns = 0;
          let pppkFull = 0;
          let pppkPart = 0;
          const opds = new Set<string>();

          employees.forEach((emp: any) => {
            const status = (emp.status || emp.asn_status || '').toUpperCase();
            if (status.includes('PARUH') || status.includes('PART')) {
              pppkPart++;
            } else if (status.includes('PENUH') || status.includes('FULL') || status.includes('PPPK')) {
              pppkFull++;
            } else {
              pns++;
            }
            if (emp.opd) opds.add(emp.opd);
          });

          setEmployeeStats({
            total: employees.length,
            pns,
            pppkFullTime: pppkFull,
            pppkPartTime: pppkPart,
            opdCount: opds.size || 1
          });
        }
      } catch (e) {
        console.error('Error fetching employee stats:', e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-content">
      <div className="dashboard-header" style={{ marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>DASHBOARD</h2>
      </div>

      <div className="dashboard-stats" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/dashboard/employees')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-main)' }}>Total ASN</span>
            <span style={{ fontSize: '1rem' }}>👥</span>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); navigate('/dashboard/employees?status=PNS'); }}>
              <span style={{ color: 'var(--text-muted)' }}>PNS:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{employeeStats.pns}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); navigate('/dashboard/employees?status=PPPK Penuh Waktu'); }}>
              <span style={{ color: 'var(--text-muted)' }}>PPPK Penuh Waktu:</span>
              <span style={{ fontWeight: 'bold', color: '#8b5cf6' }}>{employeeStats.pppkFullTime}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); navigate('/dashboard/employees?status=PPPK Paruh Waktu'); }}>
              <span style={{ color: 'var(--text-muted)' }}>PPPK Paruh Waktu:</span>
              <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{employeeStats.pppkPartTime}</span>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/dashboard/kepangkatan')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-main)' }}>Usulan Kenaikan Pangkat</span>
            <span style={{ fontSize: '1rem' }}>📈</span>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Harus diproses:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{pangkatCount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sudah diproses:</span>
              <span style={{ fontWeight: 'bold', color: '#10b981' }}>{Math.floor(pangkatCount / 2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Belum diproses:</span>
              <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{pangkatCount - Math.floor(pangkatCount / 2)}</span>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/dashboard/gaji-berkala')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-main)' }}>Usulan Gaji Berkala</span>
            <span style={{ fontSize: '1rem' }}>💰</span>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Harus diproses:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{kgbCount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sudah diproses:</span>
              <span style={{ fontWeight: 'bold', color: '#10b981' }}>{Math.floor(kgbCount / 2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Belum diproses:</span>
              <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{kgbCount - Math.floor(kgbCount / 2)}</span>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/dashboard/tunjangan')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-main)' }}>Usulan Tunjangan Keluarga</span>
            <span style={{ fontSize: '1rem' }}>👪</span>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sudah diproses:</span>
              <span style={{ fontWeight: 'bold', color: '#10b981' }}>{tunjCount}</span>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/dashboard/leave')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-main)' }}>Usulan Cuti</span>
            <span style={{ fontSize: '1rem' }}>📅</span>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sudah diproses:</span>
              <span style={{ fontWeight: 'bold', color: '#10b981' }}>{cutiCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-grid-left">
          <div className="dashboard-header mt-4" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--text-main)' }}>PERLU DIUSULKAN BULAN INI</h3>
          </div>

          <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-main)', textAlign: 'left' }}>
                  <th colSpan={3} style={{ padding: '0.75rem', background: 'var(--bg-surface-hover)', fontSize: '13px' }}>{monthName} {year}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>Kenaikan Pangkat</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--text-main)' }}>{pangkatCount} pegawai</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}><span style={{ cursor: 'pointer', color: 'var(--primary-color)' }} onClick={() => navigate('/dashboard/kepangkatan')}>[Lihat Daftar]</span></td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>Gaji Berkala</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--text-main)' }}>{kgbCount} pegawai</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}><span style={{ cursor: 'pointer', color: 'var(--primary-color)' }} onClick={() => navigate('/dashboard/gaji-berkala')}>[Lihat Daftar]</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-grid-right">
          <div className="dashboard-header mt-4" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--text-main)' }}>PERENCANAAN ADMINISTRASI</h3>
          </div>

          <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'center' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Layanan</th>
                  <th style={{ padding: '0.75rem' }}>{MONTHS[currentDate.getMonth()].substring(0, 3).toUpperCase()}</th>
                  <th style={{ padding: '0.75rem' }}>{MONTHS[next1Month.getMonth()].substring(0, 3).toUpperCase()}</th>
                  <th style={{ padding: '0.75rem' }}>{MONTHS[next2Month.getMonth()].substring(0, 3).toUpperCase()}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-main)' }}>Kenaikan Pangkat</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate('/dashboard/kepangkatan')}>{pangkatCount}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>{pangkatCount - 2}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>{pangkatCount + 1}</td>
                </tr>
                <tr style={{ textAlign: 'center' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-main)' }}>Gaji Berkala</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate('/dashboard/gaji-berkala')}>{kgbCount}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>{kgbCount + 2}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>{kgbCount - 1}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="dashboard-header mt-4" style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--text-main)' }}>DAFTAR PEGAWAI PERLU TINDAK LANJUT</h3>
      </div>

      <div className="dashboard-grid" style={{ marginTop: '0' }}>
        <div className="dashboard-grid-left">
          <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface-hover)' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>Kenaikan Pangkat</strong>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Nama</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>NIP</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPangkat.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredPangkat.slice(pagePangkat * 5, (pagePangkat + 1) * 5).map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-main)' }}>{p.nama}</td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-main)' }}>{p.nip}</td>
                      <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}><span style={{ cursor: 'pointer', color: 'var(--primary-color)' }} onClick={() => navigate('/dashboard/kepangkatan')}>Proses</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-hover)', borderTop: '1px solid var(--border-color)', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                {filteredPangkat.length > 0 ? `Hal ${pagePangkat + 1} dari ${Math.ceil(filteredPangkat.length / 5)}` : '0 Data'}
              </span>
              <div>
                <button className="btn-text" style={{ padding: '2px 8px', marginRight: '4px' }} disabled={pagePangkat === 0} onClick={() => setPagePangkat(p => p - 1)}>◀</button>
                <button className="btn-text" style={{ padding: '2px 8px' }} disabled={filteredPangkat.length === 0 || (pagePangkat + 1) * 5 >= filteredPangkat.length} onClick={() => setPagePangkat(p => p + 1)}>▶</button>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid-right">
          <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface-hover)' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>Gaji Berkala</strong>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Nama</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>NIP</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredKGB.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredKGB.slice(pageKGB * 5, (pageKGB + 1) * 5).map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-main)' }}>{p.nama}</td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-main)' }}>{p.nip}</td>
                      <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}><span style={{ cursor: 'pointer', color: 'var(--primary-color)' }} onClick={() => navigate('/dashboard/gaji-berkala')}>Proses</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-hover)', borderTop: '1px solid var(--border-color)', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                {filteredKGB.length > 0 ? `Hal ${pageKGB + 1} dari ${Math.ceil(filteredKGB.length / 5)}` : '0 Data'}
              </span>
              <div>
                <button className="btn-text" style={{ padding: '2px 8px', marginRight: '4px' }} disabled={pageKGB === 0} onClick={() => setPageKGB(p => p - 1)}>◀</button>
                <button className="btn-text" style={{ padding: '2px 8px' }} disabled={filteredKGB.length === 0 || (pageKGB + 1) * 5 >= filteredKGB.length} onClick={() => setPageKGB(p => p + 1)}>▶</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [isLayananOpen, setIsLayananOpen] = React.useState(true);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const [unreadNotifications, setUnreadNotifications] = React.useState(3);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [realTime, setRealTime] = React.useState(new Date());
  const [theme, setTheme] = React.useState('light');

  // Search state for Tindak Lanjut search
  const [searchQuery, setSearchQuery] = React.useState('');

  // Dummy data untuk simulasi: Pertama kali terdaftar Juli 2026 (Bulan index 6)
  const registrationDate = new Date(2026, 6);

  React.useEffect(() => {
    const timer = setInterval(() => setRealTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = (date: Date) => {
    const hour = date.getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Set default theme to light when component mounts
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    setTheme('light');
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Collapsible Sidebar */}
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="sidebar-brand-logo" style={{ background: 'transparent' }}>
            <Logo style={{ height: '36px', width: 'auto' }} hideText={true} />
          </div>
          {!isSidebarCollapsed && (
            <div style={{ marginLeft: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ color: '#1e3a8a', fontWeight: '900', fontSize: '13px', lineHeight: '1.2' }}>SISTEM LAYANAN</span>
              <span style={{ color: '#eab308', fontWeight: '900', fontSize: '13px', lineHeight: '1.2' }}>ADMINISTRASI PEGAWAI</span>
            </div>
          )}
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <span className="nav-icon">🏠</span>
            <span>DASHBOARD</span>
          </Link>

          <Link to="/dashboard/employees" className={`nav-item ${location.pathname.includes('/employees') ? 'active' : ''}`}>
            <span className="nav-icon">👤</span>
            <span>DATA PEGAWAI</span>
          </Link>

          <div className="nav-item" onClick={() => setIsLayananOpen(!isLayananOpen)} style={{ cursor: 'pointer', justifyContent: isSidebarCollapsed ? 'center' : 'space-between' }}>
            {isSidebarCollapsed ? (
              <span className="nav-icon">📋</span>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="nav-icon">📋</span>
                  <span>LAYANAN</span>
                </div>
                <span className={`nav-chevron ${isLayananOpen ? 'open' : ''}`}>▼</span>
              </>
            )}
          </div>
          <div className={`nav-submenu ${isLayananOpen ? 'open' : ''}`}>
            <Link to="/dashboard/kepangkatan" className={`nav-item ${location.pathname.includes('/kepangkatan') ? 'active' : ''}`}>
              <span className="nav-icon" style={{ marginLeft: '1.5rem' }}>📈</span>
              <span>Kepangkatan</span>
            </Link>
            <Link to="/dashboard/gaji-berkala" className={`nav-item ${location.pathname.includes('/gaji-berkala') || location.pathname.includes('/kgb') ? 'active' : ''}`}>
              <span className="nav-icon" style={{ marginLeft: '1.5rem' }}>💰</span>
              <span>Gaji Berkala</span>
            </Link>
            <Link to="/dashboard/tunjangan" className={`nav-item ${location.pathname.includes('/tunjangan') ? 'active' : ''}`}>
              <span className="nav-icon" style={{ marginLeft: '1.5rem' }}>👪</span>
              <span>Tunjangan Keluarga</span>
            </Link>
            <Link to="/dashboard/leave" className={`nav-item ${location.pathname.includes('/leave') ? 'active' : ''}`}>
              <span className="nav-icon" style={{ marginLeft: '1.5rem' }}>📅</span>
              <span>Cuti</span>
            </Link>
          </div>

          <Link to="/dashboard/regulations" className={`nav-item ${location.pathname.includes('/regulations') ? 'active' : ''}`} style={{ marginTop: 'auto' }}>
            <span className="nav-icon">📚</span>
            <span>REGULASI</span>
          </Link>

          <Link to="/dashboard/settings" className={`nav-item ${location.pathname.includes('/settings') ? 'active' : ''}`}>
            <span className="nav-icon">⚙️</span>
            <span>PENGATURAN</span>
          </Link>
        </nav>
      </aside>

      <div className="dashboard-body-right">
        {/* Top Navigation Bar */}
        <header className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="topbar-left" style={{ flex: '1', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="sidebar-toggle" style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-main)', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', padding: 0, transition: 'all 0.2s' }} onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}>
              {isSidebarCollapsed ? '▶' : '◀'}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{getGreeting(realTime)},</span>
              <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-main)' }}>Administrator Kepegawaian</span>
            </div>
          </div>

          <div className="topbar-center" style={{ flex: '1', display: 'flex', justifyContent: 'center' }}>
            <div className="topbar-search" style={{ margin: 0, width: '100%', maxWidth: '300px', position: 'relative' }}>
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Cari..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: searchQuery ? '2rem' : '1rem', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} 
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', padding: 0 }}
                  title="Bersihkan"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="topbar-right" style={{ flex: '1.5', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--bg-app)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1px' }}>Periode Bulan</label>
                <select
                  value={currentDate.getMonth()}
                  onChange={(e) => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(parseInt(e.target.value));
                    setCurrentDate(newDate);
                  }}
                  style={{ background: 'transparent', border: 'none', fontSize: '12px', fontWeight: '600', color: 'var(--text-main)', outline: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {MONTHS.map((m, i) => {
                    if (currentDate.getFullYear() === registrationDate.getFullYear() && i < registrationDate.getMonth()) {
                      return null;
                    }
                    return <option key={m} value={i}>{m.toUpperCase()}</option>;
                  })}
                </select>
              </div>
              <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1px' }}>Tahun</label>
                <select
                  value={currentDate.getFullYear()}
                  onChange={(e) => {
                    const newYear = parseInt(e.target.value);
                    const newDate = new Date(currentDate);
                    newDate.setFullYear(newYear);
                    if (newYear === registrationDate.getFullYear() && currentDate.getMonth() < registrationDate.getMonth()) {
                      newDate.setMonth(registrationDate.getMonth());
                    }
                    setCurrentDate(newDate);
                  }}
                  style={{ background: 'transparent', border: 'none', fontSize: '12px', fontWeight: '600', color: 'var(--text-main)', outline: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {[2024, 2025, 2026, 2027, 2028, 2029, 2030].filter(y => y >= registrationDate.getFullYear()).map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-main)', textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
              <span>{realTime.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{realTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')} WIB</span>
            </div>

            <span className="topbar-icon" title="Ganti Tema" onClick={toggleTheme}>
              {theme === 'light' ? '☀️' : '🌙'}
            </span>

            <div className="notification-container">
              <span className={`topbar-icon ${unreadNotifications > 0 ? 'ringing' : ''}`} style={{ position: 'relative' }} title="Notifikasi" onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) setUnreadNotifications(0);
              }}>
                🔔
                {unreadNotifications > 0 && <span className="topbar-badge">{unreadNotifications}</span>}
              </span>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">Notifikasi</div>
                  <div className="notification-body">
                    <div className="notification-item">
                      <div className="notification-icon">🔴</div>
                      <div className="notification-content">
                        <h4>Gaji Berkala</h4>
                        <p>Ahmad akan jatuh tempo 12 hari lagi</p>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-icon">🟠</div>
                      <div className="notification-content">
                        <h4>Kenaikan Pangkat</h4>
                        <p>3 pegawai perlu diperiksa</p>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-icon">🟡</div>
                      <div className="notification-content">
                        <h4>Tunjangan Keluarga</h4>
                        <p>2 perubahan data keluarga</p>
                      </div>
                    </div>
                  </div>
                  <div className="notification-footer">
                    Lihat Semua
                  </div>
                </div>
              )}
            </div>

            <div className="profile-container" style={{ position: 'relative' }}>
              <div
                className="profile-trigger"
                onClick={() => setShowProfile(!showProfile)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.2rem', background: 'transparent', border: 'none' }}
              >
                <img src="https://upload.wikimedia.org/wikipedia/id/1/1a/Lambang_Kota_Sabang.png" referrerPolicy="no-referrer" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'contain', background: '#fff', padding: '2px' }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-main)' }}>Admin SiLAP</span>
              </div>

              {showProfile && (
                <div className="profile-dropdown" style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '240px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden' }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center' }}>
                    <img src="https://upload.wikimedia.org/wikipedia/id/1/1a/Lambang_Kota_Sabang.png" referrerPolicy="no-referrer" alt="Logo Pemda" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'contain', margin: '0 auto 8px', background: '#fff', padding: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                    <div style={{ fontWeight: 'bold', color: 'var(--text-main)', fontSize: '14px' }}>Administrator</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>BKPSDM</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pemerintah Kota Sabang</div>
                  </div>
                  <div style={{ padding: '0.5rem' }}>
                    <div className="profile-menu-item" onClick={() => { setShowProfile(false); navigate('/dashboard/settings'); }} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-main)', borderRadius: '4px', transition: 'background-color 0.2s' }}>
                      <span>⚙️</span> Pengaturan
                    </div>
                    <div className="profile-menu-item" onClick={handleLogout} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--error)', borderRadius: '4px', transition: 'background-color 0.2s', marginTop: '4px' }}>
                      <span>🚪</span> Keluar
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardHome currentDate={currentDate} searchQuery={searchQuery} />} />
            <Route path="/employees" element={<EmployeeList searchQuery={searchQuery} />} />
            <Route path="/employees/import" element={<ImportWizard />} />
            <Route path="/employees/:id" element={<EmployeeProfile />} />
            <Route path="/leave" element={<LeaveDashboard searchQuery={searchQuery} />} />
            <Route path="/gaji-berkala" element={<PeriodicSalaryDashboard searchQuery={searchQuery} />} />
            <Route path="/kepangkatan" element={<PromotionDashboard searchQuery={searchQuery} />} />
            <Route path="/tunjangan" element={<FamilyAllowanceDashboard searchQuery={searchQuery} />} />
            <Route path="/regulations" element={<RegulationDashboard />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="*" element={<div><h2 style={{ color: 'var(--text-main)', marginTop: '2rem' }}>Modul dalam pengembangan</h2><p style={{ color: 'var(--text-muted)' }}>Halaman ini belum tersedia.</p></div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
