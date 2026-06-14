-- Seed data for bean-opt application

-- Disable triggers and foreign keys for bulk loading
SET session_replication_role = replica;

--
-- Data for Name: users; Type: TABLE DATA; Schema: auth
--
INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', 'authenticated', 'authenticated', 'lookitsmidge@gmail.com', NULL, '2026-06-06 12:45:04.964798+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-06 19:22:58.116618+00', '{"provider": "google", "providers": ["google"]}', '{"iss": "https://accounts.google.com", "sub": "115829057464090476936", "name": "James Martland", "email": "lookitsmidge@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJzyk94hBdySpeGOePaiDh15DZPdxKIR1B4i4ARFGiAarAfZp3yXQ=s96-c", "full_name": "James Martland", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJzyk94hBdySpeGOePaiDh15DZPdxKIR1B4i4ARFGiAarAfZp3yXQ=s96-c", "provider_id": "115829057464090476936", "email_verified": true, "phone_verified": false}', NULL, '2026-06-06 12:45:04.954963+00', '2026-06-07 10:37:16.173134+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false)
ON CONFLICT (id) DO NOTHING;

--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth
--
INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('115829057464090476936', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', '{"iss": "https://accounts.google.com", "sub": "115829057464090476936", "name": "James Martland", "email": "lookitsmidge@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJzyk94hBdySpeGOePaiDh15DZPdxKIR1B4i4ARFGiAarAfZp3yXQ=s96-c", "full_name": "James Martland", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJzyk94hBdySpeGOePaiDh15DZPdxKIR1B4i4ARFGiAarAfZp3yXQ=s96-c", "provider_id": "115829057464090476936", "email_verified": true, "phone_verified": false}', 'google', '2026-06-06 12:45:04.961089+00', '2026-06-06 12:45:04.96111+00', '2026-06-06 19:22:58.114979+00', '5b67a4ec-3fd1-43de-bc31-e33786259ddd')
ON CONFLICT (id) DO NOTHING;

--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public
--
INSERT INTO "public"."profiles" ("id", "username", "full_name", "avatar_url", "bio", "is_banned", "privacy_policy_accepted_at", "created_at", "updated_at") VALUES
	('9915f89d-60ab-4f7b-82ee-efb65e6f14fd', 'lookitsmidge', 'James Martland', 'https://lh3.googleusercontent.com/a/ACg8ocJzyk94hBdySpeGOePaiDh15DZPdxKIR1B4i4ARFGiAarAfZp3yXQ=s96-c', NULL, false, NULL, '2026-06-06 12:45:04.940547+00', '2026-06-06 12:45:04.940547+00')
ON CONFLICT (id) DO NOTHING;

--
-- Data for Name: coffee_equipments; Type: TABLE DATA; Schema: public
--
INSERT INTO "public"."coffee_equipments" ("id", "user_id", "name", "type", "active", "created_at") VALUES
	('4c2fa2a8-a347-46be-a7c2-f14d470bafb6', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', 'IMS High-Flow Filter Basket', 'Basket', true, '2026-06-07 11:16:53.307+00'),
	('c4360de6-21cd-4f4f-a56a-204cc9ee2374', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', 'Normcore V4', 'Tamper', true, '2026-06-07 11:17:03.692+00'),
	('3a8c22b2-18c5-492d-ac6c-5bb07bf7697e', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', 'Normcore Shaker', 'Shaker', true, '2026-06-07 11:17:21.788+00')
ON CONFLICT (id) DO NOTHING;

--
-- Data for Name: coffee_grinders; Type: TABLE DATA; Schema: public
--
INSERT INTO "public"."coffee_grinders" ("id", "user_id", "name", "active", "created_at", "manufacturer") VALUES
	('37bf4f32-4501-4a8f-950e-4731d6440680', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', 'Specialita', true, '2026-06-06 12:45:04.940547+00', 'Eurika'),
	('79797679-c2d5-4062-8b59-87172464c640', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', 'Encore (non-ESP)', false, '2026-06-06 20:17:26.732+00', 'Baratza')
ON CONFLICT (id) DO NOTHING;

--
-- Data for Name: coffee_machines; Type: TABLE DATA; Schema: public
--
INSERT INTO "public"."coffee_machines" ("id", "user_id", "name", "active", "created_at", "manufacturer") VALUES
	('89946f23-f3d0-4c19-9690-06061c912fbc', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', 'Bambino Plus', true, '2026-06-06 20:15:38.574+00', 'Sage'),
	('53354dee-4ebc-4830-b336-67b6ca80bbb7', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', 'Aeropress', true, '2026-06-06 20:18:07.27+00', 'Aeropress')
ON CONFLICT (id) DO NOTHING;

--
-- Data for Name: coffees; Type: TABLE DATA; Schema: public
--
INSERT INTO "public"."coffees" ("id", "user_id", "name", "roaster", "notes", "active", "created_at", "roast_profile", "description", "url", "price_per_kg") VALUES
	('b26b0d20-33dc-40f9-91b2-11274fd7fab6', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', 'Macaron Pistache', 'Temps des Cerises', NULL, true, '2026-06-06 20:20:42.553+00', 'medium', '100% Arabica', NULL, NULL),
	('793e26f0-fbec-4b3d-ab0c-ffa7ce324ab6', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', 'Classic Italian Blend', 'Spiller & Tait', 'bitter-sweet cocoa, caramel, hazelnut.', true, '2026-06-06 20:03:05.335+00', 'dark', 'Espresso blend of Arabica beans from Brazil and Ethiopia, with a splash of Robusta beans for caffeine strength.Intense and fill bodied', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

--
-- Data for Name: coffee_targets; Type: TABLE DATA; Schema: public
--
INSERT INTO "public"."coffee_targets" ("id", "coffee_id", "min_yield", "max_yield", "min_extraction_time", "max_extraction_time", "min_flow_rate", "max_flow_rate", "created_at", "taste_profile", "min_preinfusion_time", "max_preinfusion_time") VALUES
	('b5138fe1-71dc-419c-b380-2d3ec0f6d017', '793e26f0-fbec-4b3d-ab0c-ffa7ce324ab6', 25.0, 30.0, 18.0, 24.0, 1.150, 1.450, '2026-06-06 21:32:46.531+00', 'Default Profile', 7.0, 10.0)
ON CONFLICT (id) DO NOTHING;

--
-- Data for Name: setups; Type: TABLE DATA; Schema: public
--
INSERT INTO "public"."setups" ("id", "user_id", "name", "machine_id", "grinder_id", "active", "created_at") VALUES
	('cc2889a8-a7e6-4df9-8bb3-8a74448e7d2c', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', 'Aeropress Espresso', '53354dee-4ebc-4830-b336-67b6ca80bbb7', '79797679-c2d5-4062-8b59-87172464c640', true, '2026-06-06 20:18:21.068+00'),
	('48112515-8af6-447d-a5ba-1ca990159ac7', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', 'Default Espresso', '89946f23-f3d0-4c19-9690-06061c912fbc', '37bf4f32-4501-4a8f-950e-4731d6440680', true, '2026-06-06 12:45:04.940547+00')
ON CONFLICT (id) DO NOTHING;

--
-- Data for Name: setup_equipments; Type: TABLE DATA; Schema: public
--
INSERT INTO "public"."setup_equipments" ("setup_id", "equipment_id") VALUES
	('48112515-8af6-447d-a5ba-1ca990159ac7', '4c2fa2a8-a347-46be-a7c2-f14d470bafb6'),
	('48112515-8af6-447d-a5ba-1ca990159ac7', 'c4360de6-21cd-4f4f-a56a-204cc9ee2374'),
	('48112515-8af6-447d-a5ba-1ca990159ac7', '3a8c22b2-18c5-492d-ac6c-5bb07bf7697e')
ON CONFLICT (setup_id, equipment_id) DO NOTHING;

--
-- Data for Name: workflows; Type: TABLE DATA; Schema: public
--
INSERT INTO "public"."workflows" ("id", "user_id", "name", "description", "active", "created_at") VALUES
	('a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', 'Standard Shaker Workflow', 'standard workflow including weigh out beans, pre-warming shot and then espresso execution', true, '2026-06-06 20:54:31.642+00'),
	('6d01478c-b73e-4207-bb3d-fec532003e2d', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', 'Aeropress Workflow', NULL, true, '2026-06-06 21:04:06.783+00')
ON CONFLICT (id) DO NOTHING;

--
-- Data for Name: workflow_steps; Type: TABLE DATA; Schema: public
--
INSERT INTO "public"."workflow_steps" ("id", "workflow_id", "step_number", "stage", "important", "created_at", "title", "instructions") VALUES
	('bdbe5c04-6c44-4505-8678-c0ae6a53f81f', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 1, 'Before', false, '2026-06-06 20:54:31.642+00', 'Purge Stale Grounds', 'Run the grinder for 1 second to clear stale retention.'),
	('a9535589-006f-4449-8f92-807e95576ce9', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 2, 'Before', false, '2026-06-06 20:54:31.642+00', 'Grind into Shaker', 'Grind exactly 18.0g of beans into the Normcore Shaker (use tared scale to measure weight and remove excess)'),
	('a7bed7ea-ccfc-4fb0-ab3e-e45c9b024691', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 3, 'Before', false, '2026-06-06 20:54:31.642+00', 'Shake It!', 'Shake horizontally and vertically for 5 seconds to homogenize particles and remove static clumping. Set the closed shaker aside'),
	('67c8deba-e180-43d2-a8bb-3c8a3d6b3cd1', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 4, 'Before', false, '2026-06-06 20:54:31.642+00', 'Pre-Warming Prep', 'Lock the emtpy portafilter into the machine (no puck screen). '),
	('a4358751-5610-40e2-ba2b-a67e0472ff8f', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 5, 'Before', false, '2026-06-06 20:54:31.642+00', 'Pre-Warming Shot', 'Run a single-shot blank hot water cycle. This transfers thermal energy to the group head and portafilter metal, preventing cold-start extraction drop'),
	('50f0a0cb-1c67-46e9-970a-96394c25e2ed', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 6, 'Before', false, '2026-06-06 20:54:31.642+00', 'Empty Portafilter', 'Remove portafilter, discarding water'),
	('ad18d73b-3d2f-4819-a794-5a87fad72499', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 7, 'Before', false, '2026-06-06 20:54:31.642+00', 'Dry Portafilter', 'Thoroughly dry out the portafilter using a microfiber cloth. Target specifically the vertical walls of the hot IMS basket. walls should be bone dry to maximize wall friction'),
	('935489b6-504d-418c-acb6-5fb73215a037', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 8, 'Before', false, '2026-06-06 20:54:31.642+00', 'Dose & Level', 'put the shaker ontop of the portafilter, pull the plug and ring the bell to drop the grounds into the portafilter. Give the portafilter a few taps on the mat, settling the grounds more flat. Remove the shaker'),
	('392dda5f-bd5a-4069-8960-406295b102db', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 9, 'Before', false, '2026-06-06 20:54:31.642+00', 'Edge Tamp', 'Insert the tamper edge first against the edge of the portafilter, execute a circular rolling motion around the edge to knead the perimeter grounds against the side'),
	('fe12a360-d930-437a-ab3b-5c4dcaa9f1fa', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 10, 'Before', false, '2026-06-06 20:54:31.642+00', 'Flat Tamp', 'Place portafilter flat on the top of the portafilter, perform a firm, level tamp. Remove tamper'),
	('6cfb6b46-dfad-46da-a941-4ae3ccfb7173', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 11, 'Before', false, '2026-06-06 20:54:31.642+00', 'Puck Screen and Lock in', 'Place puck screen ontop of the coffee in the portafilter, and lock it into the machine'),
	('01bc0d62-054f-4b86-bc8c-e30ac4960812', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 12, 'Before', false, '2026-06-06 20:54:31.642+00', 'Scale and Cup', 'Place scale on the machine, and place a cup on the scale. Tare the scale.'),
	('8feb0f38-754e-4151-a03d-82e1feed119a', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 13, 'During', false, '2026-06-06 20:54:31.642+00', 'Preinfuse & Timer Start', 'Press and hold the button on the machine to pre-infuse. Start the timer when you hear the water flow in the machine.'),
	('4783b295-fa6f-47d4-94b7-a1703c001d8c', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 14, 'During', false, '2026-06-06 20:54:31.642+00', 'Pivot to Extraction', 'Watch the bottom of the filter basket until you see the drops of coffee form along the whole bottom of the basket. Release the button and record time (Preinfusion time)'),
	('9fd39d34-b2f9-499d-92a6-cd7c0982990d', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 15, 'During', false, '2026-06-06 20:54:31.642+00', 'Observe Extraction', 'Watch timer and weight closely. Stop the extraction by pressing the button again when it hits your pre-determined thresholds (e.g... 28 seconds / 30g). Stop the timer at the same time as you stop the extraction.'),
	('b109184d-af08-4a12-a135-48f68a4b137c', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 16, 'After', false, '2026-06-06 20:54:31.642+00', 'Cup Removal', 'After drips finished, remove the cup from the machine'),
	('3496f712-a3f7-4e8f-8318-34a2acc6740b', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 17, 'After', false, '2026-06-06 20:54:31.642+00', 'Portafilter Removal', 'Unlock the portafilter from the machine, use the magnetic WDT tool to remove the HOT puck screen from the portafilter.'),
	('cc2261c6-043a-4c65-afce-f01c800725dd', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 18, 'After', false, '2026-06-06 20:54:31.642+00', 'Remove Coffee Puck', 'Knock out Coffee puck into knock box, proceed to run a blank through the machine to rinse the group head, and clean the portafilter.'),
	('3f884120-4ca2-47c1-accd-a8b61a556fa1', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 19, 'After', false, '2026-06-06 20:54:31.642+00', 'Stirr and Wait', 'Stirr the espresso with a small spoon to homogenise the dense, syrupy bottom layers with the lighter crema on top. Leave the shot for 60 - 90 seconds'),
	('d3113f73-cac7-4891-829c-005c82f42869', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', 20, 'After', false, '2026-06-06 20:54:31.642+00', 'Taste, Log and Enjoy', 'Try the shot, assess the flavour and evaluate further action'),
	('7e0d5590-4457-4cd8-8982-0166062b27ca', '6d01478c-b73e-4207-bb3d-fec532003e2d', 1, 'Before', false, '2026-06-06 21:04:06.783+00', 'Purge Stale Grounds', 'Run the grinder for 1 second to purge the stale grounds'),
	('bec1e759-9bc9-4284-b23e-e67b17215b6d', '6d01478c-b73e-4207-bb3d-fec532003e2d', 2, 'Before', false, '2026-06-06 21:04:06.783+00', 'Prepare Aeropress', 'Get Aeropress, unscrew bottom and add filter, screw back together'),
	('b2f9e45a-fc2d-4787-a05d-4af0d0f5d92c', '6d01478c-b73e-4207-bb3d-fec532003e2d', 3, 'Before', false, '2026-06-06 21:04:06.783+00', 'Weigh Grounds', 'put Aeropress on the scale, grind and weigh out 18g of coffee into the Aeropress'),
	('5b43ccd6-65b3-4bce-ae4d-79ae69e8d5f3', '6d01478c-b73e-4207-bb3d-fec532003e2d', 4, 'Before', false, '2026-06-06 21:04:06.783+00', 'Boil Kettle', 'Boil the kettle'),
	('ff5c8468-337d-420a-a783-ce921a646172', '6d01478c-b73e-4207-bb3d-fec532003e2d', 5, 'Before', false, '2026-06-06 21:04:06.783+00', 'Aeropress to Cup', 'Put the Aeropress ontop of a cup'),
	('0914fb0b-6b3c-407c-aad6-fa2758649d2d', '6d01478c-b73e-4207-bb3d-fec532003e2d', 6, 'During', false, '2026-06-06 21:04:06.783+00', 'Pour into Aeropress', 'Pour the hot water into the aeropress up to the (2) mark'),
	('259ec65e-b18c-4c41-a4ed-4f28ee044da2', '6d01478c-b73e-4207-bb3d-fec532003e2d', 7, 'During', false, '2026-06-06 21:04:06.783+00', 'Stirr', 'Stirr the grounds inside the Aeropress for 10 seconds, then put the plunger in the top'),
	('c9ca43dc-8402-4027-ab02-13c0609e54e2', '6d01478c-b73e-4207-bb3d-fec532003e2d', 8, 'During', false, '2026-06-06 21:04:06.783+00', 'Wait...', 'Wait for 2 minutes '),
	('73bfebe0-39c0-41f1-af0d-6ea3f6155fd8', '6d01478c-b73e-4207-bb3d-fec532003e2d', 9, 'During', false, '2026-06-06 21:04:06.783+00', 'Press the Plunger', 'Press the plunger of the Aeropress to slowly press the water through the coffee'),
	('0e80bb2a-3d1e-48aa-968c-6631c5b86174', '6d01478c-b73e-4207-bb3d-fec532003e2d', 10, 'After', false, '2026-06-06 21:04:06.783+00', 'Remove Aeropress and empty', 'Remove Aerporess, unscrew bottom and push out beans into the bin')
ON CONFLICT (id) DO NOTHING;

--
-- Data for Name: espresso_readings; Type: TABLE DATA; Schema: public
--
INSERT INTO "public"."espresso_readings" ("id", "user_id", "coffee_id", "workflow_id", "setup_id", "coffee_mass_in", "warming_shot", "preinfusion_time", "extraction_time", "total_yield", "flow_rate", "flavour_balance", "rating", "comments", "created_at") VALUES
	('7ee12710-88b4-4135-a71d-4ff1057a0e1b', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', '793e26f0-fbec-4b3d-ab0c-ffa7ce324ab6', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', '48112515-8af6-447d-a5ba-1ca990159ac7', 18.0, false, 7.0, 24.0, 29.0, 1.208, 5, 3, 'Yield expansion; well-balanced, high-resistance sweet-spot run', '2026-06-06 21:44:16.988+00'),
	('0082842e-a77c-42b2-a852-43a9a8d7851c', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', '793e26f0-fbec-4b3d-ab0c-ffa7ce324ab6', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', '48112515-8af6-447d-a5ba-1ca990159ac7', 18.0, false, 7.0, 22.0, 25.5, 1.159, 3, 2, 'Manual stop pivot; tight ristretto cut. Revealed sour underextraction as it cooled', '2026-06-06 21:42:46.059+00'),
	('247f5b82-5eea-4011-927d-f634bfe1db42', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', '793e26f0-fbec-4b3d-ab0c-ffa7ce324ab6', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', '48112515-8af6-447d-a5ba-1ca990159ac7', 18.0, false, 7.0, 24.0, 33.6, 1.400, 7, 4, 'Aggressive "bracket" fine nudge; successfully slowed down velocity', '2026-06-06 21:41:35.594+00'),
	('5cdc0c27-67c0-4780-914f-abdde1dfdb00', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', '793e26f0-fbec-4b3d-ab0c-ffa7ce324ab6', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', '48112515-8af6-447d-a5ba-1ca990159ac7', 18.0, false, 7.0, 18.0, 33.6, 1.867, 3, 2, 'Back-to-Back duplicate verification; confirmed total prep stability', '2026-06-06 21:39:55.358+00'),
	('c86649a6-59df-4d49-9565-4641a0ff5a90', '9915f89d-60ab-4f7b-82ee-efb65e6f14fd', '793e26f0-fbec-4b3d-ab0c-ffa7ce324ab6', 'a5bba7d4-b910-4b0c-9c5f-3e9703ea0c69', '48112515-8af6-447d-a5ba-1ca990159ac7', 18.0, false, 9.0, 16.0, 33.7, 2.106, 3, 2, 'Initial stabilized prep; slow ooze start with late acceleration', '2026-06-06 21:38:30.315+00')
ON CONFLICT (id) DO NOTHING;

-- Restore triggers and foreign keys
SET session_replication_role = DEFAULT;
