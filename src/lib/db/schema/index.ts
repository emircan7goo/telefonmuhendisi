import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  jsonb,
  date,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  phone: text("phone").unique(),
  passwordHash: text("password_hash"),
  role: text("role").default("customer").notNull(), // customer, admin, technician, banned
  lastLoginAt: timestamp("last_login_at", { mode: "date" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  roleIdx: index("idx_users_role").on(table.role),
}));

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<"oauth" | "oidc" | "email">().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
    userIdx: index("idx_accounts_user_id").on(account.userId),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  action: text("action").notNull(),
  target: text("target"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_audit_logs_user_id").on(table.userId),
}));

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  parentId: integer("parent_id").references((): any => categories.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  stock: integer("stock").default(0).notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  brand: text("brand"),
  condition: text("condition").default("new"), // new, refurbished
  images: jsonb("images").$type<string[]>(), // Local or R2 image URLs
  features: jsonb("features").$type<Record<string, string>>(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index("idx_products_category_id").on(table.categoryId),
  activeIdx: index("idx_products_is_active").on(table.isActive),
  brandIdx: index("idx_products_brand").on(table.brand),
  activeCategoryIdx: index("idx_products_active_category").on(table.isActive, table.categoryId),
  createdAtIdx: index("idx_products_created_at").on(table.createdAt),
}));

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  status: text("status").default("pending").notNull(), // pending, confirmed, processing, shipped, delivered, cancelled
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  couponCode: text("coupon_code"),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
  shippingAddress: jsonb("shipping_address").notNull(),
  billingAddress: jsonb("billing_address").notNull(),
  paymentId: text("payment_id"), // from iyzico
  trackingNumber: text("tracking_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_orders_user_id").on(table.userId),
  statusIdx: index("idx_orders_status").on(table.status),
  userStatusIdx: index("idx_orders_user_status").on(table.userId, table.status),
  createdAtIdx: index("idx_orders_created_at").on(table.createdAt),
}));

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").unique().notNull(),
  discountType: text("discount_type").notNull(), // "percent", "fixed"
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  usageLimit: integer("usage_limit"), // null means unlimited
  usedCount: integer("used_count").default(0).notNull(),
  expiryDate: timestamp("expiry_date", { mode: "date" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
}, (table) => ({
  orderIdx: index("idx_order_items_order_id").on(table.orderId),
  productIdx: index("idx_order_items_product_id").on(table.productId),
}));

export const repairs = pgTable("repairs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  technicianId: text("technician_id").references(() => users.id),
  deviceModel: text("device_model").notNull(),
  imei: text("imei"),
  issueDescription: text("issue_description").notNull(),
  status: text("status").default("pending").notNull(), // pending, pending_quote, negotiating, customer_agreed, shipped_to_shop, received_by_shop, in_progress, pending_payment, completed, cancelled
  repairType: text("repair_type").notNull(), // instore, cargo, remote
  estimatedPrice: decimal("estimated_price", { precision: 10, scale: 2 }),
  finalPrice: decimal("final_price", { precision: 10, scale: 2 }),
  partsCost: decimal("parts_cost", { precision: 10, scale: 2 }),
  laborCost: decimal("labor_cost", { precision: 10, scale: 2 }),
  repairImage: text("repair_image"),
  notes: text("notes"),
  customerTrackingCode: text("customer_tracking_code"),
  shippingTrackingCode: text("shipping_tracking_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_repairs_user_id").on(table.userId),
  technicianIdx: index("idx_repairs_technician_id").on(table.technicianId),
  statusIdx: index("idx_repairs_status").on(table.status),
  userStatusIdx: index("idx_repairs_user_status").on(table.userId, table.status),
  technicianStatusIdx: index("idx_repairs_technician_status").on(table.technicianId, table.status),
  createdAtIdx: index("idx_repairs_created_at").on(table.createdAt),
}));

export const repairMessages = pgTable("repair_messages", {
  id: serial("id").primaryKey(),
  repairId: integer("repair_id").references(() => repairs.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  message: text("message"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  repairIdx: index("idx_repair_messages_repair_id").on(table.repairId),
  userIdx: index("idx_repair_messages_user_id").on(table.userId),
}));

export const devicePurchases = pgTable("device_purchases", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  condition: text("condition").notNull(), // e.g. "Sıfır Gibi", "Çizikler Var", "Ekran Kırık"
  images: jsonb("images").$type<string[]>().notNull(), // Must contain at least 3
  status: text("status").default("pending").notNull(), // pending, offered, accepted, rejected, cancelled
  offeredPrice: decimal("offered_price", { precision: 10, scale: 2 }),
  notes: text("notes"), // Customer notes
  adminNotes: text("admin_notes"), // Admin's response notes
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_device_purchases_user_id").on(table.userId),
  statusIdx: index("idx_device_purchases_status").on(table.status),
}));

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  link: text("link"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_notifications_user_id").on(table.userId),
  isReadIdx: index("idx_notifications_is_read").on(table.isRead),
  userUnreadIdx: index("idx_notifications_user_unread").on(table.userId, table.isRead),
  createdAtIdx: index("idx_notifications_created_at").on(table.createdAt),
}));

import { relations } from "drizzle-orm";

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  repairs: many(repairs),
  accounts: many(accounts),
  sessions: many(sessions),
  auditLogs: many(auditLogs),
  devicePurchases: many(devicePurchases),
  notifications: many(notifications),
}));

export const devicePurchasesRelations = relations(devicePurchases, ({ one }) => ({
  user: one(users, {
    fields: [devicePurchases.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const repairsRelations = relations(repairs, ({ one, many }) => ({
  user: one(users, {
    fields: [repairs.userId],
    references: [users.id],
  }),
  messages: many(repairMessages),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export const repairMessagesRelations = relations(repairMessages, ({ one }) => ({
  repair: one(repairs, {
    fields: [repairMessages.repairId],
    references: [repairs.id],
  }),
  user: one(users, {
    fields: [repairMessages.userId],
    references: [users.id],
  }),
}));
