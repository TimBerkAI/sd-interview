import type { RoomWithDetails, UserRole, RoomSession } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
};
