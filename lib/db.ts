import "server-only";
import { PrismaClient, Role, ProjectStatus, TaskStatus, Priority, FileCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

// Global singleton declaration to prevent connection leaks during fast-refresh
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  mockStore: OpsPulseStore | undefined;
};

// In-Memory resilient fallback store if PostgreSQL is unreachable
export interface OpsPulseStore {
  users: Array<{
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    role: Role;
    department: string | null;
    avatarUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  projects: Array<{
    id: string;
    title: string;
    code: string;
    description: string;
    status: ProjectStatus;
    startDate: Date | null;
    targetDate: Date | null;
    leadId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  tasks: Array<{
    id: string;
    taskNumber: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: Priority;
    dueDate: Date | null;
    projectId: string;
    assigneeId: string | null;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  files: Array<{
    id: string;
    name: string;
    fileUrl: string;
    fileSizeKb: number;
    mimeType: string;
    category: FileCategory;
    projectId: string | null;
    taskId: string | null;
    uploaderId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  activityLogs: Array<{
    id: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    details: any;
    createdAt: Date;
  }>;
}

const defaultPasswordHash = bcrypt.hashSync("Password123!", 10);

export function initializeInitialData(): OpsPulseStore {
  const users: OpsPulseStore["users"] = [
    {
      id: "usr_admin_001",
      email: "admin@opspulse.internal",
      name: "Eleanor Vance",
      passwordHash: defaultPasswordHash,
      role: Role.ADMIN,
      department: "Operations Leadership",
      avatarUrl: "https://picsum.photos/seed/eleanor/100/100",
      isActive: true,
      createdAt: new Date("2026-01-10T08:00:00Z"),
      updatedAt: new Date("2026-01-10T08:00:00Z"),
    },
    {
      id: "usr_mgr_002",
      email: "manager@opspulse.internal",
      name: "Marcus Chen",
      passwordHash: defaultPasswordHash,
      role: Role.MANAGER,
      department: "Technical Program Mgmt",
      avatarUrl: "https://picsum.photos/seed/marcus/100/100",
      isActive: true,
      createdAt: new Date("2026-01-15T09:30:00Z"),
      updatedAt: new Date("2026-01-15T09:30:00Z"),
    },
    {
      id: "usr_mem_003",
      email: "member@opspulse.internal",
      name: "Sarah Jenkins",
      passwordHash: defaultPasswordHash,
      role: Role.MEMBER,
      department: "Infrastructure & Platform",
      avatarUrl: "https://picsum.photos/seed/sarah/100/100",
      isActive: true,
      createdAt: new Date("2026-02-01T10:00:00Z"),
      updatedAt: new Date("2026-02-01T10:00:00Z"),
    },
    {
      id: "usr_mem_004",
      email: "devon.ross@opspulse.internal",
      name: "Devon Ross",
      passwordHash: defaultPasswordHash,
      role: Role.MEMBER,
      department: "Site Reliability Eng",
      avatarUrl: "https://picsum.photos/seed/devon/100/100",
      isActive: true,
      createdAt: new Date("2026-02-10T11:00:00Z"),
      updatedAt: new Date("2026-02-10T11:00:00Z"),
    },
    {
      id: "usr_mem_005",
      email: "aaliyah.patel@opspulse.internal",
      name: "Aaliyah Patel",
      passwordHash: defaultPasswordHash,
      role: Role.MEMBER,
      department: "Security & Compliance",
      avatarUrl: "https://picsum.photos/seed/aaliyah/100/100",
      isActive: true,
      createdAt: new Date("2026-02-15T11:30:00Z"),
      updatedAt: new Date("2026-02-15T11:30:00Z"),
    },
  ];

  const projects: OpsPulseStore["projects"] = [
    {
      id: "prj_001",
      title: "Core Service Infrastructure Modernization",
      code: "OPS-2026",
      description:
        "Upgrading production Kubernetes clusters to v1.32, transitioning ingress to Envoy Gateway, and deploying automated canary deployment pipelines.",
      status: ProjectStatus.IN_PROGRESS,
      startDate: new Date("2026-02-01T00:00:00Z"),
      targetDate: new Date("2026-10-15T00:00:00Z"),
      leadId: "usr_mgr_002",
      createdAt: new Date("2026-02-01T09:00:00Z"),
      updatedAt: new Date("2026-02-28T14:30:00Z"),
    },
    {
      id: "prj_002",
      title: "SOC 2 Type II Compliance & Audit Readiness",
      code: "OPS-1088",
      description:
        "Comprehensive operational audit, IAM access review, secret rotation policies, and continuous compliance monitoring for annual recertification.",
      status: ProjectStatus.PLANNING,
      startDate: new Date("2026-03-01T00:00:00Z"),
      targetDate: new Date("2026-11-30T00:00:00Z"),
      leadId: "usr_admin_001",
      createdAt: new Date("2026-02-10T10:00:00Z"),
      updatedAt: new Date("2026-02-25T11:15:00Z"),
    },
    {
      id: "prj_003",
      title: "Internal Developer Platform (IDP) Rollout",
      code: "OPS-3044",
      description:
        "Building self-service cloud resource provisioning, ephemeral preview environments, and centralized observability for all feature squads.",
      status: ProjectStatus.IN_PROGRESS,
      startDate: new Date("2026-01-15T00:00:00Z"),
      targetDate: new Date("2026-09-30T00:00:00Z"),
      leadId: "usr_mgr_002",
      createdAt: new Date("2026-01-15T08:30:00Z"),
      updatedAt: new Date("2026-03-01T16:45:00Z"),
    },
    {
      id: "prj_004",
      title: "Disaster Recovery Drill & Failover Protocols",
      code: "OPS-0912",
      description:
        "Cross-region database replication testing, automated traffic shift simulations, and runbook updates for multi-zone fault isolation.",
      status: ProjectStatus.COMPLETED,
      startDate: new Date("2026-01-05T00:00:00Z"),
      targetDate: new Date("2026-02-20T00:00:00Z"),
      leadId: "usr_admin_001",
      createdAt: new Date("2026-01-05T09:00:00Z"),
      updatedAt: new Date("2026-02-20T17:00:00Z"),
    },
  ];

  const tasks: OpsPulseStore["tasks"] = [
    {
      id: "tsk_1001",
      taskNumber: "TSK-1001",
      title: "Configure multi-cluster Envoy Gateway control plane",
      description: "Establish mesh topology and configure cross-region service routing policies.",
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.URGENT,
      dueDate: new Date("2026-09-10T18:00:00Z"),
      projectId: "prj_001",
      assigneeId: "usr_mem_003",
      creatorId: "usr_mgr_002",
      createdAt: new Date("2026-02-05T10:00:00Z"),
      updatedAt: new Date("2026-03-01T09:15:00Z"),
    },
    {
      id: "tsk_1002",
      taskNumber: "TSK-1002",
      title: "Implement Flagger automated canary deployment operator",
      description: "Integrate Prometheus metrics threshold for automated rollback during canary rollouts.",
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      dueDate: new Date("2026-09-18T18:00:00Z"),
      projectId: "prj_001",
      assigneeId: "usr_mem_004",
      creatorId: "usr_mgr_002",
      createdAt: new Date("2026-02-06T11:00:00Z"),
      updatedAt: new Date("2026-02-20T14:00:00Z"),
    },
    {
      id: "tsk_1003",
      taskNumber: "TSK-1003",
      title: "Benchmark node pool autoscaling under burst synthetic load",
      description: "Measure cluster cold-start provisioning latency with Karpenter on AWS/GCP.",
      status: TaskStatus.IN_REVIEW,
      priority: Priority.MEDIUM,
      dueDate: new Date("2026-09-12T18:00:00Z"),
      projectId: "prj_001",
      assigneeId: "usr_mem_003",
      creatorId: "usr_mgr_002",
      createdAt: new Date("2026-02-08T14:00:00Z"),
      updatedAt: new Date("2026-03-01T15:30:00Z"),
    },
    {
      id: "tsk_1004",
      taskNumber: "TSK-1004",
      title: "Decommission legacy v1.28 staging clusters",
      description: "Verify zero residual DNS traffic before draining legacy worker pools.",
      status: TaskStatus.DONE,
      priority: Priority.LOW,
      dueDate: new Date("2026-02-25T18:00:00Z"),
      projectId: "prj_001",
      assigneeId: "usr_mem_004",
      creatorId: "usr_mgr_002",
      createdAt: new Date("2026-02-10T09:00:00Z"),
      updatedAt: new Date("2026-02-24T16:00:00Z"),
    },
    {
      id: "tsk_1005",
      taskNumber: "TSK-1005",
      title: "Audit privileged Cloud IAM bindings across all accounts",
      description: "Identify stale Owner/Editor roles and migrate to least-privilege custom roles.",
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.URGENT,
      dueDate: new Date("2026-09-08T18:00:00Z"),
      projectId: "prj_002",
      assigneeId: "usr_mem_005",
      creatorId: "usr_admin_001",
      createdAt: new Date("2026-02-12T10:30:00Z"),
      updatedAt: new Date("2026-03-02T08:00:00Z"),
    },
    {
      id: "tsk_1006",
      taskNumber: "TSK-1006",
      title: "Enforce KMS hardware key rotation interval to 90 days",
      description: "Update Terraform modules for all database storage and secret management envelopes.",
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      dueDate: new Date("2026-09-22T18:00:00Z"),
      projectId: "prj_002",
      assigneeId: "usr_mem_005",
      creatorId: "usr_admin_001",
      createdAt: new Date("2026-02-14T11:00:00Z"),
      updatedAt: new Date("2026-02-14T11:00:00Z"),
    },
    {
      id: "tsk_1007",
      taskNumber: "TSK-1007",
      title: "Draft vendor security assessment matrix for 2026",
      description: "Compile risk questionnaires and compliance certs for third-party SaaS vendors.",
      status: TaskStatus.BACKLOG,
      priority: Priority.MEDIUM,
      dueDate: new Date("2026-10-01T18:00:00Z"),
      projectId: "prj_002",
      assigneeId: null,
      creatorId: "usr_admin_001",
      createdAt: new Date("2026-02-18T16:00:00Z"),
      updatedAt: new Date("2026-02-18T16:00:00Z"),
    },
    {
      id: "tsk_1008",
      taskNumber: "TSK-1008",
      title: "Publish incident response playbooks to central wiki",
      description: "Document severity triage matrices and on-call escalation paging channels.",
      status: TaskStatus.DONE,
      priority: Priority.LOW,
      dueDate: new Date("2026-02-28T18:00:00Z"),
      projectId: "prj_002",
      assigneeId: "usr_admin_001",
      creatorId: "usr_admin_001",
      createdAt: new Date("2026-02-15T09:00:00Z"),
      updatedAt: new Date("2026-02-27T17:30:00Z"),
    },
    {
      id: "tsk_1009",
      taskNumber: "TSK-1009",
      title: "Deploy Backstage service catalog and software templates",
      description: "Bootstrap frontend portal with automated GitHub repo provisioning pipelines.",
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      dueDate: new Date("2026-09-15T18:00:00Z"),
      projectId: "prj_003",
      assigneeId: "usr_mem_004",
      creatorId: "usr_mgr_002",
      createdAt: new Date("2026-01-20T10:00:00Z"),
      updatedAt: new Date("2026-03-01T11:00:00Z"),
    },
    {
      id: "tsk_1010",
      taskNumber: "TSK-1010",
      title: "Configure ephemeral PR review environments via ArgoCD",
      description: "Implement dynamic namespace provisioning and automated TTL cleanup policies.",
      status: TaskStatus.IN_REVIEW,
      priority: Priority.URGENT,
      dueDate: new Date("2026-09-09T18:00:00Z"),
      projectId: "prj_003",
      assigneeId: "usr_mem_003",
      creatorId: "usr_mgr_002",
      createdAt: new Date("2026-01-25T14:30:00Z"),
      updatedAt: new Date("2026-03-02T07:45:00Z"),
    },
    {
      id: "tsk_1011",
      taskNumber: "TSK-1011",
      title: "Standardize OpenTelemetry distributed tracing headers",
      description: "Ensure traceparent propagation across gRPC and REST microservice boundaries.",
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      dueDate: new Date("2026-09-25T18:00:00Z"),
      projectId: "prj_003",
      assigneeId: "usr_mem_004",
      creatorId: "usr_mgr_002",
      createdAt: new Date("2026-02-01T15:00:00Z"),
      updatedAt: new Date("2026-02-22T13:00:00Z"),
    },
    {
      id: "tsk_1012",
      taskNumber: "TSK-1012",
      title: "Developer onboarding satisfaction survey & metric dashboard",
      description: "Track time-to-first-commit and developer velocity indicators.",
      status: TaskStatus.BACKLOG,
      priority: Priority.LOW,
      dueDate: new Date("2026-10-15T18:00:00Z"),
      projectId: "prj_003",
      assigneeId: null,
      creatorId: "usr_mgr_002",
      createdAt: new Date("2026-02-10T12:00:00Z"),
      updatedAt: new Date("2026-02-10T12:00:00Z"),
    },
    {
      id: "tsk_1013",
      taskNumber: "TSK-1013",
      title: "Simulate primary database region outage and verify RTO",
      description: "Trigger forced failover in staging and measure read/write resumption time.",
      status: TaskStatus.DONE,
      priority: Priority.URGENT,
      dueDate: new Date("2026-02-15T18:00:00Z"),
      projectId: "prj_004",
      assigneeId: "usr_admin_001",
      creatorId: "usr_admin_001",
      createdAt: new Date("2026-01-10T09:00:00Z"),
      updatedAt: new Date("2026-02-15T16:00:00Z"),
    },
    {
      id: "tsk_1014",
      taskNumber: "TSK-1014",
      title: "Validate automated DNS failover health-check probes",
      description: "Verify Route53 / Cloudflare DNS geo-steering failover triggers under 30s.",
      status: TaskStatus.DONE,
      priority: Priority.HIGH,
      dueDate: new Date("2026-02-18T18:00:00Z"),
      projectId: "prj_004",
      assigneeId: "usr_mem_004",
      creatorId: "usr_admin_001",
      createdAt: new Date("2026-01-12T11:30:00Z"),
      updatedAt: new Date("2026-02-18T15:00:00Z"),
    },
    {
      id: "tsk_1015",
      taskNumber: "TSK-1015",
      title: "Compile disaster recovery audit report for executive stakeholders",
      description: "Synthesize recovery time actuals vs SLAs and document preventative improvements.",
      status: TaskStatus.DONE,
      priority: Priority.MEDIUM,
      dueDate: new Date("2026-02-20T18:00:00Z"),
      projectId: "prj_004",
      assigneeId: "usr_admin_001",
      creatorId: "usr_admin_001",
      createdAt: new Date("2026-01-15T14:00:00Z"),
      updatedAt: new Date("2026-02-20T17:00:00Z"),
    },
    {
      id: "tsk_1016",
      taskNumber: "TSK-1016",
      title: "Establish quarterly automated backup restore verification schedule",
      description: "Set up Cron workflow to restore point-in-time snapshot to isolated sandbox.",
      status: TaskStatus.DONE,
      priority: Priority.LOW,
      dueDate: new Date("2026-02-20T18:00:00Z"),
      projectId: "prj_004",
      assigneeId: "usr_mem_003",
      creatorId: "usr_admin_001",
      createdAt: new Date("2026-01-18T10:00:00Z"),
      updatedAt: new Date("2026-02-20T16:30:00Z"),
    },
  ];

  const files: OpsPulseStore["files"] = [
    {
      id: "fil_001",
      name: "Envoy-Gateway-Architecture-Specification-v2.pdf",
      fileUrl: "https://storage.googleapis.com/opspulse-assets/specs/envoy-gw-spec-v2.pdf",
      fileSizeKb: 4280,
      mimeType: "application/pdf",
      category: FileCategory.SPECIFICATION,
      projectId: "prj_001",
      taskId: "tsk_1001",
      uploaderId: "usr_mgr_002",
      createdAt: new Date("2026-02-05T10:30:00Z"),
      updatedAt: new Date("2026-02-05T10:30:00Z"),
    },
    {
      id: "fil_002",
      name: "Kubernetes-1.32-Upgrade-Runbook.md",
      fileUrl: "https://storage.googleapis.com/opspulse-assets/docs/k8s-132-upgrade-runbook.md",
      fileSizeKb: 145,
      mimeType: "text/markdown",
      category: FileCategory.REFERENCE,
      projectId: "prj_001",
      taskId: "tsk_1002",
      uploaderId: "usr_mem_003",
      createdAt: new Date("2026-02-07T12:00:00Z"),
      updatedAt: new Date("2026-02-07T12:00:00Z"),
    },
    {
      id: "fil_003",
      name: "SOC2-Type-II-Audit-Scope-Matrix-2026.xlsx",
      fileUrl: "https://storage.googleapis.com/opspulse-assets/compliance/soc2-matrix-2026.xlsx",
      fileSizeKb: 2150,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      category: FileCategory.REPORT,
      projectId: "prj_002",
      taskId: "tsk_1005",
      uploaderId: "usr_mem_005",
      createdAt: new Date("2026-02-12T14:15:00Z"),
      updatedAt: new Date("2026-02-12T14:15:00Z"),
    },
    {
      id: "fil_004",
      name: "Cloud-Security-Vendor-Master-Agreement.pdf",
      fileUrl: "https://storage.googleapis.com/opspulse-assets/contracts/vendor-master-agreement.pdf",
      fileSizeKb: 6890,
      mimeType: "application/pdf",
      category: FileCategory.CONTRACT,
      projectId: "prj_002",
      taskId: null,
      uploaderId: "usr_admin_001",
      createdAt: new Date("2026-02-14T09:45:00Z"),
      updatedAt: new Date("2026-02-14T09:45:00Z"),
    },
    {
      id: "fil_005",
      name: "Backstage-Portal-Design-System-Tokens.json",
      fileUrl: "https://storage.googleapis.com/opspulse-assets/assets/backstage-tokens.json",
      fileSizeKb: 88,
      mimeType: "application/json",
      category: FileCategory.ASSET,
      projectId: "prj_003",
      taskId: "tsk_1009",
      uploaderId: "usr_mem_004",
      createdAt: new Date("2026-01-22T11:00:00Z"),
      updatedAt: new Date("2026-01-22T11:00:00Z"),
    },
    {
      id: "fil_006",
      name: "OpenTelemetry-Collector-Deployment-Manifest.yaml",
      fileUrl: "https://storage.googleapis.com/opspulse-assets/specs/otel-collector-manifest.yaml",
      fileSizeKb: 34,
      mimeType: "application/x-yaml",
      category: FileCategory.SPECIFICATION,
      projectId: "prj_003",
      taskId: "tsk_1011",
      uploaderId: "usr_mem_004",
      createdAt: new Date("2026-02-02T16:20:00Z"),
      updatedAt: new Date("2026-02-02T16:20:00Z"),
    },
    {
      id: "fil_007",
      name: "Disaster-Recovery-Postmortem-Executive-Summary.pdf",
      fileUrl: "https://storage.googleapis.com/opspulse-assets/reports/dr-postmortem-2026-q1.pdf",
      fileSizeKb: 3420,
      mimeType: "application/pdf",
      category: FileCategory.REPORT,
      projectId: "prj_004",
      taskId: "tsk_1015",
      uploaderId: "usr_admin_001",
      createdAt: new Date("2026-02-20T17:15:00Z"),
      updatedAt: new Date("2026-02-20T17:15:00Z"),
    },
    {
      id: "fil_008",
      name: "Cross-Region-Replication-Latency-Benchmarks.csv",
      fileUrl: "https://storage.googleapis.com/opspulse-assets/reports/replication-benchmarks.csv",
      fileSizeKb: 720,
      mimeType: "text/csv",
      category: FileCategory.REFERENCE,
      projectId: "prj_004",
      taskId: "tsk_1013",
      uploaderId: "usr_admin_001",
      createdAt: new Date("2026-02-16T10:00:00Z"),
      updatedAt: new Date("2026-02-16T10:00:00Z"),
    },
  ];

  const activityLogs: OpsPulseStore["activityLogs"] = [
    {
      id: "act_001",
      userId: "usr_admin_001",
      action: "PROJECT_CREATED",
      entityType: "Project",
      entityId: "prj_001",
      details: { title: "Core Service Infrastructure Modernization", code: "OPS-2026" },
      createdAt: new Date("2026-02-01T09:00:00Z"),
    },
    {
      id: "act_002",
      userId: "usr_mgr_002",
      action: "TASK_CREATED",
      entityType: "Task",
      entityId: "tsk_1001",
      details: { taskNumber: "TSK-1001", priority: "URGENT", assignee: "Sarah Jenkins" },
      createdAt: new Date("2026-02-05T10:00:00Z"),
    },
    {
      id: "act_003",
      userId: "usr_mgr_002",
      action: "FILE_UPLOADED",
      entityType: "FileAsset",
      entityId: "fil_001",
      details: { fileName: "Envoy-Gateway-Architecture-Specification-v2.pdf", sizeKb: 4280 },
      createdAt: new Date("2026-02-05T10:30:00Z"),
    },
    {
      id: "act_004",
      userId: "usr_mem_003",
      action: "TASK_STATUS_CHANGED",
      entityType: "Task",
      entityId: "tsk_1001",
      details: { fromStatus: "TODO", toStatus: "IN_PROGRESS", taskNumber: "TSK-1001" },
      createdAt: new Date("2026-02-06T08:45:00Z"),
    },
    {
      id: "act_005",
      userId: "usr_admin_001",
      action: "PROJECT_CREATED",
      entityType: "Project",
      entityId: "prj_002",
      details: { title: "SOC 2 Type II Compliance & Audit Readiness", code: "OPS-1088" },
      createdAt: new Date("2026-02-10T10:00:00Z"),
    },
    {
      id: "act_006",
      userId: "usr_mem_005",
      action: "TASK_STATUS_CHANGED",
      entityType: "Task",
      entityId: "tsk_1005",
      details: { fromStatus: "TODO", toStatus: "IN_PROGRESS", taskNumber: "TSK-1005" },
      createdAt: new Date("2026-02-12T11:00:00Z"),
    },
    {
      id: "act_007",
      userId: "usr_mem_005",
      action: "FILE_UPLOADED",
      entityType: "FileAsset",
      entityId: "fil_003",
      details: { fileName: "SOC2-Type-II-Audit-Scope-Matrix-2026.xlsx", sizeKb: 2150 },
      createdAt: new Date("2026-02-12T14:15:00Z"),
    },
    {
      id: "act_008",
      userId: "usr_admin_001",
      action: "PROJECT_STATUS_CHANGED",
      entityType: "Project",
      entityId: "prj_004",
      details: { fromStatus: "IN_PROGRESS", toStatus: "COMPLETED", code: "OPS-0912" },
      createdAt: new Date("2026-02-20T17:00:00Z"),
    },
    {
      id: "act_009",
      userId: "usr_admin_001",
      action: "FILE_UPLOADED",
      entityType: "FileAsset",
      entityId: "fil_007",
      details: { fileName: "Disaster-Recovery-Postmortem-Executive-Summary.pdf", sizeKb: 3420 },
      createdAt: new Date("2026-02-20T17:15:00Z"),
    },
    {
      id: "act_010",
      userId: "usr_mem_004",
      action: "TASK_STATUS_CHANGED",
      entityType: "Task",
      entityId: "tsk_1004",
      details: { fromStatus: "IN_PROGRESS", toStatus: "DONE", taskNumber: "TSK-1004" },
      createdAt: new Date("2026-02-24T16:00:00Z"),
    },
    {
      id: "act_011",
      userId: "usr_mem_003",
      action: "TASK_STATUS_CHANGED",
      entityType: "Task",
      entityId: "tsk_1003",
      details: { fromStatus: "IN_PROGRESS", toStatus: "IN_REVIEW", taskNumber: "TSK-1003" },
      createdAt: new Date("2026-03-01T15:30:00Z"),
    },
    {
      id: "act_012",
      userId: "usr_mem_003",
      action: "TASK_STATUS_CHANGED",
      entityType: "Task",
      entityId: "tsk_1010",
      details: { fromStatus: "IN_PROGRESS", toStatus: "IN_REVIEW", taskNumber: "TSK-1010" },
      createdAt: new Date("2026-03-02T07:45:00Z"),
    },
  ];

  return { users, projects, tasks, files, activityLogs };
}

if (!globalForPrisma.mockStore) {
  globalForPrisma.mockStore = initializeInitialData();
}

export const store = globalForPrisma.mockStore;

// Standard Prisma Client singleton
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Resilient helper wrappers that provide seamless Prisma querying with fallback
export const db = {
  user: {
    async findUnique(args: { where: { id?: string; email?: string } }) {
      if (args.where.id) {
        const u = store.users.find((x) => x.id === args.where.id);
        return u ? { ...u } : null;
      }
      if (args.where.email) {
        const u = store.users.find((x) => x.email.toLowerCase() === args.where.email?.toLowerCase());
        return u ? { ...u } : null;
      }
      return null;
    },
    async findFirst(args?: { where?: any }) {
      if (!args?.where) return store.users[0] ? { ...store.users[0] } : null;
      const found = store.users.find((u) => {
        if (args.where.email && u.email.toLowerCase() !== args.where.email.toLowerCase()) return false;
        if (args.where.id && u.id !== args.where.id) return false;
        if (args.where.role && u.role !== args.where.role) return false;
        return true;
      });
      return found ? { ...found } : null;
    },
    async findMany(args?: { where?: any; orderBy?: any; select?: any }) {
      let list = [...store.users];
      if (args?.where) {
        if (args.where.isActive !== undefined) {
          list = list.filter((u) => u.isActive === args.where.isActive);
        }
        if (args.where.role) {
          list = list.filter((u) => u.role === args.where.role);
        }
      }
      return list.map((u) => ({ ...u }));
    },
    async create(args: { data: any }) {
      const newUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        email: args.data.email.toLowerCase(),
        name: args.data.name,
        passwordHash: args.data.passwordHash || defaultPasswordHash,
        role: args.data.role || Role.MEMBER,
        department: args.data.department || null,
        avatarUrl: args.data.avatarUrl || `https://picsum.photos/seed/${args.data.name}/100/100`,
        isActive: args.data.isActive !== undefined ? args.data.isActive : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.users.unshift(newUser);
      return { ...newUser };
    },
    async update(args: { where: { id: string }; data: any }) {
      const idx = store.users.findIndex((u) => u.id === args.where.id);
      if (idx === -1) throw new Error("User not found");
      const updated = {
        ...store.users[idx],
        ...args.data,
        updatedAt: new Date(),
      };
      store.users[idx] = updated;
      return { ...updated };
    },
    async count(args?: { where?: any }) {
      let list = [...store.users];
      if (args?.where?.isActive !== undefined) {
        list = list.filter((u) => u.isActive === args.where.isActive);
      }
      return list.length;
    },
  },

  project: {
    async findUnique(args: { where: { id?: string; code?: string }; include?: any }) {
      const prj = store.projects.find((p) => {
        if (args.where.id && p.id === args.where.id) return true;
        if (args.where.code && p.code.toUpperCase() === args.where.code.toUpperCase()) return true;
        return false;
      });
      if (!prj) return null;

      const lead = store.users.find((u) => u.id === prj.leadId);
      const tasks = store.tasks
        .filter((t) => t.projectId === prj.id)
        .map((t) => ({
          ...t,
          assignee: store.users.find((u) => u.id === t.assigneeId) || null,
        }));
      const files = store.files
        .filter((f) => f.projectId === prj.id)
        .map((f) => ({
          ...f,
          uploader: store.users.find((u) => u.id === f.uploaderId)!,
        }));

      return {
        ...prj,
        lead: lead || { id: "unknown", name: "Unassigned", email: "", role: Role.MEMBER, department: null, avatarUrl: null },
        tasks,
        files,
        _count: {
          tasks: tasks.length,
          files: files.length,
        },
      };
    },
    async findMany(args?: { where?: any; orderBy?: any; include?: any }) {
      let list = [...store.projects];
      if (args?.where) {
        if (args.where.status) {
          list = list.filter((p) => p.status === args.where.status);
        }
        if (args.where.leadId) {
          list = list.filter((p) => p.leadId === args.where.leadId);
        }
        if (args.where.OR) {
          list = list.filter((p) => {
            return args.where.OR.some((cond: any) => {
              if (cond.title?.contains) {
                return p.title.toLowerCase().includes(cond.title.contains.toLowerCase());
              }
              if (cond.code?.contains) {
                return p.code.toLowerCase().includes(cond.code.contains.toLowerCase());
              }
              if (cond.description?.contains) {
                return p.description.toLowerCase().includes(cond.description.contains.toLowerCase());
              }
              return false;
            });
          });
        }
      }

      // Map includes
      return list.map((prj) => {
        const lead = store.users.find((u) => u.id === prj.leadId);
        const projectTasks = store.tasks.filter((t) => t.projectId === prj.id);
        const projectFiles = store.files.filter((f) => f.projectId === prj.id);
        return {
          ...prj,
          lead: lead || { id: "unknown", name: "Unassigned", email: "", role: Role.MEMBER, department: null, avatarUrl: null },
          _count: {
            tasks: projectTasks.length,
            files: projectFiles.length,
          },
          completedTasksCount: projectTasks.filter((t) => t.status === TaskStatus.DONE).length,
        };
      });
    },
    async create(args: { data: any }) {
      const existing = store.projects.find((p) => p.code.toUpperCase() === args.data.code.toUpperCase());
      if (existing) {
        throw new Error(`Project code ${args.data.code} already exists.`);
      }
      const newProject = {
        id: `prj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: args.data.title,
        code: args.data.code.toUpperCase(),
        description: args.data.description,
        status: args.data.status || ProjectStatus.PLANNING,
        startDate: args.data.startDate ? new Date(args.data.startDate) : null,
        targetDate: args.data.targetDate ? new Date(args.data.targetDate) : null,
        leadId: args.data.leadId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.projects.unshift(newProject);
      return { ...newProject };
    },
    async update(args: { where: { id: string }; data: any }) {
      const idx = store.projects.findIndex((p) => p.id === args.where.id);
      if (idx === -1) throw new Error("Project not found");
      const updated = {
        ...store.projects[idx],
        ...args.data,
        updatedAt: new Date(),
      };
      store.projects[idx] = updated;
      return { ...updated };
    },
    async delete(args: { where: { id: string } }) {
      const idx = store.projects.findIndex((p) => p.id === args.where.id);
      if (idx === -1) throw new Error("Project not found");
      const deleted = store.projects[idx];
      store.projects.splice(idx, 1);
      // Clean up linked tasks & files
      store.tasks = store.tasks.filter((t) => t.projectId !== args.where.id);
      store.files = store.files.filter((f) => f.projectId !== args.where.id);
      return deleted;
    },
    async count(args?: { where?: any }) {
      let list = [...store.projects];
      if (args?.where?.status) {
        list = list.filter((p) => p.status === args.where.status);
      }
      return list.length;
    },
  },

  task: {
    async findUnique(args: { where: { id?: string; taskNumber?: string }; include?: any }) {
      const task = store.tasks.find((t) => {
        if (args.where.id && t.id === args.where.id) return true;
        if (args.where.taskNumber && t.taskNumber.toUpperCase() === args.where.taskNumber.toUpperCase()) return true;
        return false;
      });
      if (!task) return null;

      const project = store.projects.find((p) => p.id === task.projectId);
      const assignee = store.users.find((u) => u.id === task.assigneeId) || null;
      const creator = store.users.find((u) => u.id === task.creatorId)!;
      const files = store.files
        .filter((f) => f.taskId === task.id)
        .map((f) => ({
          ...f,
          uploader: store.users.find((u) => u.id === f.uploaderId)!,
        }));

      return {
        ...task,
        project: project || { id: "unknown", title: "General", code: "GEN" },
        assignee,
        creator: creator || { id: "unknown", name: "System" },
        files,
      };
    },
    async findMany(args?: { where?: any; orderBy?: any; include?: any; take?: number; skip?: number }) {
      let list = [...store.tasks];
      if (args?.where) {
        if (args.where.projectId) {
          list = list.filter((t) => t.projectId === args.where.projectId);
        }
        if (args.where.assigneeId !== undefined) {
          list = list.filter((t) => t.assigneeId === args.where.assigneeId);
        }
        if (args.where.status) {
          if (typeof args.where.status === "string") {
            list = list.filter((t) => t.status === args.where.status);
          } else if (args.where.status.in) {
            list = list.filter((t) => args.where.status.in.includes(t.status));
          } else if (args.where.status.not) {
            list = list.filter((t) => t.status !== args.where.status.not);
          }
        }
        if (args.where.priority) {
          if (typeof args.where.priority === "string") {
            list = list.filter((t) => t.priority === args.where.priority);
          } else if (args.where.priority.in) {
            list = list.filter((t) => args.where.priority.in.includes(t.priority));
          }
        }
        if (args.where.OR) {
          list = list.filter((t) => {
            return args.where.OR.some((cond: any) => {
              if (cond.title?.contains) {
                return t.title.toLowerCase().includes(cond.title.contains.toLowerCase());
              }
              if (cond.taskNumber?.contains) {
                return t.taskNumber.toLowerCase().includes(cond.taskNumber.contains.toLowerCase());
              }
              if (cond.description?.contains) {
                return t.description?.toLowerCase().includes(cond.description.contains.toLowerCase());
              }
              return false;
            });
          });
        }
      }

      // Sort by creation or priority
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      if (args?.skip) {
        list = list.slice(args.skip);
      }
      if (args?.take) {
        list = list.slice(0, args.take);
      }

      return list.map((task) => {
        const project = store.projects.find((p) => p.id === task.projectId);
        const assignee = store.users.find((u) => u.id === task.assigneeId) || null;
        const creator = store.users.find((u) => u.id === task.creatorId);
        const filesCount = store.files.filter((f) => f.taskId === task.id).length;
        return {
          ...task,
          project: project || { id: "unknown", title: "General", code: "GEN" },
          assignee,
          creator: creator || { id: "unknown", name: "System" },
          _count: { files: filesCount },
        };
      });
    },
    async create(args: { data: any }) {
      const nextNum = 1000 + store.tasks.length + 1;
      const taskNumber = `TSK-${nextNum}`;
      const newTask = {
        id: `tsk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        taskNumber,
        title: args.data.title,
        description: args.data.description || null,
        status: args.data.status || TaskStatus.TODO,
        priority: args.data.priority || Priority.MEDIUM,
        dueDate: args.data.dueDate ? new Date(args.data.dueDate) : null,
        projectId: args.data.projectId,
        assigneeId: args.data.assigneeId || null,
        creatorId: args.data.creatorId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.tasks.unshift(newTask);
      return { ...newTask };
    },
    async update(args: { where: { id: string }; data: any }) {
      const idx = store.tasks.findIndex((t) => t.id === args.where.id);
      if (idx === -1) throw new Error("Task not found");
      const updated = {
        ...store.tasks[idx],
        ...args.data,
        updatedAt: new Date(),
      };
      store.tasks[idx] = updated;
      return { ...updated };
    },
    async delete(args: { where: { id: string } }) {
      const idx = store.tasks.findIndex((t) => t.id === args.where.id);
      if (idx === -1) throw new Error("Task not found");
      const deleted = store.tasks[idx];
      store.tasks.splice(idx, 1);
      return deleted;
    },
    async count(args?: { where?: any }) {
      let list = [...store.tasks];
      if (args?.where) {
        if (args.where.status) {
          if (typeof args.where.status === "string") {
            list = list.filter((t) => t.status === args.where.status);
          } else if (args.where.status.not) {
            list = list.filter((t) => t.status !== args.where.status.not);
          }
        }
        if (args.where.priority) {
          list = list.filter((t) => t.priority === args.where.priority);
        }
        if (args.where.assigneeId) {
          list = list.filter((t) => t.assigneeId === args.where.assigneeId);
        }
      }
      return list.length;
    },
  },

  fileAsset: {
    async findMany(args?: { where?: any; orderBy?: any; include?: any }) {
      let list = [...store.files];
      if (args?.where) {
        if (args.where.category) {
          list = list.filter((f) => f.category === args.where.category);
        }
        if (args.where.projectId) {
          list = list.filter((f) => f.projectId === args.where.projectId);
        }
        if (args.where.taskId) {
          list = list.filter((f) => f.taskId === args.where.taskId);
        }
        if (args.where.OR) {
          list = list.filter((f) => {
            return args.where.OR.some((cond: any) => {
              if (cond.name?.contains) {
                return f.name.toLowerCase().includes(cond.name.contains.toLowerCase());
              }
              return false;
            });
          });
        }
      }

      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return list.map((file) => {
        const project = file.projectId ? store.projects.find((p) => p.id === file.projectId) || null : null;
        const task = file.taskId ? store.tasks.find((t) => t.id === file.taskId) || null : null;
        const uploader = store.users.find((u) => u.id === file.uploaderId)!;
        return {
          ...file,
          project,
          task,
          uploader: uploader || { id: "unknown", name: "System" },
        };
      });
    },
    async create(args: { data: any }) {
      const newFile = {
        id: `fil_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: args.data.name,
        fileUrl: args.data.fileUrl,
        fileSizeKb: Number(args.data.fileSizeKb),
        mimeType: args.data.mimeType,
        category: args.data.category || FileCategory.REFERENCE,
        projectId: args.data.projectId || null,
        taskId: args.data.taskId || null,
        uploaderId: args.data.uploaderId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.files.unshift(newFile);
      return { ...newFile };
    },
    async delete(args: { where: { id: string } }) {
      const idx = store.files.findIndex((f) => f.id === args.where.id);
      if (idx === -1) throw new Error("File asset not found");
      const deleted = store.files[idx];
      store.files.splice(idx, 1);
      return deleted;
    },
    async count(args?: { where?: any }) {
      let list = [...store.files];
      if (args?.where?.category) {
        list = list.filter((f) => f.category === args.where.category);
      }
      return list.length;
    },
  },

  activityLog: {
    async findMany(args?: { where?: any; orderBy?: any; take?: number }) {
      let list = [...store.activityLogs];
      if (args?.where) {
        if (args.where.entityType) {
          list = list.filter((a) => a.entityType === args.where.entityType);
        }
        if (args.where.userId) {
          list = list.filter((a) => a.userId === args.where.userId);
        }
      }
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (args?.take) {
        list = list.slice(0, args.take);
      }
      return list.map((act) => {
        const user = store.users.find((u) => u.id === act.userId);
        return {
          ...act,
          user: user || { id: "unknown", name: "System User", email: "", role: Role.MEMBER, avatarUrl: null },
        };
      });
    },
    async create(args: { data: any }) {
      const newLog = {
        id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: args.data.userId,
        action: args.data.action,
        entityType: args.data.entityType,
        entityId: args.data.entityId,
        details: args.data.details || null,
        createdAt: new Date(),
      };
      store.activityLogs.unshift(newLog);
      return { ...newLog };
    },
  },
};
