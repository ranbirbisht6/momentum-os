"use client";

import { useMemo, useState } from "react";
import { Activity, Briefcase, CheckCircle2, Users, type LucideIcon } from "lucide-react";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import type { DailyCategory, TeamMember, TeamRole, WorkspaceKind } from "../../types";
import { categoryIsComplete, categoryProgress } from "../../utils";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";
import { EmptyState } from "../ui/EmptyState";

const KINDS: { value: WorkspaceKind; label: string }[] = [
  { value: "company", label: "Company" },
  { value: "startup", label: "Startup" },
  { value: "team", label: "Team" },
  { value: "department", label: "Department" },
];

const ROLES: { value: TeamRole; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "member", label: "Member" },
];

export function TeamView({ actions }: { actions: MomentumActions }) {
  const workspace = actions.store.teamWorkspace;
  const [name, setName] = useState(workspace.name);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState<TeamRole>("member");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");
  const todayTasks = actions.todayCategories;
  const progress = categoryProgress(todayTasks);
  const memberMap = useMemo(
    () => new Map(workspace.members.map((member) => [member.id, member.name])),
    [workspace.members],
  );

  return (
    <PageContainer className="space-y-6">
      <Surface className="grid gap-6 lg:grid-cols-[1fr_0.9fr]" padding="lg">
        <div>
          <span className="section-label">Team Workspace</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            {workspace.name}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 muted-text">
            A local-first collaboration workspace for assignments, projects, deadlines, and team activity before auth and cloud sync arrive.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <WorkspaceMetric label="Members" value={workspace.members.length} />
            <WorkspaceMetric label="Projects" value={workspace.projects.length} />
            <WorkspaceMetric label="Today" value={`${progress.percent}%`} />
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <p className="text-sm font-semibold text-[var(--text)]">Workspace Settings</p>
          <div className="mt-4 grid gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-shell min-h-12 rounded-2xl px-4 text-sm"
            />
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <select
                value={workspace.kind}
                onChange={(e) =>
                  actions.updateTeamWorkspace({ kind: e.target.value as WorkspaceKind })
                }
                className="input-shell min-h-12 rounded-2xl px-4 text-sm"
              >
                {KINDS.map((kind) => (
                  <option key={kind.value} value={kind.value}>
                    {kind.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => actions.updateTeamWorkspace({ name })}
                className="min-h-12 rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Surface>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Surface className="space-y-4">
          <SectionTitle icon={CheckCircle2} title="Task Assignment" subtitle={`${todayTasks.length} tasks today`} />
          {todayTasks.length === 0 ? (
            <EmptyState
              icon="T"
              title="No tasks to assign"
              hint="Create tasks in Today, then assign ownership from this workspace."
            />
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <AssignmentRow
                  key={task.id}
                  task={task}
                  members={workspace.members}
                  assignee={memberMap.get(task.assigneeId ?? "") ?? "Unassigned"}
                  onAssign={(memberId) => actions.assignDailyCategory(task.id, memberId)}
                />
              ))}
            </div>
          )}
        </Surface>

        <Surface className="space-y-4">
          <SectionTitle icon={Users} title="Members" subtitle={`${workspace.kind} mode`} />
          <div className="grid gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 sm:grid-cols-[1fr_9rem_auto]">
            <input
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="Member name"
              className="input-shell min-h-10 rounded-xl px-3 text-sm"
            />
            <select
              value={memberRole}
              onChange={(e) => setMemberRole(e.target.value as TeamRole)}
              className="input-shell min-h-10 rounded-xl px-3 text-sm"
            >
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                const trimmed = memberName.trim();
                if (!trimmed) return;
                actions.updateTeamWorkspace({
                  members: [
                    ...workspace.members,
                    { id: crypto.randomUUID(), name: trimmed, role: memberRole },
                  ],
                });
                setMemberName("");
                setMemberRole("member");
              }}
              className="min-h-10 rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-white"
            >
              Add
            </button>
          </div>
          {workspace.members.length === 0 ? (
            <EmptyState icon="M" title="No members yet" hint="Members can be connected after authentication and invitations are added." />
          ) : (
            <div className="grid gap-3">
              {workspace.members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </Surface>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
        <Surface className="space-y-4">
          <SectionTitle icon={Briefcase} title="Projects" subtitle="Deadlines and progress" />
          <div className="grid gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 sm:grid-cols-[1fr_11rem_auto]">
            <input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Project title"
              className="input-shell min-h-10 rounded-xl px-3 text-sm"
            />
            <input
              type="date"
              min={actions.todayKey}
              value={projectDeadline}
              onChange={(e) => setProjectDeadline(e.target.value)}
              className="input-shell min-h-10 rounded-xl px-3 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = projectTitle.trim();
                if (!trimmed) return;
                actions.updateTeamWorkspace({
                  projects: [
                    ...workspace.projects,
                    {
                      id: crypto.randomUUID(),
                      title: trimmed,
                      deadline: projectDeadline,
                      progress: 0,
                    },
                  ],
                });
                setProjectTitle("");
                setProjectDeadline("");
              }}
              className="min-h-10 rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-white"
            >
              Add
            </button>
          </div>
          {workspace.projects.length === 0 ? (
            <EmptyState icon="P" title="No projects yet" hint="Project creation can expand here once team backend support is added." />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {workspace.projects.map((project) => (
                <div key={project.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">{project.title}</p>
                      <p className="mt-1 text-xs muted-text">
                        {project.deadline ? `Due ${project.deadline}` : "No deadline"}
                      </p>
                    </div>
                    <span className="text-sm font-semibold accent-text">{project.progress}%</span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface)]">
                    <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Surface>

        <Surface className="space-y-4">
          <SectionTitle icon={Activity} title="Activity Feed" subtitle="Local timeline" />
          {workspace.activity.length === 0 ? (
            <EmptyState icon="A" title="No activity yet" hint="Team activity will become richer after invites, projects, and cloud sync are connected." />
          ) : (
            <div className="space-y-3">
              {workspace.activity.map((activity) => (
                <div key={activity.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-sm leading-6 muted-text">{activity.message}</p>
                  <p className="mt-2 text-xs soft-text">
                    {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : "Just now"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Surface>
      </div>
    </PageContainer>
  );
}

function WorkspaceMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
      <p className="section-label">{label}</p>
      <p className="stat-value mt-2 text-2xl font-semibold text-[var(--text)]">{value}</p>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--accent-soft)]">
          <Icon className="h-4 w-4 accent-text" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
          <p className="text-xs muted-text">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function AssignmentRow({
  task,
  members,
  assignee,
  onAssign,
}: {
  task: DailyCategory;
  members: TeamMember[];
  assignee: string;
  onAssign: (memberId: string) => void;
}) {
  const complete = categoryIsComplete(task);
  return (
    <div className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 md:grid-cols-[1fr_13rem]">
      <div className="min-w-0">
        <p className={`truncate text-sm font-semibold ${complete ? "text-[var(--muted-soft)] line-through" : "text-[var(--text)]"}`}>
          {task.title}
        </p>
        <p className="mt-1 text-xs muted-text">{assignee}</p>
      </div>
      <select
        value={task.assigneeId ?? ""}
        onChange={(e) => onAssign(e.target.value)}
        className="input-shell min-h-10 rounded-xl px-3 text-sm"
      >
        <option value="">Unassigned</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--surface)] text-sm font-semibold accent-text">
          {member.name.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">{member.name}</p>
          <p className="text-xs muted-text">Workspace collaborator</p>
        </div>
      </div>
      <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold muted-text">
        {member.role}
      </span>
    </div>
  );
}
