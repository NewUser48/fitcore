import {
  MemberProfile,
  TrainerProfile,
  DayWorkoutPlan,
  DayDietPlan,
  PaymentRecord,
  TrainingSession,
} from "@/types";

export const fitcoreTrainer: TrainerProfile = {
  id: "trainer_fitcore_01",
  name: "Alex Vance",
  email: "alex@fitcore.com",
  phone: "+91 98765 43210",
  gym_name: "FITCORE Performance Lab",
  specialization: "Hypertrophy & High-Performance Conditioning",
  currency: "INR",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  experience_years: 8,
  role: "trainer",
};

export const fitcoreMembers: MemberProfile[] = [
  {
    id: "mem_rohan_01",
    trainer_id: "trainer_fitcore_01",
    role: "member",
    full_name: "Rohan Malhotra",
    phone: "+919820112345",
    email: "rohan@fitcore.athlete",
    date_of_birth: "1994-08-14",
    gender: "male",
    address: "Bandra West, Mumbai, MH",
    emergency_contact_name: "Ananya Malhotra (Wife)",
    emergency_contact_phone: "+919820154321",
    height_cm: 180,
    starting_weight_kg: 89.5,
    current_weight_kg: 82.3,
    target_weight_kg: 78.0,
    fitness_goal: "Fat Loss & Conditioning",
    experience_level: "intermediate",
    joining_date: "2026-06-15",
    medical_limitations: "Prior ACL left knee strain (2023). Avoid heavy single-leg plyometrics.",
    trainer_notes: "Very high consistency. Target 80kg deadlift 5x5 next cycle.",
    membership_plan_name: "Transform 90-Day VIP",
    membership_start_date: "2026-09-01",
    membership_end_date: "2026-11-30",
    membership_fee: 22500,
    payment_status: "paid",
    membership_status: "active",
    pending_dues: 0,
    attendance_rate: 92,
    total_sessions_attended: 42,
    requires_password_change: false,
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-06-15",
  },
  {
    id: "mem_kavita_02",
    trainer_id: "trainer_fitcore_01",
    role: "member",
    full_name: "Kavita Rao",
    phone: "+919845067890",
    email: "kavita@fitcore.athlete",
    date_of_birth: "1997-03-22",
    gender: "female",
    address: "Indiranagar, Bengaluru, KA",
    emergency_contact_name: "Vikram Rao (Brother)",
    emergency_contact_phone: "+919845099999",
    height_cm: 165,
    starting_weight_kg: 58.0,
    current_weight_kg: 61.5,
    target_weight_kg: 63.0,
    fitness_goal: "Hypertrophy / Muscle Building",
    experience_level: "advanced",
    joining_date: "2026-08-01",
    medical_limitations: "None. Cleared for heavy multi-joint movements.",
    trainer_notes: "Hit 80kg deadlift PR last week. Progressing to 5x5 protocol.",
    membership_plan_name: "Transform 90-Day VIP",
    membership_start_date: "2026-08-01",
    membership_end_date: "2027-02-01",
    membership_fee: 22500,
    payment_status: "paid",
    membership_status: "active",
    pending_dues: 0,
    attendance_rate: 96,
    total_sessions_attended: 35,
    requires_password_change: false,
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-08-01",
  },
  {
    id: "mem_arjun_03",
    trainer_id: "trainer_fitcore_01",
    role: "member",
    full_name: "Arjun Singhania",
    phone: "+919711234567",
    email: "arjun@fitcore.athlete",
    date_of_birth: "1991-11-05",
    gender: "male",
    address: "Vasant Vihar, New Delhi, DL",
    emergency_contact_name: "Pooja Singhania (Sister)",
    emergency_contact_phone: "+919711288888",
    height_cm: 175,
    starting_weight_kg: 92.0,
    current_weight_kg: 91.0,
    target_weight_kg: 80.0,
    fitness_goal: "Strength & Powerlifting",
    experience_level: "intermediate",
    joining_date: "2026-09-10",
    medical_limitations: "Mild lower back stiffness on heavy pulls.",
    trainer_notes: "Missed 3 sessions due to business travel. Follow-up required.",
    membership_plan_name: "1-on-1 Monthly Elite",
    membership_start_date: "2026-10-10",
    membership_end_date: "2026-11-26",
    membership_fee: 8500,
    payment_status: "partial",
    membership_status: "expiring",
    pending_dues: 4500,
    attendance_rate: 68,
    total_sessions_attended: 18,
    requires_password_change: false,
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-09-10",
  },
  {
    id: "mem_priya_04",
    trainer_id: "trainer_fitcore_01",
    role: "member",
    full_name: "Priya Sundaram",
    phone: "+919980024680",
    email: "priya@fitcore.athlete",
    date_of_birth: "1995-05-19",
    gender: "female",
    address: "Jubilee Hills, Hyderabad, TS",
    emergency_contact_name: "Dr. Sundaram (Father)",
    emergency_contact_phone: "+919980099999",
    height_cm: 170,
    starting_weight_kg: 64.0,
    current_weight_kg: 62.0,
    target_weight_kg: 60.0,
    fitness_goal: "Athletic Performance",
    experience_level: "advanced",
    joining_date: "2026-03-01",
    medical_limitations: "None.",
    trainer_notes: "Prepping for Half-Marathon and Hyrox competition.",
    membership_plan_name: "Annual High-Performance",
    membership_start_date: "2026-03-01",
    membership_end_date: "2027-03-01",
    membership_fee: 75000,
    payment_status: "paid",
    membership_status: "active",
    pending_dues: 0,
    attendance_rate: 98,
    total_sessions_attended: 74,
    requires_password_change: false,
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    created_at: "2026-03-01",
  },
];

