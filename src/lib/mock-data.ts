export type MissingCase = {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  lastSeen: string;
  location: string;
  city: string;
  state: string;
  reward: number;
  status: "Active" | "Found" | "Under Review";
  firVerified: boolean;
  aiMatch?: "Match Found" | "Possible Match" | "No Match" | "Pending";
  description: string;
  image: string;
  reportedAt: string;
  distanceKm?: number;
};

const photos = [
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=70",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=70",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=70",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=70",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=70",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=70",
  "https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&q=70",
  "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=800&q=70",
];

export const MOCK_CASES: MissingCase[] = [
  { id: "FT-2401", name: "Priya Sharma", age: 14, gender: "Female", lastSeen: "2026-05-12", location: "Connaught Place", city: "New Delhi", state: "Delhi", reward: 50000, status: "Active", firVerified: true, aiMatch: "Possible Match", description: "Last seen wearing a blue school uniform near CP metro station.", image: photos[3], reportedAt: "2026-05-13", distanceKm: 2.4 },
  { id: "FT-2402", name: "Rohan Mehta", age: 27, gender: "Male", lastSeen: "2026-05-09", location: "Marine Drive", city: "Mumbai", state: "Maharashtra", reward: 100000, status: "Active", firVerified: true, aiMatch: "Pending", description: "Software engineer, went jogging and did not return. Wearing grey hoodie.", image: photos[0], reportedAt: "2026-05-10", distanceKm: 5.1 },
  { id: "FT-2403", name: "Anita Verma", age: 62, gender: "Female", lastSeen: "2026-05-18", location: "Hazratganj Market", city: "Lucknow", state: "Uttar Pradesh", reward: 25000, status: "Active", firVerified: false, aiMatch: "No Match", description: "Elderly woman with memory loss. Wearing a yellow saree.", image: photos[7], reportedAt: "2026-05-18", distanceKm: 8.7 },
  { id: "FT-2404", name: "Aarav Khan", age: 8, gender: "Male", lastSeen: "2026-05-20", location: "Park Street", city: "Kolkata", state: "West Bengal", reward: 200000, status: "Active", firVerified: true, aiMatch: "Match Found", description: "Child missing from school. Last seen with a red backpack.", image: photos[2], reportedAt: "2026-05-20", distanceKm: 1.2 },
  { id: "FT-2405", name: "Maya Reddy", age: 19, gender: "Female", lastSeen: "2026-04-30", location: "Brigade Road", city: "Bengaluru", state: "Karnataka", reward: 75000, status: "Found", firVerified: true, aiMatch: "Match Found", description: "College student, reunited with family on May 16 via volunteer spotting.", image: photos[5], reportedAt: "2026-05-01", distanceKm: 12.0 },
  { id: "FT-2406", name: "Vikram Singh", age: 45, gender: "Male", lastSeen: "2026-05-15", location: "Sector 17", city: "Chandigarh", state: "Punjab", reward: 60000, status: "Active", firVerified: true, aiMatch: "Possible Match", description: "Last seen leaving his office. Drives a white sedan.", image: photos[6], reportedAt: "2026-05-15", distanceKm: 22.0 },
];

export const STATS = {
  totalCases: 12847,
  peopleFound: 4392,
  activeVolunteers: 28910,
  rewardsClaimed: 8740000,
};

export const NOTIFICATIONS = [
  { id: 1, type: "ai", title: "AI match found", body: "Possible match for case FT-2401 with 87% confidence", time: "2m ago" },
  { id: 2, type: "volunteer", title: "Volunteer spotted Aarav Khan", body: "Photo evidence submitted near Park Street, Kolkata", time: "18m ago" },
  { id: 3, type: "reward", title: "Reward claim approved", body: "₹75,000 released to volunteer @maya_v for case FT-2405", time: "1h ago" },
  { id: 4, type: "status", title: "Case status updated", body: "FT-2403 marked as Under Review pending FIR verification", time: "3h ago" },
];

export const VOLUNTEER_FEED = [
  { id: 1, user: "Arjun K.", action: "submitted a sighting", target: "FT-2402", time: "4m ago" },
  { id: 2, user: "Neha P.", action: "joined as volunteer", target: "Mumbai zone", time: "12m ago" },
  { id: 3, user: "Karan S.", action: "verified FIR", target: "FT-2404", time: "1h ago" },
  { id: 4, user: "Lavanya R.", action: "claimed reward", target: "FT-2405", time: "2h ago" },
];
