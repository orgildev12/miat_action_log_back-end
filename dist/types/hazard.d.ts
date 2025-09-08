export interface HazardCreateRequest {
    user_id: number;
    type_id: number;
    location_id: number;
    description: string;
    solution?: string;
    is_private?: number;
    status_id: number;
}
export interface HazardUpdateRequest {
    user_id?: number;
    type_id?: number;
    location_id?: number;
    description?: string;
    solution?: string;
    is_private?: number;
    status_id?: number;
}
export interface HazardResponse {
    id: number;
    code: string;
    user_id: number;
    type_id: number;
    location_id: number;
    description: string;
    solution?: string;
    is_private: number;
    status_id: number;
    date_created: Date;
    date_updated: Date;
}
//# sourceMappingURL=hazard.d.ts.map