// Day-by-Day Workouts: Note-based architecture (Clean, fast & trainer-friendly)
export const sampleWeeklyWorkouts: DayWorkoutPlan[] = [
  {
    day: "Monday",
    workout_name: "Chest & Triceps Hypertrophy",
    is_rest_day: false,
    estimated_duration_min: 60,
    focus: "Pectoralis Major & Lateral Tricep Head",
    workout_note: `• Incline Barbell Bench Press: 4 sets x 8-10 reps (75 kg), rest 90s. Keep scapulae retracted.
• Flat Dumbbell Press: 3 sets x 10-12 reps (28 kg DBs), rest 75s. Deep stretch at bottom.
• Cable Chest Flyes: 3 sets x 15 reps (15 kg), rest 60s. Hold peak squeeze 2 seconds.
• Overhead Rope Tricep Extension: 3 sets x 12-15 reps (22 kg), rest 60s. Pin elbows close to ears.
• Dips (Bodyweight or weighted): 3 sets to technical failure.
• Finish with 3 rounds of 60-second Plank hold.`,
    exercises: [],
  },
  {
    day: "Tuesday",
    workout_name: "Back & Biceps Power",
    is_rest_day: false,
    estimated_duration_min: 65,
    focus: "Lats, Rhomboids & Biceps Brachii",
    workout_note: `• Trap Bar Deadlift: 4 sets x 6-8 reps (140 kg), rest 120s. Push the floor away, strong lockout.
• Chest-Supported T-Bar Row: 3 sets x 8-10 reps (50 kg), rest 90s. 1s hold at full contraction.
• Neutral Grip Lat Pulldown: 3 sets x 10-12 reps (60 kg), rest 60s. Drive elbows down to hips.
• Incline Dumbbell Bicep Curl: 3 sets x 12 reps (14 kg DBs), rest 60s. Full strict stretch.
• Hammer Curls: 3 sets x 12-15 reps (16 kg DBs). Focus on brachialis thickness.`,
    exercises: [],
  },
  {
    day: "Wednesday",
    workout_name: "Legs & Calves Hypertrophy",
    is_rest_day: false,
    estimated_duration_min: 70,
    focus: "Quadriceps, Hamstrings & Calves",
    workout_note: `• Barbell Back Squat: 4 sets x 8 reps (105 kg), rest 120s. Controlled 3s descent below parallel.
• Romanian Dumbbell Deadlift: 3 sets x 10-12 reps (32 kg DBs), rest 90s. Deep hamstring hinge.
• Bulgarian Split Squats: 3 sets x 8 reps per leg (18 kg DBs), rest 90s. Upright torso.
• Lying Leg Curls: 3 sets x 12-15 reps (45 kg), rest 60s. Slow eccentric.
• Standing Calf Raises: 4 sets x 15 reps (Bodyweight + 25kg), rest 45s. Full deep stretch at bottom.`,
    exercises: [],
  },
  {
    day: "Thursday",
    workout_name: "Shoulders & Abs Core Stability",
    is_rest_day: false,
    estimated_duration_min: 55,
    focus: "Deltoids & Core Musculature",
    workout_note: `• Seated DB Overhead Press: 4 sets x 8-10 reps (24 kg DBs), rest 90s. Keep core braced.
• Cable Lateral Raises: 4 sets x 12-15 reps (7.5 kg), rest 45s. Constant deltoid tension.
• Face Pulls with Rope: 3 sets x 15 reps (20 kg), rest 60s. External rotation emphasis for rear delts.
• Hanging Leg Raises: 3 sets x 12-15 reps, rest 60s. Curl pelvis up without swinging.
• Ab Wheel Rollouts: 3 sets x 10 reps.`,
    exercises: [],
  },
  {
    day: "Friday",
    workout_name: "Full Body Athletic Circuit",
    is_rest_day: false,
    estimated_duration_min: 50,
    focus: "Compound Density & Power",
    workout_note: `• Kettlebell Clean & Press: 4 sets x 8 reps per side (20 kg KB), rest 60s.
• Weighted Dips: 3 sets x 10 reps (+15 kg belt), rest 75s.
• Heavy Sled Push: 4 rounds x 25 meters (80 kg sled), rest 90s. Fast sprint speed.
• Farmer's Walk: 3 rounds x 40 meters (32 kg DBs in each hand). Grip and trap endurance.`,
    exercises: [],
  },
  {
    day: "Saturday",
    workout_name: "Cardio & Mobility Reset",
    is_rest_day: false,
    estimated_duration_min: 45,
    focus: "Zone 2 Cardio & Hip/Thoracic Mobility",
    workout_note: `• Assault Bike or Incline Treadmill: 25 minutes steady Zone 2 cardio (HR 130-140 bpm).
• World's Greatest Stretch: 2 sets x 6 reps per side.
• 90/90 Hip Flow: 5 minutes continuous gentle transitions.
• Cat-Cow & Thoracic Rotations: 3 sets x 10 reps.
• Foam roll IT bands, glutes, and upper back.`,
    exercises: [],
  },
  {
    day: "Sunday",
    workout_name: "Active Recovery & Rest Day",
    is_rest_day: true,
    estimated_duration_min: 0,
    focus: "Complete Rest, CNS Recovery & Hydration",
    workout_note: `• Complete Rest Day.
• Take a 30-minute easy outdoor walk.
• Hydrate with minimum 3.5 Liters water.
• Focus on 8+ hours quality sleep and nutrition recovery.`,
    exercises: [],
  },
];

