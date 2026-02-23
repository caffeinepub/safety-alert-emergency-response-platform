import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Location {
    latitude: number;
    longitude: number;
}
export interface ChatMessage {
    sender: string;
    message: string;
    timestamp: bigint;
}
export interface UserProfile {
    userType: string;
    name: string;
    mobile: string;
}
export interface HelpRequest {
    id: bigint;
    status: Type;
    citizenMobile: string;
    citizenPrincipal: Principal;
    citizenName: string;
    timestamp: bigint;
    assignedOfficer?: Principal;
    location: Location;
}
export enum Type {
    resolved = "resolved",
    pending = "pending",
    accepted = "accepted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptHelpRequest(requestId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeHelpRequest(requestId: bigint): Promise<void>;
    getAllProfiles(): Promise<Array<UserProfile>>;
    getAllRequests(): Promise<Array<HelpRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMessages(requestId: bigint): Promise<Array<ChatMessage>>;
    getRequestsByStatus(status: Type): Promise<Array<HelpRequest>>;
    getUserProfile(_user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    register(name: string, mobile: string, userType: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(requestId: bigint, sender: string, message: string): Promise<void>;
    sendSosRequest(location: Location): Promise<bigint>;
}
