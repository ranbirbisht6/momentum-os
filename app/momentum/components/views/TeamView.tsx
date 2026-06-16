"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import type { WorkspaceKind } from "../../types";
import { categoryProgress } from "../../utils";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";

const KINDS: { value: WorkspaceKind; label: string }[] = [
  { value: "company", label: "Company" },
  { value: "startup", label: "Startup" },
  { value: "team", label: "Team" },
  { value: "department", label: "Department" },
];

export function TeamView({ actions }: { actions: MomentumActions }) {
  const workspace = actions.store.teamWorkspace;
  const [name, setName] = useState(workspace.name);
  const todayTasks = actions.todayCategories;
  const progress = categoryProgress(todayTasks);
  const memberMap = useMemo(
    () => new Map(workspace.members.map((member) => [member.id, member.name])),
    [workspace.members],
  );

  return (
    <PageContainer className="space-y-6">
      <Surface>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
              <Users className="h-5 w-5 accent-text" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider soft-text">
                Team Workspace
              </p>
              <h2 className="text-xl font-semibold text-[var(--text)]">
                {workspace.name}
              </h2>
            </div>
          </div>
          <div className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold accent-text">
            {progress.percent}% today
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_12rem_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)]"
          />
          <select
            value={workspace.kind}
            onChange={(e) =>
              actions.updateTeamWorkspace({ kind: e.target.value as WorkspaceKind })
            }
            className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)]"
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
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          >
            Save
          </button>
        </div>
      </Surface>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Surface className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--text)]">Assignments</h2>
          {todayTasks.map((task) => (
            <div
              key={task.id}
              className="grid gap-3 rounded-lg border border-[var(--border)] p-3 md:grid-cols-[1fr_12rem]"
            >
              <div>
                <p className="font-medium text-[var(--text)]">{task.title}</p>
                <p className="text-xs muted-text">
                  {memberMap.get(task.assigneeId ?? "") ?? "Unassigned"}
                </p>
              </div>
              <select
                value={task.assigneeId ?? ""}
                onChange={(e) => actions.assignDailyCategory(task.id, e.target.value)}
                className="min-h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)]"
              >
                <option value="">Unassigned</option>
                {workspace.members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </Surface>

        <Surface className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--text)]">Members</h2>
          {workspace.members.map((member) => (
            <div key={member.id} className="flex items-center justify-between">
              <span className="text-sm text-[var(--text)]">{member.name}</span>
              <span className="rounded-full bg-[var(--surface-soft)] px-2 py-1 text-xs muted-text">
                {member.role}
              </span>
            </div>
          ))}
        </Surface>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Surface className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--text)]">Projects</h2>
          {workspace.projects.map((project) => (
            <div key={project.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-[var(--text)]">{project.title}</span>
                <span className="muted-text">{project.progress}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                <div
                  className="h-full bg-[var(--accent)]"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          ))}
        </Surface>

        <Surface className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--text)]">Activity feed</h2>
          {workspace.activity.map((activity) => (
            <p key={activity.id} className="rounded-lg bg-[var(--surface-soft)] p-3 text-sm muted-text">
              {activity.message}
            </p>
          ))}
        </Surface>
      </div>
    </PageContainer>
  );
}