// Day-by-Day Nutrition Plans: Note-based architecture (Clean, fast & trainer-friendly)
export const sampleWeeklyDiet: DayDietPlan[] = [
  {
    day: "Monday",
    diet_title: "High Protein & Training Day Fuel",
    daily_calories_target: 2200,
    protein_target_g: 180,
    carbs_target_g: 200,
    fats_target_g: 60,
    water_target_liters: 3.5,
    diet_note: `• Breakfast (8:00 AM): 4 whole eggs + 2 egg whites scramble with spinach, 60g rolled oats with blueberries & 1 tsp chia seeds.
• Morning Snack (11:00 AM): 1 medium apple + 15g roasted raw almonds.
• Lunch (1:30 PM): 200g grilled chicken breast or paneer, 150g basmati rice, steamed broccoli & cucumber salad.
• Pre-Workout Fuel (5:00 PM): 1 scoop Whey isolate in water + 1 banana + 2 organic rice cakes with light honey.
• Post-Workout Dinner (8:30 PM): 220g baked fish or tofu, 180g sweet potato mash, fresh mixed greens with 1 tsp olive oil.
• Hydration Rule: Drink at least 3.5 Liters of water throughout the day. Avoid sugar & processed foods.`,
    meals: [],
  },
  {
    day: "Tuesday",
    diet_title: "Heavy Pull & Power Fuel",
    daily_calories_target: 2300,
    protein_target_g: 185,
    carbs_target_g: 215,
    fats_target_g: 62,
    water_target_liters: 4.0,
    diet_note: `• Breakfast (8:00 AM): 3 whole eggs + 3 egg whites omelette, 2 slices toasted sourdough, black coffee.
• Morning Snack (11:00 AM): 150g low-fat Greek yogurt with 1 tbsp walnuts.
• Lunch (1:30 PM): 220g minced chicken/turkey or soya chunks, 180g cooked quinoa, bell peppers & zucchini.
• Pre-Workout (5:00 PM): 1 scoop whey protein + 40g cream of rice with cinnamon.
• Dinner (8:30 PM): 200g grilled salmon or paneer steak, roasted asparagus & 1 cup brown rice.
• Hydration: 4 Liters minimum. Heavy deadlift day requires extra water.`,
    meals: [],
  },
  {
    day: "Wednesday",
    diet_title: "High Carbohydrate Leg Day Protocol",
    daily_calories_target: 2400,
    protein_target_g: 180,
    carbs_target_g: 240,
    fats_target_g: 65,
    water_target_liters: 4.0,
    diet_note: `• Breakfast (8:00 AM): 4 eggs, 75g oats cooked in almond milk with 1 banana sliced.
• Morning Snack (11:00 AM): 2 boiled eggs + 1 orange.
• Lunch (1:30 PM): 220g chicken breast or paneer, 200g jasmine rice, sauteed green beans.
• Pre-Workout (5:00 PM): 2 slices whole wheat toast with 1 tbsp peanut butter + 1 scoop whey.
• Dinner (8:30 PM): 220g lean beef / soya / paneer, 220g baked potato with skin, big bowl of cucumber and tomato salad.
• Note: Extra carbs allotted today to support squat volume and glycogen recovery.`,
    meals: [],
  },
  {
    day: "Thursday",
    diet_title: "Lean Conditioning & Moderate Carbs",
    daily_calories_target: 2150,
    protein_target_g: 180,
    carbs_target_g: 190,
    fats_target_g: 58,
    water_target_liters: 3.5,
    diet_note: `• Breakfast (8:00 AM): 1 scoop whey smoothie with 250ml milk, 50g oats, spinach, and 1 tbsp flaxseed.
• Morning Snack (11:00 AM): Handful of roasted makhana (lotus seeds) + green tea.
• Lunch (1:30 PM): 200g chicken or grilled tofu, 120g brown rice, mixed vegetable curry.
• Snack (5:00 PM): 1 boiled egg + 1 small banana.
• Dinner (8:30 PM): 200g grilled fish / paneer, stir-fried broccoli, mushrooms, and zucchini with herbs.
• Hydration: 3.5 Liters water.`,
    meals: [],
  },
  {
    day: "Friday",
    diet_title: "Athletic Circuit Energy Plan",
    daily_calories_target: 2200,
    protein_target_g: 180,
    carbs_target_g: 200,
    fats_target_g: 60,
    water_target_liters: 3.5,
    diet_note: `• Breakfast: 4 eggs scrambled + 2 whole wheat rotis or toasts.
• Snack: 1 glass buttermilk / chaas + 10 almonds.
• Lunch: 200g chicken / paneer, 150g basmati rice, dal & raw salad.
• Pre-Workout: 1 scoop whey in water + 1 apple 45 mins prior.
• Dinner: 220g grilled protein of choice, baked sweet potato wedges, cucumber salad.
• Water: 3.5L.`,
    meals: [],
  },
  {
    day: "Saturday",
    diet_title: "Cardio Cleanse & Fat Burn",
    daily_calories_target: 2100,
    protein_target_g: 175,
    carbs_target_g: 180,
    fats_target_g: 60,
    water_target_liters: 3.5,
    diet_note: `• Breakfast: 3 egg whites + 2 whole eggs, avocado slices, 1 slice sourdough toast.
• Lunch: 200g grilled chicken / soya chunks with quinoa salad, lemon dressing.
• Snack: Coconut water + 1 scoop protein.
• Dinner: Light chicken soup or lentil soup with 150g grilled paneer/fish and steamed veggies.
• Water: 3.5L.`,
    meals: [],
  },
  {
    day: "Sunday",
    diet_title: "Rest Day Recovery & Light Deficit",
    daily_calories_target: 1950,
    protein_target_g: 170,
    carbs_target_g: 150,
    fats_target_g: 55,
    water_target_liters: 3.0,
    diet_note: `• Rest Day Calorie Protocol: Lower carbohydrates on rest days since training energy is not expended.
• Breakfast: 3 whole eggs with spinach & mushrooms + 1 cup green tea.
• Lunch: 200g chicken or paneer, 100g basmati rice, big vegetable bowl.
• Evening Snack: 1 glass cold water with lemon + 1 protein bar or whey shake.
• Dinner: 220g fish or tofu with grilled vegetables, light dressing.
• Focus: Early dinner before 8:00 PM to optimize deep sleep.`,
    meals: [],
  },
];

