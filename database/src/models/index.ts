// Accountability Coach — Sequelize models (docs/09 §2).
// v1 ships the intervention + prescription logs even though learning is v2 —
// the logged corpus is the moat (docs/02 §9, docs/03 §8).

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

// ── enum value sets ────────────────────────────────────────────────
export const GOAL_SHAPES = ['habit', 'project', 'outcome', 'hybrid'] as const;
export const HABIT_STATES = [
  'calibration', 'building', 'wobbling', 'lapsed',
  'dormant', 'comeback', 'consolidating', 'graduated',
] as const;
export const EVENT_TYPES = ['completion', 'floor', 'miss', 'snooze', 'dismiss', 'backfill'] as const;
export const REASON_TAPS = ['forgot', 'no_time', 'didnt_feel', 'too_hard', 'life'] as const;
export const EVENT_SOURCES = ['app', 'lockscreen', 'inferred'] as const;
export const COMMITMENT_KINDS = ['why', 'promise', 'floor'] as const;
export const DIAGNOSES = ['law1', 'law2', 'law3', 'law4', 'none'] as const;
export const INTERVENTION_LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5'] as const;
export const INTERVENTION_CHANNELS = ['push', 'inapp'] as const;
export const RESPONSE_TYPES = ['acted', 'snoozed', 'dismissed', 'silent'] as const;
export const OUTBOUND_STATUSES = ['queued', 'sent', 'suppressed', 'failed'] as const;

// ── User & style ───────────────────────────────────────────────────
@Table({ tableName: 'users', underscored: true })
export class User extends Model {
  @PrimaryKey @Default(DataType.UUIDV4) @Column(DataType.UUID) id!: string;

  @Default('UTC') @Column(DataType.STRING) tz!: string;

  // { allowedRange, current, easeUpUntil, history } (docs/03 §4)
  @Default({}) @Column(DataType.JSONB) styleContract!: Record<string, unknown>;

  @AllowNull @Column(DataType.JSONB) quietHours?: Record<string, unknown>;

  @Default(3) @Column(DataType.INTEGER) notifBudget!: number; // governor budget/day (docs/02 §6)

  @Default([]) @Column(DataType.ARRAY(DataType.STRING)) sensitivities!: string[]; // domain flags (docs/03 §5)

  @AllowNull @Column(DataType.DATE) savageUnlockedAt?: Date; // gated ≥14 days (docs/08)

  @AllowNull @Column(DataType.STRING) distressState?: string;

  @HasMany(() => Goal) goals?: Goal[];
  @HasMany(() => Event) events?: Event[];
  @HasMany(() => Commitment) commitments?: Commitment[];
  @HasMany(() => Intervention) interventions?: Intervention[];
  @HasMany(() => ConversationSummary) summaries?: ConversationSummary[];
  @HasMany(() => OutboundQueued) outbound?: OutboundQueued[];
  @HasMany(() => DeviceToken) devices?: DeviceToken[];
}

// ── Goals, habits, milestones ──────────────────────────────────────
@Table({ tableName: 'goals', underscored: true })
export class Goal extends Model {
  @PrimaryKey @Default(DataType.UUIDV4) @Column(DataType.UUID) id!: string;

  @ForeignKey(() => User) @AllowNull(false) @Column(DataType.UUID) userId!: string;
  @BelongsTo(() => User, { onDelete: 'CASCADE' }) user?: User;

  @AllowNull(false) @Column(DataType.TEXT) rawGoal!: string; // user's words, verbatim
  @AllowNull(false) @Column(DataType.TEXT) whyVerbatim!: string; // the receipts (docs/03 §1)
  @Default(DataType.NOW) @Column(DataType.DATE) whyDate!: Date;

  @Column(DataType.ENUM(...GOAL_SHAPES)) shape!: (typeof GOAL_SHAPES)[number];
  @AllowNull @Column(DataType.STRING) domain?: string;
  @Default(false) @Column(DataType.BOOLEAN) sensitive!: boolean;
  @AllowNull @Column(DataType.JSONB) laggingMetric?: Record<string, unknown>; // outcome goals only

  @HasMany(() => Habit) habits?: Habit[];
  @HasMany(() => Milestone) milestones?: Milestone[];
}

@Table({ tableName: 'habits', underscored: true })
export class Habit extends Model {
  @PrimaryKey @Default(DataType.UUIDV4) @Column(DataType.UUID) id!: string;

