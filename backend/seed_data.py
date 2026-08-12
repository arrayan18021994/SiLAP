import datetime
from app.database.session import SessionLocal, Base, engine
from app.database.models.employees import Employee, EmployeeRank, EmployeePosition, Rank, Position
from app.database.models.family import FamilyMember
from app.services.reminder_engine import ReminderEngine
from app.main import ensure_sqlite_columns

def seed_simulation_data():
    Base.metadata.create_all(bind=engine)
    ensure_sqlite_columns()
    db = SessionLocal()

    try:
        # Clear existing data first for clean 10 test dataset
        from app.database.models.reminders import ReminderRecord
        db.query(ReminderRecord).delete()
        db.query(FamilyMember).delete()
        db.query(Employee).delete()
        db.commit()

        sample_employees = [
            {
                "nip": "197203151996031001",
                "full_name": "Dr. H. Ahmad Supriyadi, M.Si.",
                "nik": "3201123456780001",
                "birth_place": "Bandung",
                "birth_date": datetime.date(1972, 3, 15),
                "gender": "L",
                "asn_status": "PNS",
                "employment_status": "Aktif",
                "rank": "IV/d",
                "position": "Kepala Badan Kepegawaian Daerah",
                "opd": "Badan Kepegawaian Daerah",
                "marital_status": "KAWIN",
                "mkg_years": 26,
                "mkg_months": 4,
                "tmt_mkg": datetime.date(2022, 4, 1),
                "address": "Jl. Merdeka No. 45, Bandung",
                "phone": "081234567890",
                "email": "ahmad.supriyadi@pemda.go.id",
                "spouse": {
                    "relationship_type": "PASANGAN",
                    "name": "Hj. Siti Aminah, S.Pd.",
                    "gender": "P",
                    "nik": "3201123456780002",
                    "birth_place": "Cimahi",
                    "birth_date": datetime.date(1974, 8, 15),
                    "marriage_date": datetime.date(1998, 5, 20),
                    "job": "Guru PNS"
                },
                "children": [
                    {
                        "relationship_type": "ANAK",
                        "name": "Budi Santoso",
                        "gender": "L",
                        "nik": "3201123456780003",
                        "birth_place": "Bandung",
                        "birth_date": datetime.date(2003, 2, 10), # Age 23 -> Has Surat Aktif Kuliah
                        "child_status": "Anak Kandung",
                        "education": "S1 Universitas Padjadjaran",
                        "school_letter_number": "421/102/UNPAD/2025",
                        "school_letter_date": datetime.date(2025, 1, 15),
                        "school_letter_valid_until": datetime.date(2026, 8, 31),
                        "status": "ACTIVE"
                    },
                    {
                        "relationship_type": "ANAK",
                        "name": "Anisa Supriyadi",
                        "gender": "P",
                        "nik": "3201123456780004",
                        "birth_place": "Bandung",
                        "birth_date": datetime.date(2008, 11, 24), # Age 17
                        "child_status": "Anak Kandung",
                        "education": "SMA Negeri 1 Bandung",
                        "status": "ACTIVE"
                    }
                ]
            },
            {
                "nip": "197805102001032002",
                "full_name": "Drs. M. Ridwan Kusuma, M.Si.",
                "nik": "3201987654320002",
                "birth_place": "Cirebon",
                "birth_date": datetime.date(1978, 5, 10),
                "gender": "L",
                "asn_status": "PNS",
                "employment_status": "Aktif",
                "rank": "IV/b",
                "position": "Sekretaris Inspektorat Daerah",
                "opd": "Inspektorat Daerah",
                "marital_status": "KAWIN",
                "mkg_years": 22,
                "mkg_months": 10,
                "tmt_mkg": datetime.date(2023, 4, 1),
                "address": "Jl. Siliwangi No. 12, Cirebon",
                "phone": "081298765432",
                "spouse": {
                    "relationship_type": "PASANGAN",
                    "name": "Dra. Hidayati",
                    "gender": "P",
                    "birth_date": datetime.date(1980, 2, 12),
                    "marriage_date": datetime.date(2002, 6, 10),
                    "job": "PNS Dinas Pendidikan"
                },
                "children": [
                    {
                        "relationship_type": "ANAK",
                        "name": "Muhammad Rofiq",
                        "gender": "L",
                        "birth_date": datetime.date(2005, 3, 20),
                        "status": "ACTIVE"
                    }
                ]
            },
            {
                "nip": "198207192006042005",
                "full_name": "Dra. Ratna Sarumpaet, M.Pd.",
                "nik": "3202987654320001",
                "birth_place": "Garut",
                "birth_date": datetime.date(1982, 7, 19),
                "gender": "P",
                "asn_status": "PNS",
                "employment_status": "Aktif",
                "rank": "IV/a",
                "position": "Kabid Pengembangan Karir",
                "opd": "Badan Kepegawaian Daerah",
                "marital_status": "KAWIN",
                "mkg_years": 18,
                "mkg_months": 3,
                "tmt_mkg": datetime.date(2023, 4, 1),
                "address": "Jl. Sunda No. 12, Bandung",
                "phone": "081987654321",
                "spouse": {
                    "relationship_type": "PASANGAN",
                    "name": "Ir. Bambang Triyono",
                    "gender": "L",
                    "birth_date": datetime.date(1980, 4, 10),
                    "marriage_date": datetime.date(2005, 9, 12),
                    "job": "Wiraswasta"
                },
                "children": [
                    {
                        "relationship_type": "ANAK",
                        "name": "Rian Triyono",
                        "gender": "L",
                        "birth_date": datetime.date(2004, 8, 10), # Age 21 -> Triggers 21+ reminder!
                        "child_status": "PERLU_SURAT_KULIAH",
                        "education": "Universitas Pendidikan Indonesia",
                        "status": "INACTIVE"
                    }
                ]
            },
            {
                "nip": "198509122009021004",
                "full_name": "Ir. Bambang Suryadi, S.T., M.T.",
                "nik": "3203123456780005",
                "birth_place": "Sukabumi",
                "birth_date": datetime.date(1985, 9, 12),
                "gender": "L",
                "asn_status": "PNS",
                "employment_status": "Aktif",
                "rank": "III/d",
                "position": "Kabid Perencanaan & Pembangunan",
                "opd": "Dinas Pekerjaan Umum",
                "marital_status": "KAWIN",
                "mkg_years": 14,
                "mkg_months": 2,
                "tmt_mkg": datetime.date(2023, 10, 1),
                "address": "Jl. Bhayangkara No. 8, Sukabumi",
                "phone": "081345678901",
                "spouse": {
                    "relationship_type": "PASANGAN",
                    "name": "Novianti, S.E.",
                    "gender": "P",
                    "birth_date": datetime.date(1987, 11, 3),
                    "job": "Banker"
                },
                "children": [
                    {
                        "relationship_type": "ANAK",
                        "name": "Kania Suryadi",
                        "gender": "P",
                        "birth_date": datetime.date(2012, 4, 18),
                        "status": "ACTIVE"
                    },
                    {
                        "relationship_type": "ANAK",
                        "name": "Faris Suryadi",
                        "gender": "L",
                        "birth_date": datetime.date(2016, 7, 22),
                        "status": "ACTIVE"
                    }
                ]
            },
            {
                "nip": "198811042014021003",
                "full_name": "Hendrik Wijaya, S.Kom., M.T.",
                "nik": "3203456789010001",
                "birth_place": "Bogor",
                "birth_date": datetime.date(1988, 11, 4),
                "gender": "L",
                "asn_status": "PNS",
                "employment_status": "Aktif",
                "rank": "III/c",
                "position": "Analis Sistem Informasi",
                "opd": "Dinas Komunikasi dan Informatika",
                "marital_status": "KAWIN",
                "mkg_years": 10,
                "mkg_months": 0,
                "tmt_mkg": datetime.date(2024, 2, 1),
                "address": "Jl. Pajajaran No. 88, Bogor",
                "phone": "085678901234",
                "spouse": {
                    "relationship_type": "PASANGAN",
                    "name": "Dewi Sartika, S.E.",
                    "gender": "P",
                    "birth_date": datetime.date(1990, 1, 5),
                    "job": "Karyawan Swasta"
                },
                "children": [
                    {
                        "relationship_type": "ANAK",
                        "name": "Nabil Wijaya",
                        "gender": "L",
                        "birth_date": datetime.date(2018, 6, 12),
                        "child_status": "Anak Kandung",
                        "status": "ACTIVE"
                    }
                ]
            },
            {
                "nip": "199102142015032007",
                "full_name": "Fitri Handayani, S.E., M.Ak.",
                "nik": "3204123456780006",
                "birth_place": "Majalengka",
                "birth_date": datetime.date(1991, 2, 14),
                "gender": "P",
                "asn_status": "PNS",
                "employment_status": "Aktif",
                "rank": "III/b",
                "position": "Bendahara Pengeluaran BPKAD",
                "opd": "Badan Pengelola Keuangan Daerah",
                "marital_status": "KAWIN",
                "mkg_years": 8,
                "mkg_months": 5,
                "tmt_mkg": datetime.date(2023, 3, 1),
                "address": "Jl. KH Abdul Halim No. 44, Majalengka",
                "spouse": {
                    "relationship_type": "PASANGAN",
                    "name": "Aditya Permana, S.T.",
                    "gender": "L",
                    "job": "Konsultan IT"
                },
                "children": [
                    {
                        "relationship_type": "ANAK",
                        "name": "Zhafira Permana",
                        "gender": "P",
                        "birth_date": datetime.date(2020, 10, 5),
                        "status": "ACTIVE"
                    }
                ]
            },
            {
                "nip": "199304152019032008",
                "full_name": "Nabila Kartika, S.STP.",
                "nik": "3204567890120002",
                "birth_place": "Sumedang",
                "birth_date": datetime.date(1993, 4, 15),
                "gender": "P",
                "asn_status": "PNS",
                "employment_status": "Aktif",
                "rank": "III/a",
                "position": "Pengelola Layanan Kepegawaian",
                "opd": "Sekretariat Daerah",
                "marital_status": "BELUM KAWIN",
                "mkg_years": 5,
                "mkg_months": 6,
                "tmt_mkg": datetime.date(2024, 3, 1),
                "address": "Jl. Asia Afrika No. 23, Bandung",
                "phone": "087890123456",
                "children": []
            },
            {
                "nip": "199001252023211002",
                "full_name": "Rahmat Hidayat, S.P.",
                "nik": "3205678901230003",
                "birth_place": "Tasikmalaya",
                "birth_date": datetime.date(1990, 1, 25),
                "gender": "L",
                "asn_status": "PPPK Penuh Waktu",
                "employment_status": "Aktif",
                "rank": "IX",
                "position": "Penyuluh Pertanian Ahli Pertama",
                "opd": "Dinas Tanaman Pangan dan Hortikultura",
                "marital_status": "KAWIN",
                "mkg_years": 3,
                "mkg_months": 2,
                "tmt_mkg": datetime.date(2023, 6, 1),
                "address": "Jl. Raya Singaparna No. 10, Tasikmalaya",
                "spouse": {
                    "relationship_type": "PASANGAN",
                    "name": "Nurhayati",
                    "gender": "P",
                    "job": "Ibu Rumah Tangga"
                },
                "children": [
                    {
                        "relationship_type": "ANAK",
                        "name": "Aura Hidayat",
                        "gender": "P",
                        "birth_date": datetime.date(2019, 9, 30),
                        "status": "ACTIVE"
                    },
                    {
                        "relationship_type": "ANAK",
                        "name": "Fadil Hidayat",
                        "gender": "L",
                        "birth_date": datetime.date(2022, 12, 15),
                        "status": "ACTIVE"
                    }
                ]
            },
            {
                "nip": "199406182024211005",
                "full_name": "Danang Prasetya, S.Pd.",
                "nik": "3205123456780007",
                "birth_place": "Kuningan",
                "birth_date": datetime.date(1994, 6, 18),
                "gender": "L",
                "asn_status": "PPPK Penuh Waktu",
                "employment_status": "Aktif",
                "rank": "IX",
                "position": "Guru Matematika Ahli Pertama",
                "opd": "Dinas Pendidikan Kota Sabang",
                "marital_status": "KAWIN",
                "mkg_years": 2,
                "mkg_months": 1,
                "tmt_mkg": datetime.date(2024, 1, 1),
                "address": "Jl. Ahmad Yani No. 15, Sabang",
                "spouse": {
                    "relationship_type": "PASANGAN",
                    "name": "Lestari Anggraini",
                    "gender": "P",
                    "job": "Wiraswasta"
                },
                "children": [
                    {
                        "relationship_type": "ANAK",
                        "name": "Ghani Prasetya",
                        "gender": "L",
                        "birth_date": datetime.date(2021, 5, 14),
                        "status": "ACTIVE"
                    }
                ]
            },
            {
                "nip": "199609102024212004",
                "full_name": "Siti Nurhaliza, A.Md.Keb.",
                "nik": "3206789012340004",
                "birth_place": "Ciamis",
                "birth_date": datetime.date(1996, 9, 10),
                "gender": "P",
                "asn_status": "PPPK Paruh Waktu",
                "employment_status": "Aktif",
                "rank": "VII",
                "position": "Bidan Pelaksana",
                "opd": "Dinas Kesehatan / Puskesmas Pembantu",
                "marital_status": "KAWIN",
                "mkg_years": 1,
                "mkg_months": 4,
                "address": "Jl. Jenderal Sudirman No. 5, Ciamis",
                "children": []
            }
        ]

        inserted_count = 0
        for data in sample_employees:
            existing = db.query(Employee).filter(Employee.nip == data["nip"]).first()
            if existing:
                print(f"Skipping existing employee NIP: {data['nip']}")
                continue

            children = data.pop("children", [])
            spouse = data.pop("spouse", None)

            emp = Employee(**data)
            db.add(emp)
            db.flush() # get emp.id

            if spouse:
                sp_member = FamilyMember(
                    employee_id=emp.id,
                    relationship_type=spouse.get("relationship_type", "PASANGAN"),
                    name=spouse.get("name"),
                    gender=spouse.get("gender"),
                    nik=spouse.get("nik"),
                    birth_place=spouse.get("birth_place"),
                    birth_date=spouse.get("birth_date"),
                    marriage_date=spouse.get("marriage_date"),
                    job=spouse.get("job"),
                    status="ACTIVE"
                )
                db.add(sp_member)

            for child in children:
                ch_member = FamilyMember(
                    employee_id=emp.id,
                    relationship_type=child.get("relationship_type", "ANAK"),
                    name=child.get("name"),
                    gender=child.get("gender"),
                    nik=child.get("nik"),
                    birth_place=child.get("birth_place"),
                    birth_date=child.get("birth_date"),
                    child_status=child.get("child_status", "Anak Kandung"),
                    education=child.get("education"),
                    school_letter_number=child.get("school_letter_number"),
                    school_letter_date=child.get("school_letter_date"),
                    school_letter_valid_until=child.get("school_letter_valid_until"),
                    status=child.get("status", "ACTIVE")
                )
                db.add(ch_member)

            inserted_count += 1

        db.commit()
        print(f"Successfully inserted {inserted_count} complete test employees with family members!")

        # Refresh reminder engine for age 21+ reminders
        ReminderEngine.refresh_child_age_reminders(db)
        print("Child age 21+ reminders refreshed successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_simulation_data()
