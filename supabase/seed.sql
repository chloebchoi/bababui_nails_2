SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict aONaTonydlyikXohbgzwZcuXrrTMcWdOLdYBdHPaSENrwPdmoVLf6l8T2ezgqIP

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: appointment_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: blocked_dates; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."blocked_dates" ("id", "blocked_date", "blocked_time", "reason", "created_at", "blocked_time_end") VALUES
	('ce2d7c17-618a-4963-b512-6488166c105d', '2026-10-08', NULL, NULL, '2026-09-03 05:01:22.203955+00', NULL),
	('6e57e669-6b81-409c-97ac-3c1a44da0605', '2026-10-09', NULL, NULL, '2026-09-03 05:01:22.561514+00', NULL),
	('fe0a3381-84d6-47f7-a7ab-297f53575037', '2026-10-10', NULL, NULL, '2026-09-03 05:01:22.86205+00', NULL),
	('9b24624c-1bcb-4228-8073-24bc686ff1de', '2026-10-11', NULL, NULL, '2026-09-03 05:01:23.141442+00', NULL),
	('8308b8e7-f636-4438-a774-56c16e83f6f6', '2026-10-12', NULL, NULL, '2026-09-03 05:01:23.371146+00', NULL),
	('7baac75f-94c9-47c3-801c-e88d9b709090', '2026-10-13', NULL, NULL, '2026-09-03 05:01:23.738923+00', NULL),
	('fde9903b-7962-4155-9770-956eb1316832', '2026-10-14', NULL, NULL, '2026-09-03 05:01:23.960895+00', NULL),
	('1dd59553-fc67-40d0-a212-75e2403288c8', '2026-10-15', NULL, NULL, '2026-09-03 05:02:33.514837+00', NULL),
	('bdb88ee1-4544-4d4d-ba84-bb1c54f40701', '2026-10-16', NULL, NULL, '2026-09-03 05:02:33.765884+00', NULL),
	('fcdc5d16-d836-4ad4-a2e0-d80ea5b20048', '2026-10-17', NULL, NULL, '2026-09-03 05:02:34.085406+00', NULL),
	('38a7f050-343c-4aef-8a9a-e3647b199f52', '2026-10-18', NULL, NULL, '2026-09-03 05:02:34.379366+00', NULL),
	('91e50de9-569d-4c6c-8bb1-594c0aabe293', '2026-10-19', NULL, NULL, '2026-09-03 05:02:34.790723+00', NULL),
	('8206d4c4-b99e-4cee-88a6-ff0456782d1a', '2026-10-20', NULL, NULL, '2026-09-03 05:02:34.984013+00', NULL),
	('c6d7be1b-38eb-4663-a966-9ce37ff1e513', '2026-10-21', NULL, NULL, '2026-09-03 05:02:35.370844+00', NULL),
	('70b82e0f-185a-4844-8c64-a1f825c9bbc0', '2026-10-22', NULL, NULL, '2026-09-03 05:02:35.553725+00', NULL),
	('55681550-acef-4629-bfd5-23520558ec8f', '2026-09-08', NULL, NULL, '2026-09-03 07:56:48.062174+00', NULL),
	('aa477e9d-1d4e-4765-9e2f-cf374397d79c', '2026-09-09', NULL, NULL, '2026-09-03 07:56:48.430802+00', NULL),
	('133e2523-4518-4d31-bc8c-3dc7bc3e51c6', '2026-09-10', NULL, NULL, '2026-09-03 07:56:48.688544+00', NULL),
	('264725a8-ac88-4de3-be35-aeb39b68804b', '2026-09-11', NULL, NULL, '2026-09-03 07:56:49.012639+00', NULL),
	('51b91e19-5b10-4395-9f53-aed800ee3836', '2026-09-12', NULL, NULL, '2026-09-03 07:56:49.209383+00', NULL),
	('fd8924bb-8c09-449e-ba3c-a70353d0f9fb', '2026-09-13', NULL, NULL, '2026-09-03 07:56:49.386163+00', NULL),
	('6f03f120-930e-4749-97c0-d41129001907', '2026-10-06', NULL, NULL, '2026-09-08 06:54:07.247546+00', NULL),
	('d79a5173-decc-4372-b057-bc0a2025535d', '2026-10-07', NULL, NULL, '2026-09-08 06:54:07.891109+00', NULL),
	('d83c6308-eefd-466e-b253-f31b619eeac9', '2026-10-06', NULL, NULL, '2026-09-09 21:18:30.27839+00', NULL),
	('5fc502e1-2e6c-4b93-9811-5c2d979c2f26', '2026-10-07', NULL, NULL, '2026-09-09 21:18:30.637496+00', NULL),
	('d5ebe8e3-5476-4ef4-ba03-519a478b25d1', '2026-09-19', NULL, NULL, '2026-09-12 00:35:39.119863+00', NULL),
	('a150b7ab-049b-4224-86f0-ec7e031f4f88', '2026-09-19', NULL, NULL, '2026-09-12 01:51:25.542002+00', NULL),
	('f48f4394-ef94-45e7-8666-e772a1aafa7b', '2026-10-25', NULL, 'violet ', '2026-09-12 07:12:03.449768+00', NULL),
	('8944c4ae-e2dc-48e3-9fd5-c7dbc51f855d', '2026-10-24', NULL, 'hannah', '2026-09-12 07:12:25.600733+00', NULL),
	('93c7925d-1603-419c-943e-9b1d8d21daaf', '2026-10-23', NULL, 'kiana ', '2026-09-12 07:13:24.385458+00', NULL),
	('172331a2-9ffe-4760-a706-a4385cf815d6', '2026-10-30', NULL, NULL, '2026-09-12 07:15:09.227518+00', NULL),
	('80621f22-7bf3-4546-a4a5-a5be3c346c21', '2026-10-31', NULL, NULL, '2026-09-12 07:15:10.565521+00', NULL),
	('b69cc1b9-71a6-470b-a204-7039af4ebfa3', '2026-09-14', NULL, 'break', '2026-09-12 07:25:31.854737+00', NULL),
	('3d37d0be-1f98-4ded-addf-7cefc1f6b687', '2026-09-16', NULL, 'break ', '2026-09-12 07:26:13.409913+00', NULL),
	('e2be891e-959b-42ce-992c-b914c5c13b68', '2026-09-24', NULL, 'break', '2026-09-12 07:27:21.58552+00', NULL),
	('f4de79be-c3ef-482f-abea-da887f05a6fc', '2026-09-27', NULL, 'esther', '2026-09-13 04:15:22.375092+00', NULL),
	('86ec1040-0df9-4250-86ac-77e67c76d275', '2026-09-23', NULL, 'break ', '2026-09-13 04:16:41.557254+00', NULL),
	('d87841e1-18a0-408d-a81c-9b126fe36c8e', '2026-09-29', NULL, 'mishal', '2026-09-13 23:51:38.871567+00', NULL),
	('1be518c6-4fc1-47ea-8f3c-6c1706e9a9e9', '2026-10-01', NULL, 'sandy', '2026-09-13 23:56:27.768367+00', NULL),
	('f3d7c758-bc80-4ea8-8b65-2b694df81ca0', '2026-09-30', NULL, 'break', '2026-09-13 23:57:53.095104+00', NULL),
	('12644cf9-d93e-42a0-b413-56dbd0df7705', '2026-10-02', NULL, 'mia', '2026-09-18 08:27:41.016507+00', NULL),
	('5e696c77-ecbf-46ee-8002-08e91b0aa3bf', '2026-10-27', NULL, 'isabel', '2026-09-22 05:42:55.821291+00', NULL),
	('fb52ea6c-d206-4a8d-bb26-05b58df24f7d', '2026-11-07', NULL, 'shubhi', '2026-09-23 22:11:47.827531+00', NULL);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories" ("id", "name", "created_at") VALUES
	('cee2d2da-e2ca-43d4-94d9-0e9036b57ac6', 'Acrylic', '2026-08-29 22:52:24.98836+00'),
	('eaee8e4b-ba1e-442a-a657-f10bfb6c15cb', 'Gel-X', '2026-08-29 22:52:24.98836+00'),
	('7e4be63a-d94b-4e50-9aed-aa6f1599dba0', 'Builder Gel', '2026-08-29 22:52:24.98836+00'),
	('0e1ae5ee-973e-46dd-a98c-e1112b60e036', 'Removals', '2026-08-29 22:52:24.98836+00');


