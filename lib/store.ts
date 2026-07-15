import crypto from "crypto";

interface Goods {
  id: number;
  name: string;
  category: string;
  price_per_day: number;
  status: string;
  description: string;
  image: string;
  owner_id: number;
  owner_name: string;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar: string;
  phone: string;
  role: string;
  created_at: string;
}

interface BorrowRecord {
  id: number;
  goods_id: number;
  goods_name: string;
  user_id: number;
  user_name: string;
  owner_id: number;
  days: number;
  total_price: number;
  borrow_date: string;
  return_date: string | null;
  status: string;
  is_returned: number;
  deposit: number;
}

interface Activity {
  id: number;
  title: string;
  content: string;
  activity_time: string;
  location: string;
  image: string;
  user_id: number;
  user_name: string;
  status: string;
  created_at: string;
}

let goodsIdCounter = 11;
let userIdCounter = 2;
let borrowIdCounter = 1;
let activityIdCounter = 5;

const now = () => new Date().toISOString().replace("T", " ").substring(0, 19);

const md5 = (str: string) =>
  crypto.createHash("md5").update(str).digest("hex");

let goods: Goods[] = [
  { id: 1, name: "冲击钻", category: "维修工具", price_per_day: 3.0, status: "available", description: "家用冲击钻，功能完好", image: "", owner_id: 1, owner_name: "admin", created_at: now() },
  { id: 2, name: "投影仪", category: "影音家电", price_per_day: 8.0, status: "available", description: "高清投影仪，含幕布", image: "", owner_id: 1, owner_name: "admin", created_at: now() },
  { id: 3, name: "露营帐篷", category: "户外用品", price_per_day: 5.0, status: "available", description: "4人帐篷，含防潮垫", image: "", owner_id: 1, owner_name: "admin", created_at: now() },
  { id: 4, name: "折叠椅", category: "户外用品", price_per_day: 2.0, status: "available", description: "轻便折叠椅，承重100kg", image: "", owner_id: 1, owner_name: "admin", created_at: now() },
  { id: 5, name: "自行车", category: "交通工具", price_per_day: 5.0, status: "available", description: "山地自行车，车况良好", image: "", owner_id: 1, owner_name: "admin", created_at: now() },
  { id: 6, name: "相机", category: "摄影设备", price_per_day: 15.0, status: "available", description: "单反相机，含镜头", image: "", owner_id: 1, owner_name: "admin", created_at: now() },
  { id: 7, name: "音响", category: "影音家电", price_per_day: 6.0, status: "available", description: "蓝牙音响，音质好", image: "", owner_id: 1, owner_name: "admin", created_at: now() },
  { id: 8, name: "梯子", category: "维修工具", price_per_day: 4.0, status: "available", description: "伸缩梯子，最高3米", image: "", owner_id: 1, owner_name: "admin", created_at: now() },
  { id: 9, name: "烧烤架", category: "户外用品", price_per_day: 8.0, status: "available", description: "便携烧烤架，含烤网", image: "", owner_id: 1, owner_name: "admin", created_at: now() },
  { id: 10, name: "麻将桌", category: "娱乐用品", price_per_day: 10.0, status: "available", description: "自动麻将桌", image: "", owner_id: 1, owner_name: "admin", created_at: now() },
];

let users: User[] = [
  { id: 1, username: "admin", email: "admin@test.com", password: md5("123456"), avatar: "", phone: "", role: "admin", created_at: now() },
];

let borrow_records: BorrowRecord[] = [];

let activities: Activity[] = [
  { id: 1, title: "社区亲子活动日", content: "带上小朋友一起来参加有趣的亲子游戏，增进亲子感情！", activity_time: "2026-07-15 10:00", location: "小区广场", image: "", user_id: 1, user_name: "admin", status: "active", created_at: now() },
  { id: 2, title: "夏日烧烤派对", content: "炎炎夏日，一起来一场美味的烧烤派对，认识更多邻居！", activity_time: "2026-07-20 18:00", location: "小区花园", image: "", user_id: 1, user_name: "admin", status: "active", created_at: now() },
  { id: 3, title: "图书交换活动", content: "把家里闲置的图书带来交换，让知识流动起来！", activity_time: "2026-07-25 14:00", location: "社区活动室", image: "", user_id: 1, user_name: "admin", status: "active", created_at: now() },
  { id: 4, title: "健康义诊活动", content: "免费为居民提供健康咨询和简单体检服务", activity_time: "2026-07-30 09:00", location: "社区医院", image: "", user_id: 1, user_name: "admin", status: "active", created_at: now() },
];

export const store = {
  getGoods: () => goods,
  addGoods: (data: Omit<Goods, "id" | "status" | "created_at">) => {
    const item: Goods = {
      id: goodsIdCounter++,
      status: "available",
      created_at: now(),
      ...data,
    };
    goods.push(item);
    return item;
  },
  deleteGoods: (id: number) => {
    goods = goods.filter((g) => g.id !== id);
  },
  getGoodsById: (id: number) => goods.find((g) => g.id === id),
  updateGoodsStatus: (id: number, status: string) => {
    const g = goods.find((x) => x.id === id);
    if (g) g.status = status;
  },

  getUsers: () => users,
  getUserById: (id: number) => users.find((u) => u.id === id),
  getUserByEmail: (email: string) => users.find((u) => u.email === email),
  addUser: (data: Omit<User, "id" | "role" | "avatar" | "phone" | "created_at">) => {
    const user: User = {
      id: userIdCounter++,
      role: "user",
      avatar: "",
      phone: "",
      created_at: now(),
      ...data,
      password: md5(data.password),
    };
    users.push(user);
    return user;
  },
  updateUser: (id: number, data: Partial<Pick<User, "username" | "phone" | "avatar">>) => {
    const u = users.find((x) => x.id === id);
    if (u) {
      if (data.username !== undefined) u.username = data.username;
      if (data.phone !== undefined) u.phone = data.phone;
      if (data.avatar !== undefined) u.avatar = data.avatar;
    }
    return u;
  },

  getBorrowRecords: () => borrow_records,
  addBorrowRecord: (data: Omit<BorrowRecord, "id" | "borrow_date" | "return_date" | "status" | "is_returned">) => {
    const record: BorrowRecord = {
      id: borrowIdCounter++,
      borrow_date: now(),
      return_date: null,
      status: "borrowed",
      is_returned: 0,
      ...data,
    };
    borrow_records.push(record);
    return record;
  },
  returnGoods: (id: number) => {
    const r = borrow_records.find((x) => x.id === id);
    if (r) {
      r.status = "returned";
      r.is_returned = 1;
      r.return_date = now();
      const g = goods.find((x) => x.id === r.goods_id);
      if (g) g.status = "available";
    }
    return r;
  },

  getActivities: () => activities,
  addActivity: (data: Omit<Activity, "id" | "status" | "created_at">) => {
    const activity: Activity = {
      id: activityIdCounter++,
      status: "active",
      created_at: now(),
      ...data,
    };
    activities.push(activity);
    return activity;
  },

  md5,
};
