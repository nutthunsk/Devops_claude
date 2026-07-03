// Mock data per PRD §6 — the frontend simulates live data from these seeds.

export const MOCK_USER = {
  name: 'Tanapat MoneyGuy',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanapat',
}

export const MOCK_ACCOUNTS = [
  { id: 'acc_01', name: 'KBank Main', type: 'Bank Account', balance: 82500 },
  { id: 'acc_02', name: 'SCB Saving', type: 'Bank Account', balance: 54300 },
  { id: 'acc_03', name: 'Cash Wallet', type: 'Cash', balance: 3200 },
  { id: 'acc_04', name: 'KTC Credit Card', type: 'Credit Card', balance: 5000 },
]

// July 2026 expenses sum to 18,200 and July income to 45,000 so the
// dashboard summary matches the PRD overview numbers when derived.
export const MOCK_TRANSACTIONS = [
  { id: 'tx_01', type: 'expense', amount: 120, category: 'Food & Drink', account: 'SCB Saving', date: '2026-07-02', note: 'Lunch and Coffee' },
  { id: 'tx_09', type: 'expense', amount: 580, category: 'Transport', account: 'Cash Wallet', date: '2026-07-02', note: 'BTS + Grab to office' },
  { id: 'tx_10', type: 'expense', amount: 1500, category: 'Food & Drink', account: 'KTC Credit Card', date: '2026-07-02', note: 'Groceries for the week' },
  { id: 'tx_03', type: 'expense', amount: 1500, category: 'Investment', account: 'KBank Main', date: '2026-07-01', note: 'Mutual Fund DCA' },
  { id: 'tx_04', type: 'expense', amount: 8000, category: 'Housing', account: 'KBank Main', date: '2026-07-01', note: 'Condo rent — July' },
  { id: 'tx_05', type: 'expense', amount: 1450, category: 'Food & Drink', account: 'SCB Saving', date: '2026-07-01', note: 'Dinner with friends' },
  { id: 'tx_06', type: 'expense', amount: 2350, category: 'Shopping', account: 'KTC Credit Card', date: '2026-07-01', note: 'New running shoes' },
  { id: 'tx_07', type: 'expense', amount: 1800, category: 'Bills & Utilities', account: 'KBank Main', date: '2026-07-01', note: 'Electricity + internet' },
  { id: 'tx_08', type: 'expense', amount: 900, category: 'Entertainment', account: 'Cash Wallet', date: '2026-07-01', note: 'Movie night' },
  { id: 'tx_11', type: 'income', amount: 45000, category: 'Freelance', account: 'KBank Main', date: '2026-07-01', note: 'Website project — final payment' },
  { id: 'tx_02', type: 'income', amount: 42000, category: 'Salary', account: 'KBank Main', date: '2026-06-30', note: 'Monthly Salary Payout' },
  { id: 'tx_12', type: 'income', amount: 1200, category: 'Dividends', account: 'SCB Saving', date: '2026-06-26', note: 'SET50 fund dividend' },
  { id: 'tx_13', type: 'expense', amount: 3400, category: 'Shopping', account: 'KTC Credit Card', date: '2026-06-28', note: 'Birthday gift for mom' },
  { id: 'tx_14', type: 'expense', amount: 2100, category: 'Food & Drink', account: 'Cash Wallet', date: '2026-06-25', note: 'Weekend brunches' },
  { id: 'tx_15', type: 'income', amount: 3500, category: 'Side Hustle', account: 'Cash Wallet', date: '2026-06-20', note: 'Sold old camera lens' },
]

export const MOCK_GOALS = [
  { id: 'goal_01', name: 'Emergency Fund', emoji: '🛟', target: 100000, current: 65000, monthly: 5000, category: 'savings' },
  { id: 'goal_02', name: 'Japan Trip 2027', emoji: '🗾', target: 50000, current: 22000, monthly: 4000, category: 'savings' },
  { id: 'goal_03', name: 'New MacBook Pro', emoji: '💻', target: 60000, current: 48000, monthly: 3000, category: 'savings' },
  { id: 'goal_04', name: 'SET50 Index DCA', emoji: '📈', target: 120000, current: 54000, monthly: 3000, category: 'investment' },
  { id: 'goal_05', name: 'Global ETF Portfolio', emoji: '🌍', target: 200000, current: 61500, monthly: 5000, category: 'investment' },
]

export const MOCK_PORTFOLIO = [
  { label: 'Thai Equity Funds', value: 52000 },
  { label: 'Global ETFs', value: 38000 },
  { label: 'Fixed Income', value: 21000 },
  { label: 'Gold', value: 9000 },
  { label: 'Crypto', value: 6500 },
]

