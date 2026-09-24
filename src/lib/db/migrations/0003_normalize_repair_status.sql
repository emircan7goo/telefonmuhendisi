-- Tamir durumları tek durum makinesinde (src/lib/repair-status.ts) toplandı; eski isimleri kanonik isimlere taşı.
UPDATE "repairs" SET "status" = 'pending' WHERE "status" = 'pending_quote';--> statement-breakpoint
UPDATE "repairs" SET "status" = 'awaiting_customer_approval' WHERE "status" = 'negotiating';--> statement-breakpoint
UPDATE "repairs" SET "status" = 'customer_agreed' WHERE "status" = 'awaiting_shipment';--> statement-breakpoint
UPDATE "repairs" SET "status" = 'received_by_shop' WHERE "status" = 'received';--> statement-breakpoint
UPDATE "repairs" SET "status" = 'in_progress' WHERE "status" = 'repairing';--> statement-breakpoint
UPDATE "repairs" SET "status" = 'completed' WHERE "status" IN ('shipped', 'delivered');
