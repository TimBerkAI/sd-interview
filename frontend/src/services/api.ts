import type {
  RoomWithDetails,
  UserRole,
  RoomSession,
  Candidate,
  CandidateWay,
  WaySection,
  TechRoomSession,
  ArchTask,
  ArchTemplate,
  ArchRoom,
  ArchSection,
  AdminTechTask,
  AdminTechRoom,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const api = {
  async validateToken(token: string): Promise<RoomSession | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/validate-token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error validating token:", error);
      return null;
    }
  },

  async getRoomByToken(
    token: string,
    isReviewer: boolean,
  ): Promise<RoomWithDetails | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/room/${token}?is_reviewer=${isReviewer}/`,
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching room:", error);
      return null;
    }
  },

  async updateCandidateAnswer(
    answerId: number,
    candidateAnswer: string,
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/answer/${answerId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ candidate_answer: candidateAnswer }),
        },
      );

      return response.ok;
    } catch (error) {
      console.error("Error updating candidate answer:", error);
      return false;
    }
  },

  async updateReviewerFeedback(
    answerId: number,
    reviewerComment: string,
    mark: number | null,
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/answer/${answerId}/feedback/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reviewer_comment: reviewerComment, mark }),
        },
      );

      return response.ok;
    } catch (error) {
      console.error("Error updating reviewer feedback:", error);
      return false;
    }
  },

  async updateRoomStatus(roomId: number, status: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/room/${roomId}/status/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      return response.ok;
    } catch (error) {
      console.error("Error updating room status:", error);
      return false;
    }
  },

  async getCandidates(): Promise<Candidate[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/flow/candidates/`);
      if (!response.ok) return [];
      return await response.json();
    } catch {
      return [];
    }
  },

  async getCandidate(id: number): Promise<(Candidate & { ways: CandidateWay[] }) | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/flow/candidates/${id}/`);
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },

  async getWays(): Promise<CandidateWay[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/flow/ways/`);
      if (!response.ok) return [];
      return await response.json();
    } catch {
      return [];
    }
  },

  async getWay(id: number): Promise<CandidateWay | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/flow/ways/${id}/`);
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },

  async updateWay(id: number, update: { decision?: string; status?: string }): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/flow/ways/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async updateSection(id: number, update: Partial<WaySection>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/flow/sections/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async validateTechToken(token: string): Promise<TechRoomSession | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tech/validate-token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },

  async updateTechAnswer(answerId: number, candidateAnswer: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tech/answer/${answerId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_answer: candidateAnswer }),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async updateTechFeedback(
    answerId: number,
    reviewerComment: string,
    score: Record<string, number> | null,
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tech/answer/${answerId}/feedback/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewer_comment: reviewerComment, score }),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  async updateTechRoomStatus(roomId: number, status: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tech/room/${roomId}/status/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  // ── Arch Admin CRUD ──────────────────────────────────────────────────────

  async getArchTasks(): Promise<ArchTask[]> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tasks/`);
      return r.ok ? r.json() : [];
    } catch { return []; }
  },

  async getArchTask(id: number): Promise<ArchTask | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tasks/${id}/`);
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async createArchTask(data: Partial<ArchTask>): Promise<ArchTask | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tasks/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async updateArchTask(id: number, data: Partial<ArchTask>): Promise<ArchTask | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tasks/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async deleteArchTask(id: number): Promise<boolean> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tasks/${id}/`, { method: "DELETE" });
      return r.ok;
    } catch { return false; }
  },

  async getArchTemplates(): Promise<ArchTemplate[]> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/templates/`);
      return r.ok ? r.json() : [];
    } catch { return []; }
  },

  async getArchTemplate(id: number): Promise<ArchTemplate | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/templates/${id}/`);
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async createArchTemplate(data: Partial<ArchTemplate>): Promise<ArchTemplate | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/templates/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async updateArchTemplate(id: number, data: Partial<ArchTemplate>): Promise<ArchTemplate | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/templates/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async deleteArchTemplate(id: number): Promise<boolean> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/templates/${id}/`, { method: "DELETE" });
      return r.ok;
    } catch { return false; }
  },

  async createArchSection(templateId: number, data: Partial<ArchSection>): Promise<ArchSection | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/templates/${templateId}/sections/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async updateArchSection(id: number, data: Partial<ArchSection>): Promise<ArchSection | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/sections/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async deleteArchSection(id: number): Promise<boolean> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/sections/${id}/`, { method: "DELETE" });
      return r.ok;
    } catch { return false; }
  },

  async getArchRooms(): Promise<ArchRoom[]> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/rooms/`);
      return r.ok ? r.json() : [];
    } catch { return []; }
  },

  async getArchRoom(id: number): Promise<ArchRoom | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/rooms/${id}/`);
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async createArchRoom(data: Record<string, unknown>): Promise<ArchRoom | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/rooms/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async updateArchRoom(id: number, data: Partial<ArchRoom>): Promise<ArchRoom | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/rooms/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async deleteArchRoom(id: number): Promise<boolean> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/rooms/${id}/`, { method: "DELETE" });
      return r.ok;
    } catch { return false; }
  },

  async regenerateArchRoomAnswers(id: number): Promise<boolean> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/rooms/${id}/regenerate-answers/`, { method: "POST" });
      return r.ok;
    } catch { return false; }
  },

  // ── Tech Admin CRUD ──────────────────────────────────────────────────────

  async getTechTasks(): Promise<AdminTechTask[]> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tech/tasks/`);
      return r.ok ? r.json() : [];
    } catch { return []; }
  },

  async getTechTask(id: number): Promise<AdminTechTask | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tech/tasks/${id}/`);
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async createTechTask(data: Partial<AdminTechTask>): Promise<AdminTechTask | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tech/tasks/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async updateTechTask(id: number, data: Partial<AdminTechTask>): Promise<AdminTechTask | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tech/tasks/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async deleteTechTask(id: number): Promise<boolean> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tech/tasks/${id}/`, { method: "DELETE" });
      return r.ok;
    } catch { return false; }
  },

  async getTechRooms(): Promise<AdminTechRoom[]> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tech/rooms/`);
      return r.ok ? r.json() : [];
    } catch { return []; }
  },

  async getTechRoom(id: number): Promise<AdminTechRoom | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tech/rooms/${id}/`);
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async createTechRoom(data: Record<string, unknown>): Promise<AdminTechRoom | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tech/rooms/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async updateTechRoom(id: number, data: Record<string, unknown>): Promise<AdminTechRoom | null> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tech/rooms/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return r.ok ? r.json() : null;
    } catch { return null; }
  },

  async deleteTechRoom(id: number): Promise<boolean> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tech/rooms/${id}/`, { method: "DELETE" });
      return r.ok;
    } catch { return false; }
  },

  async regenerateTechRoomAnswers(id: number): Promise<boolean> {
    try {
      const r = await fetch(`${API_BASE_URL}/api/v1/tech/rooms/${id}/regenerate-answers/`, { method: "POST" });
      return r.ok;
    } catch { return false; }
  },
};