  @ForeignKey(() => Goal) @AllowNull(false) @Column(DataType.UUID) goalId!: string;
  @BelongsTo(() => Goal, { onDelete: 'CASCADE' }) goal?: Goal;

  @Default(1) @Column(DataType.INTEGER) slot!: number; // ≤3, slot 2 gated (docs/02 §1)
  @AllowNull(false) @Column(DataType.TEXT) definition!: string;
  @AllowNull(false) @Column(DataType.TEXT) implementationIntention!: string; // "after [anchor], I…"
  @AllowNull(false) @Column(DataType.TEXT) twoMinuteFloor!: string;
  @Column(DataType.JSONB) schedule!: Record<string, unknown>; // { days, window }

  @Default('calibration') @Column(DataType.ENUM(...HABIT_STATES)) state!: (typeof HABIT_STATES)[number];
  @Default(DataType.NOW) @Column(DataType.DATE) stateSince!: Date;

  @HasMany(() => Event) events?: Event[];
  @HasMany(() => Prescription) prescriptions?: Prescription[];
}

@Table({ tableName: 'milestones', underscored: true })
export class Milestone extends Model {
  @PrimaryKey @Default(DataType.UUIDV4) @Column(DataType.UUID) id!: string;

  @ForeignKey(() => Goal) @AllowNull(false) @Column(DataType.UUID) goalId!: string;
  @BelongsTo(() => Goal, { onDelete: 'CASCADE' }) goal?: Goal;

  @AllowNull(false) @Column(DataType.STRING) title!: string;
  @AllowNull @Column(DataType.INTEGER) targetWeek?: number;
  @Default(false) @Column(DataType.BOOLEAN) done!: boolean;
}

// ── Events (the ground truth) ──────────────────────────────────────
@Table({
  tableName: 'events',
  underscored: true,
  indexes: [{ fields: ['habit_id', 'occurred_at'] }],
})
export class Event extends Model {
  @PrimaryKey @Default(DataType.UUIDV4) @Column(DataType.UUID) id!: string;

  @ForeignKey(() => Habit) @AllowNull(false) @Column(DataType.UUID) habitId!: string;
  @BelongsTo(() => Habit, { onDelete: 'CASCADE' }) habit?: Habit;

  @ForeignKey(() => User) @AllowNull(false) @Column(DataType.UUID) userId!: string;
  @BelongsTo(() => User, { onDelete: 'CASCADE' }) user?: User;

  @Column(DataType.ENUM(...EVENT_TYPES)) type!: (typeof EVENT_TYPES)[number];
  @AllowNull @Column(DataType.ENUM(...REASON_TAPS)) reasonTap?: (typeof REASON_TAPS)[number]; // docs/02 §4
  @AllowNull @Column(DataType.TEXT) note?: string;
  @Column(DataType.DATE) occurredAt!: Date;
  @Default(DataType.NOW) @Column(DataType.DATE) loggedAt!: Date;
  @Default('app') @Column(DataType.ENUM(...EVENT_SOURCES)) source!: (typeof EVENT_SOURCES)[number];
}

// ── The commitment ledger (receipts) ───────────────────────────────
@Table({ tableName: 'commitments', underscored: true })
export class Commitment extends Model {
  @PrimaryKey @Default(DataType.UUIDV4) @Column(DataType.UUID) id!: string;

  @ForeignKey(() => User) @AllowNull(false) @Column(DataType.UUID) userId!: string;
  @BelongsTo(() => User, { onDelete: 'CASCADE' }) user?: User;

  @AllowNull(false) @Column(DataType.TEXT) textVerbatim!: string; // exact + dated (docs/03 §1)
  @Default(DataType.NOW) @Column(DataType.DATE) saidOn!: Date;
  @Column(DataType.ENUM(...COMMITMENT_KINDS)) kind!: (typeof COMMITMENT_KINDS)[number];
  @AllowNull @Column(DataType.STRING) source?: string;
}

// ── Diagnosis + intervention corpus ────────────────────────────────
@Table({ tableName: 'prescriptions', underscored: true })
export class Prescription extends Model {
  @PrimaryKey @Default(DataType.UUIDV4) @Column(DataType.UUID) id!: string;

  @ForeignKey(() => Habit) @AllowNull(false) @Column(DataType.UUID) habitId!: string;
  @BelongsTo(() => Habit, { onDelete: 'CASCADE' }) habit?: Habit;

