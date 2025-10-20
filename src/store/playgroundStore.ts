import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Component = {
  id: string;
  name: string;
  code: string;
};

export type Project = {
  id: string;
  name: string;
  components: Component[];
};

type PlaygroundState = {
  projects: Project[];
  addProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addComponent: (projectId: string, component: Component) => void;
  deleteComponent: (projectId: string, componentId: string) => void;
  updateComponentCode: (
    projectId: string,
    componentId: string,
    code: string,
  ) => void;
};

export const usePlaygroundStore = create<PlaygroundState>()(
  persist(
    (set) => ({
      projects: [],
      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      deleteProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
        })),
      addComponent: (projectId, component) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, components: [...p.components, component] }
              : p,
          ),
        })),
      deleteComponent: (projectId, componentId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  components: p.components.filter((c) => c.id !== componentId),
                }
              : p,
          ),
        })),
      updateComponentCode: (projectId, componentId, code) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  components: p.components.map((c) =>
                    c.id === componentId ? { ...c, code } : c,
                  ),
                }
              : p,
          ),
        })),
    }),
    { name: "projects-storage" },
  ),
);
