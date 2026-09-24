ALTER TABLE "accounts" ADD CONSTRAINT "accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId");--> statement-breakpoint
ALTER TABLE "verificationTokens" ADD CONSTRAINT "verificationTokens_identifier_token_pk" PRIMARY KEY("identifier","token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_accounts_user_id" ON "accounts" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_user_id" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_device_purchases_user_id" ON "device_purchases" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_device_purchases_status" ON "device_purchases" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_notifications_user_id" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_notifications_is_read" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_notifications_user_unread" ON "notifications" USING btree ("user_id","is_read");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_notifications_created_at" ON "notifications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_order_items_order_id" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_order_items_product_id" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orders_user_id" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orders_status" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orders_user_status" ON "orders" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orders_created_at" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_category_id" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_is_active" ON "products" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_brand" ON "products" USING btree ("brand");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_active_category" ON "products" USING btree ("is_active","category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_created_at" ON "products" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_repair_messages_repair_id" ON "repair_messages" USING btree ("repair_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_repair_messages_user_id" ON "repair_messages" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_repairs_user_id" ON "repairs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_repairs_technician_id" ON "repairs" USING btree ("technician_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_repairs_status" ON "repairs" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_repairs_user_status" ON "repairs" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_repairs_technician_status" ON "repairs" USING btree ("technician_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_repairs_created_at" ON "repairs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users" USING btree ("role");