export interface StudentData {
  regNo: string
  name: string
  totalClasses: number
  present: number
  absent: number
  percentage: string
  program: string
  semester: string
  section: string
  medicalCertificate?: "submitted" | "not_submitted"
  status?: "completed" | "pending" | null | "Eligible" | "Not Eligible"
  eligibilityStatus?: "Eligible" | "Ineligible" | "Conditional"
  amcRemark?: string
  hodRemark?: string
}

// Generate student data with consistent naming and counts
export function generateStudentData(program: string, semester: string, section: string) {
  const firstNames = [
    "Aarav",
    "Aditi",
    "Arjun",
    "Ananya",
    "Dhruv",
    "Diya",
    "Ishaan",
    "Kavya",
    "Rohan",
    "Riya",
    "Vihaan",
    "Zara",
    "Kabir",
    "Kiara",
    "Vivaan",
    "Anvi",
    "Reyansh",
    "Saanvi",
    "Ayaan",
    "Anika",
    "Veer",
    "Myra",
    "Arnav",
    "Pari",
    "Shaurya",
    "Aadhya",
    "Rudra",
    "Avni",
    "Krish",
    "Amaira",
    "Advait",
    "Anvi",
    "Atharv",
    "Avani",
    "Darsh",
    "Disha",
    "Eshaan",
    "Ira",
    "Laksh",
    "Mira",
    "Neev",
    "Navya",
    "Pranav",
    "Prisha",
    "Reyansh",
    "Riya",
    "Sai",
    "Saanvi",
    "Veer",
    "Zoya",
    "Aarush",
    "Aanya",
    "Aryan",
    "Anika",
    "Devansh",
    "Diya",
    "Ishaan",
    "Isha",
    "Kabir",
    "Kyra",
  ]

  const lastNames = [
    "Sharma",
    "Patel",
    "Singh",
    "Kumar",
    "Gupta",
    "Joshi",
    "Malhotra",
    "Kapoor",
    "Verma",
    "Rao",
    "Reddy",
    "Nair",
    "Menon",
    "Pillai",
    "Iyer",
    "Agarwal",
    "Mukherjee",
    "Chatterjee",
    "Banerjee",
    "Das",
    "Bose",
    "Sen",
    "Dutta",
    "Roy",
    "Choudhury",
    "Desai",
    "Shah",
    "Mehta",
    "Trivedi",
    "Patil",
    "Jain",
    "Khanna",
    "Chopra",
    "Mehra",
    "Bhatia",
    "Chauhan",
    "Gill",
    "Bajwa",
    "Saxena",
    "Tiwari",
    "Kulkarni",
    "Kaur",
    "Bhatt",
    "Mishra",
    "Pandey",
    "Sinha",
    "Thakur",
    "Yadav",
    "Malik",
    "Hegde",
    "Rajan",
    "Nayar",
    "Menon",
    "Krishnan",
    "Mani",
    "Subramaniam",
    "Naidu",
    "Murthy",
    "Sethi",
    "Arora",
  ]

  // Determine student count based on program
  let studentCount = 20 // Default for MCA and M.Sc.
  if (program === "BCA") {
    studentCount = 60
  } else if (program === "B.Sc.") {
    studentCount = 40
  }

  // Determine starting roll number based on section
  const startRollNo = section === "A" ? 1 : section === "B" ? 70 : 140

  // Generate program prefix
  const programPrefix = program === "MCA" ? "MCA" : program === "BCA" ? "BCA" : program === "B.Sc." ? "BSC" : "MSC"

  // Generate year prefix based on program and semester
  const yearPrefix = program === "MCA" || program === "M.Sc." ? "22" : "20"

  const students = []

  for (let i = 0; i < studentCount; i++) {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[i % lastNames.length]
    const name = `${firstName} ${lastName}`

    // Generate registration number with consistent format
    const rollNo = startRollNo + i
    const regNo = `VU${yearPrefix}${programPrefix}${String(rollNo).padStart(3, "0")}`

    // Generate attendance percentage with distribution:
    // 20% below 65% (non-eligible)
    // 20% between 65-75% (under evaluation)
    // 60% above 75% (eligible)
    let attendancePercentage
    if (i < studentCount * 0.2) {
      // 20% below 65%
      attendancePercentage = 40 + Math.floor(Math.random() * 25) // 40-64%
    } else if (i < studentCount * 0.4) {
      // 20% between 65-75%
      attendancePercentage = 65 + Math.floor(Math.random() * 10) // 65-74%
    } else {
      // 60% above 75%
      attendancePercentage = 75 + Math.floor(Math.random() * 25) // 75-99%
    }

    const totalClasses = 96
    const present = Math.round((attendancePercentage / 100) * totalClasses)
    const absent = totalClasses - present
    const percentage = `${attendancePercentage}.${Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0")}%`

    // Determine eligibility status
    let eligibilityStatus
    if (attendancePercentage < 65) {
      eligibilityStatus = "Ineligible"
    } else if (attendancePercentage < 75) {
      eligibilityStatus = "Conditional"
    } else {
      eligibilityStatus = "Eligible"
    }

    students.push({
      regNo,
      name,
      totalClasses,
      present,
      absent,
      percentage,
      program,
      semester,
      section,
      medicalCertificate: "not_submitted",
      status: null,
      eligibilityStatus,
      amcRemark: "",
      hodRemark: "",
    })
  }

  return students
}

