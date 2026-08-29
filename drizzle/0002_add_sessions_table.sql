-- Custom SQL migration file, put your code below! --
CREATE TABLE `sessions` (
  `id` serial AUTO_INCREMENT NOT NULL,
  `token` varchar(255) NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
  CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);