-- Custom SQL migration file, put your code below! --
ALTER TABLE `users` DROP COLUMN `updated_at`, ADD COLUMN `password` varchar(255) NOT NULL;