// Generate data for all programs, semesters, and sections
export const generateAllStudentData = () => {
  const allStudents = []

  // BCA - 6 semesters, sections A and B
  for (let sem = 1; sem <= 6; sem++) {
    const semRoman = ["I", "II", "III", "IV", "V", "VI"][sem - 1]
    allStudents.push(...generateStudentData("BCA", semRoman, "A"))
    allStudents.push(...generateStudentData("BCA", semRoman, "B"))
  }

  // B.Sc. - 6 semesters, sections A and B
  for (let sem = 1; sem <= 6; sem++) {
    const semRoman = ["I", "II", "III", "IV", "V", "VI"][sem - 1]
    allStudents.push(...generateStudentData("B.Sc.", semRoman, "A"))
    allStudents.push(...generateStudentData("B.Sc.", semRoman, "B"))
  }

  // MCA - 4 semesters, sections A and B
  for (let sem = 1; sem <= 4; sem++) {
    const semRoman = ["I", "II", "III", "IV"][sem - 1]
    allStudents.push(...generateStudentData("MCA", semRoman, "A"))
    allStudents.push(...generateStudentData("MCA", semRoman, "B"))
  }

  // M.Sc. - 4 semesters, sections A and B
  for (let sem = 1; sem <= 4; sem++) {
    const semRoman = ["I", "II", "III", "IV"][sem - 1]
    allStudents.push(...generateStudentData("M.Sc.", semRoman, "A"))
    allStudents.push(...generateStudentData("M.Sc.", semRoman, "B"))
  }

  return allStudents
}

// Generate all student data
export const allStudents = generateAllStudentData()

// Get specific program, semester, section data
export const getStudentsByFilter = (program: string, semester: string, section: string) => {
  return allStudents.filter(
    (student) => student.program === program && student.semester === semester && student.section === section,
  )
}

// Get eligible students
export const getEligibleStudents = (program: string, semester: string, section: string) => {
  return getStudentsByFilter(program, semester, section).filter((student) => student.eligibilityStatus === "Eligible")
}

// Get conditional students (under evaluation)
export const getConditionalStudents = (program: string, semester: string, section: string) => {
  return getStudentsByFilter(program, semester, section).filter(
    (student) => student.eligibilityStatus === "Conditional",
  )
}

// Get ineligible students
export const getIneligibleStudents = (program: string, semester: string, section: string) => {
  return getStudentsByFilter(program, semester, section).filter((student) => student.eligibilityStatus === "Ineligible")
}

// Get statistics for review page
export const getReviewStats = (program: string, semester: string, section: string) => {
  const students = getStudentsByFilter(program, semester, section)

  const eligible = students.filter((s) => s.eligibilityStatus === "Eligible").length
  const ineligible = students.filter((s) => s.eligibilityStatus === "Ineligible").length
  const conditional = students.filter((s) => s.eligibilityStatus === "Conditional").length

  return {
    eligible,
    nonEligible: ineligible,
    underEvaluation: conditional,
    overall: students.length,
  }
}

// Sample data for quick access
export const mcaVIBStudents = getStudentsByFilter("MCA", "IV", "B")
export const bcaIIIAStudents = getStudentsByFilter("BCA", "III", "A")
export const bcaIIIBStudents = getStudentsByFilter("BCA", "III", "B")
export const mcaIVAStudents = getStudentsByFilter("MCA", "IV", "A")