  @Column(DataType.ENUM(...DIAGNOSES)) diagnosis!: (typeof DIAGNOSES)[number];
  @AllowNull(false) @Column(DataType.TEXT) prescription!: string;
  @AllowNull @Column(DataType.TEXT) framedExperiment?: string;
  @AllowNull @Column(DataType.DATE) reviewOn?: Date;
  @AllowNull @Column(DataType.JSONB) outcome?: Record<string, unknown>; // { completionDelta, verdict }
}

@Table({
  tableName: 'interventions',
  underscored: true,
  indexes: [{ fields: ['user_id', 'sent_at'] }],
})
export class Intervention extends Model {
  @PrimaryKey @Default(DataType.UUIDV4) @Column(DataType.UUID) id!: string;

  @ForeignKey(() => User) @AllowNull(false) @Column(DataType.UUID) userId!: string;
  @BelongsTo(() => User, { onDelete: 'CASCADE' }) user?: User;

  @AllowNull @Column(DataType.UUID) habitId?: string;
  @Column(DataType.ENUM(...INTERVENTION_LEVELS)) level!: (typeof INTERVENTION_LEVELS)[number];
  @AllowNull(false) @Column(DataType.STRING) kind!: string;
  @Default('push') @Column(DataType.ENUM(...INTERVENTION_CHANNELS)) channel!: (typeof INTERVENTION_CHANNELS)[number];
  @AllowNull @Column(DataType.JSONB) context?: Record<string, unknown>;
  @AllowNull @Column(DataType.TEXT) openerText?: string;
  @Default(DataType.NOW) @Column(DataType.DATE) sentAt!: Date;
  @AllowNull @Column(DataType.ENUM(...RESPONSE_TYPES)) responded?: (typeof RESPONSE_TYPES)[number];
  @AllowNull @Column(DataType.FLOAT) responseWithinH?: number; // the corpus + live quality signal
}

// ── Memory + outbound ──────────────────────────────────────────────
@Table({ tableName: 'conversation_summaries', underscored: true })
export class ConversationSummary extends Model {
  @PrimaryKey @Default(DataType.UUIDV4) @Column(DataType.UUID) id!: string;

  @ForeignKey(() => User) @AllowNull(false) @Column(DataType.UUID) userId!: string;
  @BelongsTo(() => User, { onDelete: 'CASCADE' }) user?: User;

  @AllowNull(false) @Column(DataType.STRING) threadId!: string;
  @AllowNull(false) @Column(DataType.TEXT) summary!: string; // ≤200 tokens (docs/03 §1)
  @AllowNull @Column(DataType.JSONB) lastExchanges?: Record<string, unknown>;
}

// Every coach-initiated message passes through here (the governor choke point, docs/09 §6).
@Table({
  tableName: 'outbound_queued',
  underscored: true,
  indexes: [{ fields: ['status', 'scheduled_for'] }],
})
export class OutboundQueued extends Model {
  @PrimaryKey @Default(DataType.UUIDV4) @Column(DataType.UUID) id!: string;

  @ForeignKey(() => User) @AllowNull(false) @Column(DataType.UUID) userId!: string;
  @BelongsTo(() => User, { onDelete: 'CASCADE' }) user?: User;

  @Column(DataType.ENUM(...INTERVENTION_LEVELS)) level!: (typeof INTERVENTION_LEVELS)[number];
  @Column(DataType.JSONB) payload!: Record<string, unknown>;
  @AllowNull @Column(DataType.JSONB) deeplink?: Record<string, unknown>; // notif ↔ opener pair (docs/03 §2)
  @Column(DataType.DATE) scheduledFor!: Date;
  @Default('queued') @Column(DataType.ENUM(...OUTBOUND_STATUSES)) status!: (typeof OUTBOUND_STATUSES)[number];
  @AllowNull @Column(DataType.TEXT) suppressedReason?: string;
}

@Table({ tableName: 'device_tokens', underscored: true })
export class DeviceToken extends Model {
  @PrimaryKey @Default(DataType.UUIDV4) @Column(DataType.UUID) id!: string;

  @ForeignKey(() => User) @AllowNull(false) @Column(DataType.UUID) userId!: string;
  @BelongsTo(() => User, { onDelete: 'CASCADE' }) user?: User;

  @AllowNull(false) @Column({ type: DataType.STRING, unique: true }) expoToken!: string;
  @AllowNull(false) @Column(DataType.STRING) platform!: string;
  @Default(true) @Column(DataType.BOOLEAN) active!: boolean;
}

export const models = [
  User, Goal, Habit, Milestone, Event, Commitment,
  Prescription, Intervention, ConversationSummary, OutboundQueued, DeviceToken,
];