--
-- Data for Name: custom_hours; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."custom_hours" ("id", "date", "start_time", "end_time", "created_at") VALUES
	('5277444b-119f-4bef-bba5-598c06938c49', '2026-09-30', '10:00:00', '19:00:00', '2026-09-13 20:23:09.688545+00');


--
-- Data for Name: service_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."service_types" ("id", "category_id", "name", "created_at") VALUES
	('30232b7f-a927-4f4c-9275-c2bf8bd258af', 'cee2d2da-e2ca-43d4-94d9-0e9036b57ac6', 'New Set', '2026-08-29 22:52:24.98836+00'),
	('2789dce0-03c3-4824-8fca-db6bc3b0ff31', 'cee2d2da-e2ca-43d4-94d9-0e9036b57ac6', 'Fill', '2026-08-29 22:52:24.98836+00'),
	('39b3de00-4afe-40d0-813f-a2c3a0d5c392', 'eaee8e4b-ba1e-442a-a657-f10bfb6c15cb', 'New Set', '2026-08-29 22:52:24.98836+00'),
	('035c4cee-a8cd-4032-898f-e9675075c5b4', 'eaee8e4b-ba1e-442a-a657-f10bfb6c15cb', 'Fill', '2026-08-29 22:52:24.98836+00'),
	('51bc2874-17ad-4cfa-8d33-44b9b83497c8', '7e4be63a-d94b-4e50-9aed-aa6f1599dba0', 'Builder Gel', '2026-08-30 03:12:23.152745+00'),
	('111c3b34-195e-4478-a48b-fccfab7314dd', '0e1ae5ee-973e-46dd-a98c-e1112b60e036', 'Removals', '2026-08-30 03:12:23.152745+00');


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."services" ("id", "service_type_id", "name", "created_at") VALUES
	('9a6faba0-657e-4be7-b04f-dfb7b8e08173', '30232b7f-a927-4f4c-9275-c2bf8bd258af', 'Short', '2026-08-29 22:52:24.98836+00'),
	('6ef31a28-a0c5-43a8-84c8-ef79d0ae26f7', '30232b7f-a927-4f4c-9275-c2bf8bd258af', 'Medium', '2026-08-29 22:52:24.98836+00'),
	('41d4e837-772c-4761-8939-ce5f5762dc24', '30232b7f-a927-4f4c-9275-c2bf8bd258af', 'Long', '2026-08-29 22:52:24.98836+00'),
	('cfedae63-0e7a-49a5-89b1-4fd067d1c7f0', '30232b7f-a927-4f4c-9275-c2bf8bd258af', 'Extra Long', '2026-08-29 22:52:24.98836+00'),
	('3093e218-7915-4c26-b1d8-37dfd188c7ee', '2789dce0-03c3-4824-8fca-db6bc3b0ff31', 'Short', '2026-08-29 22:52:24.98836+00'),
	('e788a1df-8650-4399-9125-4c6116a9625c', '2789dce0-03c3-4824-8fca-db6bc3b0ff31', 'Medium', '2026-08-29 22:52:24.98836+00'),
	('932fc4a3-d7ba-4a32-8dc2-64f540617218', '2789dce0-03c3-4824-8fca-db6bc3b0ff31', 'Long', '2026-08-29 22:52:24.98836+00'),
	('8ecb0afa-194b-4c77-b529-2298ea22d518', '2789dce0-03c3-4824-8fca-db6bc3b0ff31', 'Extra Long', '2026-08-29 22:52:24.98836+00'),
	('fe09514d-587c-4371-a0f0-51501485997a', '39b3de00-4afe-40d0-813f-a2c3a0d5c392', 'Short', '2026-08-29 22:52:24.98836+00'),
	('e026121b-6ca9-4ec5-a47d-438f5e8d173e', '39b3de00-4afe-40d0-813f-a2c3a0d5c392', 'Medium', '2026-08-29 22:52:24.98836+00'),
	('1d05a21e-4ba8-41af-9d17-5758696b09be', '39b3de00-4afe-40d0-813f-a2c3a0d5c392', 'Long', '2026-08-29 22:52:24.98836+00'),
	('56563391-ab48-45d2-b527-d7f3fe1d15b3', '39b3de00-4afe-40d0-813f-a2c3a0d5c392', 'Extra Long', '2026-08-29 22:52:24.98836+00'),
	('38f4a1f9-b75d-436a-ae7f-bb4ecd930c7b', '035c4cee-a8cd-4032-898f-e9675075c5b4', 'Short', '2026-08-29 22:52:24.98836+00'),
	('45207d7f-d15b-43ba-9c29-fd455e06dd52', '035c4cee-a8cd-4032-898f-e9675075c5b4', 'Medium', '2026-08-29 22:52:24.98836+00'),
	('da33b7bb-928c-4aea-baac-b9d64c0e2c8c', '035c4cee-a8cd-4032-898f-e9675075c5b4', 'Long', '2026-08-29 22:52:24.98836+00'),
	('4194e7b5-865a-4b19-94a6-cb2ec0a94755', '035c4cee-a8cd-4032-898f-e9675075c5b4', 'Extra Long', '2026-08-29 22:52:24.98836+00'),
	('3e58fbd6-caee-45af-83ac-ea5200388326', '51bc2874-17ad-4cfa-8d33-44b9b83497c8', 'Natural Nail Overlay', '2026-08-30 03:12:23.152745+00'),
	('3f0e3472-025e-4dec-a6da-3c79417664c1', '51bc2874-17ad-4cfa-8d33-44b9b83497c8', 'Fill - Natural Nail Overlay', '2026-08-30 03:12:23.152745+00'),
	('8fdd7fd3-bc5b-48db-b469-5d3ecd2dd48d', '111c3b34-195e-4478-a48b-fccfab7314dd', 'Full Removal', '2026-08-30 03:12:23.152745+00'),
	('e2ecdbe4-8198-44fc-a1d6-b7c63ed4435a', '111c3b34-195e-4478-a48b-fccfab7314dd', 'Removal with New Set', '2026-08-30 03:12:23.152745+00');


