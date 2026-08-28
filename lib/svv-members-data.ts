export interface SvvMember {
  id: string
  name: string
  role: string
  category: string
  joinedYear: number
  badge: string
  avatarColor: string
  order: number
}

export const MEMBER_NAMES = [
  "B. Karthik",
  "N.C. Bathrinath",
  "N.L. Dinesh",
  "A. Nanda Gokul",
  "Santosh",
  "S. Raghavendran",
  "Ashok V",
  "Kannan. A",
  "Prem Kumar",
  "K P Satish",
  "R.Gokul",
  "Vinoth",
  "Aravindan",
  "Vivek",
  "Harish",
  "Harish Babu",
  "Naresh Kumar",
  "Karthi",
  "Arun Kumar",
  "V.Sasikumar",
  "Rajesh",
  "Abinash",
  "Lokesh",
  "Madan Kumar",
  "Naveen",
  "N. Vicky",
  "Velu",
  "R. Srinath",
  "N.Karthick",
  "Rajkumar",
  "Madhan",
  "Praveen R",
  "Kishore N",
  "Sasikumar",
  "Srinath T",
  "Karthick T",
  "Harish K",
  "Gowtham",
  "Balaji",
  "Monish",
  "Bharath K",
  "Karthi",
  "Manigandan K",
  "Harshan S",
  "Mithun S",
  "Santhosh S",
]

const AVATAR_COLORS = [
  "from-amber-600 to-yellow-500",
  "from-yellow-600 to-amber-500",
  "from-amber-700 to-orange-500",
  "from-amber-800 to-yellow-600",
  "from-orange-600 to-amber-500",
  "from-yellow-700 to-amber-600",
  "from-amber-600 to-orange-600",
]

export const SVV_MEMBERS: SvvMember[] = MEMBER_NAMES.map((name, index) => ({
  id: `svv-mem-${index + 1}`,
  name: name,
  role: "SVV Group Member",
  category: "SVV Group Member",
  joinedYear: 1999,
  badge: "",
  avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
  order: index,
}))
