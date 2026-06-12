

INSERT INTO users (password, username, first_name, last_name) VALUES
    ('$2b$10$DLSwFdtsjWp3u/wxqxez9.Y7OvAB/3ZnbCR07293lgz7bMf.I.HKC', 'admin', 'Admin', 'Admin'),
    ('$2b$10$DLSwFdtsjWp3u/wxqxez9.Y7OvAB/3ZnbCR07293lgz7bMf.I.HKC', 'guest', 'Guest', 'Guest')
;


INSERT INTO products (name) VALUES
    ('8DAB'),
    ('8DJH'),
    ('Simosec'),
    ('NXPlus C')
;


INSERT INTO assembly_lines (product_id, name) VALUES
    ((SELECT id FROM products WHERE name = '8DAB'), 'Convey line'),
    ((SELECT id FROM products WHERE name = '8DAB'), 'Testing line'),

    ((SELECT id FROM products WHERE name = '8DJH'), 'Manual line'),
    ((SELECT id FROM products WHERE name = '8DJH'), 'Final assembly line'),
    ((SELECT id FROM products WHERE name = '8DJH'), 'Testing line'),

    ((SELECT id FROM products WHERE name = 'Simosec'), 'Convey line'),
    ((SELECT id FROM products WHERE name = 'Simosec'), 'Final assembly line'),

    ((SELECT id FROM products WHERE name = 'NXPlus C'), 'Manual line'),
    ((SELECT id FROM products WHERE name = 'NXPlus C'), 'Testing line')
;


INSERT INTO workstations (short_name, name, pc_name) VALUES
    ('WS-L-WELD',   'Laser welding',      'PC-LASER-WELD-01'),
    ('WS-M-WELD',   'Manual welding',     'PC-MAN-WELD-01'),
    ('WS-DRV-ASM',  'Drive assembly',     'PC-DRIVE-ASM-01'),
    ('WS-V-DROP',   'Voltage drop test',  'PC-VDROP-TEST-01'),
    ('WS-LEAK',     'Leakage test',       'PC-LEAK-TEST-01'),
    ('WS-HV-PD',    'HV/PD test',         'PC-HVPD-TEST-01'),
    ('WS-FIN-INSP', 'Final inspection',   'PC-FINAL-INSP-01'),
    ('WS-FRM-ASM',  'Frame assembly',     'PC-FRAME-ASM-01'),
    ('WS-TESTING',  'Testing',            'PC-GEN-TEST-01'),
    ('WS-DISPATCH', 'Dispatch',           'PC-DISPATCH-01')
;


INSERT INTO assembly_line_workstations (assembly_line_id, workstation_id) VALUES
    -- Stanowiska na liniach typu 'Convey line'
    ((SELECT id FROM assembly_lines WHERE name = 'Convey line' AND product_id = (SELECT id FROM products WHERE name = '8DAB')), (SELECT id FROM workstations WHERE short_name = 'WS-FRM-ASM')),
    ((SELECT id FROM assembly_lines WHERE name = 'Convey line' AND product_id = (SELECT id FROM products WHERE name = '8DAB')), (SELECT id FROM workstations WHERE short_name = 'WS-DRV-ASM')),
    ((SELECT id FROM assembly_lines WHERE name = 'Convey line' AND product_id = (SELECT id FROM products WHERE name = '8DAB')), (SELECT id FROM workstations WHERE short_name = 'WS-L-WELD')),

    -- Stanowiska na liniach typu 'Manual line'
    ((SELECT id FROM assembly_lines WHERE name = 'Manual line' AND product_id = (SELECT id FROM products WHERE name = '8DJH')), (SELECT id FROM workstations WHERE short_name = 'WS-FRM-ASM')),
    ((SELECT id FROM assembly_lines WHERE name = 'Manual line' AND product_id = (SELECT id FROM products WHERE name = '8DJH')), (SELECT id FROM workstations WHERE short_name = 'WS-M-WELD')),

    -- Stanowiska na liniach testowych 'Testing line'
    ((SELECT id FROM assembly_lines WHERE name = 'Testing line' AND product_id = (SELECT id FROM products WHERE name = '8DAB')), (SELECT id FROM workstations WHERE short_name = 'WS-V-DROP')),
    ((SELECT id FROM assembly_lines WHERE name = 'Testing line' AND product_id = (SELECT id FROM products WHERE name = '8DAB')), (SELECT id FROM workstations WHERE short_name = 'WS-LEAK')),
    ((SELECT id FROM assembly_lines WHERE name = 'Testing line' AND product_id = (SELECT id FROM products WHERE name = '8DAB')), (SELECT id FROM workstations WHERE short_name = 'WS-HV-PD')),
    ((SELECT id FROM assembly_lines WHERE name = 'Testing line' AND product_id = (SELECT id FROM products WHERE name = '8DAB')), (SELECT id FROM workstations WHERE short_name = 'WS-TESTING')),

    -- Stanowiska na linii 'Final assembly line'
    ((SELECT id FROM assembly_lines WHERE name = 'Final assembly line' AND product_id = (SELECT id FROM products WHERE name = '8DJH')), (SELECT id FROM workstations WHERE short_name = 'WS-FIN-INSP')),
    ((SELECT id FROM assembly_lines WHERE name = 'Final assembly line' AND product_id = (SELECT id FROM products WHERE name = '8DJH')), (SELECT id FROM workstations WHERE short_name = 'WS-DISPATCH'))

;
