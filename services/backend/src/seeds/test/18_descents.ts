import Knex from 'knex';
import { DescentRaw } from '~/features/descents/types';
import { BOOM_USER_1500_ID, TEST_USER2_ID, TEST_USER_ID } from './01_users';
import {
  ECUADOR_QUIJOS_BRIDGE,
  ECUADOR_QUIJOS_CHEESE,
  GALICIA_R1_S1,
  GALICIA_R1_S2,
  GEORGIA_BZHUZHA_EXTREME,
  GEORGIA_BZHUZHA_LONG,
  GEORGIA_BZHUZHA_QUALI,
  NORWAY_FINNA_GORGE,
  NORWAY_SJOA_AMOT,
} from './09_sections';

const USER_1 = TEST_USER_ID;
const USER_2 = TEST_USER2_ID;
const USER_3 = BOOM_USER_1500_ID;

export const SECTION_1 = GALICIA_R1_S1;
export const SECTION_2 = GALICIA_R1_S2;
export const SECTION_3 = NORWAY_SJOA_AMOT;
export const SECTION_4 = NORWAY_FINNA_GORGE;
export const SECTION_5 = GEORGIA_BZHUZHA_LONG;
export const SECTION_6 = GEORGIA_BZHUZHA_QUALI;
export const SECTION_7 = GEORGIA_BZHUZHA_EXTREME;
export const SECTION_8 = ECUADOR_QUIJOS_BRIDGE;
export const SECTION_9 = ECUADOR_QUIJOS_CHEESE;

export const DESCENT_01 = '97998f67-74f2-43db-a4e4-198c2ca540a7';
export const DESCENT_02 = '3fb2b1da-6649-429e-8b0e-0cbbda055da7';
export const DESCENT_03 = '7deddd48-9f7f-4a76-9ff9-811f694f52a4';
export const DESCENT_04 = 'ffd6ba41-d7e5-4fbf-8347-2481d583674e';
export const DESCENT_05 = '3a12cd33-2ccd-4fcd-9da5-7ce14006aa15';
export const DESCENT_06 = 'f56a3887-34ba-493e-b681-43b0b4547df7';
export const DESCENT_07 = 'ac323bc5-47e7-43cf-b3dd-e029cf96fcf4';
export const DESCENT_08 = '902c52f3-5165-443b-b4a7-2e9c27b48538';
export const DESCENT_09 = '900ede8f-b605-4dd6-a9b2-9b2628f79254';
export const DESCENT_10 = '7f712c8a-45a9-4fd5-966a-c8b4d07f36df';

export const DESCENT_2_SHARE_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXNjZW50IjoiM2ZiMmIxZGEtNjY0OS00MjllLThiMGUtMGNiYmRhMDU1ZGE3Iiwic2VjdGlvbiI6ImU3ZDAzZTAxLTQ5MjctNGFlMS04MmJmLWE5ZTE5NWU1OWRiNiJ9.-l5oX12jib_nibeTqbMlIZZhEKIKjElNljStujLSHzA';
export const DESCENT_4_SHARE_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXNjZW50IjoiZmZkNmJhNDEtZDdlNS00ZmJmLTgzNDctMjQ4MWQ1ODM2NzRlIiwic2VjdGlvbiI6ImY5MDM1MzU1LTA0OTktNGQxYy05Y2NkLWM5OTA5ZGJhZDQ5YSJ9.nK9brw2qiiccfYBgyjvyzXDcX51YPdBFR5MQNelZZX4';

