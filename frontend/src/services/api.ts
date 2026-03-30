import type { RoomWithDetails, UserRole, RoomSession, Candidate, CandidateWay, WaySection, TechRoomSession } from "../types";

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
};
