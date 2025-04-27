export interface FacultyData {
  id: string
  name: string
  department: string
  email: string
  phone: string
  designation: string
  specialization: string
}

export const facultyData: FacultyData[] = [
  {
    id: "100109",
    name: "Abhishek Malik",
    department: "Computer Science",
    email: "abhishek.malik@example.com",
    phone: "+91 9876543210",
    designation: "Assistant Professor",
    specialization: "Artificial Intelligence",
  },
  {
    id: "100102",
    name: "Punit Kumar",
    department: "Information Technology",
    email: "punit.kumar@example.com",
    phone: "+91 9876543211",
    designation: "Associate Professor",
    specialization: "Database Systems",
  },
  {
    id: "100107",
    name: "Sultan Fahad",
    department: "Computer Science",
    email: "sultan.fahad@example.com",
    phone: "+91 9876543212",
    designation: "Professor",
    specialization: "Computer Networks",
  },
  {
    id: "100115",
    name: "Meera Desai",
    department: "Information Technology",
    email: "meera.desai@example.com",
    phone: "+91 9876543213",
    designation: "Assistant Professor",
    specialization: "Web Technologies",
  },
  {
    id: "100123",
    name: "Rajesh Khanna",
    department: "Computer Science",
    email: "rajesh.khanna@example.com",
    phone: "+91 9876543214",
    designation: "Professor",
    specialization: "Machine Learning",
  },
  {
    id: "100131",
    name: "Priya Singh",
    department: "Mathematics",
    email: "priya.singh@example.com",
    phone: "+91 9876543215",
    designation: "Associate Professor",
    specialization: "Discrete Mathematics",
  },
  {
    id: "100142",
    name: "Vikram Kumar",
    department: "Computer Science",
    email: "vikram.kumar@example.com",
    phone: "+91 9876543216",
    designation: "Assistant Professor",
    specialization: "Software Engineering",
  },
  {
    id: "100156",
    name: "Neha Verma",
    department: "Information Technology",
    email: "neha.verma@example.com",
    phone: "+91 9876543217",
    designation: "Associate Professor",
    specialization: "Information Security",
  },
  {
    id: "100167",
    name: "Karthik Nair",
    department: "Computer Science",
    email: "karthik.nair@example.com",
    phone: "+91 9876543218",
    designation: "Professor",
    specialization: "Computer Graphics",
  },
  {
    id: "100178",
    name: "Divya Krishnan",
    department: "Mathematics",
    email: "divya.krishnan@example.com",
    phone: "+91 9876543219",
    designation: "Assistant Professor",
    specialization: "Applied Mathematics",
  },
  {
    id: "100189",
    name: "Arjun Reddy",
    department: "Computer Science",
    email: "arjun.reddy@example.com",
    phone: "+91 9876543220",
    designation: "Associate Professor",
    specialization: "Data Science",
  },
  {
    id: "100195",
    name: "Sneha Gupta",
    department: "Information Technology",
    email: "sneha.gupta@example.com",
    phone: "+91 9876543221",
    designation: "Assistant Professor",
    specialization: "Cloud Computing",
  },
  {
    id: "100203",
    name: "Rahul Patel",
    department: "Computer Science",
    email: "rahul.patel@example.com",
    phone: "+91 9876543222",
    designation: "Professor",
    specialization: "Operating Systems",
  },
  {
    id: "100217",
    name: "Ananya Sharma",
    department: "Mathematics",
    email: "ananya.sharma@example.com",
    phone: "+91 9876543223",
    designation: "Associate Professor",
    specialization: "Statistics",
  },
  {
    id: "100224",
    name: "Sanjay Mehta",
    department: "Information Technology",
    email: "sanjay.mehta@example.com",
    phone: "+91 9876543224",
    designation: "Assistant Professor",
    specialization: "Mobile Computing",
  },
]

// Get faculty by department
export const getFacultyByDepartment = (department: string) => {
  return facultyData.filter((faculty) => faculty.department === department)
}

// Get faculty by specialization
export const getFacultyBySpecialization = (specialization: string) => {
  return facultyData.filter((faculty) => faculty.specialization === specialization)
}

// Get all faculty
export const getAllFaculty = () => {
  return facultyData
}