const descents: Array<Partial<DescentRaw>> = [
  {
    id: DESCENT_01,
    user_id: USER_1,
    section_id: SECTION_1,
    parent_id: null,
    public: true,
    comment: 'descent 1 comment',
    duration: 3600,
    level_unit: 'm3/s',
    level_value: 99.9,

    started_at: new Date(2020, 1, 1),
    created_at: new Date(2020, 1, 1),
    updated_at: new Date(2020, 1, 1),
  },
  {
    id: DESCENT_02,
    user_id: USER_1,
    section_id: SECTION_2,
    parent_id: null,
    public: false,
    comment: 'descent 2 comment',
    duration: 3000,
    level_unit: 'm',
    level_value: 0.9,

    started_at: new Date(2020, 1, 2),
    created_at: new Date(2020, 1, 2),
    updated_at: new Date(2020, 1, 2),
  },
  {
    id: DESCENT_03,
    user_id: USER_1,
    section_id: SECTION_3,
    parent_id: null,
    public: true,
    comment: 'descent 3 comment',
    duration: null,
    level_unit: null,
    level_value: null,

    started_at: new Date(2020, 1, 3),
    created_at: new Date(2020, 1, 3),
    updated_at: new Date(2020, 1, 3),
  },
  {
    id: DESCENT_04,
    user_id: USER_2,
    section_id: SECTION_1,
    parent_id: DESCENT_01,
    public: true,
    comment: 'descent 4, parent descent 1 comment',
    duration: 3600,
    level_unit: 'm3/s',
    level_value: 99.9,

    started_at: new Date(2020, 1, 1),
    created_at: new Date(2020, 1, 4),
    updated_at: new Date(2020, 1, 4),
  },
  {
    id: DESCENT_05,
    user_id: USER_2,
    section_id: SECTION_5,
    parent_id: null,
    public: true,
    comment: 'descent 5 comment',
    duration: 1000,
    level_unit: null,
    level_value: 4,

    started_at: new Date(2020, 1, 5),
    created_at: new Date(2020, 1, 5),
    updated_at: new Date(2020, 1, 5),
  },
  {
    id: DESCENT_06,
    user_id: USER_2,
    section_id: SECTION_6,
    parent_id: null,
    public: false,
    comment: 'descent 6 comment',
    duration: 7200,
    level_unit: 'cm',
    level_value: 320,

    started_at: new Date(2020, 1, 6),
    created_at: new Date(2020, 1, 6),
    updated_at: new Date(2020, 1, 6),
  },
  {
    id: DESCENT_07,
    user_id: USER_3,
    section_id: SECTION_7,
    parent_id: null,
    public: true,
    comment: 'descent 7 comment',
    duration: null,
    level_unit: 'cm',
    level_value: 211,

    started_at: new Date(2020, 1, 7),
    created_at: new Date(2020, 1, 7),
    updated_at: new Date(2020, 1, 7),
  },
  {
    id: DESCENT_08,
    user_id: USER_3,
    section_id: SECTION_8,
    parent_id: null,
    public: false,
    comment: 'descent 8 comment',
    duration: 600,
    level_unit: 'cfs',
    level_value: 100,

    started_at: new Date(2020, 1, 8),
    created_at: new Date(2020, 1, 8),
    updated_at: new Date(2020, 1, 8),
  },
  {
    id: DESCENT_09,
    user_id: USER_3,
    section_id: SECTION_8,
    parent_id: null,
    public: false,
    comment: 'descent 9 comment',
    duration: 500,
    level_unit: 'cfs',
    level_value: 100,

    started_at: new Date(2020, 1, 9),
    created_at: new Date(2020, 1, 9),
    updated_at: new Date(2020, 1, 9),
  },
  {
    id: DESCENT_10,
    user_id: USER_3,
    section_id: SECTION_1,
    parent_id: DESCENT_01,
    public: true,
    comment: 'descent 10, parent descent 1 comment',
    duration: 3600,
    level_unit: 'm3/s',
    level_value: 99.9,

    started_at: new Date(2020, 1, 1),
    created_at: new Date(2020, 1, 10),
    updated_at: new Date(2020, 1, 10),
  },
];

export async function seed(db: Knex) {
  await db.table('descents').del();
  await db.table('descents').insert(descents);
}
