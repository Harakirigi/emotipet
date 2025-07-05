export type ToastType = "success" | "error" | "warning" | "info" | "default";
export type ToastPosition = "top" | "bottom";

export interface ToastParams {
    message: string;
    type?: ToastType;
    duration?: number;
    position?: ToastPosition;
}

export interface ToastData extends ToastParams {
    id: string;
}
