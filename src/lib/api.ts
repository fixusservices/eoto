/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = (globalThis as any).process?.env?.REACT_APP_API_URL || "http://localhost:5000/api"

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

class ApiClient {
    private baseUrl: string

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl
    }

    private getHeaders(): HeadersInit {
        const token = localStorage.getItem("eoto_token")
        return {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        }
    }

    async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    ...this.getHeaders(),
                    ...options.headers,
                },
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`)
            }

            return { success: true, data }
        } catch (error) {
            console.error("[v0] API Error:", error)
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            }
        }
    }

    // Auth endpoints
    async login(email: string, password: string) {
        return this.request("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        })
    }

    async signup(data: any) {
        return this.request("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async logout() {
        return this.request("/auth/logout", { method: "POST" })
    }

    // User endpoints
    async getProfile() {
        return this.request("/users/profile")
    }

    async updateProfile(data: any) {
        return this.request("/users/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        })
    }

    // Groups endpoints
    async getGroups() {
        return this.request("/groups")
    }

    async createGroup(data: any) {
        return this.request("/groups", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async joinGroup(groupId: string) {
        return this.request(`/groups/${groupId}/join`, { method: "POST" })
    }

    async leaveGroup(groupId: string) {
        return this.request(`/groups/${groupId}/leave`, { method: "POST" })
    }

    // Tasks endpoints
    async getTasks() {
        return this.request("/tasks")
    }

    async createTask(data: any) {
        return this.request("/tasks", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async updateTask(taskId: string, data: any) {
        return this.request(`/tasks/${taskId}`, {
            method: "PUT",
            body: JSON.stringify(data),
        })
    }

    async deleteTask(taskId: string) {
        return this.request(`/tasks/${taskId}`, { method: "DELETE" })
    }

    // Connections endpoints
    async getConnections() {
        return this.request("/connections")
    }

    async sendConnectionRequest(userId: string, message?: string) {
        return this.request("/connections/request", {
            method: "POST",
            body: JSON.stringify({ targetUserId: userId, message }),
        })
    }

    async acceptConnection(connectionId: string) {
        return this.request(`/connections/${connectionId}/accept`, { method: "POST" })
    }

    // Grades endpoints
    async getGrades() {
        return this.request("/grades")
    }

    async addGrade(data: any) {
        return this.request("/grades", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    // Calendar endpoints
    async getCalendarEvents() {
        return this.request("/calendar")
    }

    async createCalendarEvent(data: any) {
        return this.request("/calendar", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    // Resources endpoints
    async getResources() {
        return this.request("/resources")
    }

    async uploadResource(data: FormData) {
        return this.request("/resources", {
            method: "POST",
            body: data,
            headers: {}, // Let browser set Content-Type for FormData
        })
    }
}

export const apiClient = new ApiClient()
