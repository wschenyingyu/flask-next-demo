"use client";

import { useEffect } from "react";
import localApi from "@/lib/localApi";

export default function ApiMockProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch;

    const mockFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === "string" ? input : input.toString();
      const method = init?.method || "GET";
      const body = init?.body;

      try {
        let result: any;

        if (url.startsWith("/api/index")) {
          result = { msg: "欢迎使用社区便民物品借用管理平台" };
        } else if (url.startsWith("/api/goods") && method === "GET") {
          result = await localApi.getGoods();
        } else if (url.startsWith("/api/goods") && method === "POST") {
          const data = body ? JSON.parse(body as string) : {};
          result = await localApi.addGoods(data);
        } else if (url.startsWith("/api/delete_goods/") && method === "DELETE") {
          const id = parseInt(url.split("/").pop() || "0");
          result = await localApi.deleteGoods(id);
        } else if (url.startsWith("/api/calc_rent")) {
          let day: string | null = null;
          let price: string | null = null;
          if (url.includes("?")) {
            const params = new URLSearchParams(url.split("?")[1]);
            day = params.get("day");
            price = params.get("price");
          } else if (body) {
            const data = JSON.parse(body as string);
            day = data.day;
            price = data.price;
          }
          result = await localApi.calcRent(parseFloat(day || "0"), parseFloat(price || "0"));
        } else if (url.startsWith("/api/register") && method === "POST") {
          const data = body ? JSON.parse(body as string) : {};
          result = await localApi.register(data);
        } else if (url.startsWith("/api/login") && method === "POST") {
          const data = body ? JSON.parse(body as string) : {};
          result = await localApi.login(data);
        } else if (url.startsWith("/api/user/") && method === "GET") {
          const id = parseInt(url.split("/").pop() || "0");
          result = await localApi.getUser(id);
        } else if (url.startsWith("/api/update_user/") && method === "POST") {
          const id = parseInt(url.split("/").pop() || "0");
          const data = body ? JSON.parse(body as string) : {};
          result = await localApi.updateUser(id, data);
        } else if (url.startsWith("/api/upload_avatar") && method === "POST") {
          result = await localApi.uploadAvatar();
        } else if (url.startsWith("/api/borrow_records") && method === "GET") {
          result = await localApi.getBorrowRecords();
        } else if (url.startsWith("/api/borrow_records") && method === "POST") {
          const data = body ? JSON.parse(body as string) : {};
          result = await localApi.addBorrowRecord(data);
        } else if (url.startsWith("/api/return_goods/") && method === "POST") {
          const id = parseInt(url.split("/").pop() || "0");
          result = await localApi.returnGoods(id);
        } else if (url.startsWith("/api/activities") && method === "GET") {
          result = await localApi.getActivities();
        } else if ((url.startsWith("/api/activities") || url.startsWith("/api/add_activity")) && method === "POST") {
          const data = body ? JSON.parse(body as string) : {};
          const mappedData = {
            title: data.title,
            content: data.description || data.content,
            activity_time: data.date || data.activity_time,
            location: data.location,
            image: "",
            user_id: data.organizer_id || data.user_id || 1,
            user_name: data.organizer_name || data.user_name || "admin",
          };
          result = await localApi.addActivity(mappedData);
        } else if (url.startsWith("/api/upload_activity_image") && method === "POST") {
          result = await localApi.uploadActivityImage();
        } else {
          return originalFetch(input, init);
        }

        const responseBody = JSON.stringify(result);
        return new Response(responseBody, {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Mock API error:", error);
        return originalFetch(input, init);
      }
    };

    (window as any).fetch = mockFetch;

    return () => {
      (window as any).fetch = originalFetch;
    };
  }, []);

  return <>{children}</>;
}
