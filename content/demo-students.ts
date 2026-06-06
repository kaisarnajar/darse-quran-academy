import type { OccupationValue } from "../lib/occupations";

/** Shared password for all demo student accounts (local / QA only). */
export const DEMO_STUDENT_PASSWORD = "Demo@2026";

export type DemoPaymentStatus = "approved" | "pending" | "declined";

export type DemoPayment = {
  status: DemoPaymentStatus;
  month: string;
  year: string;
};

export type DemoEnrollment = {
  courseId: string;
  status: "pending_approval" | "active" | "completed";
  payments?: DemoPayment[];
  completedAt?: string;
};

export type DemoStudent = {
  id: string;
  name: string;
  fatherName: string;
  occupation: OccupationValue;
  address: string;
  whatsapp: string;
  dateOfBirth: string;
  enrollments: DemoEnrollment[];
};

const jk = (district: string) => `${district}, J&K`;

/** 25 demo students with varied enrollments and payment history for local QA. */
export const demoStudents: DemoStudent[] = [
  {
    id: "01",
    name: "Ayesha Bhat",
    fatherName: "Ghulam Rasool Bhat",
    occupation: "STUDENT",
    address: jk("Srinagar"),
    whatsapp: "919900000001",
    dateOfBirth: "2004-03-12",
    enrollments: [{ courseId: "quran-nazira", status: "pending_approval" }],
  },
  {
    id: "02",
    name: "Mohammad Idrees",
    fatherName: "Abdul Ahad Dar",
    occupation: "WORKING",
    address: jk("Baramulla"),
    whatsapp: "919900000002",
    dateOfBirth: "1998-07-21",
    enrollments: [{ courseId: "hifz-foundation", status: "pending_approval" }],
  },
  {
    id: "03",
    name: "Fatima Jan",
    fatherName: "Ali Mohammad Wani",
    occupation: "HOMEMAKER",
    address: jk("Anantnag"),
    whatsapp: "919900000003",
    dateOfBirth: "1992-11-05",
    enrollments: [{ courseId: "tajweed-intensive", status: "pending_approval" }],
  },
  {
    id: "04",
    name: "Omar Farooq",
    fatherName: "Farooq Ahmad Malik",
    occupation: "IT_PROFESSIONAL",
    address: jk("Pulwama"),
    whatsapp: "919900000004",
    dateOfBirth: "1996-01-18",
    enrollments: [{ courseId: "arabic-grammar", status: "pending_approval" }],
  },
  {
    id: "05",
    name: "Kulsum Akhtar",
    fatherName: "Ghulam Nabi Lone",
    occupation: "TEACHER",
    address: jk("Shopian"),
    whatsapp: "919900000005",
    dateOfBirth: "1989-09-30",
    enrollments: [{ courseId: "fiqh-basics", status: "pending_approval" }],
  },
  {
    id: "06",
    name: "Bilal Ahmad",
    fatherName: "Mohammad Sultan",
    occupation: "SELF_EMPLOYED",
    address: jk("Budgam"),
    whatsapp: "919900000006",
    dateOfBirth: "1995-04-08",
    enrollments: [
      {
        courseId: "quran-nazira",
        status: "active",
        payments: [{ status: "approved", month: "01", year: "2026" }],
      },
    ],
  },
  {
    id: "07",
    name: "Nida Rashid",
    fatherName: "Abdul Rashid",
    occupation: "STUDENT",
    address: jk("Sopore"),
    whatsapp: "919900000007",
    dateOfBirth: "2003-06-14",
    enrollments: [
      {
        courseId: "hifz-foundation",
        status: "active",
        payments: [
          { status: "approved", month: "01", year: "2026" },
          { status: "approved", month: "02", year: "2026" },
        ],
      },
    ],
  },
  {
    id: "08",
    name: "Imran Yousuf",
    fatherName: "Yousuf Shah",
    occupation: "ENGINEER",
    address: jk("Kupwara"),
    whatsapp: "919900000008",
    dateOfBirth: "1994-12-02",
    enrollments: [
      {
        courseId: "tajweed-intensive",
        status: "active",
        payments: [
          { status: "approved", month: "01", year: "2026" },
          { status: "approved", month: "02", year: "2026" },
          { status: "approved", month: "03", year: "2026" },
        ],
      },
    ],
  },
  {
    id: "09",
    name: "Sana Mir",
    fatherName: "Ghulam Hassan Mir",
    occupation: "HEALTHCARE_WORKER",
    address: jk("Bandipora"),
    whatsapp: "919900000009",
    dateOfBirth: "1991-08-25",
    enrollments: [
      {
        courseId: "arabic-grammar",
        status: "active",
        payments: [{ status: "approved", month: "02", year: "2026" }],
      },
    ],
  },
  {
    id: "10",
    name: "Tariq Hussain",
    fatherName: "Ghulam Hussain",
    occupation: "GOVERNMENT_EMPLOYEE",
    address: jk("Ganderbal"),
    whatsapp: "919900000010",
    dateOfBirth: "1988-02-17",
    enrollments: [
      {
        courseId: "seerah-youth",
        status: "active",
        payments: [
          { status: "approved", month: "01", year: "2026" },
          { status: "approved", month: "02", year: "2026" },
        ],
      },
    ],
  },
  {
    id: "11",
    name: "Hafsa Nazir",
    fatherName: "Nazir Ahmad",
    occupation: "STUDENT",
    address: jk("Srinagar"),
    whatsapp: "919900000011",
    dateOfBirth: "2005-05-09",
    enrollments: [
      {
        courseId: "quran-nazira",
        status: "active",
        payments: [
          { status: "approved", month: "01", year: "2026" },
          { status: "pending", month: "03", year: "2026" },
        ],
      },
    ],
  },
  {
    id: "12",
    name: "Adnan Qadir",
    fatherName: "Abdul Qadir",
    occupation: "LABOURER",
    address: jk("Baramulla"),
    whatsapp: "919900000012",
    dateOfBirth: "1997-10-11",
    enrollments: [
      {
        courseId: "hifz-foundation",
        status: "active",
        payments: [
          { status: "approved", month: "01", year: "2026" },
          { status: "approved", month: "02", year: "2026" },
          { status: "pending", month: "03", year: "2026" },
        ],
      },
    ],
  },
  {
    id: "13",
    name: "Rukhsana Begum",
    fatherName: "Mohammad Akbar",
    occupation: "HOMEMAKER",
    address: jk("Anantnag"),
    whatsapp: "919900000013",
    dateOfBirth: "1990-07-03",
    enrollments: [
      {
        courseId: "fiqh-basics",
        status: "active",
        payments: [{ status: "pending", month: "03", year: "2026" }],
      },
    ],
  },
  {
    id: "14",
    name: "Zubair Khan",
    fatherName: "Abdul Hamid Khan",
    occupation: "SHOPKEEPER",
    address: jk("Pulwama"),
    whatsapp: "919900000014",
    dateOfBirth: "1993-03-28",
    enrollments: [
      {
        courseId: "tajweed-intensive",
        status: "active",
        payments: [
          { status: "approved", month: "02", year: "2026" },
          { status: "pending", month: "03", year: "2026" },
        ],
      },
    ],
  },
  {
    id: "15",
    name: "Mehreen Ashraf",
    fatherName: "Mohammad Ashraf",
    occupation: "STUDENT",
    address: jk("Shopian"),
    whatsapp: "919900000015",
    dateOfBirth: "2006-01-22",
    enrollments: [
      {
        courseId: "seerah-youth",
        status: "active",
        payments: [{ status: "pending", month: "03", year: "2026" }],
      },
    ],
  },
  {
    id: "16",
    name: "Shahid Lone",
    fatherName: "Ghulam Mohammad Lone",
    occupation: "DRIVER",
    address: jk("Budgam"),
    whatsapp: "919900000016",
    dateOfBirth: "1987-11-19",
    enrollments: [
      {
        courseId: "quran-nazira",
        status: "active",
        payments: [
          { status: "approved", month: "01", year: "2026" },
          { status: "declined", month: "02", year: "2026" },
        ],
      },
    ],
  },
  {
    id: "17",
    name: "Asiya Manzoor",
    fatherName: "Manzoor Ahmad",
    occupation: "UNEMPLOYED",
    address: jk("Sopore"),
    whatsapp: "919900000017",
    dateOfBirth: "1999-09-07",
    enrollments: [
      {
        courseId: "hifz-foundation",
        status: "active",
        payments: [{ status: "declined", month: "02", year: "2026" }],
      },
    ],
  },
  {
    id: "18",
    name: "Faisal Rather",
    fatherName: "Abdul Rather",
    occupation: "FARMER",
    address: jk("Kupwara"),
    whatsapp: "919900000018",
    dateOfBirth: "1986-06-30",
    enrollments: [
      {
        courseId: "arabic-grammar",
        status: "active",
        payments: [
          { status: "approved", month: "01", year: "2026" },
          { status: "approved", month: "02", year: "2026" },
          { status: "declined", month: "03", year: "2026" },
        ],
      },
    ],
  },
  {
    id: "19",
    name: "Tabassum Gul",
    fatherName: "Mohammad Gul",
    occupation: "RETIRED",
    address: jk("Bandipora"),
    whatsapp: "919900000019",
    dateOfBirth: "1975-04-15",
    enrollments: [
      {
        courseId: "quran-nazira",
        status: "completed",
        completedAt: "2026-03-01T12:00:00.000Z",
        payments: [
          { status: "approved", month: "01", year: "2026" },
          { status: "approved", month: "02", year: "2026" },
          { status: "approved", month: "03", year: "2026" },
        ],
      },
    ],
  },
  {
    id: "20",
    name: "Junaid Mir",
    fatherName: "Ghulam Qadir Mir",
    occupation: "ACCOUNTANT",
    address: jk("Ganderbal"),
    whatsapp: "919900000020",
    dateOfBirth: "1992-12-08",
    enrollments: [
      {
        courseId: "hifz-foundation",
        status: "completed",
        completedAt: "2026-04-01T12:00:00.000Z",
        payments: [
          { status: "approved", month: "01", year: "2026" },
          { status: "approved", month: "02", year: "2026" },
          { status: "approved", month: "03", year: "2026" },
          { status: "approved", month: "04", year: "2026" },
        ],
      },
    ],
  },
  {
    id: "21",
    name: "Samreen Akhter",
    fatherName: "Mohammad Akhter",
    occupation: "LAWYER",
    address: jk("Srinagar"),
    whatsapp: "919900000021",
    dateOfBirth: "1990-08-04",
    enrollments: [
      {
        courseId: "tajweed-intensive",
        status: "completed",
        completedAt: "2026-02-15T12:00:00.000Z",
        payments: [
          { status: "approved", month: "01", year: "2026" },
          { status: "approved", month: "02", year: "2026" },
        ],
      },
    ],
  },
  {
    id: "22",
    name: "Irfan Nazir",
    fatherName: "Nazir Hussain",
    occupation: "POLICE_OFFICER",
    address: jk("Baramulla"),
    whatsapp: "919900000022",
    dateOfBirth: "1985-05-27",
    enrollments: [
      {
        courseId: "fiqh-basics",
        status: "completed",
        completedAt: "2026-03-20T12:00:00.000Z",
        payments: [
          { status: "approved", month: "01", year: "2026" },
          { status: "approved", month: "02", year: "2026" },
          { status: "approved", month: "03", year: "2026" },
        ],
      },
    ],
  },
  {
    id: "23",
    name: "Mariam Hassan",
    fatherName: "Abdul Hassan",
    occupation: "STUDENT",
    address: jk("Anantnag"),
    whatsapp: "919900000023",
    dateOfBirth: "2004-10-16",
    enrollments: [
      {
        courseId: "quran-nazira",
        status: "active",
        payments: [{ status: "approved", month: "02", year: "2026" }],
      },
      {
        courseId: "seerah-youth",
        status: "completed",
        completedAt: "2026-01-30T12:00:00.000Z",
        payments: [{ status: "approved", month: "01", year: "2026" }],
      },
    ],
  },
  {
    id: "24",
    name: "Hamza Sheikh",
    fatherName: "Mohammad Ramzan Sheikh",
    occupation: "CLERGY",
    address: jk("Pulwama"),
    whatsapp: "919900000024",
    dateOfBirth: "1983-07-09",
    enrollments: [
      {
        courseId: "hifz-foundation",
        status: "active",
        payments: [{ status: "approved", month: "01", year: "2026" }],
      },
      {
        courseId: "arabic-grammar",
        status: "active",
        payments: [
          { status: "approved", month: "02", year: "2026" },
          { status: "pending", month: "03", year: "2026" },
        ],
      },
    ],
  },
  {
    id: "25",
    name: "Noor Jehan",
    fatherName: "Ghulam Mohammad",
    occupation: "WORKING",
    address: jk("Shopian"),
    whatsapp: "919900000025",
    dateOfBirth: "1996-02-03",
    enrollments: [
      { courseId: "seerah-youth", status: "pending_approval" },
      {
        courseId: "fiqh-basics",
        status: "active",
        payments: [{ status: "approved", month: "01", year: "2026" }],
      },
    ],
  },
];
