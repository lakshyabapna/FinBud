import { useState, useCallback } from "react";

export function useToast() {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = "info") => {
        setToast({ message, type });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return { toast, showToast, hideToast };
}

export function useConfirm() {
    const [confirmState, setConfirmState] = useState(null);

    const showConfirm = useCallback((message) => {
        return new Promise((resolve) => {
            setConfirmState({
                message,
                onConfirm: () => {
                    setConfirmState(null);
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmState(null);
                    resolve(false);
                },
            });
        });
    }, []);

    return { confirmState, showConfirm };
}