--
-- Data for Name: working_hours; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."working_hours" ("id", "day_of_week", "start_time", "end_time", "is_active", "created_at") VALUES
	('7dd7e37a-c437-4a04-a24a-586ea3cce6e2', 0, '10:00:00', '19:00:00', true, '2026-08-31 00:04:34.143015+00'),
	('27261f31-3750-45a6-bcd8-91ce46450ed0', 1, '16:30:00', '19:00:00', true, '2026-08-31 00:04:34.143015+00'),
	('1e11ead9-e62f-4688-bfab-551a9aa77909', 2, '13:30:00', '19:00:00', true, '2026-08-31 00:04:34.143015+00'),
	('f3e1cb38-28c1-4977-aa31-2ca1250209e7', 4, '13:30:00', '19:00:00', true, '2026-08-31 00:04:34.143015+00'),
	('bf8ea1b0-1306-4248-a092-8c472dac15b5', 5, '10:00:00', '19:00:00', true, '2026-08-31 00:04:34.143015+00'),
	('df704c54-375d-4c28-bbc8-bfcdacd985e8', 6, '10:00:00', '19:00:00', true, '2026-08-31 00:04:34.143015+00'),
	('a59d1cb5-4059-4495-8c9e-9d8a090a0068', 3, '16:30:00', '19:00:00', true, '2026-08-31 00:04:34.143015+00');


--
-- PostgreSQL database dump complete
--

-- \unrestrict aONaTonydlyikXohbgzwZcuXrrTMcWdOLdYBdHPaSENrwPdmoVLf6l8T2ezgqIP

RESET ALL;