export const sampleDashboardKpis = {
  totalMembers: 32,
  activeMembers: 29,
  todayAttendance: { present: 14, expected: 18, rate: 78 },
  activeWorkoutPlans: 28,
  pendingPaymentsCount: 2,
  pendingPaymentsAmount: 13000,
  monthlyRevenue: 148500,
  expiringMemberships: 3,
};

// Backward compatibility exports for widgets and charts
export const initialTrainerProfile = fitcoreTrainer;
export const sampleMembers: MemberProfile[] = fitcoreMembers;
export const sampleMembershipPlans = [
  {
    id: "plan_monthly",
    name: "1-on-1 Monthly Elite",
    duration_type: "monthly" as any,
    duration_days: 30,
    price: 8500,
    currency: "INR",
    description: "12 personalized sessions, customized nutrition plan, weekly check-in",
    features: ["12 Training Sessions", "Customized Nutrition Plan", "Weekly Body Composition", "24/7 Trainer Chat"],
    is_active: true,
    member_count: 8,
    created_at: "2026-01-01",
  },
  {
    id: "plan_quarterly",
    name: "Transform 90-Day VIP",
    duration_type: "quarterly" as any,
    duration_days: 90,
    price: 22500,
    currency: "INR",
    description: "36 intensive sessions with full macro coaching, biometric tracking & PR logging",
    features: ["36 Training Sessions", "Macro & Supplement Plan", "Bi-weekly Dexa Tracking", "Priority Slot Booking"],
    is_active: true,
    member_count: 14,
    created_at: "2026-01-01",
  },
  {
    id: "plan_annual",
    name: "Annual High-Performance",
    duration_type: "annual" as any,
    duration_days: 365,
    price: 75000,
    currency: "INR",
    description: "Year-round athletic periodization, unlimited direct guidance & injury prevention",
    features: ["Year-round Periodization", "Monthly Physical Assessment", "Recovery & Mobility Protocols"],
    is_active: true,
    member_count: 6,
    created_at: "2026-01-01",
  },
];
export const samplePayments: PaymentRecord[] = [
  {
    id: "pay_101",
    member_id: "mem_kavita_02",
    member_name: "Kavita Rao",
    amount: 22500,
    paid_amount: 22500,
    currency: "INR",
    status: "paid",
    payment_method: "UPI",
    invoice_number: "INV-2026-089",
    payment_date: "2026-11-20",
    notes: "Quarterly VIP package renewal",
  },
  {
    id: "pay_102",
    member_id: "mem_priya_04",
    member_name: "Priya Sundaram",
    amount: 75000,
    paid_amount: 75000,
    currency: "INR",
    status: "paid",
    payment_method: "Bank Transfer",
    invoice_number: "INV-2026-088",
    payment_date: "2026-11-18",
    notes: "Annual high-performance coaching",
  },
  {
    id: "pay_103",
    member_id: "mem_arjun_03",
    member_name: "Arjun Singhania",
    amount: 8500,
    paid_amount: 4000,
    currency: "INR",
    status: "partial",
    payment_method: "UPI",
    invoice_number: "INV-2026-087",
    payment_date: "2026-11-10",
    due_date: "2026-11-25",
    notes: "Balance pending: ₹4,500 due on 25th Nov",
  },
];
export const sampleSessions: TrainingSession[] = [
  {
    id: "ses_01",
    member_id: "mem_rohan_01",
    member_name: "Rohan Malhotra",
    member_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    title: "Posterior Chain & Deadlift Max Test",
    date: "2026-11-22",
    start_time: "06:30",
    end_time: "07:30",
    status: "completed",
    notes: "New PR: 160kg x 3 reps on trap bar deadlift.",
  },
  {
    id: "ses_02",
    member_id: "mem_kavita_02",
    member_name: "Kavita Rao",
    member_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    title: "Push Day A (Chest, Delts & Triceps)",
    date: "2026-11-22",
    start_time: "08:00",
    end_time: "09:00",
    status: "in_progress",
    notes: "Incline DB Bench Press 18kg dumbbell progression.",
  },
  {
    id: "ses_03",
    member_id: "mem_priya_04",
    member_name: "Priya Sundaram",
    member_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "Aerobic Capacity & Sled Conditioning",
    date: "2026-11-22",
    start_time: "17:00",
    end_time: "18:00",
    status: "scheduled",
    notes: "Heart rate monitor test on Assault Bike + SkiErg.",
  },
];
export const sampleNotifications = [
  {
    id: "notif_01",
    title: "Membership Expiring in 4 Days",
    message: "Arjun Singhania's 1-on-1 Monthly plan expires on Nov 26, 2026.",
    type: "expiring_membership" as const,
    is_read: false,
    created_at: "2 hours ago",
    member_id: "mem_arjun_03",
  },
  {
    id: "notif_02",
    title: "Pending Balance Overdue",
    message: "Arjun Singhania has an overdue renewal balance of ₹4,500.",
    type: "overdue_payment" as const,
    is_read: false,
    created_at: "5 hours ago",
    member_id: "mem_arjun_03",
  },
  {
    id: "notif_03",
    title: "Attendance Alert",
    message: "Arjun Singhania missed 3 consecutive scheduled workouts.",
    type: "attendance_alert" as const,
    is_read: false,
    created_at: "1 day ago",
    member_id: "mem_arjun_03",
  },
];
export const sampleRevenueChart = [
  { month: "Jun", revenue: 68000, projected: 65000 },
  { month: "Jul", revenue: 84000, projected: 75000 },
  { month: "Aug", revenue: 112000, projected: 95000 },
  { month: "Sep", revenue: 98500, projected: 105000 },
  { month: "Oct", revenue: 134000, projected: 120000 },
  { month: "Nov", revenue: 148500, projected: 140000 },
];
export const sampleMembershipGrowth = [
  { month: "Jun", total: 14, active: 13 },
  { month: "Jul", total: 18, active: 17 },
  { month: "Aug", total: 22, active: 20 },
  { month: "Sep", total: 25, active: 23 },
  { month: "Oct", total: 28, active: 26 },
  { month: "Nov", total: 32, active: 29 },
];
export const sampleAttendanceTrends = [
  { day: "Mon", attendance: 24, scheduled: 26 },
  { day: "Tue", attendance: 22, scheduled: 24 },
  { day: "Wed", attendance: 25, scheduled: 27 },
  { day: "Thu", attendance: 21, scheduled: 25 },
  { day: "Fri", attendance: 26, scheduled: 28 },
  { day: "Sat", attendance: 28, scheduled: 30 },
  { day: "Sun", attendance: 12, scheduled: 14 },
];
export const sampleMetrics = {
  totalMembers: 32,
  activeMembers: 29,
  expiringMemberships: 3,
  monthlyRevenue: 148500,
  todayAttendance: { present: 14, totalExpected: 18, percentage: 78 },
  pendingPaymentsTotal: 13000,
  pendingPaymentsCount: 2,
};
