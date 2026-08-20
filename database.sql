-- Run this once to create the database before `python manage.py migrate`
CREATE DATABASE IF NOT EXISTS pizza_delivery
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Optional: create a dedicated MySQL user
-- CREATE USER 'pizza_user'@'localhost' IDENTIFIED BY 'strong_password';
-- GRANT ALL PRIVILEGES ON pizza_delivery.* TO 'pizza_user'@'localhost';
-- FLUSH PRIVILEGES;

-- All tables are created automatically by Django migrations:
--   python manage.py makemigrations
--   python manage.py migrate