// Monthly closing balance, Dec 2025 → Jul 2026 (current)
export const MOCK_TREND = [
  { label: 'Dec', value: 104500 },
  { label: 'Jan', value: 109800 },
  { label: 'Feb', value: 113200 },
  { label: 'Mar', value: 118600 },
  { label: 'Apr', value: 124100 },
  { label: 'May', value: 131400 },
  { label: 'Jun', value: 138900 },
  { label: 'Jul', value: 145000 },
]

export const MOCK_POSTS = [
  {
    post_id: 'post_101',
    author: { name: 'PennySaver', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=saving_queen' },
    title: 'How I saved my first $3,000 as a fresh graduate! (Realistic Guide)',
    content: 'Hey everyone! Just wanted to share my 3-bucket budgeting method that actually worked. Bucket 1 is fixed costs (50%), bucket 2 is guilt-free spending (30%), bucket 3 is auto-transferred savings (20%) on payday — before I can touch it. The trick is automating the transfer the morning your salary lands.',
    upvotes: 142,
    comments_count: 28,
    created_at: '2 hours ago',
    tag: 'Saving',
  },
  {
    post_id: 'post_102',
    author: { name: 'CryptoCrasher', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto' },
    title: 'Portfolio is down 20%. Should I cut losses or dollar-cost average down?',
    content: 'Title says it all. Getting a bit stressed out because this cash was meant for a house down payment next year. Everyone says "zoom out" but my timeline is 12 months, not 12 years. Would love to hear from people who have been through a drawdown with a real deadline.',
    upvotes: 45,
    comments_count: 52,
    created_at: '5 hours ago',
    tag: 'Investing',
  },
  {
    post_id: 'post_103',
    author: { name: 'FIREby40', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fire40' },
    title: 'Meal-prepped every lunch for 90 days — saved ฿6,300 and 4 hours a week',
    content: 'I tracked every baht. Office lunches averaged ฿120/day; my meal-prep worked out to ฿50/day. Sunday batch cooking takes 2 hours but I got back my lunch-hour queue time. Numbers and recipe rotation in the comments if anyone wants them.',
    upvotes: 89,
    comments_count: 17,
    created_at: '9 hours ago',
    tag: 'Budgeting',
  },
  {
    post_id: 'post_104',
    author: { name: 'FreelanceFinn', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=finn' },
    title: 'Freelancers: how much do you set aside for taxes each invoice?',
    content: 'First year going fully independent and I keep getting surprised at filing time. Currently moving 15% of every invoice into a separate account the day it clears. Too little? Too much? What is your system?',
    upvotes: 31,
    comments_count: 23,
    created_at: '1 day ago',
    tag: 'Freelance',
  },
]

export const MOCK_COMMENTS = {
  post_101: [
    { author: 'BahtByBaht', text: 'The auto-transfer trick is the whole game. If I can see the money, I will spend it. 😅', when: '1 hour ago' },
    { author: 'NidNoi', text: 'Congrats! Did you count your employer pension contributions in the 20%?', when: '1 hour ago' },
    { author: 'PennySaver', text: '@NidNoi No — pension is on top. The 20% is purely liquid savings.', when: '45 min ago' },
  ],
  post_102: [
    { author: 'SlowMoneyTH', text: 'Money you need within 12 months should not be in risk assets at all. Cutting losses here is buying certainty, not "losing".', when: '4 hours ago' },
    { author: 'DCA_Dan', text: 'Averaging down with house money is how a drawdown becomes a disaster. Separate the goals first.', when: '3 hours ago' },
  ],
  post_103: [
    { author: 'LunchLady', text: 'Recipe rotation please! 🙏', when: '8 hours ago' },
    { author: 'FIREby40', text: 'Posted! 5 mains × 2 sauces, shop once. Search "90-day rotation" in my profile.', when: '7 hours ago' },
  ],
  post_104: [
    { author: 'TaxTellerTH', text: 'Freelance here 6 years — 15% is fine early on, but once you cross the VAT threshold move to 20% and thank yourself later.', when: '20 hours ago' },
  ],
}

export const MOCK_TRENDING = [
  { tag: 'Saving', posts: 128 },
  { tag: 'Investing', posts: 94 },
  { tag: 'Budgeting', posts: 76 },
  { tag: 'Freelance', posts: 41 },
  { tag: 'FirstJobber', posts: 33 },
]

export const EXPENSE_CATEGORIES = [
  'Housing',
  'Food & Drink',
  'Transport',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Investment',
  'Health',
  'Other',
]

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Side Hustle',
  'Dividends',
  'Interest',
  'Gift',
  'Other',
]
