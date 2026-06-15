import { Pool, types } from 'pg';

// Issue: pg return BIGINT (OID 20) as a string
types.setTypeParser(types.builtins.INT8, (value: string | null) => (value === null ? null : Number(value)));


// Requied env: PGPASSWORD, PGUSER, PGDATABASE, PGHOST, PGPORT
export const pool = new Pool();

