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

const md5 = (str: string) =>
  crypto.createHash("md5").update(str).digest("hex");

const now = () => new Date().toISOString().replace("T", " ").substring(0, 19);

const defaultGoods: Goods[] = [
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

const defaultUsers: User[] = [
  { id: 1, username: "admin", email: "admin@test.com", password: md5("123456"), avatar: "", phone: "", role: "admin", created_at: now() },
];

const defaultActivities: Activity[] = [
  { id: 1, title: "社区亲子活动日", content: "带上小朋友一起来参加有趣的亲子游戏，增进亲子感情！", activity_time: "2026-07-15 10:00", location: "小区广场", image: "", user_id: 1, user_name: "admin", status: "active", created_at: now() },
  { id: 2, title: "夏日烧烤派对", content: "炎炎夏日，一起来一场美味的烧烤派对，认识更多邻居！", activity_time: "2026-07-20 18:00", location: "小区花园", image: "", user_id: 1, user_name: "admin", status: "active", created_at: now() },
  { id: 3, title: "图书交换活动", content: "把家里闲置的图书带来交换，让知识流动起来！", activity_time: "2026-07-25 14:00", location: "社区活动室", image: "", user_id: 1, user_name: "admin", status: "active", created_at: now() },
  { id: 4, title: "健康义诊活动", content: "免费为居民提供健康咨询和简单体检服务", activity_time: "2026-07-30 09:00", location: "社区医院", image: "", user_id: 1, user_name: "admin", status: "active", created_at: now() },
];

const STORE_KEY = "community_goods_store";

function loadStore() {
  if (typeof window === "undefined") {
    return { goods: defaultGoods, users: defaultUsers, borrow_records: [], activities: defaultActivities, counters: { goods: 11, user: 2, borrow: 1, activity: 5 } };
  }
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // ignore
    }
  }
  const initial = {
    goods: defaultGoods,
    users: defaultUsers,
    borrow_records: [],
    activities: defaultActivities,
    counters: { goods: 11, user: 2, borrow: 1, activity: 5 },
  };
  localStorage.setItem(STORE_KEY, JSON.stringify(initial));
  return initial;
}

function saveStore(store: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const localApi = {
  async getGoods() {
    await delay(100);
    const store = loadStore();
    return { code: 200, data: store.goods, msg: "物品查询成功" };
  },

  async addGoods(data: any) {
    await delay(100);
    const store = loadStore();
    const item: Goods = {
      id: store.counters.goods++,
      name: data.name,
      category: data.category || "",
      price_per_day: parseFloat(data.price_per_day),
      status: "available",
      description: data.description || "",
      image: data.image || "",
      owner_id: data.owner_id || 1,
      owner_name: data.owner_name || "admin",
      created_at: now(),
    };
    store.goods.push(item);
    saveStore(store);
    return { code: 200, msg: "闲置物品发布成功", data: item };
  },

  async deleteGoods(id: number) {
    await delay(100);
    const store = loadStore();
    store.goods = store.goods.filter((g: Goods) => g.id !== id);
    saveStore(store);
    return { code: 200, msg: "物品删除成功" };
  },

  async calcRent(day: number, price: number) {
    await delay(50);
    const total = day * price;
    return { code: 200, total_rent: total, msg: "费用计算完成" };
  },

  async register(data: any) {
    await delay(100);
    const store = loadStore();
    if (store.users.find((u: User) => u.email === data.email)) {
      return { code: 400, msg: "该邮箱已被注册" };
    }
    const user: User = {
      id: store.counters.user++,
      username: data.username,
      email: data.email,
      password: md5(data.password),
      avatar: "",
      phone: "",
      role: "user",
      created_at: now(),
    };
    store.users.push(user);
    saveStore(store);
    return { code: 200, msg: "注册成功" };
  },

  async login(data: any) {
    await delay(100);
    const store = loadStore();
    const user = store.users.find((u: User) => u.email === data.email);
    if (!user || user.password !== md5(data.password)) {
      return { code: 400, msg: "邮箱或密码错误" };
    }
    const { password: _, ...userData } = user;
    return { code: 200, data: userData, msg: "登录成功" };
  },

  async getUser(id: number) {
    await delay(100);
    const store = loadStore();
    const user = store.users.find((u: User) => u.id === id);
    if (!user) return { code: 400, msg: "用户不存在" };
    const { password: _, ...userData } = user;
    return { code: 200, data: userData, msg: "用户查询成功" };
  },

  async updateUser(id: number, data: any) {
    await delay(100);
    const store = loadStore();
    const user = store.users.find((u: User) => u.id === id);
    if (!user) return { code: 500, msg: "更新失败" };
    if (data.username !== undefined) user.username = data.username;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.avatar !== undefined) user.avatar = data.avatar;
    saveStore(store);
    return { code: 200, msg: "用户信息更新成功" };
  },

  async uploadAvatar() {
    await delay(100);
    return { code: 200, msg: "头像上传成功", data: { avatar_url: "avatar.png" } };
  },

  async getBorrowRecords() {
    await delay(100);
    const store = loadStore();
    return { code: 200, data: store.borrow_records, msg: "借用记录查询成功" };
  },

  async addBorrowRecord(data: any) {
    await delay(100);
    const store = loadStore();
    const record: BorrowRecord = {
      id: store.counters.borrow++,
      goods_id: data.goods_id,
      goods_name: data.goods_name,
      user_id: data.user_id,
      user_name: data.user_name,
      owner_id: data.owner_id,
      days: data.days,
      total_price: data.total_price,
      borrow_date: now(),
      return_date: null,
      status: "borrowed",
      is_returned: 0,
      deposit: data.deposit || 0,
    };
    store.borrow_records.push(record);
    const g = store.goods.find((x: Goods) => x.id === data.goods_id);
    if (g) g.status = "borrowed";
    saveStore(store);
    return { code: 200, msg: "借用申请提交成功", data: record };
  },

  async returnGoods(id: number) {
    await delay(100);
    const store = loadStore();
    const r = store.borrow_records.find((x: BorrowRecord) => x.id === id);
    if (r) {
      r.status = "returned";
      r.is_returned = 1;
      r.return_date = now();
      const g = store.goods.find((x: Goods) => x.id === r.goods_id);
      if (g) g.status = "available";
    }
    saveStore(store);
    return { code: 200, msg: "归还成功" };
  },

  async getActivities() {
    await delay(100);
    const store = loadStore();
    return { code: 200, data: store.activities, msg: "活动查询成功" };
  },

  async addActivity(data: any) {
    await delay(100);
    const store = loadStore();
    const activity: Activity = {
      id: store.counters.activity++,
      title: data.title,
      content: data.content || "",
      activity_time: data.activity_time || "",
      location: data.location || "",
      image: data.image || "",
      user_id: data.user_id || 1,
      user_name: data.user_name || "admin",
      status: "active",
      created_at: now(),
    };
    store.activities.push(activity);
    saveStore(store);
    return { code: 200, msg: "活动发布成功", data: activity };
  },

  async uploadActivityImage() {
    await delay(100);
    return { code: 200, msg: "活动图片上传成功", data: { image_url: "activity.png" } };
  },
};

export default localApi;
